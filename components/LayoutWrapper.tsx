import React from 'react';
import { ThemeMode, Language, Handedness } from '../types';

interface LayoutWrapperProps {
  children: React.ReactNode;
  theme: ThemeMode;
  toggleTheme: () => void;
  lang: Language;
  toggleLang: () => void;
  handedness: Handedness;
  toggleHandedness: () => void;
  t: any;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, theme, toggleTheme, lang, toggleLang, handedness, toggleHandedness, t 
}) => {
  const isNight = theme === 'night';

  const containerClass = isNight
    ? 'bg-black text-night-green selection:bg-night-green selection:text-black'
    : 'bg-white text-black selection:bg-black selection:text-white';

  const borderColor = isNight ? 'border-night-green' : 'border-black';
  const buttonClass = isNight
    ? 'border-night-green hover:bg-night-green hover:text-black'
    : 'border-black hover:bg-black hover:text-white';

  return (
    <div className={`min-h-screen w-full font-mono transition-colors duration-300 ${containerClass} flex flex-col relative overflow-hidden`}>
      {isNight && <div className="scanlines pointer-events-none fixed inset-0 z-50 opacity-20" />}
      
      {/* Structural Header */}
      <header className={`w-full border-b-4 ${borderColor} p-4 flex flex-col lg:flex-row gap-4 justify-between items-center z-10 bg-inherit`}>
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 ${borderColor} border-2 flex items-center justify-center`}>
              <span className="text-xl font-bold">A</span>
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter truncate">{t.title}</h1>
          </div>
          
          {/* Mobile visible toggle for quick access */}
          <div className="lg:hidden">
             <button
               onClick={toggleHandedness}
               className={`w-10 h-10 border-2 ${buttonClass} font-bold text-xs flex items-center justify-center`}
             >
               {handedness === 'right' ? 'R' : 'L'}
             </button>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-4 flex-wrap justify-center">
          <button
            onClick={toggleHandedness}
            className={`hidden lg:flex px-3 h-10 border-2 ${buttonClass} font-bold uppercase text-sm transition-all hard-shadow-sm active:translate-y-1 active:shadow-none items-center justify-center`}
          >
             {handedness === 'right' ? t.alignRight : t.alignLeft}
          </button>

          <button
            onClick={toggleLang}
            className={`w-12 h-10 border-2 ${buttonClass} font-bold uppercase text-sm transition-all hard-shadow-sm active:translate-y-1 active:shadow-none flex items-center justify-center`}
          >
            {t.switchLang}
          </button>
          
          <button
            onClick={toggleTheme}
            className={`px-4 h-10 border-2 ${buttonClass} font-bold uppercase text-sm transition-all hard-shadow-sm active:translate-y-1 active:shadow-none flex items-center justify-center`}
          >
            [{theme === 'day' ? t.nightMode : t.dayMode}]
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-grow flex flex-col md:flex-row relative z-10">
        {/* Left Sidebar / Decoration - purely structural */}
        <aside className={`hidden md:block w-16 border-r-4 ${borderColor} relative`}>
           <div className="absolute top-10 left-1/2 -translate-x-1/2 rotate-90 whitespace-nowrap text-xs tracking-[0.2em] opacity-50">
             {t.systemReady}
           </div>
           <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-1 h-24 ${isNight ? 'bg-night-green' : 'bg-black'}`}></div>
        </aside>

        {/* Content Area */}
        <div className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full">
           {children}
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t-4 ${borderColor} p-2 text-xs uppercase flex justify-between z-10 bg-inherit`}>
        <span>Gemini 2.5 Flash // Struct_Engine</span>
        <span>{t.statusOnline}</span>
      </footer>
    </div>
  );
};