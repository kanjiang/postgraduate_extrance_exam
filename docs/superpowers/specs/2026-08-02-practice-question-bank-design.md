# 题库练习与错题本 — 设计规格

**日期：** 2026-08-02  
**状态：** 已确认（2026-08-02）  
**关联：** 一期笔记库已上线；本规格覆盖二期「真正做题系统」  
**选定方案：** 本地 PDF 批量抽题 → 结构化入库 → 网站练习 / 交卷 / 错题本

---

## 1. 背景与目标

`考研材料/` 下已有逻辑、数学、英语二、英语写作等讲义 PDF，题目分布在各讲义中，但未结构化，网站目前只有知识点笔记，没有可答题的题库。

### 成功标准

1. 能从 `考研材料/**/*.pdf` 批量半自动抽出题目并导入 Supabase  
2. 登录后可按科目/章节做一套题并交卷  
3. 选择题自动判分；简答/填空交卷后展示解析，由用户自标对错  
4. 错题进入错题本，可重练  
5. 抽题不确定的条目标记「待校对」，可筛选修改  
6. 手机可用（沿用现有 Vercel 部署与「日间课桌」视觉）

---

## 2. 范围

### 本期做

| 项 | 说明 |
|----|------|
| 抽题流水线 | 本地脚本抽 PDF 文字 → JSON → SQL/导入 |
| 题库数据模型 | 预置题 + 用户可增补 |
| 练习 UI | 练习首页、章节练习、交卷结果、错题本 |
| 章节补全 | 数学等 PDF 有而骨架缺失的章节（如平面几何、概率）予以补齐以便挂题 |
| 导航入口 | `/nav`、首页或科目页增加「练习」 |

### 本期不做

- PDF 在线翻页阅读器  
- 整卷模考计时 / 估分报告  
- 云端上传 PDF 后在线 AI 抽题  
- 微信登录、PWA（沿用邮箱密码）

---

## 3. 用户决策摘要

| 决策点 | 选择 |
|--------|------|
| 形态 | B · 真正做题系统（非仅挂 PDF） |
| 入库方式 | B · 批量半自动从全部相关 PDF 抽取 |
| 题型 | B · 选择题 + 简答/填空（简答自查） |
| 架构 | 方案 1 · 本地抽题入库 + 网站练习 |

---

## 4. 信息架构与页面

| 路由 | 作用 |
|------|------|
| `/practice` | 练习首页：三科 → 章节列表（显示题量、待校对数） |
| `/practice/c/[chapterId]` | 开始或继续该章节练习（一套题） |
| `/practice/session/[id]` | 交卷结果：得分、逐题对错与解析；简答可点「我做对了/做错了」 |
| `/practice/wrong` | 错题本列表；可「重练错题」生成新 session |
| `/practice/q/[id]/edit` | 编辑单题（个人备考阶段：登录用户可改系统预置题以便校对，及改/建本人题目） |
| `/practice/new` | 手动新建题目（挂到某章节） |

科目页 `/subjects/[slug]` 增加「去练习」链到该科练习列表；`/nav` 增加练习入口。

### 做题交互

1. 进入章节 → 拉取该章题目（可先隐藏答案）  
2. 连续作答；**交卷前不显示对错**（与既定「做完再出分」一致）  
3. 交卷：  
   - `mcq`：与标准答案比对，自动记对错  
   - `short`：先不算分，展示解析；用户点「对/错」后计入该次结果与错题本  
4. 错题写入 `wrong_book`；从错题本重练时只抽错题集  

---

## 5. 数据模型

### 5.1 `questions`

| 字段 | 说明 |
|------|------|
| `id` | uuid |
| `chapter_id` | 所属章节 |
| `qtype` | `mcq` \| `short` |
| `stem` | 题干（Markdown 文本） |
| `options` | jsonb，仅 mcq：`[{"key":"A","text":"..."}, ...]` |
| `answer` | 标准答案：mcq 为 `"A"` 等；short 为参考答案文本 |
| `explanation` | 解析（可空） |
| `source_file` | 来源相对路径，如 `逻辑/基础必修2-假言命题.pdf` |
| `source_page` | 可选页码 |
| `needs_review` | bool，抽题不确定时为 true |
| `sort_order` | int |
| `user_id` | null = 系统预置；非空 = 用户自建 |
| `created_at` / `updated_at` | 时间戳 |

### 5.2 `practice_sessions`

| 字段 | 说明 |
|------|------|
| `id` | uuid |
| `user_id` | 作答用户 |
| `chapter_id` | 可空；错题重练可空或记来源标签 |
| `mode` | `chapter` \| `wrong_book` |
| `started_at` / `finished_at` | 交卷后写入 finished |
| `mcq_correct` / `mcq_total` | 选择题统计 |
| `short_marked_correct` / `short_total` | 简答已自评统计 |

### 5.3 `practice_answers`

| 字段 | 说明 |
|------|------|
| `session_id` / `question_id` | 关联 |
| `user_answer` | 文本 |
| `is_correct` | bool，可空（short 未自评前） |
| `self_marked` | bool，short 是否已自评 |

### 5.4 `wrong_book`

| 字段 | 说明 |
|------|------|
| `user_id` / `question_id` | 唯一约束 |
| `wrong_count` | 累计错次 |
| `last_wrong_at` | 最近一次 |
| `cleared_at` | 做对后写入时间，软移出活跃错题本；重做错再清空该字段 |

### 5.5 RLS

与一期一致：登录用户可读系统题（`user_id is null`）与本人题；session / answers / wrong_book 仅本人读写。

### 5.6 章节补全

在现有 `chapters` 上按 PDF 映射追加数学等缺失章（示例，实现时以映射表为准）：

- 平面几何、解析几何、立体几何、排列组合、概率、数据描述  

英语写作若需独立挂题，可挂在「写作」章或新增子章，不另开第四科目（除非后续明确要求）。

---

## 6. 抽题流水线

```
考研材料/**/*.pdf
    → scripts/extract_questions.py（PyMuPDF 等抽文本）
    → content/questions/raw/<pdf名>.txt
    → 规则/LLM 辅助切题（可分步）
    → content/questions/bank/<subject>/<chapter>.json
    → supabase/migrations/00x_questions_seed.sql 或导入脚本
```

### 映射

维护 `content/questions/pdf_chapter_map.json`：PDF 相对路径 → `chapter` 稳定 id 或 slug+title。

### 质量

- 解析失败或无答案 → `needs_review=true`  
- 导入后网站提供「仅看待校对」筛选与编辑  
- 图题、复杂公式：题干保留可识别文本；无法还原的图用占位说明「见原 PDF 第 x 页」，并标待校对  

### 版权与隐私

材料仅用于个人备考站；题库不主动公开仓库外分发；PDF 原件不上传到 Vercel（仅结构化题目入库）。

---

## 7. 技术要点

- 栈不变：Next.js App Router + Supabase + Vercel  
- 服务端 actions 创建 session、提交答案、交卷、错题本操作  
- 交卷后 `revalidatePath` 相关练习页  
- 视觉沿用现有 CSS 变量与组件风格，避免另起一套主题  

---

## 8. 实现分期（本规格内）

| 步 | 内容 |
|----|------|
| A | SQL：questions / sessions / answers / wrong_book + RLS；补章节 |
| B | 抽题脚本 + 映射表 + 至少跑通一批导入（全量 PDF 分批） |
| C | `/practice*` UI：章节练、交卷、简答自评、错题本 |
| D | 导航接入；待校对筛选与编辑；部署说明补充 |

---

## 9. 非目标与风险

- **风险：** PDF 扫描件或双栏排版导致抽题质量差 → 用 `needs_review` + 人工改，不阻塞上线  
- **风险：** 题量很大导致首屏慢 → 按章节分页加载，不一次拉全库  
- **非目标：** 保证 100% 自动切题正确；以保证「能练、能改、能积累错题」为准  

---

## 10. 确认清单

请用户确认本文件后进入实现计划：

- [ ] 范围与不做项可接受  
- [ ] 页面与交卷流程可接受  
- [ ] 数据模型可接受  
- [ ] 抽题流水线与待校对策略可接受  
