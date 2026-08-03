# 部署到手机 / 平板可用（Vercel + Supabase）

目标：电脑、手机、平板用同一个网址登录，数据自动同步。

## 一、把代码放到 GitHub（推荐）

1. 打开 https://github.com/new ，新建仓库（例如 `zju-mem-prep`），先**不要**勾选 README。
2. 在本机项目目录执行（把 `你的用户名` 换成自己的）：

```powershell
git checkout -b main
git add -A
git commit -m "chore: prepare for deploy"
git remote add origin https://github.com/你的用户名/zju-mem-prep.git
git push -u origin main
```

若提示登录 GitHub，按浏览器提示完成即可。

## 二、用 Vercel 一键部署

1. 打开 https://vercel.com ，用 GitHub 账号登录。
2. **Add New… → Project**，选中刚推送的仓库 → **Import**。
3. **Environment Variables** 添加（与本地 `.env.local` 相同）：

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://uyflszmmhgovpbvjobnb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Publishable key（`sb_publishable_...`） |

4. 点 **Deploy**，等几分钟出现成功页，会得到类似：

`https://xxx.vercel.app`

这就是手机/平板要打开的网址。

## 三、配置 Supabase（必须，否则手机登录会失败）

打开 Supabase 项目 → **Authentication → URL Configuration**：

1. **Site URL** 改成你的 Vercel 地址，例如：  
   `https://xxx.vercel.app`
2. **Redirect URLs** 增加（可多条）：  
   - `https://xxx.vercel.app/**`  
   - `http://localhost:3000/**`（本地继续调试用）

保存。

开发阶段建议：**Authentication → Providers → Email** 里继续关闭 **Confirm email**，手机注册后能马上进。

## 四、题库练习相关 SQL（在已有种子之后执行）

若已执行过 `001_init.sql`、`004_full_seed.sql` 等基础迁移，在 Supabase SQL Editor 中**按顺序**新建查询并执行：

1. `supabase/migrations/006_practice_schema.sql` — 练习表结构与 RLS  
2. `supabase/migrations/006b_math_chapters.sql` — 数学额外章节  
3. **题库数据（不要整份跑 `007_questions_seed.sql`，编辑器会报 Query too large）**，改跑拆分包：

| 顺序 | 文件 | 说明 |
|------|------|------|
| 先跑 | `supabase/migrations/007_parts/007a_clean_only.sql` | 约 74 道可直接练习的题（推荐先跑这个） |
| 可选 | `007_parts/007b_review_part_01.sql` … `007b_review_part_34.sql` | 待校对题，每次新建查询粘贴一份再 Run |

整份 `007_questions_seed.sql` 仅作备份；日常导入请用 `007_parts/`。

注意：重跑种子只会覆盖仍为 `needs_review = true` 的题目，已人工校对过的题不会被回写覆盖。

执行成功后，刷新站点即可在导航中看到「练习」入口。

## 五、手机 / 平板怎么用

1. 浏览器打开 Vercel 给你的网址（Safari / Chrome 均可）。
2. 用已有邮箱账号登录，或重新注册。
3. 可「添加到主屏幕」方便以后打开。

同一账号在电脑和手机上笔记、打卡会同步。

## 六、以后更新网站

本地改完代码后：

```powershell
git add -A
git commit -m "feat: 你的改动说明"
git push
```

Vercel 会自动重新部署；一两分钟后手机刷新即可。

## 常见问题

- **能打开但登录失败**：多半是 Site URL / Redirect URLs 没配好。
- **页面空白**：到 Vercel → Deployments → 点最新一次看 Build Logs。
- **国内访问偶发慢**：Vercel 在境外，一般可用；若长期很慢再考虑国内托管。
- **练习页无题目**：确认已执行 `006`、`006b`，以及至少 `007_parts/007a_clean_only.sql`。  
- **Query is too large**：不要跑整份 `007_questions_seed.sql`，改用 `007_parts/` 下的小文件逐个执行。
