# Rotten Beans

Rotten tomatoes🍅 + 豆瓣 (Beans)🫘

# 后端接口

## 用户管理

- [x] 登陆
- [x] 登陆后才能操作 token传递 **RequireAuth component**
- [x] token **unauthorization** time expiaration (1 hour) + sign out
- [ ] 超级管理员
  - [x] 初始创建
  - [ ] 创建用户
  - [x] 查看所有用户资料
- [ ] 图书进货
- [ ] 销售信息 

## 图书管理

- [x] 查询图书
  - [x] 书籍编号、书籍ISBN号、书名、作者、出版社 等
  - [x] 模糊查询
- [x] 图书信息修改 书籍名称、作者、出版社、零售价格

## 图书销售

- [ ] 进货
  - [ ] 查询是否存在
- [ ] 付款
  - [ ] 更新库存
- [ ] 退货
- [ ] 卖出
  - [ ] 更新库存

## 财务信息

- [ ] 付款、售出， 更新支出/收入
- [ ] 查看某段时间的记录

## 书籍数据

- [x] 爬虫，添加数据

# 前端界面

## Sign In

## Dashboard

Sidebar 入口：
- book
- purchase
- finance

基本模式
- 图表
- 查询
- 修改


## Setting

- [ ] personal info management
- [ ] Create user
- [ ] Super admin check all user