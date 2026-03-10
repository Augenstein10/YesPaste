import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useClipboardHistory } from './hooks/useClipboardHistory';
import { useSettings } from './hooks/useSettings';
import { ClipboardList } from './components/ClipboardList';
import { Settings } from './components/Settings';

const iconCls = 'iconify shrink-0 w-5 h-5';

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
    { id: 'history' as const, label: t('app.history'), icon: 'icon-[mdi--clipboard-text-multiple]' },
    { id: 'settings' as const, label: t('app.settings'), icon: 'icon-[mdi--cog]' },
  ] as const;

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
          {menuItems.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-md text-left border-none bg-transparent cursor-pointer text-sm transition-colors ${
                tab === id
                  ? 'text-[#6d9fff] bg-[#2a2b2e]'
                  : 'text-[#999] hover:text-[#e6e6e6] hover:bg-[#2a2b2e]'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              title={sidebarCollapsed ? label : undefined}
            >
              <span className={`${iconCls} ${icon}`} aria-hidden />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-[#333] shrink-0">
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="group flex items-center justify-center w-full gap-2.5 px-3 py-2.5 rounded-lg border border-transparent bg-transparent text-[#999] hover:text-[#e6e6e6] hover:bg-[#2a2b2e] hover:border-[#333] cursor-pointer text-sm transition-colors duration-150"
            title={sidebarCollapsed ? t('app.expand') : t('app.collapse')}
          >
            {sidebarCollapsed ? (
              <span className={`${iconCls} icon-[mdi--chevron-right]`} aria-hidden />
            ) : (
              <>
                <span className={`${iconCls} icon-[mdi--chevron-left]`} aria-hidden />
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
