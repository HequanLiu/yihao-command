# 一号指挥台

> 开源的一人公司管理工具 / Open-source management tool for solopreneurs

[![AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)

## 特性

- **本地优先** - 数据存储在本地（SQLite），完全可控
- **可选云同步** - Pro版支持端到端加密云同步
- **开源透明** - 代码完全开源（AGPL v3），隐私可审计
- **完整功能** - 客户管理、任务看板、日程汇总、财务概览、AI助手

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Next.js 14 + Tailwind + shadcn/ui |
| 桌面壳 | Tauri v2 (Rust) |
| 本地数据库 | SQLite |
| 状态管理 | Zustand |
| 拖拽 | dnd-kit |

## 快速开始

### 前置依赖

- Node.js 18+
- Rust 1.70+

### 安装

```bash
# 克隆项目
git clone https://github.com/yourname/yihao-command.git
cd yihao-command

# 安装前端依赖
npm install

# 安装 Tauri CLI（如果还没有）
npm install -g @tauri-apps/cli

# 开发模式运行
npm run tauri dev
```

### Web 模式运行（无需 Rust）

```bash
npm run dev
```

> Web模式下数据存储在 localStorage，仅供预览。

## 数据导出

- **JSON** - 全量数据导出
- **CSV** - 客户表 / 任务表 单独导出

## 商业模式

| 方案 | 价格 | 功能 |
|------|------|------|
| 开源版 | 免费 | 完整本地功能，自己部署 |
| Pro | ¥68/月 | 云同步、多设备、n8n自动化、技术支持 |

## License

[AGPL v3](LICENSE) © 2024

---

**为什么开源？**
代码透明 = 信任。用户可以审计数据存储逻辑，确认隐私安全。开源不等于赚不到钱——云同步的便利性本身就是付费点。
