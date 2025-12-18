import React, { useState, useEffect, useRef } from 'react';
import { ThemeMode, Language, Handedness } from '../types';
import { parseTodoInput } from '../services/aiService';
import { playMechanicalClick, playSuccessSound } from '../utils/sound';

interface InputSectionProps {
  theme: ThemeMode;
  lang: Language;
  handedness: Handedness;
  t: any;
  onAddTasks: (parsedTasks: any[]) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ theme, lang, handedness, t, onAddTasks }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Ref to track if unmounted to prevent state updates on unmounted component
  const isMounted = useRef(true);
  // Ref to track active submission to prevent double invocation
  const isSubmitting = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const isNight = theme === 'night';
  const borderColor = isNight ? 'border-night-green' : 'border-black';
  const placeholderColor = isNight ? 'placeholder-night-green/50' : 'placeholder-gray-500';

  // Speech Recognition Setup
  const handleMicClick = () => {
    playMechanicalClick();
    
    if (isListening) return; 

    // Use a small timeout to allow the UI to update and sound to play 
    // before the heavy SpeechRecognition initialization hits the main thread.
    // This fixes the "laggy" feeling.
    setTimeout(() => {
        if (!isMounted.current) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          alert("Speech Recognition API not supported in this browser.");
          return;
        }

        try {
            const recognition = new SpeechRecognition();
            
            // Strict Internationalization Mapping
            // zh -> zh-CN (Chinese Mainland)
            // en -> en-US (English US)
            recognition.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            setIsListening(true);

            recognition.onstart = () => {
              // Native start event
            };

            recognition.onresult = (event: any) => {
              if (!isMounted.current) return;
              const transcript = event.results[0][0].transcript;
              setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
              playSuccessSound();
            };

            recognition.onerror = (event: any) => {
              console.error("Speech recognition error", event.error);
              if (isMounted.current) setIsListening(false);
            };

            recognition.onend = () => {
              if (isMounted.current) setIsListening(false);
            };

            recognition.start();
        } catch (error) {
            console.error("Failed to initialize speech recognition", error);
            if (isMounted.current) setIsListening(false);
        }
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting.current) return;
    
    playMechanicalClick();
    if (!input.trim()) return;

    isSubmitting.current = true;
    setIsLoading(true);
    try {
      const result = await parseTodoInput(input);
      if (result.tasks && result.tasks.length > 0) {
        onAddTasks(result.tasks);
        setInput('');
        playSuccessSound();
      } else {
        // If no tasks found (or error handled silently), show a gentle notification or log
        console.log("No tasks parsed or error occurred.");
      }
    } catch (error) {
      console.error("Error processing task:", error);
      alert(t.error);
    } finally {
      isSubmitting.current = false;
      if (isMounted.current) setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Layout Logic
  const mobileJustify = handedness === 'right' ? 'justify-end' : 'justify-start';

  return (
    <section className={`mb-12 border-2 ${borderColor} p-1 relative`}>
      <div className={`absolute -top-3 left-4 bg-inherit px-2 text-xs font-bold uppercase tracking-widest ${isNight ? 'bg-black' : 'bg-white'}`}>
        {t.newInput}
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-grow relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? t.listening : t.placeholder}
            className={`w-full h-24 bg-transparent resize-none border-b-2 ${borderColor} focus:outline-none p-2 font-mono text-sm ${placeholderColor} ${isListening ? 'animate-pulse' : ''}`}
            disabled={isLoading}
          />
          <div className="absolute bottom-2 right-2 text-xs opacity-50">
            {input.length} {t.chars}
          </div>
        </div>

        {/* Button Group */}
        <div className={`
          flex gap-2 
          md:flex-col md:w-32 md:justify-start
          flex-row w-full ${mobileJustify}
        `}>
            <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading}
            className={`
                h-10 flex items-center justify-center font-bold uppercase tracking-wider
                border-2 ${borderColor} transition-all
                w-16 md:w-full
                ${isListening ? 'bg-red-600 text-white border-red-600 animate-pulse' : `active:translate-y-1 ${isNight ? 'hover:bg-night-green/10' : 'hover:bg-black/10'}`}
            `}
            title="Microphone"
            >
            {isListening ? (
                <span>●</span>
            ) : (
                <span>MIC</span>
            )}
            </button>

            <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`
                flex items-center justify-center font-bold uppercase tracking-wider
                border-2 ${borderColor} transition-all
                w-24 md:w-full md:flex-grow h-10 md:h-auto
                ${isLoading ? 'opacity-50 cursor-not-allowed' : `active:translate-y-1 ${isNight ? 'hover:bg-night-green/10' : 'hover:bg-black/10'}`}
            `}
            >
            {isLoading ? (
                <span className="animate-pulse">...</span>
            ) : (
                <span>{t.execute}</span>
            )}
            </button>
        </div>
      </form>
    </section>
  );
};