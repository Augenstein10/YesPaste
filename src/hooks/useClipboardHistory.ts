import { useState, useEffect, useCallback } from 'react';
import { readText, writeText } from '@tauri-apps/plugin-clipboard-manager';
import type { ClipboardItem } from '../types';
import {
  loadHistory,
  saveHistory,
  loadSettings,
} from '../types';

function applyRetention(
  list: ClipboardItem[],
  maxDays: number,
  maxItems: number
): ClipboardItem[] {
  const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;
  const filtered = list.filter((item) => item.createdAt >= cutoff);
  return filtered.slice(-maxItems);
}

export function useClipboardHistory() {
  const [list, setList] = useState<ClipboardItem[]>(() => {
    const s = loadSettings();
    return applyRetention(loadHistory(), s.maxRetentionDays, s.maxItems);
  });
  const [search, setSearch] = useState('');

  const persist = useCallback((next: ClipboardItem[]) => {
    const s = loadSettings();
    const trimmed = applyRetention(next, s.maxRetentionDays, s.maxItems);
    setList(trimmed);
    saveHistory(trimmed);
  }, []);

  // Load from storage on mount and when settings might have changed
  useEffect(() => {
    const s = loadSettings();
    const raw = loadHistory();
    setList(applyRetention(raw, s.maxRetentionDays, s.maxItems));
  }, []);

  // Poll clipboard and add new content
  useEffect(() => {
    let lastContent: string | null = null;
    const interval = setInterval(async () => {
      try {
        const content = await readText();
        if (content == null || content === '') return;
        if (content === lastContent) return;
        lastContent = content;
        const s = loadSettings();
        const raw = loadHistory();
        const existing = raw.find((i) => i.content === content);
        if (existing) return;
        const newItem: ClipboardItem = {
          id: crypto.randomUUID(),
          content,
          createdAt: Date.now(),
        };
        const next = applyRetention(
          [...raw, newItem],
          s.maxRetentionDays,
          s.maxItems
        );
        setList(next);
        saveHistory(next);
      } catch {
        // ignore
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = useCallback(async (item: ClipboardItem) => {
    await writeText(item.content);
  }, []);

  const deleteItem = useCallback(
    (id: string) => {
      const next = list.filter((i) => i.id !== id);
      persist(next);
    },
    [list, persist]
  );

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  const filteredList = search.trim()
    ? list.filter((i) =>
        i.content.toLowerCase().includes(search.trim().toLowerCase())
      )
    : list;

  return {
    list: filteredList,
    search,
    setSearch,
    copyToClipboard,
    deleteItem,
    clearAll,
    refreshFromStorage: () => {
      const s = loadSettings();
      setList(applyRetention(loadHistory(), s.maxRetentionDays, s.maxItems));
    },
  };
}
