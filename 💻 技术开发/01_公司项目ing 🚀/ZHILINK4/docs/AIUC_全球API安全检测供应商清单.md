# AIUC 全球 API 安全检测供应商清单（仅含可编程 API/SDK 接入）

用途：为 AIUC/智评AI、ZHILINK4 的技术检测与合规评估提供“可编程、安全测试”能力来源。仅收录提供公开 API/SDK 或明确支持系统集成的供应商/平台/工具，并按赛道归类。价格以官网为准（随版本与地区波动）。

标注说明：
- 接入方式：REST API、SDK（Python/JS/Go 等）、CI/CD 插件、Webhook
- 认证方式：API Key / OAuth2 / 云账户鉴权
- 费用：如未公开，标“联系销售/Enterprise”；附“定价/价格”或“产品”页面链接

---

## 1) LLM/AI 专用安全与内容安全（提示注入/越狱/不当内容/偏见鲁棒）

- Lakera Guard（LLM安全网关）
  - 接入方式：REST API、SDK（Python/JS）、代理/中间件
  - 文档/产品：[Lakera Guard](https://www.lakera.ai/guard)
  - 费用：联系销售（企业版）

- Azure AI Content Safety（微软）
  - 接入方式：REST API、SDK（Python/JS/.NET/Java），Azure 资源集成
  - 文档/产品：[Azure AI Content Safety](https://learn.microsoft.com/azure/ai-services/content-safety/)
  - 定价：[Pricing](https://azure.microsoft.com/pricing/details/ai-services/)

- OpenAI Moderation / Safety APIs
  - 接入方式：REST API、SDK（Python/JS）
  - 文档/产品：[OpenAI API docs](https://platform.openai.com/docs)
  - 定价：[Pricing](https://openai.com/pricing)

- Google Vertex AI Safety Filters（谷歌）
  - 接入方式：Vertex AI REST/gRPC API、SDK（Python/JS/Java），Safety Filters 配置
  - 文档/产品：[Vertex AI Safety](https://cloud.google.com/vertex-ai/docs/safety/overview)
  - 定价：[Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)

- AWS Bedrock Guardrails（亚马逊）
  - 接入方式：Bedrock API（REST/SDK），Guardrails 配置
  - 文档/产品：[Guardrails for Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)
  - 定价：[Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)

- Robust Intelligence（模型/LLM 验证）
  - 接入方式：API/SDK（企业接入）
  - 文档/产品：[Robust Intelligence](https://www.robustintelligence.com/)
  - 费用：联系销售

- HiddenLayer（ML 安全检测与防护）
  - 接入方式：API/SDK（企业接入）
  - 文档/产品：[HiddenLayer](https://hiddenlayer.com/)
  - 费用：联系销售

- CalypsoAI（模型安全与治理）
  - 接入方式：API/SDK（企业接入）、代理
  - 文档/产品：[CalypsoAI](https://www.calypsoai.com/)
  - 费用：联系销售

- Protect AI（模型供应链与安全）
  - 接入方式：API/SDK、CI/CD 集成
  - 文档/产品：[Protect AI](https://protectai.com/)
  - 费用：联系销售

---

## 2) Web/应用/接口安全测试（DAST 与 API Security）

- OWASP ZAP（开源 DAST）
  - 接入方式：REST API、CLI、Docker、自托管
  - 文档/产品：[ZAP API](https://www.zaproxy.org/docs/api/)
  - 费用：开源免费

- Burp Suite Enterprise（PortSwigger）
  - 接入方式：REST API、CI/CD 集成、自托管
  - 文档/产品：[Burp Enterprise](https://portswigger.net/burp/enterprise)
  - 费用：[Pricing](https://portswigger.net/burp/enterprise/pricing)

- StackHawk（API 优先 DAST）
  - 接入方式：REST API、CLI、CI/CD（GitHub/GitLab/CircleCI）
  - 文档/产品：[Docs](https://docs.stackhawk.com/)
  - 费用：[Pricing](https://www.stackhawk.com/pricing/)

- Invicti（原 Netsparker/Acunetix 家族）
  - 接入方式：REST API、CI/CD 插件、自托管/云
  - 文档/产品：[Invicti Platform](https://www.invicti.com/)
  - 费用：联系销售

- Wallarm（API 安全/WAAP）
  - 接入方式：REST API、边车/网关集成、云托管
  - 文档/产品：[Wallarm Docs](https://docs.wallarm.com/)
  - 费用：[Pricing](https://www.wallarm.com/pricing)

- Salt Security（API 安全）
  - 接入方式：API、SaaS/自托管、云集成
  - 文档/产品：[Salt Security](https://salt.security/)
  - 费用：联系销售

- Noname Security（API 安全）
  - 接入方式：API、SaaS/自托管、云集成
  - 文档/产品：[Noname Security](https://nonamesecurity.com/)
  - 费用：联系销售

---

## 3) 代码/依赖/配置安全（SAST/SCA/Secrets/IaC）

- GitHub Advanced Security / CodeQL
  - 接入方式：GitHub REST/GraphQL API、CodeQL CLI、Actions
  - 文档/产品：[CodeQL](https://codeql.github.com/)
  - 费用：[GitHub Enterprise/GHAS Pricing](https://github.com/enterprise)

- Snyk（SAST/SCA/IaC/Container）
  - 接入方式：REST API、SDK、CI/CD 集成
  - 文档/产品：[Snyk API](https://docs.snyk.io/snyk-api)
  - 费用：[Pricing](https://snyk.io/plans/)

- Veracode（SAST/SCA）
  - 接入方式：REST API、CI/CD Integrations
  - 文档/产品：[API Docs](https://docs.veracode.com/)
  - 费用：联系销售

- Checkmarx（SAST/IAST）
  - 接入方式：REST API、CI/CD 插件、自托管/云
  - 文档/产品：[Checkmarx Docs](https://checkmarx.com/resources/documentation/)
  - 费用：联系销售

- SonarQube / SonarCloud（SAST/质量门禁）
  - 接入方式：Web API、CLI、CI/CD 插件
  - 文档/产品：[Web API](https://docs.sonarsource.com/sonarqube/latest/extension-guide/web-api/)
  - 费用：[SonarQube](https://www.sonarsource.com/products/sonarqube/), [SonarCloud Pricing](https://sonarcloud.io/pricing)

- Sonatype Nexus IQ（SCA/策略门禁）
  - 接入方式：REST API、CI/CD、IDE 插件
  - 文档/产品：[Docs](https://help.sonatype.com/iqserver)
  - 费用：联系销售

- Mend（原 WhiteSource，SCA）
  - 接入方式：REST API、CI/CD 集成
  - 文档/产品：[Mend Docs](https://docs.mend.io/)
  - 费用：联系销售

- GitGuardian（Secrets/泄露检测）
  - 接入方式：REST API、CI/CD、VCS Webhook
  - 文档/产品：[API Docs](https://api.gitguardian.com/doc)
  - 费用：[Pricing](https://www.gitguardian.com/pricing)

---

## 4) 漏洞管理与主机/网络扫描（VM/VA）

- Qualys VMDR
  - 接入方式：REST API、云代理/扫描器
  - 文档/产品：[Qualys API](https://www.qualys.com/documentation/)
  - 费用：联系销售

- Tenable.io / Nessus
  - 接入方式：REST API、Scanner、CI 集成
  - 文档/产品：[Tenable Developer](https://developer.tenable.com/)
  - 费用：[Pricing](https://www.tenable.com/products/tenable-io/pricing)（地域/版本差异）

- Rapid7 InsightVM
  - 接入方式：REST API、Agents、CI/CD
  - 文档/产品：[InsightVM API](https://docs.rapid7.com/insightvm/)
  - 费用：[Pricing](https://www.rapid7.com/pricing/)

---

## 5) 云安全 posture/CNAPP/CSPM（多云）

- Wiz（CNAPP）
  - 接入方式：API、云账户集成（AWS/Azure/GCP）
  - 文档/产品：[Wiz Docs](https://docs.wiz.io/)
  - 费用：联系销售

- Prisma Cloud（Palo Alto）
  - 接入方式：REST API、Agentless/Agent、CI/CD
  - 文档/产品：[Prisma Cloud API](https://pan.dev/prisma-cloud/)
  - 费用：[Pricing/Contact](https://www.paloaltonetworks.com/prisma/prisma-cloud)

- Lacework（CNAPP）
  - 接入方式：REST API、多云集成
  - 文档/产品：[Lacework Docs](https://docs.lacework.net/)
  - 费用：联系销售

- Orca Security（Agentless CNAPP）
  - 接入方式：REST API、Agentless 云连接
  - 文档/产品：[Orca Docs](https://docs.orca.security/)
  - 费用：联系销售

- AWS Security Hub / Inspector / Config
  - 接入方式：AWS SDK/API，事件总线集成
  - 文档/产品：[Security Hub](https://docs.aws.amazon.com/securityhub/), [Inspector](https://docs.aws.amazon.com/inspector/)
  - 定价：[AWS Pricing](https://aws.amazon.com/pricing/)

- Google Security Command Center（SCC）
  - 接入方式：REST API、组织/项目级集成
  - 文档/产品：[SCC APIs](https://cloud.google.com/security-command-center/docs)
  - 定价：[Pricing](https://cloud.google.com/security-command-center/pricing)

---

## 6) 渗透测试/众测（PTaaS/Bug Bounty）

- HackerOne
  - 接入方式：REST API、Webhook、SIEM/工单集成
  - 文档/产品：[HackerOne API](https://api.hackerone.com/)
  - 费用：联系销售

- Bugcrowd
  - 接入方式：REST API、Webhook、CI/CD
  - 文档/产品：[Bugcrowd API](https://docs.bugcrowd.com/api/)
  - 费用：联系销售

- Cobalt.io（PTaaS）
  - 接入方式：REST API、Jira/Slack 集成
  - 文档/产品：[Cobalt API](https://docs.cobalt.io/)
  - 费用：联系销售

- Synack（PTaaS）
  - 接入方式：企业平台与集成（API 需商务）
  - 文档/产品：[Synack](https://www.synack.com/)
  - 费用：联系销售

---

## 7) 第三方/供应链风险评分

- SecurityScorecard
  - 接入方式：REST API、Webhook
  - 文档/产品：[Developers](https://securityscorecard.readme.io/)
  - 费用：联系销售

- BitSight
  - 接入方式：REST API
  - 文档/产品：[BitSight](https://www.bitsight.com/)
  - 费用：联系销售

- Panorays
  - 接入方式：REST API、问卷自动化
  - 文档/产品：[Panorays](https://panorays.com/)
  - 费用：联系销售

---

## 8) 攻击面/资产指纹与威胁情报（ASM/CTI）

- Censys ASM
  - 接入方式：REST API、查询语言
  - 文档/产品：[Censys API](https://search.censys.io/api)
  - 费用：[Pricing](https://censys.io/pricing/)

- Shodan
  - 接入方式：REST API、命令行
  - 文档/产品：[Shodan API](https://developer.shodan.io/)
  - 费用：[Pricing](https://account.shodan.io/billing)

- VirusTotal（Google）
  - 接入方式：REST API、文件/URL/情报查询
  - 文档/产品：[VT API](https://developers.virustotal.com/)
  - 费用：[Premium/Enterprise](https://www.virustotal.com/gui/pricing)（免费层有限制）

- Microsoft Defender EASM
  - 接入方式：API/Graph 集成（企业）
  - 文档/产品：[Defender EASM](https://learn.microsoft.com/security/defender-easm/)
  - 费用：联系销售

- Recorded Future / Mandiant Advantage / GreyNoise
  - 接入方式：REST API、馈源/集成
  - 文档/产品：[Recorded Future](https://support.recordedfuture.com/), [Mandiant](https://advantage.mandiant.com/), [GreyNoise](https://docs.greynoise.io/docs)
  - 费用：联系销售 / [GreyNoise Pricing](https://www.greynoise.io/pricing)

---

## 9) 数据敏感信息识别/脱敏（DLP/PII/令牌化）

- Google Cloud DLP
  - 接入方式：REST API/客户端库，批量与流式检测
  - 文档/产品：[Cloud DLP](https://cloud.google.com/dlp/docs)
  - 定价：[Pricing](https://cloud.google.com/dlp/pricing)

- AWS Macie
  - 接入方式：AWS SDK/API，S3 数据分类与隐私发现
  - 文档/产品：[Macie](https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html)
  - 定价：[Pricing](https://aws.amazon.com/macie/pricing/)

- Nightfall AI（SaaS DLP）
  - 接入方式：REST API、SDK、SaaS 连接器
  - 文档/产品：[Nightfall Docs](https://docs.nightfall.ai/)
  - 费用：[Pricing](https://nightfall.ai/pricing)

- VGS（Very Good Security，令牌化/代理）
  - 接入方式：Vault/Proxy API、SDK、网关
  - 文档/产品：[VGS Docs](https://www.verygoodsecurity.com/docs)
  - 费用：[Pricing](https://www.verygoodsecurity.com/pricing)

---

## 10) 容器/镜像与软件供应链安全

- Snyk Container
  - 接入方式：REST API、CLI、CI/CD 集成（K8s/Registry）
  - 文档/产品：[Snyk Container](https://docs.snyk.io/scan-with-snyk/container-security)
  - 费用：[Pricing](https://snyk.io/plans/)

- Anchore Enterprise
  - 接入方式：REST API、自托管
  - 文档/产品：[Anchore Docs](https://docs.anchore.com/)
  - 费用：联系销售

- Aqua Security（Aqua Platform / Trivy Enterprise）
  - 接入方式：REST API、CI/CD、K8s 集成
  - 文档/产品：[Aqua Docs](https://docs.aquasec.com/)
  - 费用：联系销售

- JFrog Xray（制品与依赖扫描）
  - 接入方式：REST API、CI/CD、Artifactory 集成
  - 文档/产品：[Xray REST API](https://jfrog.com/help/r/xray-rest-apis)
  - 费用：[Pricing](https://jfrog.com/pricing/)

---

## 实施建议（AIUC 流程映射）

- 需求与威胁建模：Censys/Shodan/VirusTotal + SecurityScorecard/BitSight
- 开发左移（CI/CD）：GitHub/CodeQL、Snyk、Sonar、GitGuardian、JFrog Xray
- 应用与接口联调：OWASP ZAP/StackHawk + Invicti/Burp Enterprise
- LLM/AI 能力上线前：Lakera/Azure Content Safety/OpenAI/Vertex/AWS Guardrails
- 云与资产合规：Wiz/Prisma/Lacework/Orca + AWS/GCP 原生
- 定期治理：Qualys/Tenable/Rapid7 VM + PTaaS（HackerOne/Bugcrowd/Cobalt）

> 备注：上表皆提供 API/SDK 或企业可编程集成途径；定价与配额常按扫描量/调用量/资产数/席位计费，建议按 AIUC 的“检测流水线”分阶段选型并 PoC 验证。







