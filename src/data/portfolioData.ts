import spatialOpticsImg from '../assets/images/project_spatial_optics_1794550696872.jpg';
import designSystemImg from '../assets/images/project_design_system_1794550698396.jpg';
import fintechTerminalImg from '../assets/images/project_fintech_terminal_1794550698196.jpg';
import kineticCommerceImg from '../assets/images/project_kinetic_commerce_1794550698795.jpg';
import type { LanguageCode } from '../context/PreferencesContext';

export type ProjectCategory = 'All' | 'Interactive 3D' | 'Design Systems' | 'Product UI';

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: Exclude<ProjectCategory, 'All'>;
  year: string;
  role: string;
  client: string;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  deliverables: string[];
  image: string;
  imageAlt: string;
  aspect: 'wide' | 'standard';
  liveUrl: string;
}

export interface CapabilityItem {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

export interface TimelineEntry {
  period: string;
  title: string;
  organization: string;
  details: string[];
}

export const PORTFOLIO_IDENTITY = {
  email: 'ansovanvichka@gmail.com',
  phone: '096 962 8631',
  cvUrl: '/assets/aistudio/AN_SOVANVICHKA__English___3__ab553a40.pdf',
};

interface LocalizedPortfolioContent {
  name: string;
  shortLocation: string;
  address: string;
  nationality: string;
  dateOfBirth: string;
  availability: string;
  nav: {
    work: string;
    about: string;
    capabilities: string;
    contact: string;
    cta: string;
  };
  hero: {
    title: string;
    headline: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    hint: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    paragraphs: [string, string];
    downloadCv: string;
    metaPrefix: string;
    metrics: { value: string; label: string }[];
  };
  work: {
    eyebrow: string;
    heading: string;
    outcomeLabel: string;
    categoryLabels: Record<ProjectCategory, string>;
    modal: {
      client: string;
      role: string;
      challenge: string;
      solution: string;
      measuredOutcome: string;
      deliverables: string;
      close: string;
      discuss: string;
    };
    projects: ProjectItem[];
  };
  capabilitiesSection: {
    eyebrow: string;
    heading: string;
    educationEyebrow: string;
    educationHeading: string;
    experienceEyebrow: string;
    experienceHeading: string;
    capabilities: CapabilityItem[];
    education: TimelineEntry[];
    experience: TimelineEntry[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    description: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    copy: string;
    copied: string;
    downloadCv: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      focusLabel: string;
      scopes: string[];
      detailsLabel: string;
      detailsPlaceholder: string;
      submit: string;
      errName: string;
      errEmail: string;
      errMessage: string;
      receivedEyebrow: string;
      thankYouPrefix: string;
      receivedBodyA: string;
      receivedBodyB: string;
      sendAnother: string;
    };
    footer: {
      role: string;
      top: string;
      work: string;
      about: string;
    };
  };
  controls: {
    dark: string;
    light: string;
    switchToLight: string;
    switchToDark: string;
  };
}

const CONTENT_EN: LocalizedPortfolioContent = {
  name: 'An Sovanvichka',
  shortLocation: 'Phnom Penh, Cambodia',
  address: 'St Lum, Sangkat Phnom Penh Thmey, Khan Sen Sok, Phnom Penh',
  nationality: 'Khmer',
  dateOfBirth: 'November 24, 2001',
  availability: 'Available for Web Development, Front-End Engineering & UX/UI Design roles',
  nav: {
    work: 'Work',
    about: 'About',
    capabilities: 'Capabilities',
    contact: 'Contact',
    cta: "Let's Connect",
  },
  hero: {
    title: 'Front-End Developer & UX/UI Designer.',
    headline: 'Designing Digital Experiences That Inspire.',
    description:
      'I transform ideas into beautiful, interactive and user-centered digital experiences.',
    primaryCta: 'Explore My Work',
    secondaryCta: "Let's Connect",
    hint: 'Move pointer to interact with sculpture · Scroll to transition into About',
  },
  about: {
    eyebrow: 'About',
    heading: 'Computer Science graduate crafting modern web interfaces and resilient systems.',
    paragraphs: [
      "I'm An Sovanvichka, a Computer Science graduate from the Royal University of Phnom Penh specializing in Web Development and UX/UI Design. My foundation spans HTML, CSS, JavaScript, Bootstrap, Vue.js, and Laravel alongside C, C++, C#, and Java.",
      'Following intensive bootcamp training at Instinct Institute—building responsive Front-End experiences for WebView—as well as Windows Form software, network infrastructure, and Linux/Windows Server administration, I bring both design sensitivity and practical systems discipline to every product.',
    ],
    downloadCv: 'Download CV (PDF)',
    metaPrefix: 'Born November 24, 2001 · Khmer',
    metrics: [
      { value: '2023', label: 'B.Sc. Computer Science (RUPP)' },
      { value: '6+', label: 'Web & Systems Languages' },
      { value: '60fps', label: 'Interactive Motion Standard' },
    ],
  },
  work: {
    eyebrow: 'Selected Works',
    heading: 'Crafted for clarity, depth, and measurable impact.',
    outcomeLabel: 'Outcome:',
    categoryLabels: {
      All: 'All',
      'Interactive 3D': 'Interactive 3D',
      'Design Systems': 'Design Systems',
      'Product UI': 'Product UI',
    },
    modal: {
      client: 'Client',
      role: 'Role',
      challenge: 'The Challenge',
      solution: 'The Solution',
      measuredOutcome: 'Measured Outcome',
      deliverables: 'Deliverables',
      close: 'Close',
      discuss: 'Discuss a Similar Project',
    },
    projects: [
      {
        id: 'webview-interactive-experience',
        index: '01',
        title: 'WebView Front-End & Spatial Hero',
        category: 'Interactive 3D',
        year: '2023',
        role: 'Front-End Developer',
        client: 'Instinct Institute Bootcamp',
        summary:
          'Responsive, touch-friendly front-end interfaces engineered to render cleanly inside embedded mobile WebView shells and modern desktop browsers.',
        challenge:
          'Embedded WebView environments demand lightweight DOM updates, strict memory discipline, and smooth 60fps transitions across varied mobile hardware.',
        solution:
          'Built modular HTML, CSS, and JavaScript components paired with adaptive rendering, hardware-accelerated transforms, and clean UX hierarchy.',
        impact: 'Smooth cross-device rendering across desktop and mobile WebView viewports',
        deliverables: ['HTML / CSS / JavaScript', 'WebView Front-End', 'UX/UI Layout'],
        image: spatialOpticsImg,
        imageAlt: 'Interactive 3D optical wave web interface showcase on a studio display',
        aspect: 'wide',
        liveUrl: '#contact',
      },
      {
        id: 'vue-laravel-web-architecture',
        index: '02',
        title: 'Vue.js & Laravel Full-Stack Platform',
        category: 'Design Systems',
        year: '2023',
        role: 'Web Developer',
        client: 'Royal University of Phnom Penh',
        summary:
          'Component-driven front-end architecture combining Vue.js reactivity, Bootstrap grid discipline, and a structured Laravel MVC back-end.',
        challenge:
          'Coordinating dynamic client-side views with relational server endpoints while keeping UI patterns consistent across pages.',
        solution:
          'Established reusable Vue.js view templates, clean RESTful Laravel routes, and responsive Bootstrap styling tokens.',
        impact: 'Unified front-to-back web workflow delivered as CS Web Development major work',
        deliverables: ['Vue.js Components', 'Laravel Back-End', 'Bootstrap UI'],
        image: designSystemImg,
        imageAlt: 'Modular dark-mode UI component and design system grid on a studio workstation',
        aspect: 'standard',
        liveUrl: '#contact',
      },
      {
        id: 'coffee-shop-management-app',
        index: '03',
        title: 'Coffee Shop Management System',
        category: 'Product UI',
        year: '2023',
        role: 'Software & UI Developer',
        client: 'University Capstone Project',
        summary:
          'Windows Form desktop point-of-sale and inventory management application built to streamline daily café orders, billing, and stock tracking.',
        challenge:
          'Replacing slow manual order tallies with a clear, error-resistant counter workflow that staff can operate at peak hours.',
        solution:
          'Engineered an intuitive C# Windows Form interface with structured item categories, real-time order totals, and persistent database records.',
        impact: 'Completed full order, inventory, and receipt workflow in C# Windows Forms',
        deliverables: ['C# Windows Forms', 'POS Interface Design', 'Database Logic'],
        image: fintechTerminalImg,
        imageAlt: 'Clean dark analytics and point-of-sale interface displayed on an angled glass panel',
        aspect: 'standard',
        liveUrl: '#contact',
      },
      {
        id: 'enterprise-network-server-lab',
        index: '04',
        title: 'Small Business Network & Server Architecture',
        category: 'Interactive 3D',
        year: '2023',
        role: 'Systems & Network Engineer',
        client: 'Infrastructure Capstone',
        summary:
          'End-to-end computer network topology design and dual-OS server deployment covering Windows Server 2012 administration and Linux CLI configuration.',
        challenge:
          'Designing a reliable, segmented network infrastructure capable of supporting small-business workstations, services, and access policies.',
        solution:
          'Configured subnetting, routing, Windows Server 2012 directory services, and command-line Linux server roles with documented IT support procedures.',
        impact: 'Full network blueprint plus configured Windows Server 2012 & Linux CLI nodes',
        deliverables: ['Network Infrastructure', 'Windows Server 2012', 'Linux CLI Config'],
        image: kineticCommerceImg,
        imageAlt: 'Precision architectural technology interface rendered on dark sapphire glass',
        aspect: 'wide',
        liveUrl: '#contact',
      },
    ],
  },
  capabilitiesSection: {
    eyebrow: 'Skills & Capabilities',
    heading: 'From front-end web interfaces to server and network foundations.',
    educationEyebrow: 'Education',
    educationHeading: 'Academic Background',
    experienceEyebrow: 'Work Experience',
    experienceHeading: 'Bootcamp & Engineering Projects',
    capabilities: [
      {
        index: '01.',
        title: 'Front-End & Web Development',
        subtitle: 'JavaScript · HTML · CSS · Vue.js · Bootstrap · Laravel',
        description:
          'Building responsive, accessible web applications and WebView interfaces from clean semantic markup to full-stack Laravel and Vue.js integration.',
        highlights: [
          'JavaScript, HTML5, CSS3 & Bootstrap responsive layouts',
          'Vue.js component architecture & Laravel MVC integration',
          'Embedded mobile WebView front-end engineering',
        ],
      },
      {
        index: '02.',
        title: 'UX/UI Design & Problem Solving',
        subtitle: 'UX/UI Craft · Team Leadership · Communication',
        description:
          'Designing intuitive, user-centered flows backed by strong analytical problem-solving, clear verbal and written communication, and collaborative leadership.',
        highlights: [
          'User-centered wireframing, hierarchy & interactive polish',
          'Strong collaboration and team leadership across group builds',
          'Structured problem-solving from requirements to delivery',
        ],
      },
      {
        index: '03.',
        title: 'Programming, Systems & IT Support',
        subtitle: 'C · C++ · C# · Java · Windows & Linux Server · Networking',
        description:
          'Solid Computer Science foundations across object-oriented programming, Windows Form applications, small-business network design, and server administration.',
        highlights: [
          'C, C++, C# (Windows Forms), and Java application logic',
          'Windows Server 2012 setup & Linux Server CLI configuration',
          'Small-business network infrastructure & hands-on IT support',
        ],
      },
    ],
    education: [
      {
        period: '2019 – 2023',
        title: "Bachelor's Degree in Computer Science",
        organization: 'Royal University of Phnom Penh',
        details: [
          'Major in Web Development across C, C++, C#, Java, HTML, CSS, JavaScript, Bootstrap, Laravel, and Vue.js',
          'Completed Foundation Year Course at the University of Phnom Penh (2019 – 2020)',
        ],
      },
      {
        period: '2017 – 2019',
        title: 'General English Program',
        organization: 'Milky Way School',
        details: [
          'Completed general English fluency and technical communication coursework',
        ],
      },
      {
        period: '2014 – 2019',
        title: 'High School Graduation',
        organization: 'Samdach Hun Sen Phnom Penh Thmey High School',
        details: [
          'Graduated secondary education following foundational schooling (2006 – 2013)',
        ],
      },
    ],
    experience: [
      {
        period: '2023',
        title: 'Web Development Bootcamp & WebView Front-End',
        organization: 'Instinct Institute',
        details: [
          'Completed intensive Web Development Bootcamp focusing on modern responsive interfaces',
          'Built production-ready Front-End experiences running seamlessly inside WebView containers',
        ],
      },
      {
        period: '2023',
        title: 'Full-Stack & Systems Capstone Projects',
        organization: 'Royal University of Phnom Penh',
        details: [
          'Delivered a Windows Form Application for end-to-end Coffee Shop Management',
          'Designed and managed small-business computer network infrastructure',
          'Installed and configured Windows Server 2012 and command-line Linux Server environments',
        ],
      },
      {
        period: '2021',
        title: 'Productivity & Digital Foundations',
        organization: 'Computer Literacy Certification',
        details: [
          'Completed practical coursework in Word, PowerPoint, Excel, and Internet workflows',
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Let's Connect",
    heading: 'Ready to collaborate on your next web product or engineering team.',
    description:
      'Available for Web Development, Front-End Engineering & UX/UI Design roles. Send a short message or reach me directly by email or phone.',
    emailLabel: 'Direct Email',
    phoneLabel: 'Phone',
    addressLabel: 'Address',
    copy: 'Copy',
    copied: 'Copied',
    downloadCv: 'Download Full CV (PDF)',
    form: {
      nameLabel: 'Name',
      namePlaceholder: 'Your Name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      focusLabel: 'Project Focus',
      scopes: ['Front-End / WebView', 'Vue.js & Laravel', 'UX/UI Design', 'IT & Networking'],
      detailsLabel: 'Project Details',
      detailsPlaceholder: 'Share a brief overview of your goals, timeline, or role...',
      submit: 'Send Inquiry',
      errName: 'Please enter your name so I know how to address you.',
      errEmail: 'Please enter a valid email address.',
      errMessage: 'Please share a brief note (at least 10 characters) about your project.',
      receivedEyebrow: 'Inquiry Received',
      thankYouPrefix: 'Thank you,',
      receivedBodyA: 'Your inquiry regarding',
      receivedBodyB: "is ready. I'll follow up shortly at",
      sendAnother: 'Send Another Note',
    },
    footer: {
      role: 'Web Development & UX/UI Design.',
      top: 'Back to Top',
      work: 'Selected Works',
      about: 'About',
    },
  },
  controls: {
    dark: 'Dark',
    light: 'Light',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
  },
};

const CONTENT_KM: LocalizedPortfolioContent = {
  name: 'អាន សុវណ្ណវិច្ឆិកា',
  shortLocation: 'រាជធានីភ្នំពេញ កម្ពុជា',
  address: 'ផ្លូវលំ សង្កាត់ភ្នំពេញថ្មី ខណ្ឌសែនសុខ រាជធានីភ្នំពេញ',
  nationality: 'ខ្មែរ',
  dateOfBirth: '២៤ វិច្ឆិកា ២០០១',
  availability: 'ត្រៀមខ្លួនសម្រាប់ការងារអភិវឌ្ឍន៍គេហទំព័រ Front-End និងរចនា UX/UI',
  nav: {
    work: 'ស្នាដៃ',
    about: 'អំពីខ្ញុំ',
    capabilities: 'សមត្ថភាព',
    contact: 'ទំនាក់ទំនង',
    cta: 'ទាក់ទងមកខ្ញុំ',
  },
  hero: {
    title: 'អ្នកអភិវឌ្ឍន៍ Front-End និងអ្នករចនា UX/UI។',
    headline: 'រចនា បទពិសោធន៍ ឌីជីថល ដែល បំផុសគំនិត។',
    description:
      'ខ្ញុំបំប្លែងគំនិតទៅជាបទពិសោធន៍ឌីជីថលដ៏ស្រស់ស្អាត មានអន្តរកម្ម និងផ្តោតលើអ្នកប្រើប្រាស់។',
    primaryCta: 'ស្វែងយល់ពីស្នាដៃ',
    secondaryCta: 'ទាក់ទងមកខ្ញុំ',
    hint: 'រំកិលទស្សន៍ទ្រនិចដើម្បីធ្វើអន្តរកម្ម · អូសចុះក្រោមដើម្បីមើលផ្នែកអំពីខ្ញុំ',
  },
  about: {
    eyebrow: 'អំពីខ្ញុំ',
    heading: 'និស្សិតបញ្ចប់ការសិក្សាវិទ្យាសាស្ត្រកុំព្យូទ័រ បង្កើតគេហទំព័រទំនើប និងប្រព័ន្ធរឹងមាំ។',
    paragraphs: [
      'ខ្ញុំឈ្មោះ អាន សុវណ្ណវិច្ឆិកា ជាបរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ ពីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ ជំនាញអភិវឌ្ឍន៍គេហទំព័រ និងរចនា UX/UI។ មូលដ្ឋានគ្រឹះរបស់ខ្ញុំរួមមាន HTML, CSS, JavaScript, Bootstrap, Vue.js និង Laravel រួមជាមួយ C, C++, C# និង Java។',
      'បន្ទាប់ពីបញ្ចប់វគ្គសិក្សា Bootcamp នៅវិទ្យាស្ថាន Instinct Institute លើការបង្កើត Front-End សម្រាប់ WebView រួមទាំងកម្មវិធី Windows Form បណ្តាញកុំព្យូទ័រ និងការគ្រប់គ្រង Windows/Linux Server ខ្ញុំនាំមកនូវទាំងសោភ័ណភាពរចនា និងវិន័យបច្ចេកទេសជាក់ស្តែង។',
    ],
    downloadCv: 'ទាញយកប្រវត្តិរូប (PDF)',
    metaPrefix: 'កើតថ្ងៃទី ២៤ វិច្ឆិកា ២០០១ · សញ្ជាតិខ្មែរ',
    metrics: [
      { value: '2023', label: 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ (RUPP)' },
      { value: '6+', label: 'ភាសាកម្មវិធី និងបច្ចេកវិទ្យាគេហទំព័រ' },
      { value: '60fps', label: 'ស្តង់ដារចលនា និងអន្តរកម្ម' },
    ],
  },
  work: {
    eyebrow: 'ស្នាដៃជ្រើសរើស',
    heading: 'បង្កើតឡើងដើម្បីភាពច្បាស់លាស់ សោភ័ណភាព និងលទ្ធផលជាក់ស្តែង។',
    outcomeLabel: 'លទ្ធផល៖',
    categoryLabels: {
      All: 'ទាំងអស់',
      'Interactive 3D': 'អន្តរកម្ម 3D',
      'Design Systems': 'ប្រព័ន្ធរចនា',
      'Product UI': 'កម្មវិធី និងប្រព័ន្ធ',
    },
    modal: {
      client: 'ស្ថាប័ន / គម្រោង',
      role: 'តួនាទី',
      challenge: 'បញ្ហាប្រឈម',
      solution: 'ដំណោះស្រាយ',
      measuredOutcome: 'លទ្ធផលសម្រេចបាន',
      deliverables: 'សមាសធាតុបច្ចេកទេស',
      close: 'បិទ',
      discuss: 'ពិភាក្សាអំពីគម្រោងស្រដៀងគ្នា',
    },
    projects: [
      {
        id: 'webview-interactive-experience',
        index: '01',
        title: 'គេហទំព័រ Front-End សម្រាប់ WebView',
        category: 'Interactive 3D',
        year: '2023',
        role: 'អ្នកអភិវឌ្ឍន៍ Front-End',
        client: 'Instinct Institute Bootcamp',
        summary:
          'ចំណុចប្រទាក់ Front-End ដែលឆ្លើយតបរហ័ស និងរលូនសម្រាប់ដំណើរការក្នុងកម្មវិធី WebView ទូរស័ព្ទ និងកម្មវិធីរុករកទំនើប។',
        challenge:
          'បរិស្ថាន WebView ត្រូវការការប្រើប្រាស់អង្គចងចាំតិច ការធ្វើបច្ចុប្បន្នភាព DOM រហ័ស និងចលនារលូន 60fps លើឧបករណ៍ចម្រុះ។',
        solution:
          'បង្កើតសមាសធាតុ HTML, CSS និង JavaScript ប្រកបដោយសណ្តាប់ធ្នាប់ ជាមួយប្លង់ UX/UI ច្បាស់លាស់។',
        impact: 'ដំណើរការរលូនទាំងលើកុំព្យូទ័រ និងទូរស័ព្ទ WebView',
        deliverables: ['HTML / CSS / JavaScript', 'WebView Front-End', 'ការរចនា UX/UI'],
        image: spatialOpticsImg,
        imageAlt: 'គំរូគេហទំព័រ 3D និងចំណុចប្រទាក់អន្តរកម្ម',
        aspect: 'wide',
        liveUrl: '#contact',
      },
      {
        id: 'vue-laravel-web-architecture',
        index: '02',
        title: 'ប្រព័ន្ធគេហទំព័រ Vue.js និង Laravel',
        category: 'Design Systems',
        year: '2023',
        role: 'អ្នកអភិវឌ្ឍន៍គេហទំព័រ',
        client: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ',
        summary:
          'ស្ថាបត្យកម្មគេហទំព័រពេញលេញដោយប្រើប្រាស់ Vue.js, Bootstrap និង Laravel MVC ដើម្បីរក្សាភាពស៊ីសង្វាក់គ្នានៃចំណុចប្រទាក់។',
        challenge:
          'ការតភ្ជាប់ទិន្នន័យរវាង Front-End និង Back-End ដោយធានាបាននូវភាពងាយស្រួលប្រើប្រាស់ និងរចនាសម្ព័ន្ធស្អាត។',
        solution:
          'រៀបចំសមាសធាតុ Vue.js ដែលអាចប្រើឡើងវិញបាន រួមជាមួយ API របស់ Laravel និងប្លង់ Bootstrap។',
        impact: 'បញ្ចប់គម្រោងជំនាញអភិវឌ្ឍន៍គេហទំព័រប្រកបដោយជោគជ័យ',
        deliverables: ['Vue.js Components', 'Laravel Back-End', 'Bootstrap UI'],
        image: designSystemImg,
        imageAlt: 'ប្រព័ន្ធរចនា UI និងសមាសធាតុគេហទំព័រ',
        aspect: 'standard',
        liveUrl: '#contact',
      },
      {
        id: 'coffee-shop-management-app',
        index: '03',
        title: 'កម្មវិធីគ្រប់គ្រងហាងកាហ្វេ (Windows Form)',
        category: 'Product UI',
        year: '2023',
        role: 'អ្នកអភិវឌ្ឍន៍កម្មវិធី និង UI',
        client: 'គម្រោងបញ្ចប់ឆ្នាំសិក្សា',
        summary:
          'កម្មវិធីកុំព្យូទ័រ Windows Form សម្រាប់គ្រប់គ្រងការកម្ម៉ង់ភេសជ្ជៈ ការទូទាត់ប្រាក់ និងស្តុកទំនិញប្រចាំថ្ងៃ។',
        challenge:
          'កាត់បន្ថយកំហុសក្នុងការកត់ត្រាដោយដៃ និងជួយឱ្យបុគ្គលិកគិតលុយបានលឿននៅម៉ោងមមាញឹក។',
        solution:
          'រចនាផ្ទាំង C# Windows Form ងាយស្រួលប្រើ មានការបែងចែកប្រភេទភេសជ្ជៈ គណនាសរុបស្វ័យប្រវត្តិ និងរក្សាទុកទិន្នន័យ។',
        impact: 'បញ្ចប់ប្រព័ន្ធលក់ និងគ្រប់គ្រងស្តុកដោយ C# Windows Forms',
        deliverables: ['C# Windows Forms', 'ការរចនា POS UI', 'ទិន្នន័យមូលដ្ឋាន'],
        image: fintechTerminalImg,
        imageAlt: 'ផ្ទាំងវិភាគទិន្នន័យ និងប្រព័ន្ធគ្រប់គ្រងការលក់',
        aspect: 'standard',
        liveUrl: '#contact',
      },
      {
        id: 'enterprise-network-server-lab',
        index: '04',
        title: 'បណ្តាញកុំព្យូទ័រ និងម៉ាស៊ីនមេ (Server)',
        category: 'Interactive 3D',
        year: '2023',
        role: 'អ្នកជំនាញប្រព័ន្ធ និងបណ្តាញ',
        client: 'គម្រោងហេដ្ឋារចនាសម្ព័ន្ធ',
        summary:
          'ការរចនាបណ្តាញកុំព្យូទ័រសម្រាប់ក្រុមហ៊ុនខ្នាតតូច រួមជាមួយការដំឡើង និងកំណត់រចនាសម្ព័ន្ធ Windows Server 2012 និង Linux CLI។',
        challenge:
          'ការរៀបចំបណ្តាញដែលមានសុវត្ថិភាព ស្ថិរភាព និងងាយស្រួលគ្រប់គ្រងសម្រាប់ស្ថាប័នអាជីវកម្មខ្នាតតូច។',
        solution:
          'កំណត់រចនាសម្ព័ន្ធ Subnet, Routing, Windows Server 2012 និង Linux Server តាម Command Line ព្រមទាំងឯកសារ IT Support។',
        impact: 'ប្លង់បណ្តាញពេញលេញ និងម៉ាស៊ីនមេ Windows/Linux ដំណើរការជាក់ស្តែង',
        deliverables: ['រចនាបណ្តាញ', 'Windows Server 2012', 'Linux CLI Config'],
        image: kineticCommerceImg,
        imageAlt: 'គំរូស្ថាបត្យកម្មបច្ចេកវិទ្យា និងបណ្តាញ',
        aspect: 'wide',
        liveUrl: '#contact',
      },
    ],
  },
  capabilitiesSection: {
    eyebrow: 'ជំនាញ និងសមត្ថភាព',
    heading: 'ចាប់ពីការរចនាគេហទំព័រ Front-End រហូតដល់ប្រព័ន្ធម៉ាស៊ីនមេ និងបណ្តាញ។',
    educationEyebrow: 'ការសិក្សា',
    educationHeading: 'ប្រវត្តិការសិក្សា',
    experienceEyebrow: 'បទពិសោធន៍ការងារ',
    experienceHeading: 'វគ្គបណ្តុះបណ្តាល និងគម្រោងបច្ចេកទេស',
    capabilities: [
      {
        index: '01.',
        title: 'ការអភិវឌ្ឍន៍គេហទំព័រ និង Front-End',
        subtitle: 'JavaScript · HTML · CSS · Vue.js · Bootstrap · Laravel',
        description:
          'បង្កើតគេហទំព័រដែលឆ្លើយតបគ្រប់ទំហំអេក្រង់ និងចំណុចប្រទាក់ WebView ដោយប្រើកូដស្អាត និងតភ្ជាប់ជាមួយ Vue.js និង Laravel។',
        highlights: [
          'ប្លង់ឆ្លើយតបដោយ JavaScript, HTML5, CSS3 និង Bootstrap',
          'សមាសធាតុ Vue.js និងប្រព័ន្ធ Laravel MVC',
          'ការបង្កើត Front-End សម្រាប់ WebView ទូរស័ព្ទ',
        ],
      },
      {
        index: '02.',
        title: 'ការរចនា UX/UI និងការដោះស្រាយបញ្ហា',
        subtitle: 'ការរចនា UX/UI · ភាពជាអ្នកដឹកនាំក្រុម · ការទំនាក់ទំនង',
        description:
          'រចនាលំហូរការងារដែលងាយស្រួលសម្រាប់អ្នកប្រើប្រាស់ គួបផ្សំជាមួយជំនាញដោះស្រាយបញ្ហា ការទំនាក់ទំនងល្អ និងការសហការជាក្រុម។',
        highlights: [
          'ការរចនាប្លង់ Wireframe និងចំណុចប្រទាក់ផ្តោតលើអ្នកប្រើប្រាស់',
          'សមត្ថភាពសហការ និងដឹកនាំក្រុមការងារប្រកបដោយប្រសិទ្ធភាព',
          'ការវិភាគ និងដោះស្រាយបញ្ហាបច្ចេកទេសបានរហ័ស',
        ],
      },
      {
        index: '03.',
        title: 'កម្មវិធីកុំព្យូទ័រ ប្រព័ន្ធ និង IT Support',
        subtitle: 'C · C++ · C# · Java · Windows & Linux Server · បណ្តាញ',
        description:
          'មូលដ្ឋានរឹងមាំលើការសរសេរកម្មវិធី ការបង្កើតកម្មវិធី Windows Form ការរចនាបណ្តាញអាជីវកម្មខ្នាតតូច និងការគ្រប់គ្រង Server។',
        highlights: [
          'ភាសាកម្មវិធី C, C++, C# (Windows Forms) និង Java',
          'ការដំឡើង Windows Server 2012 និង Linux Server CLI',
          'ការរចនាបណ្តាញកុំព្យូទ័រ និងជំនួយបច្ចេកទេស IT Support',
        ],
      },
    ],
    education: [
      {
        period: '2019 – 2023',
        title: 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ',
        organization: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)',
        details: [
          'ជំនាញអភិវឌ្ឍន៍គេហទំព័រ៖ C, C++, C#, Java, HTML, CSS, JS, Bootstrap, Laravel, Vue.js',
          'បានបញ្ចប់ថ្នាក់ឆ្នាំមូលដ្ឋាននៅសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (2019 – 2020)',
        ],
      },
      {
        period: '2017 – 2019',
        title: 'កម្មវិធីភាសាអង់គ្លេសទូទៅ',
        organization: 'សាលា Milky Way School',
        details: [
          'បានសិក្សាជំនាញភាសាអង់គ្លេសទូទៅ និងការទំនាក់ទំនង',
        ],
      },
      {
        period: '2014 – 2019',
        title: 'សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ',
        organization: 'វិទ្យាល័យ សម្តេច ហ៊ុន សែន ភ្នំពេញថ្មី',
        details: [
          'បានបញ្ចប់ការសិក្សាថ្នាក់វិទ្យាល័យ បន្ទាប់ពីបឋមសិក្សា (2006 – 2013)',
        ],
      },
    ],
    experience: [
      {
        period: '2023',
        title: 'វគ្គ Bootcamp អភិវឌ្ឍន៍គេហទំព័រ និង WebView',
        organization: 'វិទ្យាស្ថាន Instinct Institute',
        details: [
          'បានបញ្ចប់វគ្គ Bootcamp ផ្នែកអភិវឌ្ឍន៍គេហទំព័រ (Web Development)',
          'បង្កើតចំណុចប្រទាក់ Front-End សម្រាប់ដំណើរការលើ WebView',
        ],
      },
      {
        period: '2023',
        title: 'គម្រោងកម្មវិធី បណ្តាញ និងម៉ាស៊ីនមេ',
        organization: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ',
        details: [
          'បញ្ចប់គម្រោងកម្មវិធី Windows Form Application (គ្រប់គ្រងហាងកាហ្វេ)',
          'រចនា និងគ្រប់គ្រងហេដ្ឋារចនាសម្ព័ន្ធបណ្តាញកុំព្យូទ័រសម្រាប់ក្រុមហ៊ុនខ្នាតតូច',
          'ដំឡើង និងកំណត់រចនាសម្ព័ន្ធ Windows Server 2012 និង Linux Server តាម Command Line',
        ],
      },
      {
        period: '2021',
        title: 'ជំនាញការិយាល័យ និងអ៊ីនធឺណិត',
        organization: 'វគ្គសិក្សាកុំព្យូទ័រមូលដ្ឋាន',
        details: [
          'បានសិក្សា Word, PowerPoint, Excel និងការប្រើប្រាស់អ៊ីនធឺណិត',
        ],
      },
    ],
  },
  contact: {
    eyebrow: 'ទំនាក់ទំនង',
    heading: 'ត្រៀមខ្លួនសហការលើគម្រោងគេហទំព័រ ឬក្រុមការងារបច្ចេកវិទ្យារបស់អ្នក។',
    description:
      'បើកទទួលឱកាសការងារផ្នែក Web Development, Front-End និង UX/UI Design។ សូមផ្ញើសារខ្លីមួយ ឬទាក់ទងមកខ្ញុំតាមអ៊ីមែល និងទូរស័ព្ទ។',
    emailLabel: 'អ៊ីមែលផ្ទាល់',
    phoneLabel: 'លេខទូរស័ព្ទ',
    addressLabel: 'អាសយដ្ឋាន',
    copy: 'ចម្លង',
    copied: 'បានចម្លង',
    downloadCv: 'ទាញយកប្រវត្តិរូបពេញ (PDF)',
    form: {
      nameLabel: 'ឈ្មោះ',
      namePlaceholder: 'ឈ្មោះរបស់អ្នក',
      emailLabel: 'អ៊ីមែល',
      emailPlaceholder: 'you@company.com',
      focusLabel: 'ប្រធានបទគម្រោង',
      scopes: ['Front-End / WebView', 'Vue.js & Laravel', 'រចនា UX/UI', 'IT & បណ្តាញ'],
      detailsLabel: 'ព័ត៌មានលម្អិត',
      detailsPlaceholder: 'សូមរៀបរាប់សង្ខេបអំពីគោលដៅ ពេលវេលា ឬតួនាទី...',
      submit: 'ផ្ញើសារ',
      errName: 'សូមបញ្ចូលឈ្មោះរបស់អ្នក។',
      errEmail: 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលឱ្យបានត្រឹមត្រូវ។',
      errMessage: 'សូមសរសេរសារខ្លីយ៉ាងតិច ១០ តួអក្សរ។',
      receivedEyebrow: 'ទទួលបានសាររួចរាល់',
      thankYouPrefix: 'សូមអរគុណ,',
      receivedBodyA: 'សាររបស់អ្នកអំពី',
      receivedBodyB: 'ត្រូវបានត្រៀមរួចរាល់។ ខ្ញុំនឹងឆ្លើយតបទៅវិញតាមរយៈ',
      sendAnother: 'ផ្ញើសារម្តងទៀត',
    },
    footer: {
      role: 'អភិវឌ្ឍន៍គេហទំព័រ និងរចនា UX/UI។',
      top: 'ឡើងទៅលើ',
      work: 'ស្នាដៃ',
      about: 'អំពីខ្ញុំ',
    },
  },
  controls: {
    dark: 'ងងឹត',
    light: 'ភ្លឺ',
    switchToLight: 'ប្តូរទៅផ្ទៃភ្លឺ',
    switchToDark: 'ប្តូរទៅផ្ទៃងងឹត',
  },
};

export function getPortfolioContent(lang: LanguageCode): LocalizedPortfolioContent {
  return lang === 'km' ? CONTENT_KM : CONTENT_EN;
}
