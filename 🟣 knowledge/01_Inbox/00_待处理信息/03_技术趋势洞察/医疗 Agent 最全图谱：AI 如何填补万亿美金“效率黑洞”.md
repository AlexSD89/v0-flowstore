---
source: "https://mp.weixin.qq.com/s/3-XOuI-_Av8PTldmPKt1_Q"
created: 2025-05-07
---
原创 拾象 *2025年05月07日 20:02*

[![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/3tHNibnJ2jgy8PI5CzA2lEY896G6Pp8j3vcibnicEvtzhUpvBttqlmPKMq5lL6vXtuWh2dWxxAoZDeiaicpXJXmCcPA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg2OTY0MDk0NQ==&action=getalbum&album_id=3570724992708624387#wechat_redirect)

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/3tHNibnJ2jgy8PI5CzA2lEY896G6Pp8j3pfsT8DQUHBOjI20TIMVGghMuSKiabYuQ1swDYt5VIa3qxQfWg3qPBxQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1) ![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/3tHNibnJ2jgy8PI5CzA2lEY896G6Pp8j3MCI1cWhZGomJHuV7Wdjp3SYE2SXh7vg4rPIFibQI8Nr2XO0ZLdVgicibA/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

作者：haina

Healthcare 是美国最大的行业之一，支出占 GDP 的 17%，雇佣 1/10 的美国劳动力。它也极其低效，美国每年 4.5 万亿美元的医疗支出中，有高达 25%，也就是 1.1 万亿美元被视为无效或可避免的浪费。在某些情况下，healthcare 从业者用于保险账单处理的时间成本可能占账单收入的 1/7。碎片化的系统、低效的运营流程和人力密集的环节，是 AI Agent 的天然切入点。如果 AI 能切掉哪怕一小部分，就可能创造几千亿级别的新市场空间。

  

过去一年，GenAI 在医疗行业的渗透加速了。本文我们系统梳理了 Healthcare AI 的产业结构，重点聚焦了在哪些环节 AI 能够真正创造价值、并且拥有明确预算，识别了值得优先关注和投资的细分方向和公司。

  

医疗行业的独特性决定了 AI 的扩散路径和传统软件或消费级应用并不同。目前 Healthcare AI 的高价值切入口，集中在 **高频刚需、非临床环节** ，一方面是 **前台任务** ，如提升医生效率的 Patient Copilot ( Case Study 包括 Abridge、Ambience、OpenEvidence )；另一方面是 **后台基础设施** ，如加速理赔与账单流转的 Billing / Claims Infra（Case Study 包括 Infinitus）。这些领域的共同特征是：流程痛点明确，付费意愿强，能够快速看到 ROI。

  

商业模式上，在现阶段，能快速集成、轻量部署的 SaaS 型产品模式最为奏效，因为像 Epic、Cerner 这样的传统医疗系统迁移成本高，短期难以撼动。客户粘性和切换壁垒也很重要。以 Abridge 为例，通过与 Epic 深度集成，不仅实现了快速部署，也获得了更高的定价权和留存率。未来，能够深度融入医疗工作流的 AI 公司，将具备更强的长期护城河。

  

  

💡 目录 💡

  

01 拆解医疗万亿美金的“效率黑洞”

02 赛道图谱及关键公司

03 创业团队正在把 Agent 带进每个诊所和系统

  

  

  

  

**01.**  

  

**拆解医疗万亿美金的**

**“效率黑洞”**

  

美国医疗体系庞大且复杂，每年支出已超过 4.5 万亿美元，占到 GDP 的 17%以上。而其中约四分之一的支出，超过 1.1 万亿美元，实际上被认为是无效或可以避免的浪费。这些浪费的根源，来自于医疗行业极度碎片化的现状：支付、理赔、管理、诊断和患者服务彼此割裂，流程冗长、系统互不兼容，导致了巨大的人工成本和效率损失。这一切，也为 AI 技术在医疗领域的应用打开了清晰且可衡量的窗口。只要能够帮助削减其中的一小部分冗余，就有潜力释放出数千亿美元级别的新增价值，这正是今天 Healthcare AI 最值得关注的机会。

  

**目前 AI 非常适合切入非临床环节（如收入周期管理、理赔自动化、文书工作）及半结构化任务密集型场景（如影像诊断、医生助手、患者交互）。当前最典型的切入口包括：**

**•** 患者服务自动化（聊天机器人、预约管理）

**•** 医生效率工具（scribe、copilot）

**•** 医疗数据结构化（EHR、临床记录、影像识别）

**•** 行政环节（revenue cycle， billing， claims）

  

相比传统医疗软件系统（如 Epic），AI 产品更易模块化部署，通常按 SaaS 模式或增值服务计价，不需要大规模替换主系统，更适合以“插件”方式切入医院、诊所、保险公司等现有工作流。客户与预算来源主要包括：

**•** 诊所与医生集团（private practices）：提升运营效率、提升回款率（买单人是 practice owner）。

**•** 医院系统（IDNs）：关注护理人员流失与患者满意度，通常从运营预算或 IT 预算中支付。

**•** 健康保险公司（payer）：愿为提高理赔效率、欺诈识别等功能买单。

**•** 雇主医疗福利（employer benefits）：雇主为员工健康管理采购服务。

  

现阶段 AI 渗透率保守估计在 **0.3%～0.4%** 之间，对应实际市场规模 **$120 亿～$150 亿** 。假设未来 AI 在医疗支出中能渗透 5%～10% 的环节（聚焦在服务效率提升、运营自动化和诊断辅助）， **长期可实现 $2250 亿～$4500 亿的市场空间。这一区间可被视为 Healthcare AI 的长期 TAM，** 与当前整个美国医疗 IT（$400B）或医疗设备市场（$550B）体量相当。不过短期内由于行业保守和法规限制，行业内的 AI 渗透会是比较渐进式的。

  

**AI 医疗的结构性机会：**

**从 Co-pilot 到 Infra**

**具体到目前 AI 在 healthcare 的应用，可以用以下坐标轴分类：**

  

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/3tHNibnJ2jgy8PI5CzA2lEY896G6Pp8j3CmDXAM831YINFAFFJ0TJP3J3dW6RiacCtYC0mcxNicM9tRKPQs9vm1lg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

Source: byFounders

  

**面向病人的“前台任务” vs 行政类的“后台任务”：**

“前台任务”是面向终端用户的 Copilot/Agent 应用，如医生助手、患者交互机器人、AI 诊断辅助，提升现有工作效率或优化患者体验，适合通过 PLG 或 BD 推广；“后台任务”是指底层基础设施的 AI 化重建，如 AI 理赔引擎、账单处理 API、数据互通平台，类似金融科技里的 Stripe / Plaid，重构新一代医疗支付和数据网络的底座。

  

这一波 AI 技术在医疗行业的扩散路 **径， 是从“前台任务”开始的。** 因为要开发一个帮助病人自我诊断症状的 AI chatbot（比如 Ada）或 AI Scrabing （abridge） 相对简单；而要在后台实现自动化流程，不但需要连接各种旧系统，还需要培训工作人员，难度和复杂度都更高，但可能有全新的 Enterprise 级别的机会。

  

**另外还可以分为临床任务 vs 非临床任务** ，是否必须由专业医疗人员（如医生）完成的任务，还是可以由非医学背景的人来完成的任务。以目前的 AI 能力，非临床、执行型任务 AI 能更好的胜任，但临床任务能创造更多的经济价值。

  

**市场规模**

延续上文对 AI 应用场景的分析， **我们根据 Patient Facing 和 Healthcare Infra 两个方向，** 定位了重要环节和值得关注的公司：

  

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/3tHNibnJ2jgy8PI5CzA2lEY896G6Pp8j3ZCO3l4fxWhIGzib4zW2EDQ5rEUuSBQhTzrhO2b64nsFedE2SLfQoAeg/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

  

根据上文对市场空间的分析，

**美国医疗总支出：** $4.5 万亿美元

**无效/浪费支出比例：** ～25%，即 $1.1 万亿美元

假设 AI 渗透率长期达到其中 5～10%，则长期 AI 可服务市场（TAM） = $1.1T × 5～10% = $550 亿 ～ $1100 亿。

  

我们确定了以下的主要市场细分和 AI 潜在空间：

  

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/3tHNibnJ2jgy8PI5CzA2lEY896G6Pp8j3nDer6hw3fZCicg0k9Dkic3NpNNuSNXmNGHDpyuYvgI0FxVxwULSuf6Pw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

  

注：每部分当前年支出估算（$B）计算逻辑如下：

  

***Doctor Copilot***

**假设：**

• 美国有约 100 万执业医生（AMA 数据）。

• 医生年均总薪酬成本 ～$250k。

• 医生有 ～30–50% 时间用于文书、开单、EHR 等非临床任务（AMA、JAMA 调研）。

**计算路径：**

• 医护人力相关支出中，估计有 $250B 用于医生。

• 其中非临床任务部分 = $250B × 40% ≈ $100B（为 Doctor Copilot 可替代任务池）。

  

***Diagnosis Copilot / Medical Imaging AI***

**假设：**

• 全球医学影像市场约为 $40–50B（MRI、CT、X 光设备市场）。

• AI 影响的主要是判读/分析成本、重复检查、初筛流程。

• 每年美国进行影像检查超 30 亿次（包括 X-ray、CT、MRI 等）。

• 单次成本估算 ～$100（含影像设备摊销、医技人力、判读等）。

**估算：**

• 影像相关总支出 = 30 亿次 × $100 = $300B，但设备折旧、人力和解读成本比例约 1:1:1。

• 其中“解读 + 诊断辅助”环节约占 1/3 → $300B × 1/3 = **$100B。**

  

***AI Nurse***

***（客服自动化、远程护理、健康咨询）***

**假设：**

• 美国 payer + provider call center 支出巨大。HealthAffairs 估算，payer call center 支出 ～$40B。

• 再加上医院、诊所前台护理/协调工作：总客服+协调支出估计 ～$80–100B。

**计算：**

• 假设 50–60 万名医疗客服人员 × $60k/人 = ～$30B–$35B。

• 加上护理前台协调等任务部分支出，总估算约为 **$80B。**

***医疗计费与保险***

***（RCM， billing， claims， prior auth 等）***

**假设基础：**

• 美国医疗行业行政支出占比极高，CMS 和 HealthAffairs 研究显示， **管理成本占总医疗支出的 25–30%。**

• 2023 年美国医疗支出总额超 **$4.5T。**

**计算路径：**

• 行政支出 = $4.5T × 25% = $1.125T

• 其中与计费/理赔/授权/coding 等任务相关部分估计占比约 30–40%。

• → $1.125T × 35% ≈ **$400B。**

  

***Clinical Dataset Structuring***

***（EHR 清洗、数据标注、OCR 等）***

**假设：**

• 医院 IT 预算中的大部分用于 EHR 系统维护和数据整理。

• 2023 年美国医院 IT 总预算约$100B（HIMSS，BEA 估算）。

• 其中数据工程相关约占 10–20%。

**估算路径：**

• $100B × 15% = **$15B** ，向上估略放宽为 **$10B–$20B 区间。**

  

***Infra/API 平台***

***（claims infra、care nav、PA infra 等）***

**假设基础：**

• 美国 payer 在 claims processing 上支出巨大。

• claims admin 成本估计约为 **$200–300 per member per year** （PBM 和 TPA 系统的成本）。

• 服务人群约为 1.5–2 亿人。

**估算路径：**

• claims admin market = 2 亿 × $250 = $50B。

• 加上部分 TPA、雇主健康计划、care navigation API 平台支出。

• 整体平台级 infra 服务市场估算为 **$100B–$150B。**

  

**我们愿意 bet 的方向**

  

**Patient facing 领域**

  

1\. **患者咨询与医生助手。** 特点是轻量级切入，高 ROI 回报，合规路径明确。 **( ~$100B)**

  

这一方向的 AI 公司聚焦于提升医生与患者之间的沟通效率，代表性的产品形态包括预约前的症状分流工具，以及在问诊过程中协助医生完成自动记录、病历总结、医疗编码（CPT/ICD）、协调检查等任务的“AI co-pilot”。这一类产品通常不需要 FDA 认证，仅需满足 HIPAA、SOC2 等数据隐私与安全合规要求，具备较低的部署门槛和快速落地能力。

  

该领域的 ROI 也很明确。医生平均每周需花费超过 15 小时在行政任务上，AI 助手可以将这一负担减少 50%以上，提升医生效率与满意度，降低运营成本。 **当前值得关注的公司包括 Abridge、Nabla 和 Ambience，聚焦在 Note taking 环节，切入点轻巧、增长潜力也较大。**

  

2\. **Diagnosis Copilot，用 AI 辅助医生诊断，减轻知识负担、提升决策质量。( ~$100B)**

  

在临床一线，医生每天都面临快速变化的医学知识体系和复杂的病例判断，传统的学习和信息检索方式难以满足实时决策的需要。 **Diagnosis Copilot** 可以快速学习最新研究文献，结合患者个体信息，减轻医生的信息负担和认知压力。

  

产品形态上 **，有独立使用的 Chatbot（如 OpenEvidence），也有与医院 EHR 系统深度集成的诊疗平台（如 Glass Health）。** 从长期来看，Diagnosis Copilot 类产品具备结构化数据输入、明确 ROI 和高频刚需的特点，有可能成为医生日常工作的“标配工具”。

  

3\. **医疗计费与保险（～$400B）**

  

**相比前两类“前台”场景，Healthcare Infra 更为复杂，但其长期商业价值同样可观。** 医疗基础设施支撑预约、账单、理赔、数据共享和支付处理等关键环节。医疗机构在运营和行政成本上的支出通常占总支出的 25～30%。很多基础设施系统如诊所管理软件、理赔 clearinghouse 等都是上世纪遗留下来的，严重依赖人工流程，信息割裂。新兴医疗模式（如远程医疗、居家护理、自费医疗）正在快速兴起，但配套的底层系统没有建立，有“空白地带”。这正是创业者的机会：要么升级传统系统，要么在新场景中从零构建平台。

  

我们特别关注的细分领域包括医疗计费与编码自动化（RCM）、保险理赔流程优化（如 Prior Authorization、Claims Submission）。这一领域面临的挑战在于产品需深度集成进现有系统， **客户决策周期较长，对企业的销售策略和实施能力要求更高。但一旦完成部署，客户黏性极高，具备强劲的收入稳定性。当前该赛道的明星公司不多，我们比较关注的包括 Infinitus 和 Alaffia，也值得发掘更多早期的机会。**

  

  

  

**02.**  

  

**赛道图谱及关键公司**

  

**Patient Facing：**

**AI 成为医生的第二大脑**

**Doctor Co-pilots**

  

美国约有 **100 万** 执业医生和更多的护士、技师。医生平均将 **40%+** 工作时间花在 **电子病历和文书** 上，“数字行政负担”极大。如果每位医生每年为此类 AI 服务付费 ～$5,000（可能由医院或诊所支付），对应市场规模 ～$50 亿美元/年。

  

该领域的产品需求明确、ROI 清晰，并且深度依赖与 EHR 系统的集成。值得关注的公司包括 Abridge、Ambience、Nabla 等。

  

**这个市场已经出现价格竞争，** 已经有像 Nabla 以较低的价格（约 $100–$150/医生/月）进入市场，这大约是 Abridge 价格的一半 。一些低价供应商（如 Freed、Heidi、Corti）甚至以低于 $100/医生/月的价格入场，但这些供应商通常不提供系统集成，难以进入主流医疗系统 。

  

**集成能力还是定价关键， 深度集成 EHR（电子健康记录系统，如 Epic）是大型医疗系统的核心需求。** 这种集成能力需要成本投入，也是供应商定价能力的来源 。像 Abridge 与 Epic 深度集成，能够拥有一定的定价权（约 $250–$300/医生/月）。Nuance 的 DAX 产品价格更高（曾高达 $1,000–$2,000/医生/月，后降至 $400-$600/医生/月，且非 Epic DMO 用户需额外付费）。

  

**根据客户访谈，Abridge 的用户 Day90 留存率在提高，从初期的 60% 上升到 75% 左右。** 对于终端医生来说，更换供应商的感知可能不强，因为使用流程（启动录音 -> 记录同步）基本一致 。 而管理层更关注整合成本，倾向于选择“少而强”的供应商，以减少 EHR 对接和厂商管理的负担。 **所以新的供应商需要同时做到提供更优的集成、更低的价格、更强的住院场景能力** 或独特功能，才可能引发客户更换供应商 。而 Ambience 以专科笔记质量高、准确率高，同时提供还能生成患者教育材料 、支持“建议诊断”和“建议编码”、多语言翻译等功能而获得了显著的市场份额。

  

**Case Study**

  

**Abridge**

**•** **背景：** 创始人兼 CEO 是 Shivdev Rao 博士，是一名执业心脏病医生，本科毕业于 CMU，此后在匹兹堡大学医学中心 （UPMC） 的心脏和血管研究所担任教授。

  

**•** **产品：** 提供基于 ASR（自动语音识别）和生成式 AI 的临床对话记录和笔记生成解决方案。核心优势在于 **与 Epic 等主流 EHR 系统的深度无缝集成，** 允许医生在原有工作流中轻松使用（如通过 Epic 移动端录音，在 PC 端直接编辑 AI 生成的 SOAP 笔记）。实时生成、附带原文证据引用、自动摘要是关键特性。也关注患者端，提供医嘱回顾。

  

**•** **商业模式与进展：** B2B 模式，向医疗系统销售。凭借卓越的产品体验和与 Epic 的整合，实现了快速客户拓展。近期完成两轮共 1.8 亿美元融资，估值据传将达 25 亿美元，是 LLM 在医疗应用领域的明星公司。

  

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

  

**Ambience**

**•** **产品：** 医疗临床医生人工智能助理，提供了一款符合 CDI 规范的 **人工智能医疗记录器** ，可通过环境语音识别自动记录临床记录。它减轻了 **EHR 文档** 的管理负担，无缝集成 EHR 系统。

  

**•** **创始团队：** 两人同时是 Remedy 的创始团队。Co-founder & 首席科学家 Nikhil Buduma 专注于深度学习、人工智能和医疗保健领域。Co-founder & CEO Michael Ng 曾在 Morgan Stanley、Calera Capital 工作。

  

**•** **融资：** 20 年创立，已在三轮融资中筹集了总计 7630 万美元的资金，2024 年 2 月 6 日由 Kleiner Perkins 和 OpenAI 的 Startup Fund 领投的 B 轮融资中筹集了 7000 万美元，投资者包括 Andreessen Horowitz， Kleiner Perkins， Liquid 2 Ventures， Optum Ventures， OpenAI Startup Fund。

  

**Nabla**

**•** **产品：** Nabla Copilot 可以帮助临床医生减少行政事务，2025 年 2 月 13 日新增 Nabla Dictation，这是一款语音转文本解决方案，旨在进一步简化超过 55 个专科的临床工作流程。Nabla 的多 EHR 方案已在广泛的 EHR 群体中得到应用。

  

**•** **商业模式：** 并被 100 多个组织的 50,000 多名临床医生使用。

  

**•** **创始团队：** 创始人 & CEO 首席执行官 Alex Lebrun ，拥有超过二十年的人工智能产品开发经验，其旗下公司已被 Nuance （VirtuOz） 和 Facebook （Wit.ai） 收购；创始人 & COO Delphine Groll 和创始人 & CTO Martin Raison 。医学博士、公共卫生硕士 Ed Lee 曾任 Permanente Federation 的首席信息官，最近加入 Nabla 担任首席医疗官。

  

**•** **融资：** 2018 年成立，法国巴黎欧洲初创公司，已累计融资 4470 万美元 ，最近一轮融资是 2024 年 1 月 5 日由全球风险投资公司 Cathay Innovation 领投的 3000 万美元（2200 万欧元） B 轮融资。

  

**Freed.ai**

**•** **产品：** AI 抄写员可在患者就诊期间自动完成整个医疗记录过程，为临床医生每天节省大约 2 小时的记录时间。Freed 采用直接面向临床医生的商业模式，拥有超过 17,000 名付费用户。

  

**•** **创始团队** ：由 Erez Druk （CEO）和 Andrey Bannikov （CTO）于 2023 年初创立，Erez Druk 是一位前 Meta 工程师，受到妻子的医生经历的启发。Andrey 是一位顶尖的 0.1%技术专家。他来自俄罗斯，曾参加过高难度的编程和数学竞赛。他在 Meta 工作了 10 年，解决了一些世界上最棘手技术难题。

  

**•** **融资：** 迄今为止共筹集了 3400 万美元 ，其中包括 2025 年 3 月由红杉资本领投的 3000 万美元 A 轮融资 ，Scale Venture Partners、Daniel Gross、Gokul Rajaram 和 Ted Zagat 也参与其中。

  

**Diagnosis Copilot AI 诊断支持**

  

随着医学知识的更新速度日益加快，医生在临床一线所面对的判断压力也持续上升。传统的查阅指南或搜索文献方式，往往难以满足他们在诊断过程中对“快速、个性化、高精度”信息的需求。Diagnosis Copilot 是一类为医生设计的实时诊断辅助系统，借助大型语言模型、临床知识图谱以及交互式界面，将“信息获取”到“临床决策”之间的路径重新构建得更智能、更高效。

  

目前这一赛道的参与者大致可以分为两类：一类是 **专注为医生提供诊断建议或信息检索能力的工具型产品，** 如 Open Evidence、Glass Health，它们更像医生手边的“智能助手”；另一类则是 **将 AI 诊断能力与完整医疗服务打包交付的平台型公司** ，如 Ada Health、K Health，直接为患者提供闭环式的在线问诊与初筛服务。

  

**Case Study**

  

**OpenEvidence**

**•** **背景：** 由哈佛背景的连续创业者 Daniel Nadler 于 2021 年创立，2025 年 2 月宣布 A 轮获红杉 7500 万美元投资，估值 10 亿美元。

  

**•** **产品：** 面向医生的 AI Chatbot/ Deepresearch。特点包括：回答附带引用文献、提供“指南”和“证据”双模式、智能推荐后续问题。功能涵盖症状分析、诊断建议、治疗方案推荐、药物对比、指南查询、行政文档（如授权信）生成、临床计算器等。还提供文献摘要功能。

  

**•** **商业模式与策略：** 采用 **面向 C 端医生免费** 的策略，通过 **口碑实现病毒式增长** （已覆盖美国 20-25%医生）。主要通过 **精准广告** （药企、器械商）变现。这种独特的增长和变现模式在 Chatbot 产品中比较罕见。

  

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

OpenEvidence 网页版主界面

  

**Glass Health**

**•** **产品：** 提供 AI 临床决策支持平台，包括聊天机器人， **为临床医生服务** ，根据患者摘要制定鉴别诊断和临床计划。可无缝集成到现有的 EHR 系统中，也包括从 EHR 系统中获得数据。临床医生可以使用人工智能聊天机器人从符合最新临床指南的患者数据中获得实时洞察、预测见解，加快临床决策过程。新功能更新频率高，最近推出了三个新的 AI 临床文档功能：1）H&P 注释；2）进度记录；3）出院总结。

  

**•** **创始团队** ：Co-founder & CEO Dereck Paul 医学博士，Co-founder & CPO Graham Ramsey。

  

**•** **融资** ： YC W23，成立于 21 年，共融资 700 万美元，最近一轮融资为 2023 年 9 月 11 日 500 万美元的种子轮，投资者包括 Y Combinator、Initialized Capital、Breyer Capital、Breyer Labs、Tom X Lee。成功入选 2024 年 Google for Startups Accelerator: AI First。

  

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

  

**Medical Imaging & Pathology**

  

医学影像一直是 AI 最早进入医疗领域的应用场景之一。随着影像数据的爆炸式增长，以及诊断精度要求的不断提升，依赖人工判读已难以满足临床效率和准确性的双重需求。以美国为例，现有约 3 万名放射科医师，以及数量庞大的技师团队，日常要处理从 X 光、CT 到 MRI 等不同模态的大量图像数据。AI 在这一过程中，正逐步成为医生的重要助手——帮助筛查、标注、生成摘要，提高诊断速度与一致性。

  

目前，许多 AI 影像产品聚焦在放射科和病理科等“数据密集型”科室，利用多模态 AI 模型，对 X 光、CT、MRI 以及病理切片等图像进行分析，辅助医生做出更快更准确的判断。这类产品的价值，正逐渐从单点诊断效率提升，延伸到科研数据支持与药企合作等更高阶的应用场景。代表性公司包括 Rad AI、Modella AI 和 Aidoc 等。

  

**影像 AI 作为医疗 AI 中最早成熟的应用方向之一，发展已趋于常规化，行业进入标准化和规模部署阶段。新突破来自于大语言模型对多模态理解能力的增强：** 不再只是对图像进行判断，而是能够跨模态整合图像、文本、结构化数据，共同辅助医生做出更复杂的决策。这一演进趋势，正在推动影像 AI 从“工具”走向“决策伙伴”的下一阶段。

  

**Case Study**

  

**Rad AI**

**•** **产品：** 面向医院和影像中心的放射科医生和放射科 。Rad AI 使用 AI 从 **语音听写** 和 **图像数据** 中转录并生成放射学报告，减少放射科医生花在文档上的时间，使他们能够更加专注于图像解释和患者护理。

  

**•** **创始团队：** Dr. Jeff Chang，美国历史上最年轻的放射科医生，拥有超过 10 年的急诊放射科医生经验，专攻肌肉骨骼 MRI，并在机器学习领域有深入研究；Doktor Gurson，连续创业者，拥有 20 多年科技创业经验，曾创办多家公司并参与多次收购，具备深厚的技术和投资背景。

  

**•** **融资情况：** 18 年成立，累计融资总额超过 1.4 亿美元。C 轮融资（2025 年 1 月）：完成 6000 万美元融资，由 Transformation Capital 领投，现有投资者 Khosla Ventures、World Innovation Lab、UP2398、Kickstart Fund、OCV Partners、Cone Health 等跟投，公司估值达到 5.25 亿美元。

  

**Modella AI**

**•** **定位：** 专注于 **病理学** 领域的多模态生成式 AI。2024 年从哈佛医学院和麻省总医院（Mass General Brigham）的 Mahmood 实验室分拆出来。

  

**•** **产品：** 1） **PathChat:** 面向病理医生的 AI Copilot，支持自然语言与病理图像交互（识别、报告、标注等）。 **临床版本 PathChat DX 获 FDA 突破性医疗器械认定。** 2） **Judith:** 面向科研的 AI Agent，执行图像分析、生物标志物识别、预后建模等任务。

  

**•** **技术：** 基于视觉-语言模型，整合图像与文本理解能力。

  

**•** **商业模式：** SaaS 订阅、与药企/研究机构战略合作（算法定制、biomarker 标志物挖掘）。

  

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

  

**AI Nurse 患者互动沟通**

  

AI Nurse 是 GenAI 在医疗场景中最接近“数字员工”形态的应用之一。在全球范围内，医护资源紧张一直是医疗系统面临的长期结构性挑战。以美国为例，预计到 2030 年，全国护士缺口将超过 100 万人。 **“数字护士”** （AI Nurse），正加速进入临床一线的非诊断性护理场景，应用于术前宣教、慢病管理、用药提醒、心理支持等任务，替代部分重复性强、劳动密集的人工操作，同时保证服务质量标准化、压缩响应时间，控制整体运营成本。

  

AI Nurse 之所以市场空间可观，有以下原因：

  

**•** **重复性护理任务的自动化：** AI 可以工作 7/24，承担大量标准化、流程化的任务，降低服务成本；

**•** **LLM 和 Voice Agent 的发展提升了自然度；**

**•** **合规落地门槛较低：** 非诊断性护理属于“辅助交互”角色，当前在监管上更容易获得通过，也更容易被医疗系统所接受。

  

**Case Study**

  

**Hippocratic AI**

**•** **背景与使命：** 由医疗行业连续创业者创立，强调安全为先，目标是解决医护短缺。

  

**•** **产品：** 核心是安全性优化的医疗 LLM Polaris，驱动 AI Agent 通过电话与患者进行非诊断性交互（如术前指导、慢病管理、用药提醒、预约确认等）。系统包含 ASR、LLM、TTS，并支持无代码定制 Agent。

  

**•** **商业模式与定价：** B2B2C 模式，向医疗机构提供服务。定价极具竞争力（约$10/小时），远低于美国注册护士时薪（约$45/小时），成本优势显著。

  

**•** Hippocratic AI 共完成五轮融资，总额约 2.78 亿美元，投资机构包括 General Catalyst、Andreessen Horowitz、Premji Invest、Kleiner Perkins、NVIDIA 的 NVentures 等，最新 B 轮（2025 年 1 月）融资金额 1.41 亿美元，估值达 16.4 亿美元。

  

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

  

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

  

**面向消费者的 AI**

**（Consumer-facing AI）**

  

该部分的公司主要专注 C 端的个人健康伴侣、聊天机器人、教练。

  

**Livv**

**•** **产品：** 从 **病历** 入手，构建未来健康伴侣。该公司致力于打造一个全球人工智能驱动的健康记录平台，将零散的医疗数据和可穿戴设备信息汇总成一份单一、全面且持续更新的 **健康记录** ——通常被称为 **“医疗简历”** 。这份统一的记录使患者能够掌控自己的健康数据，并促进更明智、更主动、更个性化的医疗保健。

  

**•** **创始团队：** 由 Sverre Sundsdal 和 Ishita Barua 于 2023 年挪威创立。Co-founder & CEO Sverre Sundsdal 拥有二十年的产品开发和人工智能领导经验，曾担任 Babylon Health 的人工智能工程主管，并在 Google、Schibsted、Telenor 和 Oda 工作过。 Co-founder & 首席健康 AI 官 Ishita Barua 是一名拥有医学 AI 博士学位的医生， *《人工智能拯救生命》* 一书的作者，并在德勤领导医疗保健领域的 AI 工作。

  

**•** **融资：** 已筹集 140 万欧元，最近一轮即 2024 年 6 月 24 日 140 万欧元种子轮前，投资者包括 Inventure 、 byFounders 、 Calm/Storm Ventures。

  

**Meeno**

**•** **产品：** 关系 AI 聊天机器人。Meeno 是一款由生成式人工智能驱动的人际关系指导应用，旨在帮助用户掌握社交联系，改善与朋友、家人、同事和约会对象之间的关系。它将自己定位为 **“私人导师”** ，而非虚拟伴侣或治疗师。

  

**•** **商业模式与进展：** 计划于 2023 年底在美国、英国、加拿大、澳大利亚、新西兰、挪威、瑞典和荷兰发布 iOS 应用程序。截至 2024 年初，Meeno 在测试阶段已被约 90,000 人使用，随着该应用扩展到美国、英国、加拿大、澳大利亚、新西兰、挪威、瑞典和荷兰等多个国家/地区，用户群还在不断增长。

  

**•** **创始团队：** Renate Nyborg，曾任 Tinder 首席执行官、Apple 和 Headspace 高管。灵感来源于 Renate 在 Tinder 目睹年轻用户孤独的经历。

  

**•** **融资：** 共融资 500 万美元，由 Sequaio Capital 领投的种子轮融资 390 万美元，吴恩达的 AI Fund 和 NEA 也参与其中。

  

**AI 医疗基础设施的重构机会**

  

Healthcare infra 是整个体系运行的基石。它支撑核心运营（如预约、账单、理赔等），实现数据交互与互操作性（如不同系统之间共享数据）以及处理金融交易。随着 LLM 的应用，Healthcare infra 中的多个“重复、高度依赖人工”的模块是 AI/LLM 应用密集区。

  

我们重点关注的两个机会高密度区域是：

  

**1）医疗计费与保险**

  

这是目前 AI 应用最成熟、商业化进展最快的场景之一。保险理赔、预授权、账单生成和编码等流程历来依赖大量人工处理，不仅流程复杂、接口标准不一，还直接影响着医院的收入流转和资金回收。在这个环节，AI Agent 与大型语言模型的角色是充当一名全天候的“自动对接人”，高效地与保险公司沟通、确认信息、执行重复流程，最终显著提升财务运营效率。

  

这一方向有非常鲜明的产业化特征：

**•** **ROI 明确：** 直接节省人力、提高收入回收效率；

**•** **决策人清晰：** 由财务或 RCM（Revenue Cycle Management）团队主导采购；

**•** **使用频率高：** 每位患者、每次服务都涉及到验证与理赔。

  

以 Infinitus 为例，一家专注于 **福利验证（Benefits Verification）的 AI 公司，其产品以 SaaS 形式交付，集成到医院现有的 RCM 系统中，主要作用是在患者入院或预约前，快速核实其保险覆盖情况、自付额度和授权状态。**

  

**为什么这一方向具备强可复制性？**

**•** **价值明确：** 解决的是“没有验证→被拒付”这样的直接收入问题；

**•** **流程高频：** 每一个就诊环节都需要福利验证；

**•** **部署简单：** 以 API 或 voice agent 接口形式集成，无需改动医院核心系统；

**•** **付费能力强：** 客户愿意为更快、更准确的流程支付合理订阅费；

**•** **渠道可扩展：** Infinitus 既可直接销售，也可以通过大型 RCM 平台（如 R1、Optum、Change Healthcare）打包进入医院，降低销售摩擦。

  

在医疗 AI 领域，像 Infinitus 这样的产品形态正在成为一类典型模式：不是替代医生，也不是改变临床路径，而是从“财务-流程-收益”三角中，切入医院最核心的运营节点，是当前 AI 技术在 B2B 医疗中实现可规模化落地的关键路径之一。

  

**Case Study**

**Infinitus**

**•** **产品：** **构建专为支付方、医院、患者之间流程沟通的语音 AI 平台，替代繁琐的人工 IVR 和电话交互。** 其 AI Agent 和 co-pilot 可以导航 IVR 系统、等待接听，并执行与理赔处理、预授权、福利验证和处方跟进相关的复杂呼叫。

  

**•** **商业化与进程：** 已经完成了超过 500 万笔交易和超过 1 亿分钟的对话。

  

**•** **创始团队：** Co-founder & CEO Ankit Jain，连续创业者和前谷歌工程负责人 ；Co-founder & CTO Shyamsundar Rajagopalan。

  

**•** **融资：** 23 年成立于旧金山。总融资额为 1.029 亿美元，近期于 2024 年 10 月 23 日完成了 5150 万美元 C 轮融资 ，使其投后估值达到 6 亿美元。领投方包括 Andreessen Horowitz、Coatue、google 风投、凯鹏华盈和 Memorial Hermann Health System。

  

**Alaffia**

**•** **产品：** 为健康保险方提供 AI 驱动的索赔预审平台，结合 AI 与临床知识图谱，提升审查效率，降低支付误差。

  

**•** **创始团队：** Co-Founder & CEO TJ Ademiluyi；co-founder and coo Adun Akanni。

  

**•** **融资：** 共融资 1660 万美元，最新一轮为截至 2024 年 4 月 24 日的 1000 万美元种子轮。投资者包括 Plug and Play、Anthemis、FirstMark、Aperture Venture Capital、1984 Ventures。

  

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

  

**2）Clinical datasets**

训练医疗 AI 和 LLM 的基础是大量合规、高质量的临床数据，而当前数据仍呈现“低可得性 + 非结构化”的状态。这类公司为训练医疗 LLM 提供高质量数据（真实或合成）。

  

这类平台占据“AI 模型数据供给侧”位置，未来可拓展至 AI model-as-a-service、合成 cohort 构建、甚至作为 Pharma R&D 的基础设施层。

  

**Case Study**

  

**Unlearn**

**•** **产品：** 利用 Gen AI 能创建 **临床试验参与者的数字孪生。** 这些合成对照可以模拟患者结果，从而实现规模更小、速度更快的试验。其应用领域包括神经退行性疾病和肿瘤学。

  

**•** **创始团队：** 创始人兼首席执行官 Charles Fisher 生物物理学博士，毕业于哈佛大学。

  

**•** **融资：** 成立于 2017 年，已在 7 轮融资中筹集了总计 1.349 亿美元的资金 。 他们最近一次融资是在 2024 年 2 月 8 日的 C 轮 5000 万美元，投资者包括 Whittington Ventures、Radical Ventures、DCVC Bio、DCVC、8VC、Insight Partners、EPIC Ventures、Mubadala Capital、Necessary Ventures、Altimeter Capital。

  

**Topography**

**•** 是一家旨在提升 clinical trial 可及性与效率的医疗基础设施初创公司。将社区医疗机构（community-based practices）转化为可参与临床试验的节点，从而打破当前试验集中于学术医疗中心的局限，推动临床研究“下沉”至基层。同时利用 AI 优化患者筛选、流程自动化及数据整合，提升整体效率。

  

**•** **创始团队：** Alexander Saint-Amand 曾任 GLG CEO，擅长搭建专家网络。Topography 借鉴类似模式，致力于构建覆盖广泛、标准化的“临床试验网络”，推动研究基础设施的系统性重构。

  

**•** **融资：** 已筹集 2735 万美元资金，其中包括由 Andreessen Horowitz 和 Bain Capital Ventures 领投的 2022 年 1 月 9 日的 A 轮融资中的 2150 万美元。

  

  

  

**03.**  

  

**创业团队** **正在把 Agent**

**带进每个诊所和系统**

  

YC W25 批次的公司有很多医疗健康领域的 AI 和自动化应用，从 patient-facing 和 Infra 两个维度来看：

  

**Patient-Facing：** 聚焦在患者互动、诊疗辅助、分诊沟通等场景，提升用户体验或优化前线服务效率：

  

**•** **Paratus Health：** AI 驱动的患者分诊系统，提升挂号与导诊效率

• **Mecha Health：** 医学影像分析，用于辅助诊断或病灶识别

**•** **Vocality Health：** 实时医疗翻译，改善多语种患者的交流障碍

**•** **Uncommon Therapeutics：** AI 辅助新药发现，偏生物技术导向

**•** **Amby Health：** 优化救护车调度服务，提升急救响应效率

  

**Infra：** 聚焦于诊所、保险公司、医院等 B 端机构，推动医疗运营、合规、支付等环节的自动化和数据化：

  

**•** **Tire Swing：** 医疗合规自动化，降低审计和违规风险

**•** **Egress Health** **：** 收入周期管理，提升诊所理赔与回款效率

**•** **Rada：** 保险理赔流程自动化，减少人工审核和错误率

**•** **YouShift：** 医生排班自动化，解决人力资源配置瓶颈

**•** **Toothy AI：** 牙科诊所管理系统，支持账单、预约、库存等功能

**•** **HealthKey：** 临床试验患者识别系统，连接患者与研究机构

  

**Case Study**

  

**Tire Swing**

**•** **产品：** AI 驱动的医疗合规服务，通过构建联邦和州法规库，帮助医疗公司解答合规问题、评估政策并在法规变化时建议更新。

  

**•** **创始团队：**

Lucas Irvine (Instacart, Capital One; 普林斯顿大学 CS）

Paul Witten (Stroz Friedberg; 普林斯顿大学 CS）

  

**Egress Health**

**•** **产品：** AI agent 自动化牙科诊所收入周期管理，处理保险验证和计费，已扩展至数十个地点，处理 1400 万美元报销款，减少 1-2 名员工并提升 5-15%收入。

  

**•** **创始团队：**

Matthew Kiflu （哈佛大学）

Alex Pedersen （微软， 哈佛大学 CS）

  

**YouShift**

**•** **产品：** 自动化医生排班系统，结合医院规则与个人偏好生成无冲突排班表，减少职业倦怠，支持实时更新。

  

**•** **创始团队：**

Jota Chamorro （哈佛大学 CS）

Adolfo Roquero Gimenez （谷歌， 哈佛大学 CS）

Lucía Vives Martorell （哈佛大学生物医学科学）

  

**HealthKey**

**•** **产品：** AI 根据临床试验标准预筛选患者，集成多种 EHR 系统，协助医生识别符合条件的患者并增加收入。

  

**•** **创始团队：**

Josh Sabol (AWS, Plate IQ)

  

**Amby Health**

**•** **产品：** AI copilot 为救护车机构自动化计费和质量审查，分析患者报告并优化流程，取代手动操作。

  

**•** **创始团队：**

Yos Wagenmans （MIT 辍学， Meta）

Timmy Dang （MIT 辍学， Amazon）

  

**Toothy AI**

**•** **产品：** 符合 HIPAA 的 AI agent 为牙科诊所自动化保险验证和计费，覆盖整个收入周期。

  

**•** **创始团队：**

Johnny Chen （福特， 软银支持初创）

Tejas K （医疗 AI 经验）

Matt Kerrigan (Trunk Club, Salezilla)

  

**Rada**

**•** **产品：** AI 语音 agent 为医疗诊所自动化保险电话，集成管理系统，处理患者资格和预授权。

  

**•** **创始团队：**

Patrick Foster (Netflix, GoDaddy)

  

**Paratus Health**

**•** **产品：** AI 分诊护士进行预约前患者访谈，提供结构化临床总结，提升医生效率并减少误诊。

  

**•** **创始团队：**

Pablo Bermudez-Canete （斯坦福大学 CS-AI）

Tannen Hall （斯坦福大学 CS-AI）

  

**Mecha Health**

**•** **产品：** 使用基础模型自动化 X 射线分析，将放射科医生读片速度从 1 小时 1 次提升至 5 分钟 1 次。

  

**•** **创始团队：**

Ahmed Abdulaal （帝国理工学院 MD， UCL 博士）

Hugo Fry （剑桥大学数学与物理）

Ayodeji Ijishakin （UCL 博士候选人）

Nina Montaña Brown （UCL 博士， 医疗技术工程师）

  

**Vocality Health**

**•** **产品：** AI 驱动的医院翻译平台，提供实时、临床安全的翻译服务，集成现有系统。

  

**•** **创始团队：**

Brogan McPartland （哈佛大学 CS， Fulltrack AI）

Vivek Jayaram （哈佛大学 CS， Second Spectrum）

  

**Uncommon Therapeutics**

**•** **产品：** 生物技术公司开发严重遗传疾病疗法，针对雷特综合征设计潜在价值数十亿美元的联合治疗。

  

**•** **创始团队：**

Noah Auerhahn （连续创业者， 雷特综合征研究投资）

Ryan Lim （生物技术企业家， UCI 研究员）

  

  

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E) ![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

  

排版：Doro

延伸阅读

  

[![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)](https://mp.weixin.qq.com/s?__biz=Mzg2OTY0MDk0NQ==&mid=2247512957&idx=1&sn=da563a8b6596ef1464c9993219cac3af&scene=21#wechat_redirect)

o3 深度解读：OpenAI 终于发力 tool use，agent 产品危险了吗？

  

[![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)](https://mp.weixin.qq.com/s?__biz=Mzg2OTY0MDk0NQ==&mid=2247512861&idx=1&sn=9aef295be30dc91fbeafa391c31885cf&scene=21#wechat_redirect)

OpenAI：computer use 处于 GPT-2 阶段，模型公司的使命是让 agent 产品化

  

[![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)](https://mp.weixin.qq.com/s?__biz=Mzg2OTY0MDk0NQ==&mid=2247512817&idx=1&sn=9458f5df92bbdba210b9abafc77afde6&scene=21#wechat_redirect)

代码即界面：生成式 UI 带来设计范式重构

  

[![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)](https://mp.weixin.qq.com/s?__biz=Mzg2OTY0MDk0NQ==&mid=2247512752&idx=1&sn=48839c24a35e6e5094e8022a599989ac&scene=21#wechat_redirect)

Deep Research 类产品深度测评：下一个大模型产品跃迁点到来了吗？

  

  

[![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)](https://mp.weixin.qq.com/s?__biz=Mzg2OTY0MDk0NQ==&mid=2247512371&idx=1&sn=18a739c12c028fd9748d12f9eab50551&scene=21#wechat_redirect)

B2B 场景下的 AI 客服，Pylon 能否成为下一个 Zendesk?

收录于 AI Agent 为什么

继续滑动看下一个

海外独角兽

向上滑动看下一个