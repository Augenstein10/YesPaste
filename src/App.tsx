import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useClipboardHistory } from './hooks/useClipboardHistory';
import { useSettings } from './hooks/useSettings';
import { ClipboardList } from './components/ClipboardList';
import { Settings } from './components/Settings';

function IconHistory() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function App() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'history' | 'settings'>('history');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const clipboard = useClipboardHistory();
  const settingsModel = useSettings();

  useEffect(() => {
    if (tab === 'history') clipboard.refreshFromStorage();
  }, [tab]);

  const menuItems = [
    { id: 'history' as const, label: t('app.history'), icon: IconHistory },
    { id: 'settings' as const, label: t('app.settings'), icon: IconSettings },
  ];

  return (
    <div className="w-full h-full min-h-0 flex bg-[#1a1b1e] text-[#e6e6e6]">
      {/* 左侧菜单 */}
      <aside
        className={`flex flex-col shrink-0 border-r border-[#333] bg-[#1e1f23] transition-[width] duration-200 ease-out ${
          sidebarCollapsed ? 'w-14' : 'w-48'
        }`}
      >
        <div className="p-3 border-b border-[#333] shrink-0 flex items-center gap-2 min-w-0">
          {!sidebarCollapsed && (
            <span className="text-sm font-semibold truncate">{t('app.title')}</span>
          )}
        </div>
        <nav className="flex-1 py-2 flex flex-col gap-0.5 min-w-0">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-md text-left border-none bg-transparent cursor-pointer text-sm ${
                tab === id
                  ? 'text-[#6d9fff] bg-[#2a2b2e]'
                  : 'text-[#999] hover:text-[#e6e6e6] hover:bg-[#2a2b2e]'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-[#333] shrink-0">
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="flex items-center justify-center w-full gap-3 px-3 py-2.5 rounded-md border-none bg-transparent text-[#999] hover:text-[#e6e6e6] hover:bg-[#2a2b2e] cursor-pointer text-sm"
            title={sidebarCollapsed ? t('app.expand') : t('app.collapse')}
          >
            {sidebarCollapsed ? (
              <IconChevronRight />
            ) : (
              <>
                <IconChevronLeft />
                <span className="truncate">{t('app.collapse')}</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* 右侧功能区 */}
      <main className="flex-1 min-w-0 min-h-0 overflow-hidden flex flex-col">
        {tab === 'history' && <ClipboardList model={clipboard} />}
        {tab === 'settings' && <Settings model={settingsModel} />}
      </main>
    </div>
  );
}

export default App;
