# 一号指挥台 PRD v3

## 产品定位

**开源 + 本地优先的一人公司管理工具。**

不是另一个Notion/CRM——代码全透明，数据存本地，云同步可选付费。

---

## 目标用户

- 全栈开发者 / 独立开发者
- SoloPreneur（一人公司）
- 对数据隐私敏感，不信任纯SaaS

---

## 核心功能

| 模块 | 功能 |
|------|------|
| **客户雷达** | 客户信息、跟进记录、往来备注 |
| **日程汇总** | 聚合各平台日历，统一看本周/月 |
| **任务面板** | 看板式任务管理（自己给自己派活） |
| **财务概览** | 收入/支出/利润一张图 |
| **AI助手** | 数据分析、建议生成、自动化流程 |

---

## 架构：本地优先 + 可选云同步

```
用户数据
 ├── 本地存储（SQLite / IndexedDB）
 ├── 端到端加密（用户自己掌握密钥）
 └── 可选开启云同步 → 加密后上传Cloudflare R2

技术栈：Next.js + Tailwind + shadcn/ui + Tauri + SQLite
```

---

## 商业模式：开源 + Freemium

### 开源版（免费）

```
代码：GitHub完全开源（AGPL v3）
部署：自己部署，完全免费
数据：100%本地，隐私无顾虑
功能：完整功能，无阉割
社区：fork / star / PR / Issue 全部开放
```

### Pro版（付费）

| 方案 | 价格 | 功能 |
|------|------|------|
| 月付 | ¥68/月 | 官方云同步、多设备同步、n8n自动化、技术支持 |
| 年付 | ¥580/年 | 同上，约¥48/月 |

### 为什么开源能赚钱

```
信任 = 转化率
├── 隐私敏感用户：代码透明，直接审计，放心
├── 降低获客成本：GitHub SEO + 社区口碑
├── 付费点清晰：省去自建麻烦 = 愿意付费
└── 竞争壁垒：开源 + 本地优先 > 纯闭源
```

---

## 开源策略

| 项目 | 决策 |
|------|------|
| **协议** | AGPL v3（强制开源修改版，保护社区） |
| **平台** | GitHub（开发者生态，SEO最强） |
| **CI/CD** | GitHub Actions 自动构建 + 测试 |
| **贡献** | PR / Issue / Discussion 全开放 |
| **商业授权** | 可选Contact咨询（不污染开源生态） |

---

## MVP范围

**第一阶段只做核心链路：**

1. 客户管理（增删改查 + 备注）
2. 任务看板（看板3列 + 拖拽）
3. 本地数据存储（SQLite）
4. 数据导出（JSON/CSV）

---

## 技术方案

### 项目结构

```
yihao-command/
├── src/                      # Next.js 前端
│   ├── app/                  # Next.js App Router
│   ├── components/          # UI 组件（shadcn）
│   ├── stores/              # Zustand stores
│   ├── lib/                 # 工具函数 + Tauri IPC bridge
│   └── styles/
├── src-tauri/               # Tauri Rust 后端
│   ├── src/
│   │   ├── main.rs         # 入口
│   │   ├── db.rs           # SQLite 操作
│   │   └── commands.rs     # Tauri IPC commands
│   ├── Cargo.toml
│   └── tauri.conf.json
└── docs/
    └── PRD.md
```

### 数据模型

**customers 表**
- id, name, email, phone, company, notes, created_at, updated_at

**tasks 表**
- id, title, description, status (todo|in_progress|done), position, created_at, updated_at

**settings 表**
- key, value

### Tauri IPC 命令

| 命令 | 说明 |
|------|------|
| get_customers | 获取所有客户 |
| create_customer | 新建客户 |
| update_customer | 更新客户 |
| delete_customer | 删除客户 |
| get_tasks | 获取所有任务 |
| create_task | 新建任务 |
| update_task | 更新任务 |
| delete_task | 删除任务 |
| reorder_tasks | 拖拽排序 |
| export_json | 导出JSON |
| export_csv | 导出CSV |

### 开发步骤

```
Phase 1：搭架子 ✓
├── Next.js 14 + Tailwind + shadcn/ui
├── Tauri v2 项目初始化
└── 跑通 Tauri IPC 通信

Phase 2：客户管理
├── SQLite CRUD
└── 前端列表 + 弹窗表单

Phase 3：任务看板
├── 三列看板 UI
└── 拖拽排序（dnd-kit）

Phase 4：数据导出
├── JSON 全量导出
└── CSV 单表导出

Phase 5：（待开发）
├── 日历聚合
├── 财务管理
└── AI助手
```
