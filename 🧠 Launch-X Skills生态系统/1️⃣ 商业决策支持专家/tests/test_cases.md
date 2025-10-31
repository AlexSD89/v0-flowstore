# 商业决策支持专家 - 测试用例

## 测试环境配置

### 必需环境
- Python 3.8+
- Node.js (用于JavaScript工具函数)
- 网络连接 (用于市场数据验证)
- 1GB+磁盘空间

### 测试数据准备
```bash
# 创建测试目录
mkdir -p test_data/workspace
mkdir -p test_data/projects
mkdir -p test_data/reports
mkdir -p test_data/outputs
```

---

## 测试用例 1: 完整投资分析测试

### 测试目标
验证完整的投资分析流程：基础分析 → 市场分析 → 财务分析 → 风险分析 → 投资建议

### 测试输入
```json
{
  "project_name": "AI智能教育平台",
  "industry": "AI教育",
  "stage": "Pre-A轮",
  "team_size": 15,
  "mrr": 500000,
  "growth_rate": 0.15,
  "technology": "AI个性化学习",
  "target_market": "K12教育"
}
```

### 预期输出
```json
{
  "overall_score": 85,
  "investment_grade": "A",
  "investment_recommendation": "推荐投资",
  "confidence_level": "高",
  "risk_level": "中等",
  "execution_status": "SUCCESS"
}
```

### 验证点
- [ ] 所有分析步骤正常执行
- [ ] 评分在合理范围内 (60-100分)
- [ ] 投资建议逻辑清晰
- [ ] 风险评估全面
- [ ] 报告格式规范

---

## 测试用例 2: 不同行业项目分析测试

### 测试目标
验证不同行业项目的分析能力和适应性

### 测试场景
```yaml
SaaS软件项目:
  行业: "企业SaaS"
  阶段: "A轮"
  MRR: 100万元
  增长率: 20%
  预期评分: 80-90分

电商项目:
  行业: "电子商务"
  阶段: "B轮"
  月GMV: 500万元
  增长率: 25%
  预期评分: 75-85分

硬件项目:
  行业: "智能硬件"
  阶段: "种子轮"
  月销量: 1000台
  增长率: 30%
  预期评分: 70-80分
```

### 验证点
- [ ] 不同行业权重自动调整
- [ ] 行业基准对比正常
- [] 分析结果符合行业特点
- [ ] 评分模型适用性良好

---

## 测试用例 3: 风险评估测试

### 测试目标
验证风险评估功能的准确性和完整性

### 测试场景
```yaml
低风险项目:
  技术成熟度: "高"
  市场需求: "稳定"
  团队经验: "丰富"
  资金状况: "良好"
  预期风险等级: "低"

高风险项目:
  技术成熟度: "实验性"
  市场需求: "不确定"
  团队经验: "有限"
  资金状况: "紧张"
  预期风险等级: "高"

综合风险项目:
  多种风险并存
  部分风险可接受
  需要风险缓释措施
  预期风险等级: "中等"
```

### 验证点
- [ ] 风险因素识别准确
- [] 风险等级评定合理
- [ ] 风险量化数值准确
- [ ] 风险缓释建议实用

---

## 测试用例 4: ROI和财务分析测试

### 测试目标
验证投资回报率计算和财务分析功能

### 测试数据
```json
{
  "investment_scenarios": [
    {
      "initial_investment": 2000万,
      "projected_returns": [200, 500, 1000, 2000, 5000],
      "years": 5,
      "expected_roi": "150-250%"
    },
    {
      "initial_investment": 1000万,
      "projected_returns": [0, 200, 500, 1000, 2000],
      "years": 5,
      "expected_roi": "100-200%"
    },
    {
      "initial_investment": 500万",
      "projected_returns": [0, 0, 100, 300, 800],
      "years": 5,
      "expected_roi": "60-120%"
    }
  ]
}
```

### 验证点
- [ ] ROI计算准确
- [] IRR计算合理
- [] 回收期计算正确
- [ ] 财务模型评估全面

---

## 测试用例 5: 数据验证测试

### 测试目标
验证数据质量检查和数据验证功能

### 测试场景
```yaml
完整数据:
  所有必需字段完整
  数值类型正确
  格式规范
  预期结果: 验证通过

缺失数据:
  缺少关键字段
  数据不完整
  质量较差
  预期结果: 验证失败，提供明确提示

无效数据:
  数值类型错误
  负数金额或比例
  格式错误
  预期结果: 验证失败，标记具体错误
```

### 验证点
- [ ] 数据完整性检查
- [ ] 数据类型验证
- [ ] 数据范围检查
- [ ] 错误提示清晰明确

---

## 测试用例 6: 报告生成测试

### 测试目标
验证报告生成功能和输出质量

### 报告要求
```yaml
结构完整性:
  8段式结构完整
  所有章节都有内容
  逻辑顺序正确

内容质量:
  分析深度足够
  语言表达专业
  数据支撑充分
  建议具体可执行

格式规范:
  Markdown格式正确
  样式统一
  图表美观
  排版规范
```

### 验证点
- [ ] 报告结构完整
- [ ] 内容质量达标
- [ ] 模板变量替换正确
- [ ] 输出文件格式正确

---

## 测试用例 7: 边界条件测试

### 测试目标
验证系统在边界条件下的稳定性和容错能力

### 边界条件
```yaml
极小项目:
  团队规模: 1人
  MRR: 1000元
  预期处理: 正常分析，但降低评分权重

极大项目:
  团队规模: 1000人
  MRR: 1亿元
  预期处理: 正常分析，调整评估模型

极端增长率:
  月增长: 100%
  预期处理: 标记为异常增长，降低置信度

零增长项目:
  月增长: 0%
  预期处理: 标记为停滞风险
```

### 验证点
- [ ] 边界值处理正确
- [] 异常情况识别准确
- [] 系统不崩溃
- [ ] 错误处理机制有效

---

## 测试用例 8: 性能测试

### 测试目标
验证系统性能和响应时间

### 性能指标
```yaml
响应时间:
  简单分析: < 30秒
  复杂分析: < 120秒
  报告生成: < 60秒

资源使用:
  内存使用: < 1GB
  CPU使用: < 80%
  磁盘空间: < 100MB

并发能力:
  同时分析: 3个项目
  预期处理: 正常响应
```

### 验证点
- [ ] 响应时间达标
- [] 资源使用合理
- [] 并发处理稳定
- [] 性能指标一致

---

## 测试用例 9: 集成测试

### 测试目标
验证与其他Skills的协作能力

### 集成场景
```yaml
与企业研究分析师协作:
  输入: 企业深度分析数据
  预期结果: 增强企业分析维度
  验证: 数据整合和综合分析

与市场情报专家协作:
  输入: 市场情报数据
  预期结果: 市场环境分析增强
  验证: 市场洞察整合

与被投企业画像分析大师协作:
  输入: 企业画像数据
  预期结果: 投资画像完善
  验证: 数据一致性验证
```

### 验证点
- [ ] 数据共享机制正常
- [] 结果整合逻辑正确
- [ Skills间协同有效
- [] 综合分析质量提升

---

## 测试用例 10: 持续更新测试

### 测试目标
验证数据更新和持续监控功能

### 更新场景
```yaml
数据更新:
  定期更新市场数据
  动态调整分析模型
  预期处理: 分析结果自动更新

监控告警:
  关键指标异常检测
  风险变化预警
  机会识别提醒
  预期处理: 及时告警通知
```

### 验证点
- [ ] 数据更新机制正常
- [ ] 监控指标准确
- [ ] 告警触发及时
- [ ] 持续改进有效

---

## 自动化测试脚本

### Python测试脚本
```python
#!/usr/bin/env python3
import sys
import os
sys.path.append('scripts')

from main import BusinessDecisionSupportExpert
import json
import time

def run_test_case(test_name, test_input, expected_output):
    """执行单个测试用例"""
    print(f"执行测试: {test_name}")

    try:
        # 创建专家实例
        expert = BusinessDecisionSupportExpert(test_input['project_name'])

        # 执行分析
        start_time = time.time()
        result = expert.analyze_project(test_input)
        execution_time = time.time() - start_time

        # 验证结果
        success = validate_result(result, expected_output, execution_time)

        print(f"测试结果: {'通过' if success else '失败'}")
        print(f"执行时间: {execution_time:.2f}秒")
        print("-" * 50)

        return success

    except Exception as e:
        print(f"测试异常: {str(e)}")
        return False

def validate_result(result, expected, execution_time):
    """验证测试结果"""
    # 检查执行状态
    if not result.get('analysis_results'):
        return False

    # 检查执行时间
    if execution_time > expected.get('max_time', 120):
        return False

    # 检查核心指标
    overall_score = result.get('analysis_results', {}).get('overall_score', 0)
    if overall_score < expected.get('min_score', 60):
        return False

    # 检查投资建议
    recommendation = result.get('analysis_results', {}).get('investment_recommendation', {})
    if not recommendation.get('recommendation'):
        return False

    return True

def run_all_tests():
    """运行所有测试用例"""
    test_cases = [
        ("完整投资分析测试", {
            'project_name': 'AI智能教育平台',
            'industry': 'AI教育',
            'stage': 'Pre-A轮',
            'team_size': 15,
            'mrr': 500000
        }, {
            'min_score': 75,
            'max_time': 90
        }),

        ("SaaS项目分析测试", {
            'project_name': '企业CRM平台',
            'industry': '企业SaaS',
            'stage': 'A轮',
            'team_size': 30,
            'mrr': 1000000
        }, {
            'min_score': 70,
            'max_time': 90
        })
    ]

    passed = 0
    total = len(test_cases)

    for test_name, test_input, expected in test_cases:
        if run_test_case(test_name, test_input, expected):
            passed += 1

    print(f"测试总结: {passed}/{total} 通过")
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
```

### Shell测试脚本
```bash
#!/bin/bash

# 商业决策支持专家测试脚本

echo "开始执行测试套件..."

# 环境检查
check_environment() {
    echo "检查测试环境..."

    # 检查Python版本
    if ! command -v python3 &> /dev/null; then
        echo "错误: Python 3未安装"
        exit 1
    fi

    # 检查必要文件
    required_files=("scripts/main.py", "resources/data/investment-analysis-config.json")
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            echo "错误: 缺少必要文件 $file"
            exit 1
        fi
    done

    echo "环境检查通过"
}

# 创建测试数据
setup_test_data() {
    echo "准备测试数据..."
    mkdir -p test_data/workspace
    mkdir -p test_data/outputs

    # 创建测试项目数据
    cat > test_data/sample_project.json << 'EOF
{
    "project_name": "测试AI项目",
    "industry": "AI技术",
    "stage": "Pre-A轮",
    "team_size": 20,
    "mrr": 800000,
    "growth_rate": 0.18
}
EOF

    echo "测试数据准备完成"
}

# 清理测试数据
cleanup_test_data() {
    echo "清理测试数据..."
    rm -rf test_data
    echo "清理完成"
}

# 执行测试
run_tests() {
    echo "执行自动化测试..."

    # 运行Python测试
    if python3 scripts/test_runner.py; then
        echo "✅ Python测试通过"
    else
        echo "❌ Python测试失败"
        return 1
    fi

    # 运行功能测试
    if python3 scripts/main.py "测试项目" --dry-run; then
        echo "✅ 功能测试通过"
    else
        echo "❌ 功能测试失败"
        return 1
    fi

    echo "所有测试完成"
}

# 主函数
main() {
    check_environment
    setup_test_data

    if run_tests; then
        echo "🎉 所有测试通过！"
        cleanup_test_data
        exit 0
    else
        echo "💥 测试失败！"
        cleanup_test_data
        exit 1
    fi
}

# 捕获中断信号
trap cleanup_test_data EXIT

main "$@"
```

---

## 测试执行指南

### 本地测试
```bash
# 1. 环境准备
cd "1️⃣ 商业决策支持专家"

# 2. 安装依赖
pip install -r requirements.txt

# 3. 运行测试套件
chmod +x scripts/test_runner.sh
./scripts/test_runner.sh

# 4. 查看测试报告
cat test_results/report.json
```

### 持续集成
```yaml
# .github/workflows/test.yml
name: 技能测试
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: 设置Python环境
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: 安装依赖
        run: pip install -r requirements.txt
      - name: 运行测试
        run: ./scripts/test_runner.sh
```

### 测试报告
测试完成后生成详细报告：
```json
{
    "test_summary": {
        "total_tests": 10,
        "passed_tests": 10,
        "failed_tests": 0,
        "success_rate": "100%"
    },
    "execution_time": "25.3分钟",
    "performance_metrics": {
        "avg_analysis_time": "18.5分钟",
        "quality_score": "92分",
        "accuracy": "95%"
    },
    "test_results": [
        {
            "test_name": "完整投资分析测试",
            "status": "PASSED",
            "execution_time": "15.2分钟",
            "score": 88
        }
    ]
}
```

---

**测试用例版本**: v1.0.0
**最后更新**: 2025-10-23
**维护**: 商业决策支持专家团队