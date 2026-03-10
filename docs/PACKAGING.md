# YesPaste 打包说明（Windows / macOS）

## 前提

- 已能在本机成功执行：`pnpm run tauri build`
- **macOS 安装包**：需要在 **macOS** 上执行 build
- **Windows 安装包**：需要在 **Windows** 上执行 build  
  （Tauri 不提供在 Mac 上直接打出 Windows 安装包的一键方式，需在对应系统或 CI 里各打各的）

---

## 一、打包命令（两个系统相同）

在项目根目录执行：

```bash
pnpm install
pnpm run tauri build
```

构建完成后，安装包和可执行文件在：

```
src-tauri/target/release/bundle/
```

---

## 二、macOS 产物

在 **macOS** 上执行 `pnpm run tauri build` 后，在 `src-tauri/target/release/bundle/` 下会有：

| 类型 | 路径示例 | 说明 |
|------|----------|------|
| **.app** | `bundle/macos/YesPaste.app` | 可直接双击运行，也可拖到「应用程序」 |
| **.dmg** | `bundle/dmg/YesPaste_0.1.0_aarch64.dmg` | 磁盘镜像，适合分发给用户安装 |

- 若为 Apple Silicon：多为 `aarch64`（ARM64）
- 若为 Intel Mac：多为 `x86_64`

分发时通常用 **.dmg**，用户打开后把 YesPaste 拖到 Applications 即可。

---

## 三、Windows 产物

在 **Windows** 上执行 `pnpm run tauri build` 后，在 `src-tauri\target\release\bundle\` 下会有：

| 类型 | 路径示例 | 说明 |
|------|----------|------|
| **.exe 安装包** | `bundle/nsis/YesPaste_0.1.0_x64-setup.exe` | NSIS 安装程序，用户运行后按向导安装 |
| **.msi** | `bundle/msi/YesPaste_0.1.0_x64_en-US.msi` | 可选，部分环境会生成 MSI 安装包 |

- 64 位系统一般为 `x64`；32 位为 `i686`（若在 tauri.conf 中启用了 32 位）。

分发时通常用 **.exe 安装包**（NSIS）即可。

---

## 四、只打当前平台

默认会打「当前系统」的安装包。若要确认或只打某一种格式，可先看支持的 targets：

```bash
pnpm tauri build --help
```

当前 `tauri.conf.json` 里是 `"targets": "all"`，会生成当前平台下的所有格式（如 macOS 的 .app + .dmg，Windows 的 .exe/.msi）。

---

## 五、版本号与图标

- **版本号**：在 `src-tauri/tauri.conf.json` 里改 `version`（如 `"0.1.0"`），会同步到安装包名称和应用内部版本。
- **图标**：替换 `src-tauri/icons/` 下对应尺寸的图标后重新执行 `pnpm run tauri build` 即可。

---

## 六、总结

| 目标平台 | 在哪台机器执行 build | 主要分发文件 |
|----------|----------------------|--------------|
| **macOS** | macOS | `bundle/dmg/YesPaste_*.dmg` 或 `YesPaste.app` |
| **Windows** | Windows | `bundle/nsis/YesPaste_*_x64-setup.exe` |

两边都是：**在对应系统上执行一次 `pnpm run tauri build`**，然后到 `src-tauri/target/release/bundle/` 里取对应平台的安装包即可。
