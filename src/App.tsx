import { CapabilitiesSection } from './components/CapabilitiesSection';
import { ContactSection } from './components/ContactSection';
import { HeroAboutStage } from './components/HeroAboutStage';
import { HologramBackground } from './components/HologramBackground';
import { MagneticCursor } from './components/MagneticCursor';
import { Navbar } from './components/Navbar';
import { PreferenceDock } from './components/PreferenceDock';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { SectionSeparator } from './components/SectionSeparator';
import { SelectedWorks } from './components/SelectedWorks';
import { PreferencesProvider } from './context/PreferencesContext';

export default function App() {
  return (
    <PreferencesProvider>
      <div className="relative min-h-screen bg-[#F4F7FC] text-slate-900 transition-colors duration-300 dark:bg-[#07152E] dark:text-slate-100">
        <HologramBackground />
        <ScrollProgressBar />
        <MagneticCursor />
        <Navbar />
        <main className="relative z-10">
          <HeroAboutStage />
          <SectionSeparator />
          <SelectedWorks />
          <SectionSeparator />
          <CapabilitiesSection />
          <SectionSeparator />
        </main>
        <ContactSection />
        <PreferenceDock />
      </div>
    </PreferencesProvider>
  );
}
