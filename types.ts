export interface Task {
  id: string;
  summary: string;
  dueDateTime?: string; // ISO 8601 strict format
  description?: string;
  category: 'work' | 'personal' | 'urgent' | 'misc';
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
  createdAt: string;
  reminderSent?: boolean;
}

export type ThemeMode = 'day' | 'night';

export type Language = 'en' | 'zh';

export type Handedness = 'left' | 'right';

export interface ParseResult {
  tasks: Array<{
    summary: string;
    dueDateTime?: string;
    description?: string;
    category: string;
    priority: string;
  }>;
}