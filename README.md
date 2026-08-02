# 工程管理备考

浙江大学工程管理在职研备考笔记站（一期：知识点笔记库）。

技术栈：Next.js 15 + Supabase Auth/Postgres + Vercel。

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 在 [Supabase](https://supabase.com) 创建项目，打开 SQL Editor，依次执行：

- `supabase/migrations/001_init.sql`
- `supabase/seed.sql`

3. Authentication → Providers → Email：开发阶段可关闭 **Confirm email**。

4. 复制项目 URL 与 anon key：

```bash
copy .env.example .env.local
```

填入：

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

5. 启动

```bash
npm run dev
```

打开 http://localhost:3000 ，注册邮箱账号后即可使用。

## 脚本

```bash
npm run dev      # 开发
npm run build    # 生产构建
npm test         # 单元测试
```

## 部署到 Vercel（手机 / 平板可访问）

完整步骤见：[docs/DEPLOY.md](./docs/DEPLOY.md)

摘要：

1. 代码推到 GitHub  
2. Vercel 导入仓库，配置 `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
3. Supabase → Authentication → URL Configuration，把 Site URL / Redirect URLs 改成 Vercel 域名  
4. 手机浏览器打开 `https://你的项目.vercel.app` 登录即可

## 功能（一期）

- 邮箱注册/登录，多端同步
- 逻辑 / 数学 / 英语二 预置章节骨架
- 知识点 Markdown 编辑、搜索、收藏、掌握度
- 日间课桌风格；桌面左侧章节树，手机抽屉
