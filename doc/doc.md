# Rotten Beans

Rotten tomatoes🍅 + DouBan Beans🫘

## Quickstart

### **Dependencies**
- rustup 1.28.1 (f9edccde0 2025-03-05)
  - `cd backend && cargo build`
- node v22.14.0
  - `cd frontend && npm install`

### Get start✨
`make dev`

Open `http://localhost:5173`




## 项目结构

```
RottenBeans/
├── README.md
├── backend/                 # 后端 Rust + Diesel + Actix 实现
│   ├── migrations/         # 数据库迁移脚本
│   ├── src/                # 后端源代码（包括 auth、db、handlers 等模块）
│   └── diesel.toml
├── book_scraper/           # 图书爬虫模块，使用 Python 编写
│   ├── book_scraper/
│   └── tests/
├── frontend/               # 前端 React + TypeScript 实现
│   ├── public/
│   └── src/                # 前端源代码（组件、页面、接口等）
└── makefile                # 快捷构建命令
```

---

## 功能实现

### 1. 用户管理模块
- 登陆与鉴权：使用 JWT 实现 token 登陆、鉴权逻辑，所有受保护路由通过 RequireAuth 组件拦截。

- Token过期处理：设置 token 有效时间为1小时，超时自动登出。`/RottenBeans/backend/src/auth.rs`

```rust
    let exp = Utc::now()
        .checked_add_signed(Duration::hours(1))
        .unwrap()
        .timestamp() as usize;
```

- 超级管理员机制：初始化系统时创建超级管理员；超级管理员可以管理所有用户，包括创建新用户、查看所有用户信息。而普通用户只能修改自己的信息。

![admin people](image.png)
![ordinary people](image-1.png)

- 密码储存：使用md5加密储存。

### 2. 图书管理模块
- 图书查询：支持按照 ISBN、书名、作者、出版社等字段模糊匹配。

- 图书信息修改：管理员可对书籍的名称、作者、出版社、价格等信息进行编辑。

![alt text](image-2.png)

### 3. 图书销售模块

- 进货：系统会检测图书是否已存在，存在则更新库存，不存在则新建。

- 付款/卖出/退货：根据订单操作，自动调整库存数量，避免负库存现象。

![alt text](image-3.png)

### 4. 财务模块

- 收入与支出记录：自动记录每一次付款与售出的收支金额。

- 时间筛选：可按时间段查看指定区间的财务数据。

- 数据可视化：绘制图表，更形象直观展现书城财务数据。

![alt text](image-4.png)

### 5. 爬虫模块（book_scraper）

- 豆瓣图书信息获取：使用 Python 脚本模拟用户访问豆瓣网页，获取书籍信息；数据结果保存为 JSON 文件供后端导入。


---

### 具体功能

#### 用户管理

- [x] 登陆
- [x] 登陆后才能操作 token传递 **RequireAuth component**
- [x] token **unauthorization** time expiaration (1 hour) + sign out
- [x] 超级管理员
  - [x] 初始创建
  - [x] 创建用户
  - [x] 查看所有用户资料

#### 图书管理

- [x] 查询图书
  - [x] 书籍编号、书籍ISBN号、书名、作者、出版社 等
  - [x] 模糊查询
- [x] 图书信息修改 书籍名称、作者、出版社、零售价格

#### 图书销售

- [x] 进货
  - [x] 查询是否存在
- [x] 付款
  - [x] 更新库存
- [x] 退货
- [x] 卖出
  - [x] 更新库存

#### 财务信息

- [x] 付款、售出， 更新支出/收入
- [x] 查看某段时间的记录
- [x] 绘图

#### 书籍数据

- [x] 爬虫，添加数据

---

## 技术栈

| 模块   | 技术栈                                      |
| ---- | ---------------------------------------- |
| 前端   | React, TypeScript, Vite, Axios, Recharts, Bootstrap |
| 后端   | Rust, Actix-web, Diesel ORM, PostgreSQL  |
| 数据爬取 | Python, Requests, BeautifulSoup          |
| 鉴权机制 | JWT (Json Web Token)                     |
| 构建工具 | Makefile                                 |
| 代码风格 | Prettier                         |

