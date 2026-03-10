# YesPaste

基于 Tauri 2 + React 的桌面剪切板历史管理工具。

## 功能

- **历史记录**：自动记录剪切板内容，支持搜索、复制、删除、清空
- **保留策略**：可设置最大保留天数与最大条数，超出自动删除
- **全局快捷键**：自定义快捷键唤出窗口（默认 `Cmd+Shift+V` / `Ctrl+Shift+V`）
- **开机自启**：可选开机自动启动
- **多语言**：简体中文 / English

## 技术栈

- 桌面壳：Tauri 2
- 前端：React 18 + TypeScript + Vite
- 包管理：pnpm
- 插件：clipboard-manager、global-shortcut、autostart

## 开发

```bash
pnpm install
pnpm run tauri dev
```

## 构建

```bash
pnpm run tauri build
```

产物在 `src-tauri/target/release/`（或 `target/debug/` 取决于 profile）。

## 项目结构

- `docs/DEVELOPMENT_PLAN.md`：开发计划与实现要点
- `src/`：前端（React 组件、hooks、i18n）
- `src-tauri/`：Tauri Rust 端与配置

## 许可证

MIT
