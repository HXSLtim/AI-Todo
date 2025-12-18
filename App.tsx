import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import { LayoutWrapper } from './components/LayoutWrapper';
import { InputSection } from './components/InputSection';
import { TaskList } from './components/TaskList';
import { Task, ThemeMode, Language, Handedness } from './types';
import { getTranslation } from './i18n';
import { playMechanicalClick, playSuccessSound } from './utils/sound';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('structura-theme');
    return (saved === 'day' || saved === 'night') ? saved : 'day';
  });
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('structura-lang');
    return (saved === 'en' || saved === 'zh') ? saved : 'en';
  });
  const [handedness, setHandedness] = useState<Handedness>(() => {
    const saved = localStorage.getItem('structura-handedness');
    return (saved === 'left' || saved === 'right') ? saved : 'right';
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('structura-tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load tasks");
        return [];
      }
    }
    return [];
  });
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );


  // Save to local storage
  useEffect(() => {
    localStorage.setItem('structura-tasks', JSON.stringify(tasks));
    localStorage.setItem('structura-theme', theme);
    localStorage.setItem('structura-lang', lang);
    localStorage.setItem('structura-handedness', handedness);
  }, [tasks, theme, lang, handedness]);

  // System Notification Logic
  const requestNotificationPermission = async () => {
    playMechanicalClick();
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
        playSuccessSound();
    }
  };

  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const interval = setInterval(() => {
      const now = new Date();
      
      // Check for tasks that are due, not completed, and haven't triggered a reminder yet
      const tasksToNotify = tasks.filter(t => {
        if (!t.dueDateTime || t.isCompleted || t.reminderSent) return false;
        const due = new Date(t.dueDateTime);
        // Trigger if current time is greater than or equal to due time
        // Allow a small window so we don't notify for old tasks if the app was closed
        return now >= due && (now.getTime() - due.getTime() < 60000 * 5); // 5 min window
      });

      if (tasksToNotify.length > 0) {
        tasksToNotify.forEach(task => {
          new Notification("STRUCTURA REMINDER", {
            body: `[${task.priority.toUpperCase()}] ${task.summary}`,
            icon: '/favicon.ico' 
          });
          playSuccessSound(); // Play sound on notification trigger
        });

        // Update state to mark reminder as sent
        setTasks(prev => prev.map(t => 
          tasksToNotify.some(notify => notify.id === t.id)
            ? { ...t, reminderSent: true }
            : t
        ));
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [tasks, notificationPermission]);


  const toggleTheme = () => {
    playMechanicalClick();
    setTheme(prev => prev === 'day' ? 'night' : 'day');
  };

  const toggleLang = () => {
    playMechanicalClick();
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const toggleHandedness = () => {
    playMechanicalClick();
    setHandedness(prev => prev === 'right' ? 'left' : 'right');
  };

  const addTasks = (newParsedTasks: any[]) => {
    const newTasks: Task[] = newParsedTasks.map(t => ({
      id: generateId(),
      summary: t.summary,
      dueDateTime: t.dueDateTime || undefined,
      description: t.description || undefined,
      category: t.category || 'misc',
      priority: t.priority || 'medium',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      reminderSent: false
    }));
    setTasks(prev => [...newTasks, ...prev]);
  };

  const toggleTask = (id: string) => {
    playMechanicalClick();
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

  const deleteTask = (id: string) => {
    playMechanicalClick();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const t = getTranslation(lang);
  const isNight = theme === 'night';
  const borderColor = isNight ? 'border-night-green' : 'border-black';

  // Notification Button Styles
  let notifButtonClass = '';
  let notifText = '';

  if (notificationPermission === 'granted') {
    notifButtonClass = isNight 
        ? 'bg-night-green text-black border-night-green' 
        : 'bg-black text-white border-black';
    notifText = t.notifyOn;
  } else if (notificationPermission === 'denied') {
    notifButtonClass = 'border-red-500 text-red-500 opacity-70 line-through cursor-not-allowed';
    notifText = t.notifyDenied;
  } else {
    // Default
    notifButtonClass = `${borderColor} opacity-80 border-dashed animate-pulse ${isNight ? 'hover:bg-night-green/10' : 'hover:bg-black/10'}`;
    notifText = t.notifyOff;
  }

  return (
    <LayoutWrapper 
      theme={theme} 
      toggleTheme={toggleTheme} 
      lang={lang} 
      toggleLang={toggleLang}
      handedness={handedness}
      toggleHandedness={toggleHandedness} 
      t={t}
    >
      <InputSection 
        theme={theme} 
        lang={lang} 
        handedness={handedness} 
        t={t} 
        onAddTasks={addTasks} 
      />
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-4">
            <div className={`h-4 w-4 ${isNight ? 'bg-night-green' : 'bg-black'}`}></div>
            <h2 className="text-xl font-bold uppercase tracking-wider">{t.logTitle}</h2>
        </div>
        
        {/* Improved Notification Status Indicator */}
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase opacity-50 hidden md:block">{t.notifyTitle}:</span>
            <button 
            onClick={requestNotificationPermission}
            disabled={notificationPermission === 'denied'}
            className={`
                text-xs font-bold uppercase border-2 px-3 py-2 transition-all duration-200
                ${notifButtonClass}
            `}
            >
            {notifText}
            </button>
        </div>
      </div>

      <div className={`w-full h-0.5 mb-6 ${isNight ? 'bg-night-green' : 'bg-black'}`}></div>

      <TaskList 
        tasks={tasks} 
        theme={theme} 
        t={t}
        onToggleTask={toggleTask} 
        onDeleteTask={deleteTask} 
      />
    </LayoutWrapper>
  );
};

export default App;