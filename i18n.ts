import { Language } from './types';

export const translations = {
  en: {
    title: 'STRUCTURA_TODO_V1.2',
    systemReady: 'SYSTEM_READY',
    statusOnline: 'STATUS: ONLINE',
    nightMode: 'NIGHT_MODE',
    dayMode: 'DAY_MODE',
    switchLang: 'CN',
    alignLeft: 'ALIGN: L',
    alignRight: 'ALIGN: R',
    newInput: 'New_Instruction_Input',
    placeholder: 'Ex: Call Lucy at 5 PM, Urgent fix #bug...',
    chars: 'CHARS',
    processing: 'PROCESSING...',
    listening: 'LISTENING...',
    micError: 'MIC_ERROR',
    execute: 'EXECUTE',
    logTitle: 'Directive_Log',
    noTasks: 'NO_ACTIVE_DIRECTIVES',
    completed: 'COMPLETED',
    markIncomplete: 'Mark Incomplete',
    markComplete: 'Mark Complete',
    delete: 'Delete',
    
    // Notifications
    notifyTitle: 'SYSTEM_ALERTS',
    notifyOn: '[ONLINE] ALERTS_ACTIVE',
    notifyOff: '[OFFLINE] CLICK_TO_ENABLE',
    notifyDenied: '[ERROR] ACCESS_DENIED',
    
    categories: {
      work: 'WORK',
      personal: 'PERSONAL',
      urgent: 'URGENT',
      misc: 'MISC'
    },
    priorities: {
      high: 'HIGH',
      medium: 'MED',
      low: 'LOW'
    },
    error: 'Error processing input. Ensure API Key is set.'
  },
  zh: {
    title: '结构化_待办_V1.2',
    systemReady: '系统_就绪',
    statusOnline: '状态：在线',
    nightMode: '夜间模式',
    dayMode: '日间模式',
    switchLang: 'EN',
    alignLeft: '布局：左',
    alignRight: '布局：右',
    newInput: '新指令输入',
    placeholder: '例如：下午5点给Lucy打电话，紧急修复bug...',
    chars: '字符',
    processing: '处理中...',
    listening: '正在聆听...',
    micError: '麦克风错误',
    execute: '执行',
    logTitle: '指令日志',
    noTasks: '无活动指令',
    completed: '已完成',
    markIncomplete: '标记为未完成',
    markComplete: '标记为完成',
    delete: '删除',

    // Notifications
    notifyTitle: '系统警报',
    notifyOn: '[在线] 警报已激活',
    notifyOff: '[离线] 点击开启警报',
    notifyDenied: '[错误] 权限被拒绝',

    categories: {
      work: '工作',
      personal: '个人',
      urgent: '紧急',
      misc: '杂项'
    },
    priorities: {
      high: '高',
      medium: '中',
      low: '低'
    },
    error: '处理输入时出错。请确保已设置 API 密钥。'
  }
};

export const getTranslation = (lang: Language) => translations[lang];