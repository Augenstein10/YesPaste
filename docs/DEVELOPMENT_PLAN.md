# YesPaste 剪切板管理工具 - 开发计划

## 项目概述

使用 **Tauri 2** + **React (TypeScript)** + **pnpm** 开发一款桌面端剪切板历史管理工具，支持历史记录、策略清理、全局快捷键、开机自启与多语言。

---

## 技术栈

| 类别       | 技术选型 |
|------------|----------|
| 桌面壳     | Tauri 2  |
| 前端       | React 18 + TypeScript + Vite |
| 包管理     | pnpm |
| 剪切板     | `@tauri-apps/plugin-clipboard-manager` |
| 全局快捷键 | `@tauri-apps/plugin-global-shortcut` |
| 开机自启   | `@tauri-apps/plugin-autostart` |
| 持久化     | 本地 JSON/SQLite + Tauri Store 或 fs |

---

## 功能清单与实现要点

### 1. 剪切板历史列表（查看 / 复制 / 删除 / 搜索）

- **数据模型**：每条记录包含 `id`、`content`（文本）、`createdAt`（时间戳）、可选 `type`（text/image）。
- **监听剪切板**：使用 Tauri 剪切板插件 `readText`/`writeText`，配合前端或 Rust 侧定时/事件监听，新内容写入时去重并追加到历史。
- **列表 UI**：虚拟列表展示历史，每条支持：点击复制到当前剪切板、删除单条、清空全部。
- **搜索**：前端对当前列表按 `content` 过滤（可支持高亮），可选持久化搜索历史。

**验收**：可查看历史、点击复制、删除单条/清空、输入关键词过滤列表。

---

### 2. 最大保留时间与条数、超出自动删除

- **设置项**：
  - `maxRetentionDays`：最大保留天数（如 7/30/90），超过则按 `createdAt` 删除。
  - `maxItems`：最大保留条数（如 100/500/1000），超出时删除最旧的记录。
- **执行策略**：
  - 每次写入新记录或启动时：先按时间清理，再按条数截断（保留最新 N 条）。
- **存储**：与历史列表共用同一数据源（如 JSON 文件或 SQLite），在 Rust 或前端封装“写入前清理”逻辑。

**验收**：设置 7 天 + 50 条后，只保留 50 条且均为 7 天内；新复制触发自动清理。

---

### 3. 自定义快捷键唤出历史列表

- 使用 **Tauri Global Shortcut** 插件注册全局快捷键。
- **默认快捷键**：如 `CommandOrControl+Shift+V`（macOS/Windows 兼容）。
- **设置页**：提供输入框设置自定义快捷键，校验合法后 `unregister` 旧快捷键并 `register` 新快捷键；持久化到本地配置。
- 快捷键触发时：显示主窗口并 focus、或打开仅列表的悬浮窗（依产品形态二选一）。

**验收**：默认快捷键可唤出列表；修改后保存，新快捷键生效。

---

### 4. 开机自动启动

- 使用 **Tauri Autostart** 插件：`enable()` / `disable()` / `isEnabled()`。
- 设置页增加“开机自动启动”开关，与 `isEnabled` 同步；勾选时 `enable()`，取消时 `disable()`。
- 可选：自启时最小化到托盘或仅后台运行（若后续做托盘）。

**验收**：勾选后重启系统，应用随系统启动；取消后不再自启。

---

### 5. 界面语言设置

- **i18n**：使用 `react-i18next` + `i18next`，语言包放 `src/locales`（如 `zh.json`、`en.json`）。
- **可选语言**：简体中文、English（可后续扩展）。
- **持久化**：当前语言写入本地配置（如 `app_settings.json`），启动时读取并 `i18n.changeLanguage(locale)`。
- 设置页提供语言下拉框，切换后立即生效并写回配置。

**验收**：切换中/英后界面文字全部切换；重启后保持上次选择。

---

### 6. 使用 pnpm

- 项目使用 **pnpm** 初始化与日常安装、构建、运行。
- 脚本示例：`pnpm install`、`pnpm run dev`、`pnpm run tauri dev`、`pnpm run tauri build`。

---

## 项目结构（规划）

```
YesPaste/
├── docs/
│   └── DEVELOPMENT_PLAN.md
├── src/                    # 前端 React
│   ├── locales/            # i18n 语言包
│   ├── components/         # 列表、设置、搜索等
│   ├── hooks/              # 剪切板监听、设置读写
│   ├── stores/             # 历史记录、设置状态
│   └── App.tsx
├── src-tauri/              # Tauri Rust
│   ├── src/
│   │   ├── lib.rs
│   │   ├── clipboard.rs    # 历史读写、清理逻辑
│   │   └── commands.rs     # Tauri commands
│   └── Cargo.toml
├── package.json
└── pnpm-workspace.yaml     # 如需要
```

---

## 开发阶段与顺序

| 阶段 | 内容 | 依赖 |
|------|------|------|
| 1 | 使用 pnpm 创建 Tauri + React(TS) 项目骨架 | - |
| 2 | 集成 clipboard-manager，实现历史列表的读取/写入/删除与基础 UI | 阶段 1 |
| 3 | 实现搜索过滤与复制到剪切板 | 阶段 2 |
| 4 | 实现 maxRetentionDays / maxItems 与自动清理逻辑 | 阶段 2 |
| 5 | 集成 global-shortcut，默认快捷键唤出窗口；设置页自定义快捷键 | 阶段 1 |
| 6 | 集成 autostart，设置页“开机自启”开关 | 阶段 1 |
| 7 | 集成 i18n，语言包与设置页语言切换 | 阶段 1 |

---

## 验收标准总结

- 可查看、复制、删除、搜索历史剪切板数据。
- 可设置最大保留天数与条数，超出自动删除。
- 可自定义全局快捷键唤出历史列表。
- 可设置是否开机自动启动。
- 可设置界面语言（中/英）。
- 使用 pnpm 管理依赖与脚本。

---

## 运行与构建

- **开发**：`pnpm run tauri dev`（会先启动 Vite 再打开 Tauri 窗口）
- **构建**：`pnpm run tauri build`（需在可写 Cargo 缓存环境下执行）
- **仅前端**：`pnpm run dev` / `pnpm run build`

## 参考

- [Tauri 2 - Clipboard Manager](https://v2.tauri.app/plugin/clipboard)
- [Tauri 2 - Global Shortcut](https://v2.tauri.app/plugin/global-shortcut)
- [Tauri 2 - Autostart](https://v2.tauri.app/plugin/autostart)
