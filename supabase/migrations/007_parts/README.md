# 题库种子（拆分版）

Supabase SQL Editor 无法一次跑完整的 `007_questions_seed.sql`（会报 `Query is too large`）。

## 怎么跑（练习页全是 0 题时）

先确认已成功执行：

1. `../006_practice_schema.sql`
2. `../006b_math_chapters.sql`

可在 SQL Editor 检查：

```sql
select count(*) from public.questions;
```

若为 `0`，继续导入可练习题（**每次只跑一个文件**）：

1. `007a_clean_part_01.sql`
2. `007a_clean_part_02.sql`
3. `007a_clean_part_03.sql`
4. `007a_clean_part_04.sql`

每跑完一份可再执行：

```sql
select count(*) from public.questions where needs_review = false;
```

最终应约为 **74**。然后刷新网站「练习」页。

可选：再按 `007b_review_part_01.sql` … 导入待校对题（默认练习不会用这些题）。

整份 `007a_clean_only.sql` / `007_questions_seed.sql` 仅作备份；编辑器报太大时请用上面的 part 文件。
