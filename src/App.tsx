import { useState, useEffect } from 'react';
import type { Language, Theme } from './types';
import { CinematicIntro } from './components/CinematicIntro';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Timeline } from './components/Timeline';
import { YogaSection } from './components/YogaSection';
import { Philosophy } from './components/Philosophy';
import { SpeakingGrowth } from './components/SpeakingGrowth';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export type IntroPhase = 'intro' | 'transitioning' | 'revealed';

export function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('dibash_lang') as Language) || 'en';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('dibash_theme') as Theme) || 'dark';
  });

  // Controls the 4-phase cinematic portrait disintegration into hero transition
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'revealed';
    }
    return 'intro';
  });

  // Sync theme with DOM attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dibash_theme', theme);
  }, [theme]);

  // Sync language with DOM attribute
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('dibash_lang', language);
  }, [language]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIntroPhase('intro');
  };

  return (
    <div className="portfolio-app-root" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 3D Cinematic Portrait Disintegration Intro */}
      {introPhase !== 'revealed' && (
        <CinematicIntro
          language={language}
          onTransitionStart={() => setIntroPhase('transitioning')}
          onComplete={() => setIntroPhase('revealed')}
        />
      )}

      {/* Global Navigation Bar */}
      <Navigation
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeChange={handleThemeChange}
        onReplayIntro={handleReplayIntro}
      />

      {/* Main Experience Flow */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero language={language} theme={theme} introPhase={introPhase} />
        <About language={language} />
        <Projects language={language} />
        <Skills language={language} />
        <Timeline language={language} />
        <YogaSection language={language} />
        <Philosophy language={language} />
        <SpeakingGrowth language={language} />
        <Contact language={language} />
      </main>

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}

export default App;
