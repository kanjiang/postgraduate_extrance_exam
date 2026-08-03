# 题库种子（拆分版）

## 逻辑题干像讲义、不对？

PDF 抽题会把讲义段落误当成题目。请再跑：

1. `007d_logic_quality_reset.sql` — 先把逻辑题全部标成待校对  
2. `007d_logic_quality_promote.sql` — 只放开约 50 道更像真题的选择题  

然后刷新练习页。


数学 / 英语选择题答案多数没抽出来，需额外导入：

`007c_math_english_part_01.sql` … `007c_math_english_part_12.sql`

（每次一个文件）

无标准答案的选择题交卷后可自行点「做对/做错」。

## 基础可练习题（含逻辑）

1. `007a_clean_part_01.sql` … `04.sql`

## 表结构

先跑 `../006_practice_schema.sql`、`../006b_math_chapters.sql`。
