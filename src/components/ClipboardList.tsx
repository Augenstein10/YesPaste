import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ClipboardItem } from '../types';
import type { useClipboardHistory } from '../hooks/useClipboardHistory';

interface Props {
  model: ReturnType<typeof useClipboardHistory>;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ClipboardList({ model }: Props) {
  const { t } = useTranslation();
  const {
    list,
    search,
    setSearch,
    copyToClipboard,
    deleteItem,
    clearAll,
  } = model;

  const [toast, setToast] = useState<'success' | 'failed' | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (type: 'success' | 'failed') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(type);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2000);
  };

  const handleCopy = async (item: ClipboardItem) => {
    try {
      await copyToClipboard(item);
      showToast('success');
    } catch {
      showToast('failed');
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden relative">
      {toast !== null && (
        <div
          className={`absolute top-2.5 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg text-sm font-medium shadow-lg toast-in ${
            toast === 'success'
              ? 'bg-[#2d5a27] text-[#c8e6c9]'
              : 'bg-[#5a2727] text-[#ffcdd2]'
          }`}
          role="status"
        >
          {toast === 'success' ? t('app.copySuccess') : t('app.copyFailed')}
        </div>
      )}
      <div className="py-2.5 px-4 flex gap-2 items-center shrink-0 min-w-0">
        <input
          type="text"
          className="flex-1 min-w-0 py-2 px-3 border border-[#333] rounded-lg bg-[#25262a] text-[#e6e6e6] text-[0.9rem] placeholder:text-[#666] focus:outline-none focus:border-[#6d9fff]"
          placeholder={t('app.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {list.length > 0 && (
          <button
            type="button"
            className="py-2 px-3 border border-[#333] rounded-lg bg-[#25262a] text-[#999] text-[0.85rem] hover:text-[#e6e6e6] hover:bg-[#2a2b2e]"
            onClick={clearAll}
          >
            {t('app.clearAll')}
          </button>
        )}
      </div>
      <ul className="list-none m-0 p-2 overflow-y-auto flex-1 min-h-0">
        {list.length === 0 ? (
          <li className="py-6 text-center text-[#666] text-[0.9rem]">
            {t('app.empty')}
          </li>
        ) : (
          [...list].reverse().map((item) => (
            <li
              key={item.id}
              className="flex items-stretch gap-2 mb-1 rounded-lg bg-[#25262a] overflow-hidden"
            >
              <button
                type="button"
                className="flex-1 py-2.5 px-3 text-left border-none bg-transparent text-[#e6e6e6] cursor-pointer flex flex-col items-start gap-1 hover:bg-[#2a2b2e]"
                onClick={() => handleCopy(item)}
              >
                <span className="text-[0.9rem] leading-[1.4] max-w-full break-words line-clamp-3">
                  {item.content.replace(/\s+/g, ' ').trim() || ' '}
                </span>
                <span className="text-[0.75rem] text-[#666]">
                  {formatTime(item.createdAt)}
                </span>
              </button>
              <button
                type="button"
                className="w-9 border-none bg-transparent text-[#666] cursor-pointer text-[1.2rem] leading-none shrink-0 hover:text-[#e74c3c] hover:bg-[#2a2b2e]"
                onClick={() => deleteItem(item.id)}
                title={t('app.delete')}
                aria-label={t('app.delete')}
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
