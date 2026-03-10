import { useState, useEffect, useCallback } from 'react';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import { register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { getCurrentWindow } from '@tauri-apps/api/window';
import type { AppSettings } from '../types';
import {
  loadSettings as loadStored,
  saveSettings as saveStored,
  DEFAULT_SETTINGS,
} from '../types';
import i18n from '../i18n';

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(() => loadStored());
  const [autostartStatus, setAutostartStatus] = useState(false);

  useEffect(() => {
    isEnabled().then(setAutostartStatus).catch(() => {});
  }, []);

  // Register hotkey on mount
  useEffect(() => {
    const hotkey = loadStored().hotkey ?? DEFAULT_SETTINGS.hotkey;
    register(hotkey, () => {
      getCurrentWindow().show();
      getCurrentWindow().setFocus();
    }).catch(console.error);
    return () => {
      unregister(hotkey).catch(() => {});
    };
  }, []);

  const setSettings = useCallback((next: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const merged = { ...prev, ...next };
      saveStored(merged);
      if (next.language != null) {
        i18n.changeLanguage(next.language);
      }
      return merged;
    });
  }, []);

  const setAutoStart = useCallback(async (on: boolean) => {
    try {
      if (on) {
        await enable();
      } else {
        await disable();
      }
      setAutostartStatus(await isEnabled());
      setSettings({ autoStart: on });
    } catch {
      setSettings({ autoStart: false });
    }
  }, [setSettings]);

  const setHotkey = useCallback(
    async (hotkey: string) => {
      const current = settings.hotkey;
      try {
        await unregister(current);
      } catch {
        // ignore
      }
      try {
        await register(hotkey, () => {
          getCurrentWindow().show();
          getCurrentWindow().setFocus();
        });
        setSettings({ hotkey });
      } catch (e) {
        console.error('Failed to register hotkey', e);
      }
    },
    [settings.hotkey, setSettings]
  );

  return {
    settings,
    setSettings,
    setAutoStart,
    setHotkey,
    autostartStatus,
    DEFAULT_SETTINGS,
  };
}
