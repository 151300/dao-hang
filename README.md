
# Dao-Hang 导航系统

一个基于 Cloudflare Workers 的免费导航网站。

## 功能特点
- 免费使用 Cloudflare Workers
- 支持账号密码登录管理
- 可编辑分类和网站
- 可设置背景图片
- 响应式设计

## 快速开始
1. 克隆项目
2. 配置环境变量密码ADMIN_PASSWORD
3. 部署：`npm run deploy`

4绑定
KV
NAV_STORE -> DAO_HANG_STORE：用于存储网站的所有数据和配置（分类、链接、背景设置）。

SESSION_STORE -> 随意字符：用于存储用户的登录会话，确保登录状态不会丢失。



## 部署指南
详细部署步骤请查看 [部署文档](./docs/deployment.md)

## 许可证
MIT
EOF