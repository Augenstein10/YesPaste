export interface ClipboardItem {
  id: string;
  content: string;
  createdAt: number;
}

export interface AppSettings {
  maxRetentionDays: number;
  maxItems: number;
  hotkey: string;
  autoStart: boolean;
  language: 'zh' | 'en';
}

export const DEFAULT_SETTINGS: AppSettings = {
  maxRetentionDays: 7,
  maxItems: 100,
  hotkey: 'CommandOrControl+Shift+V',
  autoStart: false,
  language: 'zh',
};

const STORAGE_KEY = 'yespaste_history';
const SETTINGS_KEY = 'yespaste_settings';

export function loadHistory(): ClipboardItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: ClipboardItem[] = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveHistory(list: ClipboardItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const s = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...s };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
