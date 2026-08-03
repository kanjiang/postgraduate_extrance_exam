-- needs_review batch part 2
-- count: 80

insert into public.questions (
  id, chapter_id, qtype, stem, options, answer, explanation,
  source_file, source_page, needs_review, sort_order, user_id
)
values
  ('b6b5e0a0-50a7-5300-9e03-da472768f3f3', '22222222-2222-2222-2222-222222222221', 'short', '答案：B. roof', null, '', '需填入一个属于“房子”且能是“棕色”的部分。A. leg（腿）：房子没有腿。C. hair（头发）：房子没有头发。D.
address（地址）：地址是抽象信息，无颜色属性。B. roof（屋顶）：房子的屋顶可以有颜色，符合逻辑。', '英语2/长难句-定从2.pdf', 36, true, 84, null),
  ('3e1f41f9-63b6-53fb-af05-22532dde1fb9', '22222222-2222-2222-2222-222222222221', 'short', '答案：A. give up', null, '', '句意为“纸质支票提供收据，这是许多消费者不愿______的功能”。B. take over 和 D. pass down：与“收据”无关，
语义不匹配。C. bring back：消费者不会“带回”收据，逻辑不通。A. give up（放弃）：消费者不愿放弃收据这一功能，
符合常理（如电子支付可能无收据）。
Recap
37
Thanks.', '英语2/长难句-定从2.pdf', 36, true, 85, null),
  ('2758ca22-ce2c-5271-8e8d-2f2107b854cc', '22222222-2222-2222-2222-222222222221', 'short', '从句属于那种类型取决于引导从句的连词 状语从句位置（前中后均可） 6 主句后：I ate fish when the dog beat the cat 主句前：when the dog beat the cat，I ate fish 插入语： I，when the dog beat the cat，ate fish I, as the dog beat the cat, ate fish 让步状语从句 让步状语从句 8 【概念】让步定义：明让步，暗转折 【例子】虽然你很丑，但是你有宝马 哪个翻译是正确的？ 【A】 although you are ugly，but you have BMW 【B】 although you are ugly， you have BMW 因果关系：因为你很帅，所以我很爱你 because you are handsome，I love you very much 翻译成中文时候要把连词全还原出来 让步状语从句逻辑词 9 逻辑连词 中文意思 although 虽然，尽管；但是，然而 though 虽然，尽管；可是，不过 even if 即使，尽管 even though 尽管，即使 while 而，然而（表示对比）；尽管， 虽然 考点一：状语从句阅读法 10 Most of the first-generation students (59.1 percent) were recipients of Pell Grants, a federal grant for undergraduates with financial need, while this was true only for 8.6 percent of the students with at least one parent with a four-year degree. 大多数第一代大学生（59.1%）获得了佩尔助学金，这是联邦政府为有经济需求的本科生提供的助学金， 而父母至少有一方拥有四年制学位的学生中，只有 8.6% （？）。this was true 指的是什么？ 第一步：找出所有动词 were ，was，（注意need，grant都不是动词） 第二步：非谓语动词词组=起点+终点（前） 起点：to do；doing；done 终点=下一个标点符号前；下一个连接词前；下一 个动词前 无 第三步：一个连词+搭配一个动词+终点（下一个 标点符号；下一个连接词；下一个动词） while this was true only for 8.6 percent of the students with at least one parent with a four- year degree. 结论：唯一谓语动词是were 主句：Most of the first-generation students', null, '', '', '英语2/长难句-状从 转折.pdf', 5, true, 86, null),
  ('f40d8749-c955-5347-b017-85c812718f4d', '22222222-2222-2222-2222-222222222221', 'short', '1 percent) were recipients of Pell Grants 真题演练一： 11 ①The authors of the paper are from different universities, and their findings are based on a study involving 147 students at an unnamed private university. ②First generation was defined as not having a parent with a four-year college degree. ③Most of the first-generation students (59.1 percent) were recipients of Pell Grants, a federal grant for undergraduates with financial need, while this was true only for 8.6 percent of the students with at least one parent with a four-year degree.', null, '', '', '英语2/长难句-状从 转折.pdf', 10, true, 87, null),
  ('485b899f-bd5a-58ce-b9b9-25cb62664c43', '22222222-2222-2222-2222-222222222221', 'short', 'The study suggests that most first-generation students ______. [A] are from single-parent families来自单亲家庭 [B] study at private universities在私立大学就读 [C] are in need of financial support需要经济资助 / 有资金扶持需求 [D] have failed their college没能完成大学学业 12', null, '[C] are in need of financial support（需要经济支持）', '原文依据（对应标注句③）："Most of the first-generation students (59.1%) were recipients of
Pell Grants, a federal grant for undergraduates with financial need..."（59.1%的第一代大学生获得了佩
尔助学金——一项针对经济困难本科生的联邦资助）。数据对比：仅8.6%的非第一代学生获得该助学金，
凸显经济需求差异。
选项匹配：[C] 需要经济支持：直接对应"Pell Grants for financial need"的表述，且"most"（59.1%）量化
支持。其他选项排除：[A] 来自单亲家庭 → 全文未提及家庭结构，无依据。[B] 就读私立大学 → 研究样
本虽来自私立大学，但未说明"大多数"第一代学生就读此类学校，以偏概全。[D] 大学失败 → 原文仅提"
辍学率更高"（句①），未明确说"大多数已失败"，过度推断。
真题演练二
13
For one thing, conversations about wildfires need to be more inclusive. Over the past decade, the focus
has been on climate change—how the warming of the Earth from greenhouse gases is leading to
conditions that worsen fires.
While climate is a key element, Moritz says, it shouldn''t come at the expense of the rest of the
equation.“The human systems and the landscapes we live on are linked, and the interactions go both
ways,” he says. Failing to recognize that, he notes, leads to “an overly simplified view of what the solutions
might be. Our perception of the problem and of what the solution is becomes very limited.”
While admitting that climate is a key element, Moritz notes that ______.
[A] public debates have not settled yet 公众层面的相关争论尚无定论
[B] fire-fighting conditions are improving火灾防控条件正在改善
[C] other factors should not be overlooked其他影响因素不应被忽视
[D] a shift in the view of fire has taken place人们对火灾的看法已经发生转变
答案
14
equation：英文释义
The part of a situation that must be considered.
Money is not the only equation in this decision.
常见短语：bring X into the equation — 把某因素纳入考量 leave X out of the equation — 不考虑某因素
答案：C
原文短语拆解
at the expense of the rest of the equation
字面含义：以牺牲等式里其他部分为代价。
通俗理解：不能只看重气候，而忽略了其他影响因素。
做题方法：主句核心：不能牺牲其余要素（the rest）。
选项主语匹配：只有 C 选项主语是 other factors（其余因素）。
A 主语 public debates、B 主语 fire-fighting conditions、D 主语 view of fire，都和原文 the rest of the
equation 无关，直接排除。
真题演练三
15
①Though often viewed as a problem for western states, the growing frequency of wildfires is a national
concern because of its impact on federal tax dollars, says Professor Max Moritz, a specialist in fire
ecology and management.
②In 2015, the US Forest Service for the first time spent more than half of its $5.5 billion annual budget
fighting fires—nearly double the percentage it spent on such efforts 20 years ago. In effect, fewer federal
funds today are going towards the agency’s other work such as forest conservation, watershed and cultural
resources management, and infrastructure upkeep that affect the lives of all Americans.
More frequent wildfires have become a national concern because in 2015 they______.
[A] exhausted unprecedented management efforts耗费了前所未有的管理投入
[B] consumed a record-high percentage of budget占用了占比创历史新高的财政预算
[C] severely damaged the ecology of western states严重破坏了美国西部各州的生态环境
[D] caused a huge rise of infrastructure expenditure 造成基础设施开支大幅上涨
答案
16
答案： [B] consumed a record-high percentage of budget
[A] exhausted unprecedented management efforts
原文只讲经费 budget/funds 被大量消耗，没有提到 “管理人力、精力（management efforts）”。
属于偷换概念：把资金开销换成了人力投入，原文无对应信息。
[C] severely damaged the ecology of western states
① 题干问：野火成为全国性问题的原因；
② 原文明确说明：之所以成为全国议题，是因为耗费联邦税款，而不是因为破坏西部生态；
③ “西部生态” 只是开头一句背景，不是 2015 年这件事的原因。
属于答非所问 + 无中生有。
[D] caused a huge rise of infrastructure expenditure
原文：投入基建维护的拨款资金变少（fewer federal funds）。
选项 D：基建的开支成本大幅上涨（a huge rise of expenditure）。
资金投入额度 ≠ 项目成本开销，二者本就是两回事。
让步状语从句总结：对立关系不是非黑即白，是话题始终统一，只
是内部视角、维度不一样
17', '英语2/长难句-状从 转折.pdf', 11, true, 88, null),
  ('b8390f57-b44b-514f-a98f-e09ba01fd526', '22222222-2222-2222-2222-222222222221', 'short', 'Most of the first-generation students (59.1 percent) were recipients of Pell Grants, a federal grant for undergraduates with financial need, while this was true only for 8.6 percent of the students with at least one parent with a four-year degree 统一话题：两类学生领取佩尔助学金的比例，转折逻辑：同一话题下两组人群数据对比', null, '', '', '英语2/长难句-状从 转折.pdf', 17, true, 89, null),
  ('4cf2f664-e3c6-5482-aeef-b8a2bb960121', '22222222-2222-2222-2222-222222222221', 'short', 'While climate is a key element, Moritz says, it shouldn''t come at the expense of the rest of the equation. 统一话题：造成野火的各类影响因素，转折前后互补关系', null, '', '', '英语2/长难句-状从 转折.pdf', 17, true, 90, null),
  ('fb412090-8381-5227-826b-8b065d2625d6', '22222222-2222-2222-2222-222222222221', 'short', 'Though often viewed as a problem for western states, the growing frequency of wildfires is a national concern 统一话题：野火频发需要关注的范围只是西部各州，还是全国？转折逻辑：纠正狭隘认知，从局部问题拓 展到整体 考点二：完型填空 18 The correlation between happiness and investment was particularly strong for younger firms.Firms seem to invest more in places where most people are relatively happy, rather than in places with happiness inequality. _17__ this doesn’t prove that happiness causes firms to invest more or to take a longer-term view(采取 更长远目光）, the authors believe it at least 18 hints（暗示 v） at that possibility（n. 可能性）.', null, '', '', '英语2/长难句-状从 转折.pdf', 17, true, 91, null),
  ('a4469313-43b1-5ea8-a6c8-27c985ae6558', '22222222-2222-2222-2222-222222222221', 'mcq', '', '[{"key": "A", "text": "after"}, {"key": "B", "text": "until"}, {"key": "C", "text": "while"}, {"key": "D", "text": "Since while A， B though/although A，B 考场攻略 19 The correlation between happiness and investment was particularly strong for younger firms,.... The relationship was 15 also stronger in places where happiness was spread more 16.equally.Firms seem to invest more in places where most people are relatively happy, rather than in places with happiness inequality. _17__ this doesn’t prove that happiness causes firms to invest more or to take a longer-term view, the authors believe it at least 18 hints at that possibility."}]'::jsonb, '', '', '英语2/长难句-状从 转折.pdf', 18, true, 92, null),
  ('9dfc3bcb-e5db-5d7e-88a4-e4a2a940615e', '22222222-2222-2222-2222-222222222221', 'mcq', '', '[{"key": "A", "text": "after"}, {"key": "B", "text": "until"}, {"key": "C", "text": "while"}, {"key": "D", "text": "Since Recap 20 Thanks."}]'::jsonb, 'C', '', '英语2/长难句-状从 转折.pdf', 19, true, 93, null),
  ('9217abbc-7130-5c5d-8be2-91467ec58a21', '22222222-2222-2222-2222-222222222221', 'short', '叙事方向一致: 两句讲的是同一群人、同一类困境', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 7, true, 94, null),
  ('af90b74b-a9ef-50a6-9979-052e8c23242c', '22222222-2222-2222-2222-222222222221', 'short', '观点立场一致:作者全程客观陈述当代女性的生活负担，两句都站在同一观察角度，共同表达 “女性负担沉 重” 这同一个核心观点', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 7, true, 95, null),
  ('735055b3-a3d7-58e0-b8ad-dcc9d2c95d52', '22222222-2222-2222-2222-222222222221', 'short', '情感色彩一致:两句都是负面、压抑的消极情绪，感情基调完全统一 情感色彩一致，指情绪走向不冲突、不反向，不是要求两句必须同为褒 / 同为贬：The lake is quiet and clear, and I feel totally peaceful.湖水静谧澄澈，我内心倍感安宁。 补充：and连接单词，词组 8 【连接单词】：the process is cumbersome（笨重的）, expensive and unreliable（不可靠的） 叙事方向一致：都在描述流程，全部围绕 “该流程存在弊端” 展开 词性一致：cumbersome /expensive/unreliable 全为形容词； 情感色彩一致：三个词均为负面评价，统一吐槽流程缺陷； 【连接词组】：Popular fireworks should be replaced with cleaner drone(无人机)and laser light shows to avoid the "highly damaging" impact on wildlife,domestic pets and the broader environment 叙事方向一致：二者都属于可替代烟花的新型光影表演，同属 “环保节庆表演” 这一类别，描述对象同向，没 有切换无关事物。 观点立场一致：作者统一认可二者是比烟花更环保的方案，都作为推荐替换物，支持 “换掉传统烟花” 的核心 观点，立场完全统一。 情感色彩一致：都带有cleaner修饰，属于正面、环保的积极事物，褒义基调相同，无反差。 完型填空：and叙事方向一致；观点立场一致；情感色彩一致 9 Example 1: Growing bodies need movement and _____, but not just in competitive way. [A] care [B] nutrition [C] exercise [D] leisure Example 2: It’s not difficult to set targets for staff. It is much harder, however , to understand their negative consequences. Most work-related behaviors have multiple components. 2 one and the others become distorted.', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 7, true, 96, null),
  ('7d5ae2c5-9617-5c2c-b96e-6a8c9e9edbca', '22222222-2222-2222-2222-222222222221', 'short', '[A] Emphasize强调 [B] Identify认出，识别 [C] Assess评估 [D] Explain解释 10 Example 1:', null, 'C', '语义搭配："movement and exercise"（运动与锻炼）是固定搭配，两者属于同一语义范畴（身
体活动）。其他选项：[A] care（照料）→ 与"movement"无关。[B] nutrition（营养）→ 属于饮食范畴，
与"movement"不匹配。[D] leisure（休闲）→ 范围过大，不如"exercise"精准。逻辑衔接：后文强调
"not just in competitive ways"（不仅以竞争方式），暗示前文应填与体育活动相关的词，"exercise"最
符合。
Example 2:
正确答案：A
破题点：前句 “Most work-related behaviors have multiple components（大多数与工作相关的行为
都包含多个构成要素），其他的维度会失真，证明各个维度重要性不平等，才会出现一些维度失真了，所
以正确答案 [A] Emphasize（强调）
阅读技巧：and并列的短语阅读中通常不会成为正确选项
11
In the general population today, at this genetic and environmental level, we''ve pretty much gone as far
as we can go, ” says anthropologist William Cameron Chumlea of Wright StateUniversity.In the case of
NBA players, their increase in height appears to result from the increasingly common practice of
recruiting players from all over the world.', '英语2/长难句1-并列句【最终版】.pdf', 9, true, 97, null),
  ('f3df4f3f-2e88-549f-846b-745aa526ff78', '22222222-2222-2222-2222-222222222221', 'short', 'Which of the following plays a key role in body growth according to the text? [A] Genetic modification [B] Natural environment 练习 12 It''s not that measures such as London''s Ulez are useless. Far from it. Local officials are using the levers that are available to them to safeguard residents'' health in the face of a serious threat.......... But mayors and councilors can only do so much about a problem that is far bigger than any one city or town. They are acting because national governments一Britains and others across Europe— have failed to do so.', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 11, true, 98, null),
  ('5586603d-12a3-5416-9017-fa131103c293', '22222222-2222-2222-2222-222222222221', 'short', 'Who does the author think should have addressed (V 解决) the problem? [A] Local residents（当地居民） [B] Mayors.（市长） [C] Councilors.（议员） [D] National governments.（国家政府） 阅读例题：（传统阅读法） 13 It''s not that measures such as London''s Ulez are useless. Far from it. Local officials are using the levers that are available to them to safeguard residents'' health in the face of a serious threat.......... But mayors and councillors can only do so much about a problem that is far bigger than any one city or town. They are acting because national governments一Britains and others across Europe— have failed to do so.', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 12, true, 99, null),
  ('f8991bec-dc69-5a10-ac9a-c674dd6e2325', '22222222-2222-2222-2222-222222222221', 'short', 'Who does the author think should have addressed the problem? should have done 根据现在的情况判断，认为在过去应该做某事，但实际上没有做。 addressed the problem：解决问题：采取措施来解决问题或困难 [A] Local residents（当地居民）拼凑细节 [B] Mayors.（市长）+[C] Councilors.（议员）：can only do so much 只能做这么多 核心逻辑错 [D] National governments.（国家政府） have failed to do so：【各国中央政府】没能履行职责、解决该问题。 因果关系：与and一样，前后分句感情、观点、逻辑走向全都同向， 这一点完全相同，只是so/for 还带了一层因果关系 14 表示因果关系的并列连词 含义 ....for...... “....因为.....” ....so...... “.....所以....” 例句：strangers are inherently（adv 内在的，固有的） unfamiliar（adj不熟悉） to us，so we are more likely to feel anxious（adj 不安） 陌生人本质上对我们来说是陌生的，所以我们会更容易感到焦虑 We listened eagerly, for he brought news of our families. 我们聚精会神地听着，因为他带来了关于我们家人的消息 阅读真题（改编） 15 In addition to other weakness，these measures are politically weak, for they inevitably put the costs of cleaning the air on to individual driver rather on to the car manufactures ..... what is considered a weakness of measures to tackle dirty air? [A] They are biased against car manufacturers.它们对汽车制造商存有偏见。 [B] They prove impractical for city councils.事实证明它们对市议会而言不具备可行性。 [C] They are deemed too mild for politicians.在政客眼中，这些举措力度太过温和。 [D] They put too much burden on individual motorists它们给私家车主造成了过重的负担。 16 D 选项正确原因 [D] They put too much burden on individual motorists 译文：它们给私家车主施加了过重负担。 逻辑匹配：原文put the costs...on to individual drivers = 将治理成本压给车主，等同于给车主增加沉重负 担，完全对应原文给出的 weakness（缺陷）。 三、其余选项逐项错因分析 A 选项 They are biased against car manufacturers. 它们对汽车制造商存有偏见。 错因：原文恰恰相反 —— 措施没有把成本交给车企，是偏袒车企，而非对车企有偏见，语义完全颠倒。 B 选项 They prove impractical for city councils. 事实证明它们对市议会而言不切实际。 错因：原文只说措施politically weak（政治层面有短板），全文从未提到city councils（市议会）、“不具 备可行性” 相关内容，属于无中生有。 C 选项 They are deemed too mild for politicians. 在政客眼中，这些举措力度太过温和。 错因：politically weak仅指政策分配成本的方式容易引发民众不满、存在政治弊端，没有任何文字说明 “措施力度太温和”，偷换原文概念。 or前后大方向一致，语义同向，反向都可 17 表示选择的并列连词 含义 ....or...... ....或者..... 情况1：前后大方向一致，语义同向 同范畴：都是解决粮食短缺的办法（大方向完全统一） 语义同向：两件事都是可行对策，无褒贬对立 In effect，the U.S can import food or it can import the workers 情况 2：or 前后大方向一致，语义反向（同一体系正反两极） Every student is marked pass or fail after the exam. 翻译：所有学生考完试只会被评定为及格或是不及格。 大方向一致：同属考试成绩评级体系； 语义反向：pass 通过 /fail 挂科，结果完全对立。 真题演练 18 People complained that buses were late and infrequent（车次太少）. So, the number of buses and bus lanes were increased, and drivers were 8 or punished according to the time they took.', null, '及解析', '', '英语2/长难句1-并列句【最终版】.pdf', 13, true, 100, null),
  ('fd7f805d-cc7d-5661-82ce-8ee51ab65d31', '22222222-2222-2222-2222-222222222221', 'short', '[A] hired [B] trained [C] rewarded [D] grouped 19 People complained that buses were late and infrequent（车次太少）. So, the number of buses and bus lanes were increased, and drivers were 8 or punished according to the time they took.', null, '案', '', '英语2/长难句1-并列句【最终版】.pdf', 18, true, 101, null),
  ('8e3bc099-39d9-5d44-943f-18cbec4d0c63', '22222222-2222-2222-2222-222222222221', 'short', '[A] hired [B] trained [C] rewarded [D] grouped 破题点：呼应词 “punished（惩罚）”，此处是 “奖惩对应” 逻辑，“rewarded（奖励）” 与 “punished” 为相反逻辑方向的并列关系。正确答案：[C] rewarded，中文意思：奖励 同范畴：都属于公司对司机的考核处置手段（大类、大方向不变） 语义相反：reward 奖励（褒） vs punish 惩罚（贬） 转折but -大方向一致，感情色彩，观点对冲 20 Not everyone experiences the kinds of severe chronic stresses . But most women today are coping with a lot of obligations（n 责任）, with few breaks, and feeling the stresses. 前半句逻辑走向： 划定范围 —— 少数人才有极端巨大压力，暗示 “大部分人压力不大”，是一种弱化压力程度的表述。 前半句感情色彩： 中性偏轻松，倾向于 “压力问题不普遍、不严重”。 后半句逻辑走向： 推翻前半句的弱化预期，指出绝大多数女性普遍承压，压力是常态，和前半句 “不是所有人有重压” 形成 完全反向的事实。 后半句感情色彩： a lot of obligations（海量责任）、few breaks（几乎无休息）、feeling the stresses（深陷压力）全是负面、 压抑的词汇，消极色彩拉满。 例题：大方向一致，感情色彩，观点对冲 21 the U.S. Fish and Wildlife Service (USFWS) decided to formally list the bird as threatened.Some environmentalists, however, were disappointed. They had pushed the agency to designate the bird as “endangered,”for the “endangered” gives federal officials greater regulatory power to crack down on threats. But environmentalists argued that the “threatened” tag gave the federal government flexibility to try out new, potentially less confrontational conservation approaches. The "threatened" tag disappointed some environmentalists because it ______. [A] was a give-in to governmental pressure这是向政府压力做出的妥协 [B] would involve fewer agencies in action落实过程中参与机构会更少 [C] granted less federal regulatory power赋予联邦政府的监管权力更少 [D] went against conservation policies违反保护政策 转折 22 表示转折的并列连词 含义 .....but...... .....yet...... “.......但是........ 例子1：He had been warned of the danger, yet he still decided to take the risk 注意：is yet to be done 强调一种待定状态 The final decision is yet to be made.（最终决定仍有待作出。）；Three tasks are yet to be assigned.（三项任务尚未分配。）；This hypothesis is yet to be tested."（该假设有待 验证。） 结论：整体逻辑是相反的，大多伴随褒贬感情色彩反转，阅读重点在but后 阅读练习1：段落重点句把握 23 Madrid was hailed as a public health guiding light last November when it rolled out ambitious restrictions on the most polluting cars. Seven months and one election day later, a new conservative city council suspended enforcement of the clean air zone, a first step toward its possible termination.Mayor Jose Luis Martinez-Almeida made opposition to the zone a centerpiece of his election campaign, despite its success in improving air quality.A judge has now overruled the city’s decision to stop levying fines, ordering them restored.But with legal battles ahead, the zone’s future looks uncertain at best.', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 19, true, 102, null),
  ('f6f6a49c-8e6d-5760-a2b1-8d218d21e9e7', '22222222-2222-2222-2222-222222222221', 'short', 'Which of the following is true about Madrid''s clean air zone? [A] Its effects are questionable它的治理效果尚存疑问。 [B]It has been opposed by a judge一名法官反对该空气区政策。 [C] It needs tougher enforcement.它需要更严格的执法管控。 [D] Its fate is yet to be decided.它最终的命运尚无定论。 24 Madrid was hailed as a public health guiding light last November when it rolled out ambitious restrictions on the most polluting cars. Seven months and one election day later, a new conservative city council suspended enforcement of the clean air zone, a first step toward its possible termination.Mayor Jose Luis Martinez-Almeida made opposition to the zone ，a centerpiece of his election campaign, despite its success in improving air quality.A judge has now overruled the city’s decision to stop levying fines, ordering them restored.But with legal battles ahead, the zone’s future looks uncertain at best.', null, '案', '', '英语2/长难句1-并列句【最终版】.pdf', 23, true, 103, null),
  ('8c7a21be-fd63-5fff-b3c4-e7b9b3c37411', '22222222-2222-2222-2222-222222222221', 'short', '作者反对加州这个说法，明确转折 But 给出自己的观点： 翻看手机更像是闯入他人住宅（entering his or her home = getting into one’s residence，对应 A 选项） （翻查钱包）是加州的观点，作者认为这一类比是 "lame argument"（站不住脚的说法），并加以反驳。 因此，正确答案为 A。 阅读练习3 27 ①In the general population today, at this genetic and environmental level, we''ve pretty much gone as far as we can go.In the case of NBA players, their increase in height appears to result from the increasingly common practice of recruiting players from all over the world. ②Growth demands calories and nutrients — especially protein——to feed expanding tissues.At the start of the 20th century, under-nutrition and childhood infections got in the way.But with the improvement diet and health , children and adolescents have, on average, increased in height by about an inch and a half every 20 years......Yet according to the Centers for Disease Control and Prevention, average height—— 5’9’’ for men, 5’4’’ for women——hasn’t really changed since 1960.', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 26, true, 105, null),
  ('7fbf643c-0ae1-5063-9b59-f5f5871aa591', '22222222-2222-2222-2222-222222222221', 'short', 'Which of the following plays a key role in body growth according to the text? [A] Genetic modification [B] Natural environment [C] Living standards [D] Daily exercise 28 D选项为什么错？ 先理清两点： 题干问：什么是人体长高的关键因素； 这句讲的是：NBA 球员身高变高的特殊原因。', null, 'c', '', '英语2/长难句1-并列句【最终版】.pdf', 27, true, 106, null),
  ('f85e37ad-3f70-5373-baf9-12c1b9f973a3', '22222222-2222-2222-2222-222222222221', 'short', '句子翻译 In the case of NBA players, their increase in height appears to result from the increasingly common practice of recruiting players from all over the world. 就 NBA 球员而言，他们平均身高提升，是因为球队从全球各地招募高个子球员。 话题范围不一样 题干问的是普通人身体发育长高的关键因素； NBA 那句只是解释「NBA 球队平均身高数字变高」的特殊现象，属于小众特例，不能用来推导全体人类长 高的原理。 逻辑本质完全不同 普通人长高：自身营养、医疗变好，身体实实在在长个子（对应 C 生活水平）； NBA 均值变高：球队全球搜罗天生高个子，只是选人标准变了，球员本身并没有因为打球长高，和人体生 长机制无关。 额外一点 这句话里从头到尾没出现锻炼、运动相关内容，就算拿 NBA 举例，也完全支撑不了 D 选项。 阅读练习4 29', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 28, true, 107, null),
  ('9092af0d-5d01-5193-8762-68a26868417e', '22222222-2222-2222-2222-222222222221', 'short', 'In the UK,food security has become a big talking point recently because of a rather particular reason: Brexit.', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 29, true, 108, null),
  ('99c3c233-ff63-5689-a3fe-854dc4afdbfe', '22222222-2222-2222-2222-222222222221', 'short', 'Brexit is seen as an opportunity to move back to self-sufficiency . Sounds great—but how feasible（可行性） is this vision(构想，展望)?', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 29, true, 109, null),
  ('d3b22312-8a31-5e23-b129-63664789e1d7', '22222222-2222-2222-2222-222222222221', 'short', 'According to a report on UK food production from the University of Leeds, UK, 85 per cent of the country’s total land area is associated with meat and dairy production. That supplies 80 per cent of consumption needs，so even covering the whole country in livestock farms wouldn’t allow us to cover all our meat and dairy needs.', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 29, true, 110, null),
  ('760435d6-c5b1-5cf0-86bb-129ff808716a', '22222222-2222-2222-2222-222222222221', 'short', 'There are many caveats（注意事项） to those figures, but they are still grave....', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 29, true, 111, null),
  ('12f691b4-e459-56c9-8345-912d3dabbaf9', '22222222-2222-2222-2222-222222222221', 'short', '定位关键实词 原文中与题目直接相关的实词和短语："Brexit"（英国脱欧）→ 背景，说明讨论的是英国的粮食问题。 "opportunity"（机会）→ 表面看起来是好事，但后文有转折。"how feasible is this vision?"（这个愿景有多 可行？）→ 质疑可行性，暗示怀疑态度。"wouldn’t allow us to cover all our needs"（无法满足所有需求）→ 负面结果。"grave"（严重的）→ 强调问题的严重性。', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 30, true, 113, null),
  ('c4c44ec8-2b3e-50d7-a3ef-3e113d0d4bb1', '22222222-2222-2222-2222-222222222221', 'short', '技巧总结 抓取转折词：如 "but"、"how feasible?" 暗示质疑。锁定负面词：如 "wouldn’t allow"、"grave" 表明问题严重。 匹配态度词：优先选与 "怀疑" 最接近的选项（doubtful） and，but，or连词的省略 并列句：灯泡串联 32 省略 33 例题1：省略相同主语 Indeed,predictions of such a society have been around for 2 decades but have not yet come to fruition. 事实上，关于这样一种社会的各类预言已经流传了二十年，却至今仍未成为现实。 例题2：省略相同主语+谓语动词一部分 Then the kids were handed chocolate coins，and given a chance to share them with an anonymous child 随后，孩子们收到了巧克力硬币，并有机会将这些硬币分给一位匿名的孩子 例题3：省略相同的主谓宾和介词 Newport also recommends“deep scheduling” to combat constant interruptions and get more done in less time 纽波特还建议采用“深度规划”方法，以应对频繁的干扰，并在更短的时间内完成更多的工作。 通用步骤', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 30, true, 114, null),
  ('3774caed-0ed7-508f-b3a1-de6d1ff8aead', '22222222-2222-2222-2222-222222222221', 'short', '定位并列连词 and/or/but；', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 33, true, 115, null),
  ('3ddda307-09e2-5d0e-947f-a217269737a0', '22222222-2222-2222-2222-222222222221', 'short', '划出连词左右两端同结构、同词性 的核心动词；', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 33, true, 116, null),
  ('5c95f88a-dcc0-5aa5-a6e9-7d6cba37c4c7', '22222222-2222-2222-2222-222222222221', 'short', '核心动词前边部分即是被省略的部 分 练习题（判断对错）A√ B× 34', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 33, true, 117, null),
  ('71de89c8-fc35-510a-b5a6-d52c11f29764', '22222222-2222-2222-2222-222222222221', 'short', '. .....the key is to determine your length of focus time and stick to it. 这句话and后边省略了主语the key 以及系动词is', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 34, true, 118, null),
  ('63848ae4-b171-5a7d-8da2-047eba7ac370', '22222222-2222-2222-2222-222222222221', 'short', 'In the U.S,it has infected more than one million people,and caused more than 600 deaths and more than 6,000 hospitalizations. 第一个and省略了主语it；第二个and省略了it has caused', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 34, true, 119, null),
  ('e8cdf2f1-7237-57d4-a03e-7e046e2538bb', '22222222-2222-2222-2222-222222222221', 'short', 'the environment isn’t everyone’s priority — or even most people’s. 这句话省略了 the environment isn’t 阅读练习 35 【阅读练习】①There are a number of approaches to mastering the art of deep work — be it lengthy retreats dedicated to a specific task; developing a daily ritual; or taking a "journalistic" approach to seizing moments of deep work when you can throughout the day.②Whichever approach, the key is to determine your length of focus time and stick to it.', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 34, true, 120, null),
  ('e2d1e80c-39a6-5579-b683-ed05d0c70157', '22222222-2222-2222-2222-222222222221', 'mcq', 'The key to mastering the art of deep work is to .', '[{"key": "A", "text": "keep to your focus time"}, {"key": "B", "text": "list your immediate tasks"}, {"key": "C", "text": "make specific daily plans"}, {"key": "D", "text": "seize every minute to work 阅读练习"}]'::jsonb, '', '', '英语2/长难句1-并列句【最终版】.pdf', 35, true, 121, null),
  ('463918b1-1094-5c72-b308-837a3fe27bed', '22222222-2222-2222-2222-222222222221', 'mcq', 'The key to mastering the art of deep work is to .', '[{"key": "A", "text": "keep to your focus time"}, {"key": "B", "text": "list your immediate tasks列出你当下的任务"}, {"key": "C", "text": "make specific daily plans 制定详细的每日计划"}, {"key": "D", "text": "seize every minute to work抓紧每一分钟工作"}]'::jsonb, '', '', '英语2/长难句1-并列句【最终版】.pdf', 36, true, 122, null),
  ('06ee5079-658a-5452-906f-568a1fd52fad', '22222222-2222-2222-2222-222222222221', 'short', '错。省略内容：and 后省略了主语 the key 和系动词 is和to。语法规则：并列表语时，若主语和系动词 相同，可省略。完整形式：...and the key is to stick to it.', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 37, true, 123, null),
  ('2e6753c2-d729-5748-b2c6-bf2e88a01eb0', '22222222-2222-2222-2222-222222222221', 'short', '第一个错，第二个对。省略内容：第一个 and 后省略了主语 it 和助动词 has。第二个 and 后进一步省 略了 it has caused。', null, '', '', '英语2/长难句1-并列句【最终版】.pdf', 37, true, 124, null),
  ('e8d049d4-b989-5da2-943c-fa9af12fde7e', '22222222-2222-2222-2222-222222222221', 'short', '错， the environment isn’t everyone’s priority — or even most people’s. 这句话省略了 the environment isn’t以及priority 阅读练习. 标准答案 A（原题本身就是最优改写） A. keep to your focus time', null, '', 'keep to = stick to（固定同义短语：坚守、恪守、坚持遵守）
your focus time 对应原文 your length of focus time，it 指代 focus time，完美同义替换。
Recap
38
Thanks.', '英语2/长难句1-并列句【最终版】.pdf', 37, true, 125, null),
  ('3518f2f1-a303-5660-b39e-18fdcd10dbc4', '22222222-2222-2222-2222-222222222221', 'short', '名词性从句总览 3 同位语 简单句（名词作成分）He is my idol.（他是我的偶像） 表语从句（系动词 is 后换成句子）He is who all teenagers admire. 他就是所有青少年都崇拜的那个人。 主语从句（把从句挪到句首当主语）Who all teenagers admire is my idol. 所有青少年都崇拜的那个人，是我的偶像。 宾语从句（把从句挪到动词后边当宾语）I know who all teenagers admire. 我知道所有青少年都崇拜的那个人。 谓语动词前的名词 主语 谓语动词前的句子 主语从句 谓语动词后的名词 宾语 谓语动词后的句子 宾语从句 系动词后的名词 表语 系动词后的句子 表语从句 结论：写法基本相同，位置不同 4', null, '', '', '英语2/长难句2- 宾从.pdf', 3, true, 126, null),
  ('ce086852-d750-530f-aa7c-2bdc3e8b87f4', '22222222-2222-2222-2222-222222222221', 'short', '名词性从句怎么形成的？连词连接简单句 5 同位语 He is who all teenagers admire.', null, '', '', '英语2/长难句2- 宾从.pdf', 5, true, 127, null),
  ('fa08cd63-0ff2-5f9f-9578-5b959064de70', '22222222-2222-2222-2222-222222222221', 'short', '拆分简单句 ①He is Jay ②all teenagers admire Jay', null, '', '', '英语2/长难句2- 宾从.pdf', 5, true, 128, null),
  ('0f58ec90-b3c8-5d57-9380-8b4d749f3c95', '22222222-2222-2222-2222-222222222221', 'mcq', '句子组合 并列句：He is Jay and all teenagers admire him 套娃式复合句：He is who all teenagers admire. 连接词 6 连接词 基本意义 that 无实在意义 whether 是否 if 是否 who 谁 whom 谁 whose 谁的 what 什么 / 所……的事物，可指代物和人【没有选择范围】 I don''t know what kinds of books he likes. which 哪一个，可指代物和人【有选择范围的】 I don''t know which book he likes，the red one or the blue one when 指时间，什么时候 where 指地点，在哪里 why 指原因，为什么 how 指方式或程度，如何 名词性从句考法对比 7 初中题目 I believe ______ he will finish his homework on time.', '[{"key": "A", "text": "what"}, {"key": "B", "text": "that"}, {"key": "C", "text": "whose"}, {"key": "D", "text": "how 考研考法： The Supreme Court will now consider whether police can search the contents of a mobile phone without a warrant if the phone is on or around a person during an arrest."}]'::jsonb, '', '', '英语2/长难句2- 宾从.pdf', 5, true, 129, null),
  ('a0a519e6-31d5-5c60-bddb-003459d319ef', '22222222-2222-2222-2222-222222222221', 'short', '能不能理解句子意思，能不能分清主从句，判断出阅读重点信息', null, '', '', '英语2/长难句2- 宾从.pdf', 7, true, 130, null),
  ('fa570ed2-53f5-5cab-9eb1-4ffdbbfa685c', '22222222-2222-2222-2222-222222222221', 'short', '话题 & 词汇背景难度', null, '', '', '英语2/长难句2- 宾从.pdf', 7, true, 131, null),
  ('8680488d-658f-5d4b-a636-41a8902390b6', '22222222-2222-2222-2222-222222222221', 'short', '句子结构复杂度：多层嵌套复合句【宾从嵌套条件状语从句】 宾语从句 9 宾语从句构建规则：步骤一：入乡随俗（调整语序） 步骤二：楚河分界（加入连词） 10 主句：I realize（意识到 v.） 从句：my ginger cat loves sleeping on my bed 步骤一：入乡随俗（调整语序）：不用改动，本身陈述语序 步骤二：楚河分界（加入连词）：that 完整句子：I realize that my ginger cat loves sleeping on my bed 补充说明：that 只起连接作用，无实际含义，日常阅读、口语里，陈述句 宾语从句的 that 经常可以省略 宾语从句构建规则 11 宾语从句构建规则：步骤一：入乡随俗（调整语序） 步骤二：楚河分界（加入连词）', null, '', '', '英语2/长难句2- 宾从.pdf', 7, true, 132, null),
  ('c4cbffce-b746-5124-87d4-a2e55e2431a4', '22222222-2222-2222-2222-222222222221', 'short', '特殊疑问句变宾语从句 主句: I suddenly can’t remember ______ 从句: when did I adopt this strayed cat? (收养 v.) 步骤一：入乡随俗 (调整语序，主语提前) I adopted this stray cat 步骤二：楚河分界 (加入连词) when 完整: I suddenly can’t remember when I adopted this stray cat 宾语从句构建规则 12 宾语从句构建规则：步骤一：入乡随俗（调整语序） 步骤二：楚河分界（加入连词）', null, '', '', '英语2/长难句2- 宾从.pdf', 11, true, 133, null),
  ('4f4670cd-3079-5a0e-a508-8cf9e6f84593', '22222222-2222-2222-2222-222222222221', 'short', 'to collectively change the behavior of large numbers of people', null, '', '', '英语2/长难句2- 宾从.pdf', 18, true, 135, null),
  ('92215a1b-ef2f-50dc-82e4-722385ea282a', '22222222-2222-2222-2222-222222222221', 'short', 'to be structural 第三步：一个连词+搭配一个谓语动词+终点 （下一个标点符号；下一个连接词；下一个动 词）', null, '', '', '英语2/长难句2- 宾从.pdf', 18, true, 136, null),
  ('e88e075f-b6e8-5b1e-8031-caf2b8a3a4ab', '22222222-2222-2222-2222-222222222221', 'short', 'that+is+change 结论：主句+宾从主干 主句DeSombre argues 宾从主干：the best way is to be structural. 互动练习 19 It’s important to acknowledge that the environment isn’t everyone’s priority — or even most people’s. We shouldn’t expect it to be. In her latest book, Why Good People Do Bad Environmental Things, Wellesley College professor Elizabeth R. DeSombre argues that the best way to collectively change the behavior of large numbers of people is for the change to be structural. DeSombre argues that the best way for a collective change should be______. [A] a win-win arrangement双赢的安排 [B] a self-driven mechanism自主驱动机制 [C] a cost-effective approach高性价比方案 [D] a top-down process自上而下式流程 20 根据文章内容，Wellesley College教授Elizabeth R. DeSombre认为，要集体改变大量人的行为，最好的 方式是结构性改变（structural change）。结构性改变通常指的是通过制度、政策或规则等自上而下的方 式来实现改变，而不是依赖个人的自我驱动或自愿行为。因此，最符合这一描述的选项是： [D] a top-down process.其他选项分析：[A] a win-win arrangement（双赢安排）：文中未提到双赢的概 念。[B] a self-driven mechanism（自我驱动机制）：与“结构性改变”相反，结构性改变强调外部推动而 非自我驱动。[C] a cost-effective approach（成本效益方法）：文中未提及成本效益。因此，正确答案是 [D]。 注意： It’s important to acknowledge that the environment isn’t everyone’s priority — or even most people’s.', null, '及解析', '', '英语2/长难句2- 宾从.pdf', 18, true, 137, null),
  ('8761ab4a-6211-59b3-a7dc-51cb8009701f', '22222222-2222-2222-2222-222222222221', 'short', 'it形式主语指代to acknowledge that the environment isn’t everyone’s priority — or even most people’s.', null, '', '', '英语2/长难句2- 宾从.pdf', 20, true, 138, null),
  ('89e67186-be66-57fe-a23a-cd3c6ce24b2f', '22222222-2222-2222-2222-222222222221', 'short', 'to acknowledge that the environment isn’t everyone’s or even most people’s priority 环境保护并非所有人的优先事项——甚至对大多数人来说都不是，这个是很重要的事实。 精读第一句：and，or，but连词的省略 21 It’s important to acknowledge that the environment isn’t everyone’s priority — or even most people’s. 还原：the environment isn’t everyone’s priority — or the environment isn’t even most people’s priority. 重点就是：环保不是所有人、甚至大多数人优先关注的事情 考点二：宾语从句可以跟在谓语动词后边，也可以是非谓语动词后边 22 It’s important to acknowledge that the environment isn’t everyone’s priority — or the environment isn’t even most people’s priority. 我们得认清一个现实,环保并非每个人心中的头等大事，甚至大多数人都不会把它放在首位，这 很重要 第一步：找出所有动词 is，to acknowledge，isn’t 第二步：非谓语动词词组=起点+终点（前） 起点：to do；doing；done 终点=下一个标点符号前；下一个连接词前； 下一个动词前', null, '', '', '英语2/长难句2- 宾从.pdf', 20, true, 139, null),
  ('266e352e-fc73-50a8-b500-2551ea6e380c', '22222222-2222-2222-2222-222222222221', 'short', 'to acknowledge 第三步：一个连词+搭配一个谓语动词+终点 （下一个标点符号；下一个连接词；下一个动 词）', null, '', '', '英语2/长难句2- 宾从.pdf', 22, true, 140, null),
  ('e2505299-4485-5fc7-b6fc-e12e48a38be7', '22222222-2222-2222-2222-222222222221', 'short', 'that .... isn’t everyone’s priority', null, '', '', '英语2/长难句2- 宾从.pdf', 22, true, 141, null),
  ('3404cef2-c440-59da-a198-0600b3dc8265', '22222222-2222-2222-2222-222222222221', 'short', 'that......isn’t even most people’s priority 结论：唯一谓语动词是is 主句：it is important B错哪里？？ 23 It’s important to acknowledge that the environment isn’t everyone’s priority — or even most people’s. We shouldn’t expect it to be. In her latest book, Why Good People Do Bad Environmental Things, Wellesley College professor Elizabeth R. DeSombre argues that the best way to collectively change the behavior of large numbers of people is for the change to be structural. DeSombre argues that the best way for a collective change should be______. [A] a win-win arrangement双赢的安排 [B] a self-driven mechanism自主驱动机制 [C] a cost-effective approach高性价比方案 [D] a top-down process自上而下式流程 考点二：宾语从句可以跟在谓语动词后边，也可以是非谓语动词后边 24 练习：对A 错B 25 It is not enough to say that algorithms(算法) developed by DeepMind will benefit patients and save lives. 判断题1：这个句子包含了宾语从句 判断题2：从句中主干是 algorithms(算法) developed 判断题3：这个句子的it是真正的主语 通过阅读法，找出从句，根据位置判断是不是宾语从句 26 save lives. 翻译：仅声称DeepMind开发的算法将使患者受益并挽救生命是不够的 第一步：找出所有动词 搞清楚and save lives跟谁并列 is not; to say; developed; will benefit; (will)save 第二步：非谓语动词词组=起点+终点（前） 起点：to do；doing；done 终点=下一个标点符号前；下一个连接词前；下一个动词 前搞清楚为什么developed是非谓，而不是谓语', null, '讲解：It is not enough to say that algorithms(算法) developed by DeepMind will benefit patients and', '', '英语2/长难句2- 宾从.pdf', 22, true, 142, null),
  ('c611c402-db53-5dc5-91d4-983abf464e88', '22222222-2222-2222-2222-222222222221', 'short', 'to say', null, '', '', '英语2/长难句2- 宾从.pdf', 26, true, 143, null),
  ('f618ce27-202c-5d05-abd6-35ca23ed45a2', '22222222-2222-2222-2222-222222222221', 'short', 'developed by DeepMind 第三步：一个连词+搭配一个谓语动词+终点（下一个标 点符号；下一个连接词；下一个动词）', null, '', '', '英语2/长难句2- 宾从.pdf', 26, true, 144, null),
  ('70cd01a6-41cc-5a8a-8ba7-5266eb15f3f1', '22222222-2222-2222-2222-222222222221', 'short', 'that+will benefit patients and save lives. 结论：唯一谓语动词是is not 主句：[it/to say] It is not enough that从句跟在to say后边，做这个非谓语动词宾语从句 如果连词被省略，如何判断从句位置 27 Overwhelming majorities of both groups said they believe it is harder for young people 口诀：主谓....（that）主谓.....（that）主谓 多个宾从（连词省略）+非谓语动词+形式主语+比较状从 28 Overwhelming majorities of both groups said（that） they believe（that） it is harder for young people today to get started in life than it was for earlier generations. 绝大多数两组人都认为，如今年轻人开始独立生活比前几代人更难 注意 第一步：找出所有动词 said，believe，is，to get started，was 在英语中，“get” 可以像 “be” 一样，与过去分词 搭配,“get married”（结 婚） = 进入“已婚”状态 “get dressed”（穿好衣 服） = 进入“穿好衣服” 的状态 get started in life进入/ 开启新生活/立足社会 第二步：非谓语动词词组 起点：to do；doing；done 终点=下一个标点符号前；下一 个连接词前；下一个动词 to get started in life 第三步：从句 that they believe that it is harder for young people today than it was for earlier generations 问题：句子中两个it分别指的是？ 用省略方式还原成两个简单句来理解 29 ....... it is harder for young people today to get started in life than it was for earlier generations. 这个than类比处理成and，即省略部分还原 相当于and的省略 it is harder for young people today to get started in life than it was 【hard】 for earlier generations【to get started in life】. 两个简单句： it is hard for young people today to get started in life如今年轻人开始独立生活很难 it was 【hard】 for earlier generations【to get started in life】. 前几代人开始独立生活很难 再把连词加上+er 如今年轻人开始独立生活比前几代人更难 真题演练二： 30 Young and old converge on one key point: Overwhelming majorities of both groups said they believe it is harder for young people today to get started in life than it was for earlier generations.', null, '', '', '英语2/长难句2- 宾从.pdf', 26, true, 145, null),
  ('44e242d1-a855-58d5-a049-f69c31c75457', '22222222-2222-2222-2222-222222222221', 'short', 'Both young and old agree that_____ . [A]good-paying jobs are less available [B]the old made more life achievements [C]housing loans today are easy to obtain [D]getting established is harder for the young 错误选项分析 31 Young and old converge on one key point: Overwhelming majorities of both groups said they believe it is harder for young people today to get started in life than it was for earlier generations.', null, '', '', '英语2/长难句2- 宾从.pdf', 30, true, 146, null),
  ('787067d5-ba38-5302-b772-588e64b5f0c1', '22222222-2222-2222-2222-222222222221', 'short', 'Both young and old agree that_____ . [A]good-paying jobs are less available高薪工作更少了【无中生有】 主观臆断：年轻人难立足是因为经济不好，就业形势不好，高薪工作更少了 [B]the old made more life achievements老一辈取得了更多人生成就【无中生有】 主观臆断：年轻人和老一辈人开启人生难度的比较 [C]housing loans today are easy to obtain如今房贷容易申请 感情色彩不一致+无中生有房贷+房贷是一个很容易主观臆断概念 老一辈更容易取得成就 32', null, 'D', '题干关键句："Overwhelming majorities of both groups said they believe it is harder for young people
today to get started in life than it was for earlier generations."
核心含义：年轻人和老年人都认为，如今的年轻人比过去的世代更难“get started in life”（开始生活/立足社
会）。
选项匹配：[A] “高薪工作更难找” → 原文未提及“good-paying jobs”，属无关信息。[B] “老年人成就更多” →
原文比较的是“难度”，而非“成就”，偷换概念。[C] “如今房贷更容易获得” → 与原文语义相反（原文强调“更
难”）。[D] “年轻人更难立足” → 完全对应原文的“harder for young people to get started in life”。"get started
in life" ≈ "getting established"（立足社会/建立生活基础）。
宾语从句位置：介词后边
33
例子
34
Researchers measured people''s cortisol，a stress marker， and found it higher at what is supposed
to be a place of refuge.
翻译：研究人员检测了受试者体内的皮质醇（一种压力指标），结果发现，在本该是避风港湾的地方，
人们的皮质醇水平反而更高', '英语2/长难句2- 宾从.pdf', 31, true, 147, null),
  ('1e981b9a-4ace-5d51-9eda-efe26b8e6e9a', '22222222-2222-2222-2222-222222222221', 'short', '结构拆解： 句1：（Researchers）found it higher at the church/home/the heart A=句2：The church/home/the heart is supposed to be a place of refuge.', null, '', '', '英语2/长难句2- 宾从.pdf', 34, true, 148, null),
  ('70931278-cebc-5e9c-8c82-1554db9b67d9', '22222222-2222-2222-2222-222222222221', 'short', '为什么是宾语从句？ "what" 引导的从句 "what is supposed to be a place of refuge" 整体作为介词 "at" 的宾语。 真题演练三： 35 ①A new study suggests that contrary to most surveys, people are actually more stressed at home than at work. ②Researchers measured people''s cortisol，a stress marker，and found it higher at what is supposed to be a place of refuge.', null, '', '', '英语2/长难句2- 宾从.pdf', 34, true, 149, null),
  ('23349af9-32ca-5c00-ab7e-219de1a279f5', '22222222-2222-2222-2222-222222222221', 'short', 'According to Paragraph 1, most previous surveys found that home ____. [A]offered greater relaxation than the workplace比工作场所更能让人放松 [B]was an ideal place for stress measurement是测量压力的理想场所 [C]generated more stress than the workplace产生的压力比工作场所更大 [D]was an unrealistic place for relaxation是完全不适合放松地方 36', null, 'A', '题目问的是“根据第一段，大多数先前的调查发现家____”。文章第一句提到“A new study
suggests that contrary to most surveys, people are actually more stressed at home than at work”，即
“一项新研究表明，与大多数调查相反，人们实际上在家比在工作时压力更大”。这里的“contrary to most
surveys”表明，大多数调查的结果与新研究相反，即大多数人认为在家比在工作时压力更小（more
relaxed at home）。因此，最符合的选项是[A]“比工作场所提供更大的放松”。
其他选项分析：[B]“是测量压力的理想场所”：文中未提及家的“测量功能”，排除。[C]“比工作场所产生更
多压力”：这是新研究的结论，与“大多数调查”相反，排除。[D]“是一个不切实际的放松场所”：与文意不
符，排除。
互动练习
37
①Facebook paid even more than $13.5bn to acquire the WhatsApp messaging service.WhatsApp
offered Facebook its users'' friendships and social lives.
②Facebook promised the European commission that it would not link phone numbers to Facebook
identities, but it broke the promise almost as soon as the deal went through. Even without knowing
what was in the messages, the knowledge of who sent them and to whom was enormously revealing
and still could be.
Linking phone numbers to Facebook identities may____.
A. worsen political disputes
B. mess up customer records
C. pose a risk to Facebook users
D. mislead the European commission
互动练习
38
①Facebook paid even more than $13.5bn to acquire the WhatsApp messaging service.WhatsApp
offered Facebook its users'' friendships and social lives.
②Facebook promised the European commission then that it would not link phone numbers to
Facebook identities, but it broke the promise almost as soon as the deal went through. Even
without knowing what was in the messages, the knowledge of who sent them and to whom was
enormously revealing and still could be.
Linking phone numbers to Facebook identities may____.
A. worsen political disputes加剧政治争端
B. mess up customer records扰乱用户档案
C. pose a risk to Facebook users给脸书用户带来风险
D. mislead the European commission误导欧盟委员会
答案及解析
39
正确答案：C. pose a risk to Facebook users
步骤：定位关键信息：原文第②段提到，Facebook 违背承诺，将电话号码与Facebook身份关联
（linked phone numbers to Facebook identities）。后文强调：即使不知消息内容，仅通过发件人和收件人
信息就足以暴露大量隐私（enormously revealing），且这种风险至今存在（still could be）。
逻辑推理：电话号码与身份关联 → 可能泄露用户社交关系或隐私 → 对用户构成风险（与选项C直接对应）。
A. "政治争端"（无提及）B. "客户记录混乱"（无关，文中焦点是隐私风险）D. "误导欧盟委员会"
（Facebook违背承诺是事实，而非误导）排除法：原文核心问题是用户隐私风险，而非管理问题（B/D）
或政治影响（A）。重点句翻译参考：“即使不知消息内容，仅通过谁发送给谁的信息就足以暴露隐私，且
风险至今仍在。”（支持选项C的持续性风险这一关键点。）
跟在谓语动词后边的宾从，其主句的位置可前可后可中
40
①A new study suggests that contrary to most surveys, people are actually more stressed at
home than at work.
② Popular fireworks should be replaced with cleaner drone(无人机)and laser light shows to avoid the
"highly damaging" impact on wildlife,domestic pets and the broader environment,new Curtin-led
research has found.
③Failing to recognize that, he notes, leads to “an overly simplified view of what the solutions might
be.
互动练习
41
① “The human systems and the landscapes are linked, and the interactions go both ways,” he
says.②Failing to recognize that, he notes, leads to “an overly simplified view of what the solutions might
be.', '英语2/长难句2- 宾从.pdf', 35, true, 150, null),
  ('ae61af06-378b-5fea-928b-6dbe0d3987f6', '22222222-2222-2222-2222-222222222221', 'short', '这里的黑体字that指的是什么？', null, '', '', '英语2/长难句2- 宾从.pdf', 41, true, 151, null),
  ('75350cdf-2570-5b30-b7c8-62f45d30bc91', '22222222-2222-2222-2222-222222222221', 'short', '②主干是？ 未能认识到这一点，就会导致（对解决方案）过度简化的看法 42', null, '[D] understand the interrelations of man and nature', '步骤：定位关键句：原文中的核心观点："The human systems and the landscapes we live on are
linked, and the interactions go both ways."核心含义：人类系统与自然环境相互关联，且相互作用是双向
的。后续说明：若未能认识到这一点（Failing to recognize that），会导致对解决方案的过度简化认知
（overly simplified view）。题干与原文对应：题干：Moritz提到的"过度简化观点"是由于未能______。
原文依据："that" 指代前文"人类与自然的相互关联及双向作用"。
"未能认识到这一点" = 未能理解"人与自然的相互关系"。选项匹配：[A] "发现自然的基本组成" → 原文未
提及"fundamental makeup"，属无关信息。[B] "探索人类系统的机制" → 片面，忽略"自然"部分。
[C] "最大化景观在人类生活中的作用" → 原文强调"相互关系"，而非单方面"最大化"。[D] "理解人与自然的
相互关系" → 完全对应"human systems and landscapes are linked, and interactions go both ways"。
真题演练四
43
“The human systems and the landscapes are linked, and the interactions go both ways,” Moritz says.
Failing to recognize that, he notes, leads to “an overly simplified view of what the solutions
might be.', '英语2/长难句2- 宾从.pdf', 41, true, 152, null),
  ('8eee74eb-621c-5506-b428-5bc815f635b3', '22222222-2222-2222-2222-222222222221', 'short', 'The overly simplified view Moritz mentions is a result of failing to____. [A]discover the fundamental makeup of nature发现大自然的基本构成 [B]explore the mechanism of the human systems探究人类系统的运行机制 [C]maximize the role of landscape in human life最大化自然景观在人类生活中的作用 [D]understand the interrelations of man and nature理解人与自然之间的相互联系 Recap 总结 45 总结 46 总结 47 Thanks.', null, '', '', '英语2/长难句2- 宾从.pdf', 43, true, 153, null),
  ('724083a7-8502-5b38-ac8f-ef8aea322f07', '22222222-2222-2222-2222-222222222221', 'short', 'used', null, '', '', '英语2/长难句3-主表同从.pdf', 7, true, 154, null),
  ('c28bd844-c104-5acc-a0c7-8a5cc8d8be29', '22222222-2222-2222-2222-222222222221', 'short', 'to develop 非谓语动词词组：to develop them 第三步：从句=起点+与其搭 配的谓语动词+终点 起点：连词 终点：终点=下一个标点符号； 下一个连接词；下一个动词', null, '', '', '英语2/长难句3-主表同从.pdf', 7, true, 155, null),
  ('6cb9e5da-2bb8-553d-8046-014dfcf9385a', '22222222-2222-2222-2222-222222222221', 'short', 'What matters', null, '', '', '英语2/长难句3-主表同从.pdf', 7, true, 156, null),
  ('444c8cc8-a494-5693-af71-203229278b0b', '22222222-2222-2222-2222-222222222221', 'mcq', 'that they will belong to a private monopoly what引导主语从句：具备极强的强调效果，是阅读高频 “核心观点 句” 句式，后边的内容通常会成为考点 8 What makes the problem thornier is that the usual time-management techniques don''t seem sufficient. 让问题变得更加棘手的是，常规的时间管理方法似乎并不奏效。 What matters is that they will belong to a private monopoly, with public resources used to develop them. 关键问题在于，这些数据将归私人垄断企业所有，而研发它们依托的却是公共资源。 这两个句子本身就是议论文专门用来输出作者观点的标准句型，绝大多数阅读语境下，它们就是段落 / 话题的 核心观点句；即便只是分论点，也属于作者刻意强调、重点表达的看法，用来承载作者的核心态度。 考点二：主语从句的位置 9 形式主语 "it" 用于避免主语过长，使句子更符合英语表达习惯（尤其是正式写作或学术英语）。 主语从句（that/whether 引导）后置后，句子重心更突出，读起来更流畅。 原句： That the seas are being overfished has been known for years. 改写： It has been known for years that the seas are being overfished. 翻译：海洋被过度捕捞的情况早已为人所知。 原句： Whether the separation distances would satisfy air-traffic- control regulations is another matter. 改写： It is another matter whether the separation distances would satisfy air-traffic-control regulations. 翻译：间隔距离是否能满足空中交通管制的规定，则是另一回事。 表语从句 从位置判断这个是表从，表语从句是一个完整的句子放在主句be动 词后，作为表语，通常跟在be后边，连词that不能删掉 11 DeSombre isn’t saying people should stop caring about the environment. It’s just that individual actions are too slow, she says, for that to be the only, or even primary, approach to changing widespread behavior. 根据原句，下列哪项最准确地表达了句意？', '[{"key": "A", "text": "她说，个人行动过于缓慢，不足以成为改变广泛行为的唯一甚至主要途径。"}, {"key": "B", "text": "她说，个人行动速度太慢，却仍是改变广泛行为唯一的，主要的途径。"}, {"key": "C", "text": "她说，只有加快个人行动的速度，才能有效改变广泛行为。 考点一：考试中表语从句理解如何加难度"}]'::jsonb, '', '', '英语2/长难句3-主表同从.pdf', 7, true, 157, null),
  ('e53a2473-0eaa-5947-aa9d-8c6e90d57e8a', '22222222-2222-2222-2222-222222222221', 'short', 'The author concludes that individual efforts ____. [A]can be the main way to widespread behavior change改变大众行为的主要方式 [B]can be too inconsistent可能前后矛盾、缺乏连贯性 [C]are far from sufficient远远不够、严重不足 [D]are far from rational极不理性、缺乏理智 表语从句：That child is too young to talk 13 individual actions are too slow 【for that】 to be the only, or even primary, approach to changing widespread behavior. 翻译：个人层面的行动见效太慢，根本无法成为改变大众普遍行为的唯一途径，甚至连主要手段都算不上。 that指代上文individual actions change widespread behavior. 最大阅读障碍： 在too...to 固定结构中加了 for that，就认不出否定了 障碍2：that指代什么 individual actions are too slow, she says, for that to be the only, or even primary, approach to changing widespread behavior. 插入语加大too...to 结构的识别 It’s just that individual actions are too slow, she says, for that to be the only, or even primary, approach to changing widespread behavior. 变成从句 真题演练一 14 DeSombre isn’t saying people should stop caring about the environment. It’s just that individual actions are too slow, she says, for that to be the only, or even primary, approach to changing widespread behavior.', null, '', '', '英语2/长难句3-主表同从.pdf', 12, true, 158, null),
  ('b3620719-f38c-5fc5-90d0-e76eb0559f60', '22222222-2222-2222-2222-222222222221', 'short', 'The author concludes that individual efforts ____. [A]can be too aggressive可能过于激进 / 强硬 [B]can be too inconsistent可能前后矛盾、缺乏连贯性 [C]are far from sufficient远远不够、严重不足 [D]are far from rational极不理性、缺乏理智 15', null, '[C] are far from sufficient', '步骤：定位关键句：原文明确提到："It’s just that individual actions are too slow... to be the only, or
even primary, approach to changing widespread behavior."
核心含义：个人行动速度太慢，无法作为改变行为的唯一或主要方法。
隐含结论：仅靠个人行动是远远不够的（insufficient）。
选项匹配：
[A] "可能过于激进" → 原文未提及"aggressive"，完全无关。
[B] "可能不一致" → 未提到"inconsistent"，偏离重点。
[C] "远远不够" → 完全对应"too slow to be the only/primary approach"。
[D] "不够理性" → 原文批评的是"速度慢/效果不足"，而非"非理性"。
考点二：主语从句+表语从句【多层从句嵌套】
16
What makes the problem thornier is that the usual time-management techniques don''t seem sufficient.
长难句秒杀法三步走
第一步：找出所有动词
makes； is ；don''t seem；
第二步：非谓语动词词组=起点+终点（前）
起点：to do；doing；done
终点=下一个标点符号前；下一个连接词前；
下一个动词前
无
第三步：从句=起点+与其搭配的谓语动词+
终点（前）
起点：连词
终点：终点=下一个标点符号；下一个连接
词；下一个动词', '英语2/长难句3-主表同从.pdf', 14, true, 159, null),
  ('cb9d471a-cf0f-56d1-92ec-8a9409e1241d', '22222222-2222-2222-2222-222222222221', 'short', 'What makes the problem thornier', null, '', '', '英语2/长难句3-主表同从.pdf', 16, true, 160, null),
  ('d08aecb8-76c9-59e4-b685-ba05c74c64a5', '22222222-2222-2222-2222-222222222221', 'short', 'that the usual time-management techniques don''t seem sufficient. 结论： 唯一的谓语动词is 翻译：问题之所以更为棘手，是因为常规的时间管理方法似乎并不够用 真题演练二 17 段首 What makes the problem thornier is that the usual time-management techniques don''t seem sufficient....... 转折 But in my experience, using such methods to free up the odd 30 minutes doesn''t work........ 段尾 Deep reading requires not just time, but a special kind of time not obtained merely by becoming more efficient.', null, '', '', '英语2/长难句3-主表同从.pdf', 16, true, 161, null),
  ('cf56a3ad-92b3-50dd-8d5d-80e8d185cf8e', '22222222-2222-2222-2222-222222222221', 'short', 'The usual time-management techniques don''t work because____. [A] what they can offer does not ease the modern mind [B] what challenging books demand is repetitive reading [C] what people often forget is carrying a book with them [D] what deep reading requires cannot be guaranteed 清楚第3句的主干及非主干部分 18', null, '', '', '英语2/长难句3-主表同从.pdf', 17, true, 162, null),
  ('b0b7d555-aa16-541c-9846-74aaadd0dc1d', '22222222-2222-2222-2222-222222222221', 'short', 'Deep reading requires not just time, but a special kind of time not obtained merely by becoming more efficient. 深度阅读不仅需要时间，更需要一种特殊的时间状态——这种状态绝非仅靠提升效率就能获得。 第一步：找出所有动词 requires；not obtained；becoming 第二步：非谓语动词词组=起点+终点（前） 起点：to do；doing；done 终点=下一个标点符号前；下一个连接词前；下 一个动词前 1 not obtained merely by', null, '', '', '英语2/长难句3-主表同从.pdf', 18, true, 163, null),
  ('875e1cde-b80c-52f5-9e8e-d501a18d3fcd', '22222222-2222-2222-2222-222222222221', 'short', 'becoming more efficient. 主干：Deep reading requires not just time, but a special kind of time', null, '', '', '英语2/长难句3-主表同从.pdf', 18, true, 164, null),
  ('04899585-2c23-5260-a3e2-7940258e4440', '22222222-2222-2222-2222-222222222221', 'short', 'but省略', null, '', '', '英语2/长难句3-主表同从.pdf', 18, true, 165, null),
  ('d9fc8370-8021-5849-b9c1-3eb3e4eedfce', '22222222-2222-2222-2222-222222222221', 'short', 'Deep reading requires not just time, but (it requires) a special kind of time. 把省略的还原-复现词就出来了 19 段首 What makes the problem thornier is that the usual time-management techniques don''t seem sufficient....... 转折 But in my experience, using such methods to free up the odd 30 minutes doesn''t work........ 段尾 Deep reading requires not just time, but a special kind of time not obtained merely by becoming more efficient.', null, '', '', '英语2/长难句3-主表同从.pdf', 18, true, 166, null)
on conflict (id) do update set
  chapter_id = excluded.chapter_id,
  qtype = excluded.qtype,
  stem = excluded.stem,
  options = excluded.options,
  answer = excluded.answer,
  explanation = excluded.explanation,
  source_file = excluded.source_file,
  source_page = excluded.source_page,
  needs_review = excluded.needs_review,
  sort_order = excluded.sort_order,
  user_id = excluded.user_id
where public.questions.needs_review is true;
