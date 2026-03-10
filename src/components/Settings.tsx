import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { useSettings } from '../hooks/useSettings';
import type { Locale } from '../i18n';

interface Props {
  model: ReturnType<typeof useSettings>;
}

const LANGUAGES: { value: Locale; labelKey: string }[] = [
  { value: 'zh', labelKey: 'lang.zh' },
  { value: 'en', labelKey: 'lang.en' },
];

function formatHotkey(
  e: React.KeyboardEvent<HTMLInputElement>,
  isMac: boolean,
): string {
  const parts: string[] = [];

  if (e.metaKey) parts.push(isMac ? '⌘' : 'Meta');
  if (e.ctrlKey) parts.push(isMac ? '⌃' : 'Ctrl');
  if (e.altKey) parts.push(isMac ? '⌥' : 'Alt');
  if (e.shiftKey) parts.push(isMac ? '⇧' : 'Shift');

  const key = e.key;
  const modifierKeys = ['Meta', 'Control', 'Shift', 'Alt'];
  if (!modifierKeys.includes(key)) {
    if (key.length === 1) {
      parts.push(key.toUpperCase());
    } else {
      const pretty = key.replace(/^Key|^Digit/, '');
      parts.push(pretty.charAt(0).toUpperCase() + pretty.slice(1));
    }
  }

  return parts.join(' + ');
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#333] bg-[#25262a]/80 overflow-hidden">
      <h3 className="m-0 px-4 py-3 text-sm font-semibold text-[#b0b0b0] uppercase tracking-wider border-b border-[#333] bg-[#1e1f23]/60">
        {title}
      </h3>
      <div className="divide-y divide-[#333]">{children}</div>
    </section>
  );
}

function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 min-h-13">
      <div className="shrink-0">
        <div className="text-[0.95rem] text-[#e6e6e6]">{label}</div>
        {hint && (
          <div className="mt-0.5 text-xs text-[#777] leading-snug">{hint}</div>
        )}
      </div>
      <div className="shrink-0 sm:min-w-[140px] flex justify-end">{children}</div>
    </div>
  );
}

const inputBase =
  'py-2 px-3 border border-[#333] rounded-lg bg-[#1a1b1e] text-[#e6e6e6] text-[0.9rem] focus:outline-none focus:border-[#6d9fff] focus:ring-1 focus:ring-[#6d9fff]/30 transition-colors';

export function Settings({ model }: Props) {
  const { t } = useTranslation();
  const {
    settings,
    setSettings,
    setAutoStart,
    setHotkey,
    autostartStatus,
    DEFAULT_SETTINGS,
  } = model;
  const [hotkeyPreview, setHotkeyPreview] = useState(settings.hotkey);
  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-6 max-w-[480px] mx-auto">
        {/* 页面标题 */}
        <header className="mb-6">
          <h2 className="m-0 text-lg font-semibold text-[#e6e6e6]">
            {t('settings.title')}
          </h2>
          <p className="m-0 mt-1 text-sm text-[#777]">
            {t('settings.subtitle')}
          </p>
        </header>

        <div className="flex flex-col gap-5">
          {/* 存储与清理 */}
          <SectionCard title={t('settings.sectionStorage')}>
            <SettingRow
              label={t('settings.maxRetentionDays')}
              hint={t('settings.maxRetentionDaysHint')}
            >
              <select
                value={settings.maxRetentionDays}
                onChange={(e) =>
                  setSettings({ maxRetentionDays: Number(e.target.value) })
                }
                className={`${inputBase} min-w-[100px]`}
              >
                {[1, 3, 7, 14, 30, 90].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </SettingRow>
            <SettingRow
              label={t('settings.maxItems')}
              hint={t('settings.maxItemsHint')}
            >
              <select
                value={settings.maxItems}
                onChange={(e) =>
                  setSettings({ maxItems: Number(e.target.value) })
                }
                className={`${inputBase} min-w-[100px]`}
              >
                {[50, 100, 200, 500, 1000].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </SettingRow>
          </SectionCard>

          {/* 快捷与启动 */}
          <SectionCard title={t('settings.sectionShortcut')}>
            <SettingRow
              label={t('settings.hotkey')}
              hint={t('settings.hotkeyHint')}
            >
              <input
                type="text"
                className={`${inputBase} w-full min-w-[140px] max-w-[180px]`}
                value={hotkeyPreview}
                readOnly
                onFocus={() => {
                  setHotkeyPreview(settings.hotkey);
                }}
                onKeyDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (e.key === 'Escape') {
                    setHotkeyPreview(settings.hotkey);
                    (e.target as HTMLInputElement).blur();
                    return;
                  }

                  if (e.key === 'Backspace') {
                    setHotkeyPreview('');
                    return;
                  }

                  if (e.key === 'Enter') {
                    if (hotkeyPreview.trim()) {
                      setHotkey(hotkeyPreview.trim());
                    }
                    (e.target as HTMLInputElement).blur();
                    return;
                  }

                  const combo = formatHotkey(e, isMac);
                  if (!combo) return;
                  setHotkeyPreview(combo);
                }}
                onBlur={() => {
                  const v = hotkeyPreview.trim();
                  if (v && v !== settings.hotkey) setHotkey(v);
                }}
                placeholder={DEFAULT_SETTINGS.hotkey}
              />
            </SettingRow>
            <SettingRow
              label={t('settings.autoStart')}
              hint={t('settings.autoStartHint')}
            >
              <label className="switch">
                <input
                  type="checkbox"
                  checked={autostartStatus}
                  onChange={(e) => setAutoStart(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </SettingRow>
          </SectionCard>

          {/* 界面 */}
          <SectionCard title={t('settings.sectionAppearance')}>
            <SettingRow label={t('settings.language')}>
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({ language: e.target.value as Locale })
                }
                className={`${inputBase} min-w-[120px]`}
              >
                {LANGUAGES.map(({ value, labelKey }) => (
                  <option key={value} value={value}>
                    {t(labelKey)}
                  </option>
                ))}
              </select>
            </SettingRow>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
