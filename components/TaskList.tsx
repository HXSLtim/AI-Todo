import React from 'react';
import { Task, ThemeMode } from '../types';

interface TaskListProps {
  tasks: Task[];
  theme: ThemeMode;
  t: any;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, theme, t, onToggleTask, onDeleteTask }) => {
  const isNight = theme === 'night';
  const borderColor = isNight ? 'border-night-green' : 'border-black';

  if (tasks.length === 0) {
    return (
      <div className={`text-center p-12 border-2 border-dashed ${borderColor} opacity-50`}>
        {t.noTasks}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {tasks.map((task, index) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          theme={theme} 
          t={t}
          index={index}
          onToggle={() => onToggleTask(task.id)}
          onDelete={() => onDeleteTask(task.id)}
        />
      ))}
    </div>
  );
};

const TaskCard: React.FC<{ 
  task: Task; 
  theme: ThemeMode; 
  t: any;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
}> = ({ task, theme, t, index, onToggle, onDelete }) => {
  const isNight = theme === 'night';
  const borderColor = isNight ? 'border-night-green' : 'border-black';
  
  // Robust Date Parsing
  const getDateParts = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return null;

      const pad = (n: number) => n.toString().padStart(2, '0');
      
      return {
        time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
        date: `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
        fullDate: date.toLocaleDateString()
      };
    } catch (e) {
      return null;
    }
  };

  const dateParts = task.dueDateTime ? getDateParts(task.dueDateTime) : null;

  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'text-red-500';
    if (p === 'medium') return isNight ? 'text-yellow-400' : 'text-orange-600';
    return 'opacity-60';
  };

  return (
    <div className={`
      relative group border-2 ${borderColor} transition-all duration-200
      ${task.isCompleted ? 'opacity-60 grayscale' : 'hard-shadow hover:-translate-y-1'}
      ${isNight ? 'shadow-night-green' : 'shadow-black'}
    `}>
      {/* Index Number */}
      <div className={`absolute -left-3 -top-3 w-8 h-8 border-2 ${borderColor} ${isNight ? 'bg-black' : 'bg-white'} flex items-center justify-center font-bold z-20`}>
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="p-0 flex flex-col md:flex-row h-full">
        
        {/* Time Column (Strict ISO Parsing Result) */}
        {dateParts && (
          <div className={`p-4 md:w-32 border-b-2 md:border-b-0 md:border-r-2 ${borderColor} flex flex-col items-center justify-center font-bold bg-opacity-10 ${isNight ? 'bg-night-green' : 'bg-black'}`}>
            <span className="text-2xl leading-none tracking-tighter">{dateParts.time}</span>
            <span className="text-xs mt-1 opacity-70 tracking-widest">{dateParts.date}</span>
          </div>
        )}

        {/* Content Column */}
        <div className="flex-grow p-4 flex flex-col justify-center min-h-[100px]">
          <div className="flex items-start justify-between gap-4">
            <div>
               <h3 className={`text-xl font-bold uppercase leading-tight ${task.isCompleted ? 'line-through decoration-2' : ''}`}>
                 {task.summary}
               </h3>
               {task.description && (
                 <p className="mt-2 text-sm opacity-80 font-sans border-l-2 pl-2 border-current">
                   {task.description}
                 </p>
               )}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase items-center">
             <span className={`px-2 py-1 border ${borderColor}`}>
               CAT: {t.categories[task.category] || task.category}
             </span>
             <span className={`px-2 py-1 border ${borderColor} ${getPriorityColor(task.priority)} border-current`}>
               PRI: {t.priorities[task.priority] || task.priority}
             </span>
             {task.isCompleted && (
               <span className={`px-2 py-1 ${isNight ? 'bg-night-green text-black' : 'bg-black text-white'}`}>
                 {t.completed}
               </span>
             )}
          </div>
        </div>

        {/* Action Column */}
        <div className={`flex flex-row md:flex-col border-t-2 md:border-t-0 md:border-l-2 ${borderColor} divide-x-2 md:divide-x-0 md:divide-y-2 divide-current`}>
           <button 
             onClick={onToggle}
             className={`flex-1 md:flex-none p-4 w-full hover:bg-opacity-20 transition-colors flex items-center justify-center ${isNight ? 'hover:bg-night-green' : 'hover:bg-black'}`}
             title={task.isCompleted ? t.markIncomplete : t.markComplete}
           >
             <div className={`w-6 h-6 border-2 ${borderColor} flex items-center justify-center`}>
                {task.isCompleted && <div className={`w-3 h-3 ${isNight ? 'bg-night-green' : 'bg-black'}`}></div>}
             </div>
           </button>
           <button 
             onClick={onDelete}
             className={`flex-1 md:flex-none p-4 w-full hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center`}
             title={t.delete}
           >
             X
           </button>
        </div>
      </div>
    </div>
  );
}