# Spec Kit Scaffold for LaunchX Automation
#
# This directory提供统一的模板、脚本与结构约束，使任何客户项目都可以在“零干预”下完成初始化、文档生成与自动化任务编排。
#
## Structure
#
# ```
# automation/spec-kit/
# ├── README.md
# ├── bootstrap_client.py
# ├── templates/
# │   ├── constitution.md
# │   ├── spec.md
# │   ├── plan.md
# │   ├── tasks.md
# │   └── client-config.json
# └── projects/
# ```
#
# - `templates/`: Liquid 风格占位符模板 (`{{client_name}}` 等)。
# - `bootstrap_client.py`: 幂等脚本，按约定生成客户目录、渲染模板并输出 Claude 任务蓝本。
# - `projects/`: 可选 staging 目录，用于离线演练或归档脚本输出。
#
## Client Folder Contract
#
# 所有客户目录遵循同一结构，方便自动化脚本检索：
#
# ```
# clients/<client_slug>/
# ├── client-config.json        # 机器可读配置（语调、目标、任务参数）
# ├── strategy/                 # 品牌宪章、市场画像、调研洞察
# ├── execution/                # 任务编排、实施计划、验证方案
# ├── reports/                  # 周报、复盘、效果分析
# ├── logs/                     # 执行日志与异常明细
# ├── assets/
# │   └── generated/            # 生图、内容包、对外交付物
# └── data/
#     ├── intel/
#     └── drafts/
# ```
#
# Claude / Python 自动化流程默认读取 `client-config.json` 获取业务参数，再按需访问各子目录。
#
## Bootstrap Workflow
#
# 1. **准备配置**：编写 `<client>.json`，字段与 `templates/client-config.json` 保持一致。
# 2. **执行脚本**：
#    ```bash
#    python automation/spec-kit/bootstrap_client.py \
#      --client launch-x \
#      --config automation/spec-kit/configs/launch-x.json
#    ```
#    - 未提供 `--config` 时，脚本会生成带示例占位的模板，便于后续补充。
#    - 已存在文件默认跳过，支持幂等运行。
#
# 3. **自动化任务同步**：脚本会在 `automation/claude_tasks/<client_slug>.yaml` 生成 Claude 任务骨架；根据客户特定需求补充步骤后即可运行。
# 4. **运行全托管流程**：
#    ```bash
#    claude tasks run automation/claude_tasks/<client_slug>.yaml {{client_slug}}_automation
#    ```
# 5. **归档产出**：自动化脚本应将生成的内容、日志、报告写回上述约定目录，保持可追溯性。
#
## Tips
#
# - `bootstrap_client.py` 可反复运行，用于在模板扩展后批量补齐历史客户目录。
# - 将通用提示词、合规规则放在 `automation/shared/`（可自建），通过 templates 内的相对路径引用，确保所有客户共用最新规范。
# - 扩展模板字段后，需同步更新脚本中的占位符映射及示例配置，保证自动渲染不出差错。
