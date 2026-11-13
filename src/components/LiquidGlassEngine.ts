import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

export interface LiquidGlassCallbacks {
  onHoverChange?: (hovered: boolean) => void;
  onParallaxUpdate?: (x: number, y: number, hoverIntensity: number) => void;
  onContextLost?: () => void;
}

interface ParticleSeed {
  basePos: THREE.Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  phase: number;
  scale: number;
  bobAmp: number;
}

// Pre-allocated math helpers outside the per-frame loop (zero GC)
const _pointerVec = new THREE.Vector2();
const _dummyObj = new THREE.Object3D();
const _tmpColor = new THREE.Color();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function isWebGLAvailable(): boolean {
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export class LiquidGlassEngine {
  private container: HTMLElement;
  private callbacks: LiquidGlassCallbacks;
  private isSoftwareGl: boolean;
  private isMobile: boolean;
  private reducedMotion: boolean;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private envTexture: THREE.Texture;

  private sculptureRoot: THREE.Group;
  private outerGlassMesh: THREE.Mesh;
  private innerCoreMesh: THREE.Mesh;
  private pearlCoreMesh: THREE.Mesh;
  private orbitalRingA: THREE.Mesh;
  private orbitalRingB: THREE.Mesh;
  private holoLatticeMesh: THREE.LineSegments;
  private holoBaseRing: THREE.Mesh;
  private proxyCollider: THREE.Mesh;
  private particlesMesh: THREE.InstancedMesh;
  private particleSeeds: ParticleSeed[] = [];

  private outerGlassMaterial: THREE.MeshPhysicalMaterial;
  private innerCoreMaterial: THREE.MeshPhysicalMaterial;
  private pearlCoreMaterial: THREE.MeshPhysicalMaterial;
  private ringMaterialA: THREE.MeshPhysicalMaterial;
  private ringMaterialB: THREE.MeshPhysicalMaterial;
  private particleMaterial: THREE.MeshPhysicalMaterial;

  private cyanPointLight: THREE.PointLight;
  private violetPointLight: THREE.PointLight;
  private cobaltRimLight: THREE.DirectionalLight;

  private shaderUniforms = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uHover: { value: 0 },
  };

  private raycaster = new THREE.Raycaster();
  private lastRaycastMs = 0;

  // Smooth spring & damping interaction state
  private targetPointerX = 0;
  private targetPointerY = 0;
  private springOffsetX = 0;
  private springOffsetY = 0;
  private springVelX = 0;
  private springVelY = 0;
  private currentRotX = 0;
  private currentRotY = 0;
  private hoverTarget = false;
  private hoverBlend = 0;
  private scrollTarget = 0;
  private scrollBlend = 0;
  private visibilityFade = 1;
  private targetVisibilityFade = 1;

  private clock = new THREE.Clock();
  private frameId = 0;
  private disposed = false;
  private resizeObserver: ResizeObserver | null = null;
  private width = 1;
  private height = 1;

  constructor(
    container: HTMLElement,
    reducedMotion: boolean,
    callbacks: LiquidGlassCallbacks = {},
  ) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.callbacks = callbacks;
    this.isSoftwareGl = detectSoftwareWebGL();
    this.width = Math.max(container.clientWidth, 1);
    this.height = Math.max(container.clientHeight, 1);
    this.isMobile = window.innerWidth < 1024;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(38, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, this.isMobile ? 7.8 : 7.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.setClearColor(0x07152e, 0);
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.5 : 2),
    );
    this.renderer.setSize(this.width, this.height);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    container.appendChild(this.renderer.domElement);

    // Procedural studio reflection environment
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = this.envTexture;
    pmremGenerator.dispose();

    // Lighting rig: cool sky/navy hemisphere, crisp key, cyan & violet accents, studio softboxes
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x07152e, 0.85);
    this.scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    keyLight.position.set(4.5, 5.5, 5.2);
    this.scene.add(keyLight);

    this.cobaltRimLight = new THREE.DirectionalLight(0x2563eb, 2.6);
    this.cobaltRimLight.position.set(-5.0, -2.5, 3.0);
    this.scene.add(this.cobaltRimLight);

    this.cyanPointLight = new THREE.PointLight(0x22d3ee, 8.5, 16, 1.8);
    this.cyanPointLight.position.set(2.8, 2.1, 3.2);
    this.scene.add(this.cyanPointLight);

    this.violetPointLight = new THREE.PointLight(0x8b5cf6, 6.0, 15, 1.8);
    this.violetPointLight.position.set(-2.5, -2.2, 2.5);
    this.scene.add(this.violetPointLight);

    if (!this.isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softboxCyan = new THREE.RectAreaLight(0x38bdf8, 4.2, 5.5, 2.0);
      softboxCyan.position.set(4.2, 3.6, 4.0);
      softboxCyan.lookAt(0, 0, 0);
      this.scene.add(softboxCyan);

      const softboxViolet = new THREE.RectAreaLight(0x7c3aed, 3.0, 4.5, 2.2);
      softboxViolet.position.set(-4.4, -2.6, 3.4);
      softboxViolet.lookAt(0, 0, 0);
      this.scene.add(softboxViolet);
    }

    // Sculpture group
    this.sculptureRoot = new THREE.Group();
    this.scene.add(this.sculptureRoot);

    // 1. Primary Organic Liquid-Glass Twisted Sculpture
    const tubularSegs = this.isMobile ? 140 : 220;
    const radialSegs = this.isMobile ? 28 : 42;
    const outerGeo = new THREE.TorusKnotGeometry(1.08, 0.34, tubularSegs, radialSegs, 2, 3);

    this.outerGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dbeafe'),
      metalness: 0.04,
      roughness: 0.06,
      transmission: this.isSoftwareGl ? 0 : 0.94,
      transparent: true,
      opacity: this.isSoftwareGl ? 0.48 : 1.0,
      ior: 1.62,
      thickness: 1.75,
      attenuationColor: new THREE.Color('#1d4ed8'),
      attenuationDistance: 2.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      iridescence: 0.88,
      iridescenceIOR: 1.38,
      iridescenceThicknessRange: [140, 560],
      envMapIntensity: 1.9,
      specularIntensity: 1.0,
      specularColor: new THREE.Color('#67e8f9'),
    });

    this.outerGlassMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.shaderUniforms.uTime;
      shader.uniforms.uMorph = this.shaderUniforms.uMorph;
      shader.uniforms.uHover = this.shaderUniforms.uHover;

      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `
        uniform float uTime;
        uniform float uMorph;
        uniform float uHover;
        void main() {
        `,
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float wavePhase = position.x * 2.1 + position.y * 1.85 + position.z * 2.05;
        float waveAmp = 0.032 + uMorph * 0.048 + uHover * 0.02;
        float liquidRipple = sin(wavePhase + uTime * 1.35) * cos(position.y * 2.4 - uTime * 0.9);
        transformed += objectNormal * (liquidRipple * waveAmp);
        `,
      );
    };

    this.outerGlassMesh = new THREE.Mesh(outerGeo, this.outerGlassMaterial);
    this.outerGlassMesh.renderOrder = 2;
    this.sculptureRoot.add(this.outerGlassMesh);

    // 2. Inner Refracted Chromatic Filament Core
    const innerGeo = new THREE.TorusKnotGeometry(0.74, 0.125, 128, 20, 3, 2);
    this.innerCoreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#38bdf8'),
      emissive: new THREE.Color('#1e40af'),
      emissiveIntensity: 0.95,
      metalness: 0.35,
      roughness: 0.16,
      clearcoat: 1.0,
      iridescence: 0.7,
      envMapIntensity: 1.6,
    });
    this.innerCoreMesh = new THREE.Mesh(innerGeo, this.innerCoreMaterial);
    this.innerCoreMesh.renderOrder = 1;
    this.sculptureRoot.add(this.innerCoreMesh);

    // 3. Central Luminous Pearl Core
    const pearlGeo = new THREE.IcosahedronGeometry(0.31, 4);
    this.pearlCoreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#67e8f9'),
      emissive: new THREE.Color('#4f46e5'),
      emissiveIntensity: 0.85,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
      iridescence: 0.9,
    });
    this.pearlCoreMesh = new THREE.Mesh(pearlGeo, this.pearlCoreMaterial);
    this.sculptureRoot.add(this.pearlCoreMesh);

    // 4. Two Orbital Glass Lens Rings
    const ringGeoA = new THREE.TorusGeometry(1.76, 0.02, 16, 120);
    this.ringMaterialA = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#93c5fd'),
      emissive: new THREE.Color('#0284c7'),
      emissiveIntensity: 0.25,
      roughness: 0.12,
      metalness: 0.2,
      transparent: true,
      opacity: 0.62,
      clearcoat: 1.0,
      iridescence: 0.95,
      depthWrite: false,
    });
    this.orbitalRingA = new THREE.Mesh(ringGeoA, this.ringMaterialA);
    this.orbitalRingA.rotation.set(Math.PI * 0.32, Math.PI * 0.18, 0);
    this.orbitalRingA.renderOrder = 3;
    this.sculptureRoot.add(this.orbitalRingA);

    const ringGeoB = new THREE.TorusGeometry(2.04, 0.014, 16, 120);
    this.ringMaterialB = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#c4b5fd'),
      emissive: new THREE.Color('#6d28d9'),
      emissiveIntensity: 0.22,
      roughness: 0.14,
      metalness: 0.18,
      transparent: true,
      opacity: 0.5,
      clearcoat: 1.0,
      iridescence: 0.9,
      depthWrite: false,
    });
    this.orbitalRingB = new THREE.Mesh(ringGeoB, this.ringMaterialB);
    this.orbitalRingB.rotation.set(-Math.PI * 0.28, Math.PI * 0.36, 0.2);
    this.orbitalRingB.renderOrder = 3;
    this.sculptureRoot.add(this.orbitalRingB);

    // 4b. Holographic Wireframe Geodesic Lattice & Projection Reticle Ring
    const latticeBaseGeo = new THREE.IcosahedronGeometry(2.22, 1);
    const latticeEdgesGeo = new THREE.EdgesGeometry(latticeBaseGeo);
    latticeBaseGeo.dispose();
    const latticeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#22d3ee'),
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    this.holoLatticeMesh = new THREE.LineSegments(latticeEdgesGeo, latticeMat);
    this.holoLatticeMesh.renderOrder = 0;
    this.sculptureRoot.add(this.holoLatticeMesh);

    const holoRingGeo = new THREE.RingGeometry(1.45, 1.52, 64);
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#38bdf8'),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    this.holoBaseRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    this.holoBaseRing.rotation.x = Math.PI / 2;
    this.holoBaseRing.position.y = -1.78;
    this.sculptureRoot.add(this.holoBaseRing);

    // 5. Simplified Invisible Proxy Sphere for Hover Raycasting (Layer 1)
    const proxyGeo = new THREE.SphereGeometry(1.9, 16, 16);
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
    this.proxyCollider = new THREE.Mesh(proxyGeo, proxyMat);
    this.proxyCollider.layers.set(1);
    this.raycaster.layers.set(1);
    this.sculptureRoot.add(this.proxyCollider);

    // 6. Floating Glass Micro-Particles (InstancedMesh)
    const particleCount = this.isMobile ? 28 : 76;
    const particleGeo = new THREE.IcosahedronGeometry(0.048, 1);
    this.particleMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#bae6fd'),
      emissive: new THREE.Color('#0ea5e9'),
      emissiveIntensity: 0.45,
      roughness: 0.08,
      metalness: 0.15,
      transparent: true,
      opacity: 0.82,
      clearcoat: 1.0,
      iridescence: 0.8,
    });
    this.particlesMesh = new THREE.InstancedMesh(particleGeo, this.particleMaterial, particleCount);
    this.particlesMesh.frustumCulled = false;

    const palette = ['#3b82f6', '#22d3ee', '#a78bfa', '#e0f2fe'];
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2 + (i % 5) * 0.37;
      const phi = Math.acos(2 * ((i * 0.6180339887) % 1) - 1);
      const radius = 1.95 + ((i * 17) % 100) / 55;
      const basePos = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * radius,
        Math.sin(phi) * Math.sin(theta) * radius * 0.85,
        Math.cos(phi) * radius * 0.75,
      );
      const scale = 0.55 + ((i * 31) % 100) / 95;
      this.particleSeeds.push({
        basePos,
        orbitRadius: 0.08 + (i % 7) * 0.025,
        orbitSpeed: 0.35 + (i % 9) * 0.07,
        phase: i * 1.13,
        scale,
        bobAmp: 0.08 + (i % 5) * 0.03,
      });

      _dummyObj.position.copy(basePos);
      _dummyObj.scale.setScalar(scale);
      _dummyObj.rotation.set(i * 0.5, i * 0.7, 0);
      _dummyObj.updateMatrix();
      this.particlesMesh.setMatrixAt(i, _dummyObj.matrix);

      _tmpColor.set(palette[i % palette.length]);
      this.particlesMesh.setColorAt(i, _tmpColor);
    }
    this.particlesMesh.instanceMatrix.needsUpdate = true;
    if (this.particlesMesh.instanceColor) {
      this.particlesMesh.instanceColor.needsUpdate = true;
    }
    this.particlesMesh.computeBoundingSphere();
    this.scene.add(this.particlesMesh);

    // Pre-warm shaders once on hardware GPUs
    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    // Listen to context loss & container resize
    this.renderer.domElement.addEventListener('webglcontextlost', this.handleContextLost);
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    this.applyLayoutTransform(0, 0);
    this.startLoop();
  }

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.stopLoop();
    this.callbacks.onContextLost?.();
  };

  public handleResize() {
    if (this.disposed) return;
    const w = Math.max(this.container.clientWidth, 1);
    const h = Math.max(this.container.clientHeight, 1);
    if (w === this.width && h === this.height) return;
    this.width = w;
    this.height = h;
    this.isMobile = window.innerWidth < 1024;
    this.camera.aspect = w / h;
    this.camera.position.z = this.isMobile ? 7.8 : 7.2;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.5 : 2),
    );
    this.renderer.setSize(w, h);
    if (this.reducedMotion) {
      this.renderFrame(0.016, 0);
    }
  }

  public setPointer(clientX: number, clientY: number) {
    if (this.disposed) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.targetPointerX = THREE.MathUtils.clamp(nx, -1, 1);
    this.targetPointerY = THREE.MathUtils.clamp(ny, -1, 1);

    // Throttled raycast for hover detection
    const now = performance.now();
    if (now - this.lastRaycastMs >= 40) {
      this.lastRaycastMs = now;
      _pointerVec.set(this.targetPointerX, this.targetPointerY);
      this.raycaster.setFromCamera(_pointerVec, this.camera);
      const hits = this.raycaster.intersectObject(this.proxyCollider, false);
      const isHit = hits.length > 0;
      if (isHit !== this.hoverTarget) {
        this.hoverTarget = isHit;
        this.callbacks.onHoverChange?.(isHit);
      }
    }
  }

  public resetPointer() {
    this.targetPointerX = 0;
    this.targetPointerY = 0;
    if (this.hoverTarget) {
      this.hoverTarget = false;
      this.callbacks.onHoverChange?.(false);
    }
  }

  public setScrollProgress(progress: number, exitFade = 1) {
    this.scrollTarget = THREE.MathUtils.clamp(progress, 0, 1);
    this.targetVisibilityFade = THREE.MathUtils.clamp(exitFade, 0, 1);
    if (this.reducedMotion) {
      this.scrollBlend = this.scrollTarget;
      this.visibilityFade = this.targetVisibilityFade;
      this.renderFrame(0.016, 0);
    }
  }

  public setReducedMotion(enabled: boolean) {
    this.reducedMotion = enabled;
    if (enabled) {
      this.renderFrame(0.016, 0);
    }
  }

  public setTheme(theme: 'dark' | 'light') {
    const isDark = theme === 'dark';
    this.outerGlassMaterial.color.set(isDark ? '#dbeafe' : '#93c5fd');
    this.outerGlassMaterial.attenuationColor.set(isDark ? '#1d4ed8' : '#1e40af');
    this.outerGlassMaterial.opacity = this.isSoftwareGl ? (isDark ? 0.48 : 0.62) : 1.0;

    this.innerCoreMaterial.color.set(isDark ? '#38bdf8' : '#2563eb');
    this.innerCoreMaterial.emissive.set(isDark ? '#1e40af' : '#1d4ed8');
    this.ringMaterialA.color.set(isDark ? '#93c5fd' : '#2563eb');
    this.ringMaterialB.color.set(isDark ? '#c4b5fd' : '#7c3aed');

    (this.holoLatticeMesh.material as THREE.LineBasicMaterial).color.set(
      isDark ? '#22d3ee' : '#0284c7',
    );
    (this.holoBaseRing.material as THREE.MeshBasicMaterial).color.set(
      isDark ? '#38bdf8' : '#2563eb',
    );
    this.renderer.toneMappingExposure = isDark ? 1.18 : 1.05;

    if (this.reducedMotion) {
      this.renderFrame(0.016, 0);
    }
  }

  private applyLayoutTransform(elapsed: number, dt: number) {
    const scroll = this.scrollBlend;
    const motionFactor = this.reducedMotion ? 0 : 1;

    // Base desktop choreography: Hero Right (+1.72) -> glides smoothly to About Left (-1.68)
    const aspectScale = this.isMobile
      ? 0.92
      : THREE.MathUtils.clamp(this.camera.aspect / 1.65, 0.78, 1.12);

    const desktopBaseX = THREE.MathUtils.lerp(1.72 * aspectScale, -1.68 * aspectScale, scroll);
    const desktopBaseY = THREE.MathUtils.lerp(0.08, -0.06, scroll);
    const mobileBaseX = 0;
    const mobileBaseY = THREE.MathUtils.lerp(0.02, -0.08, scroll);

    const baseX = this.isMobile ? mobileBaseX : desktopBaseX;
    const baseY = this.isMobile ? mobileBaseY : desktopBaseY;

    // Smooth continuous floating animation
    const floatY = motionFactor * Math.sin(elapsed * 0.95) * 0.14;
    const floatX = motionFactor * Math.cos(elapsed * 0.62) * 0.06;

    // Second-order spring attraction toward cursor
    const springStrength = 34;
    const springDamping = 7.6;
    const desiredOffsetX = this.targetPointerX * 0.34 * motionFactor;
    const desiredOffsetY = this.targetPointerY * 0.26 * motionFactor;

    if (!this.reducedMotion) {
      const accelX = (desiredOffsetX - this.springOffsetX) * springStrength - this.springVelX * springDamping;
      const accelY = (desiredOffsetY - this.springOffsetY) * springStrength - this.springVelY * springDamping;
      this.springVelX += accelX * dt;
      this.springVelY += accelY * dt;
      this.springOffsetX += this.springVelX * dt;
      this.springOffsetY += this.springVelY * dt;
    } else {
      this.springOffsetX = 0;
      this.springOffsetY = 0;
    }

    const posX = baseX + floatX + this.springOffsetX;
    const posY = baseY + floatY + this.springOffsetY;
    const posZ = THREE.MathUtils.lerp(0, 0.35, scroll) + this.hoverBlend * 0.22;

    this.sculptureRoot.position.set(posX, posY, posZ);

    // Smooth mouse-controlled X/Y rotation + slow continuous rotation + scroll morph twist
    const targetRotX =
      -this.targetPointerY * 0.38 * motionFactor +
      scroll * 0.72 +
      motionFactor * Math.sin(elapsed * 0.4) * 0.08;
    const targetRotY =
      this.targetPointerX * 0.52 * motionFactor +
      scroll * Math.PI * 1.15 +
      motionFactor * elapsed * 0.22;

    this.currentRotX = THREE.MathUtils.damp(this.currentRotX, targetRotX, 5.5, dt);
    this.currentRotY = THREE.MathUtils.damp(this.currentRotY, targetRotY, 5.5, dt);

    this.sculptureRoot.rotation.set(this.currentRotX, this.currentRotY, scroll * 0.35);

    // Hover scale boost + scroll breathing scale
    const baseScale = this.isMobile ? 0.84 : 1.04;
    const scrollScale = THREE.MathUtils.lerp(1.0, 0.92, scroll);
    const hoverScale = 1.0 + this.hoverBlend * 0.075;
    this.sculptureRoot.scale.setScalar(baseScale * scrollScale * hoverScale * (0.85 + 0.15 * this.visibilityFade));

    // Inner core counter-rotation & orbital lens ring morph separation
    this.innerCoreMesh.rotation.set(
      motionFactor * elapsed * 0.28 + scroll * 1.2,
      -motionFactor * elapsed * 0.35,
      scroll * 0.6,
    );
    this.pearlCoreMesh.scale.setScalar(1.0 + this.hoverBlend * 0.14 + Math.sin(elapsed * 1.6) * 0.05 * motionFactor);

    const ringExpand = 1.0 + scroll * 0.18 + this.hoverBlend * 0.06;
    this.orbitalRingA.scale.setScalar(ringExpand);
    this.orbitalRingA.rotation.z = motionFactor * elapsed * 0.18 + scroll * 0.85;
    this.orbitalRingB.scale.setScalar(1.0 + scroll * 0.24 + this.hoverBlend * 0.08);
    this.orbitalRingB.rotation.x = -Math.PI * 0.28 - scroll * 0.55 + motionFactor * Math.sin(elapsed * 0.45) * 0.12;

    // Holographic wireframe lattice & projection reticle animation
    this.holoLatticeMesh.rotation.set(
      motionFactor * elapsed * 0.09 + scroll * 0.4,
      -motionFactor * elapsed * 0.14,
      motionFactor * elapsed * 0.05,
    );
    this.holoLatticeMesh.scale.setScalar(1.0 + scroll * 0.12 + this.hoverBlend * 0.09);
    (this.holoLatticeMesh.material as THREE.LineBasicMaterial).opacity = 0.12 + this.hoverBlend * 0.14;
    this.holoBaseRing.rotation.z = motionFactor * elapsed * 0.22;
    (this.holoBaseRing.material as THREE.MeshBasicMaterial).opacity = 0.14 + this.hoverBlend * 0.14;

    // Hover luminescence & material refraction modulation
    this.cyanPointLight.intensity = 8.5 + this.hoverBlend * 6.5 + scroll * 2.0;
    this.violetPointLight.intensity = 6.0 + this.hoverBlend * 4.5 + scroll * 2.2;
    this.cobaltRimLight.intensity = 2.6 + this.hoverBlend * 1.4;
    this.outerGlassMaterial.iridescence = 0.88 + this.hoverBlend * 0.12;
    this.innerCoreMaterial.emissiveIntensity = 0.95 + this.hoverBlend * 0.85;
    this.pearlCoreMaterial.emissiveIntensity = 0.85 + this.hoverBlend * 0.7;

    // Shader uniforms
    this.shaderUniforms.uTime.value = motionFactor * elapsed;
    this.shaderUniforms.uMorph.value = scroll;
    this.shaderUniforms.uHover.value = this.hoverBlend;

    // Floating glass micro-particles with distinct parallax depth (0.65x cursor offset)
    const particleCenterX = baseX + this.springOffsetX * 0.65;
    const particleCenterY = baseY + this.springOffsetY * 0.65;
    this.particlesMesh.position.set(particleCenterX, particleCenterY, -0.35);
    this.particlesMesh.rotation.y = this.currentRotY * 0.45;
    this.particlesMesh.rotation.x = this.currentRotX * 0.35;

    for (let i = 0; i < this.particleSeeds.length; i++) {
      const seed = this.particleSeeds[i];
      const t = motionFactor * elapsed * seed.orbitSpeed + seed.phase;
      const spread = 1.0 + scroll * 0.25 + this.hoverBlend * 0.08;
      _dummyObj.position.set(
        seed.basePos.x * spread + Math.cos(t) * seed.orbitRadius,
        seed.basePos.y * spread + Math.sin(t * 1.15) * seed.bobAmp,
        seed.basePos.z * spread + Math.sin(t * 0.8) * seed.orbitRadius,
      );
      _dummyObj.rotation.set(t * 0.6, t * 0.9, seed.phase);
      _dummyObj.scale.setScalar(seed.scale * (1.0 + this.hoverBlend * 0.18));
      _dummyObj.updateMatrix();
      this.particlesMesh.setMatrixAt(i, _dummyObj.matrix);
    }
    this.particlesMesh.instanceMatrix.needsUpdate = true;

    this.callbacks.onParallaxUpdate?.(
      this.springOffsetX,
      this.springOffsetY,
      this.hoverBlend,
    );
  }

  private renderFrame(dt: number, elapsed: number) {
    this.hoverBlend = THREE.MathUtils.damp(this.hoverBlend, this.hoverTarget ? 1 : 0, 6.5, dt);
    this.scrollBlend = THREE.MathUtils.damp(this.scrollBlend, this.scrollTarget, 7.0, dt);
    this.visibilityFade = THREE.MathUtils.damp(this.visibilityFade, this.targetVisibilityFade, 7.0, dt);

    this.applyLayoutTransform(elapsed, dt);
    this.renderer.render(this.scene, this.camera);
  }

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (typeof gl.fenceSync === 'function') {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (this.disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 80);
        }
      };
      this.frameId = window.setTimeout(poll, 5);
    } else {
      this.frameId = window.setTimeout(cb, 80);
    }
  }

  private tick = () => {
    if (this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.getElapsedTime();
    this.renderFrame(dt, elapsed);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  private startLoop() {
    if (this.isSoftwareGl) {
      this.tick();
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  }

  private stopLoop() {
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
  }

  public dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stopLoop();
    this.resizeObserver?.disconnect();
    this.renderer.domElement.removeEventListener('webglcontextlost', this.handleContextLost);

    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh || (obj as THREE.LineSegments).isLineSegments) {
        const renderable = obj as THREE.Mesh | THREE.LineSegments;
        renderable.geometry?.dispose();
        if (Array.isArray(renderable.material)) {
          renderable.material.forEach((m) => m.dispose());
        } else {
          renderable.material?.dispose();
        }
      }
    });

    this.envTexture.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
