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

## 四、手机 / 平板怎么用

1. 浏览器打开 Vercel 给你的网址（Safari / Chrome 均可）。
2. 用已有邮箱账号登录，或重新注册。
3. 可「添加到主屏幕」方便以后打开。

同一账号在电脑和手机上笔记、打卡会同步。

## 五、以后更新网站

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
