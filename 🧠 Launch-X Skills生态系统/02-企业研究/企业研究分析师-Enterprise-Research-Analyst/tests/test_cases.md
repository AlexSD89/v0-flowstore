# 企业研究分析师 - 测试用例

## 测试环境配置

### 必需环境
- Python 3.8+
- Node.js (用于JavaScript工具函数)
- 网络连接 (用于数据验证)
- 2GB+磁盘空间

### 测试数据准备
```bash
# 创建测试目录
mkdir -p test_data/workspace
mkdir -p test_data/companies
mkdir -p test_data/reports
mkdir -p test_data/outputs
```

---

## 测试用例 1: 完整企业分析测试

### 测试目标
验证完整的企业研究分析流程：数据收集 → 基础分析 → 竞争分析 → 财务分析 → 风险评估 → 投资建议

### 测试输入
```json
{
  "name": "智云科技有限公司",
  "industry": "企业SaaS",
  "revenue": 48000000,
  "growth_rate": 0.25,
  "profit_margin": 0.15,
  "employees": 85,
  "market_share": 0.8,
  "business_model": "SaaS订阅制"
}
```

### 预期输出
```json
{
  "overall_score": 78,
  "investment_grade": "B+",
  "investment_recommendation": "推荐",
  "confidence_level": "中高",
  "risk_level": "中等",
  "execution_status": "SUCCESS"
}
```

### 验证点
- [ ] 所有分析步骤正常执行
- [ ] 评分在合理范围内 (50-90分)
- [ ] 投资建议逻辑清晰
- [ ] 风险评估全面
- [ ] 报告格式规范

---

## 测试用例 2: 不同行业企业分析测试

### 测试目标
验证不同行业企业的分析能力和适应性

### 测试场景
```yaml
科技企业:
  行业: "AI技术"
  阶段: "A轮"
  收入: 5000万
  增长率: 35%
  预期评分: 80-90分

教育企业:
  行业: "在线教育"
  阶段: "Pre-A轮"
  收入: 2000万
  增长率: 20%
  预期评分: 70-80分

制造企业:
  行业: "智能制造"
  阶段: "B轮"
  收入: 8000万
  增长率: 15%
  预期评分: 75-85分
```

### 验证点
- [ ] 不同行业权重自动调整
- [ ] 行业基准对比正常
- [ ] 分析结果符合行业特点
- [ ] 评分模型适用性良好

---

## 测试用例 3: 竞争分析测试

### 测试目标
验证竞争分析功能的准确性和完整性

### 测试场景
```yaml
市场领导者:
  市场份额: >10%
  行业排名: ≤3
  竞争优势: 明显
  预期结果: 高竞争力评分

市场挑战者:
  市场份额: 2-5%
  行业排名: 5-15
  竞争优势: 中等
  预期结果: 中等竞争力评分

市场新进入者:
  市场份额: <1%
  行业排名: >20
  竞争优势: 有限
  预期结果: 低竞争力评分
```

### 验证点
- [ ] 市场份额计算准确
- [ ] 竞争优势识别合理
- [ ] 行业排名评估准确
- [ ] 竞争力评分合理

---

## 测试用例 4: 财务分析测试

### 测试目标
验证财务分析功能和指标计算的准确性

### 测试数据
```json
{
  "financial_test_cases": [
    {
      "company": "高增长企业",
      "revenue": 100000000,
      "growth_rate": 0.50,
      "profit_margin": 0.20,
      "expected_score": 85-95
    },
    {
      "company": "稳定增长企业",
      "revenue": 50000000,
      "growth_rate": 0.20,
      "profit_margin": 0.15,
      "expected_score": 70-80
    },
    {
      "company": "亏损企业",
      "revenue": 30000000,
      "growth_rate": 0.10,
      "profit_margin": -0.05,
      "expected_score": 40-60
    }
  ]
}
```

### 验证点
- [ ] 财务指标计算准确
- [ ] 增长率评分合理
- [ ] 盈利能力评估正确
- [ ] 行业对比分析准确

---

## 测试用例 5: 风险评估测试

### 测试目标
验证风险评估功能的准确性和完整性

### 测试场景
```yaml
低风险企业:
  财务状况: 健康稳定
  市场地位: 领导者
  团队经验: 丰富
  预期风险等级: "低"

高风险企业:
  财务状况: 亏损经营
  市场地位: 新进入者
  团队经验: 有限
  预期风险等级: "高"

综合风险企业:
  多种风险并存
  部分风险可接受
  需要风险缓释措施
  预期风险等级: "中等"
```

### 验证点
- [ ] 风险因素识别准确
- [ ] 风险等级评定合理
- [ ] 风险评分数值准确
- [ ] 风险缓释建议实用

---

## 测试用例 6: 估值分析测试

### 测试目标
验证投资估值计算和分析功能

### 测试方法
```yaml
DCF估值:
  输入: 收入、增长率、利润率、折现率
  输出: 企业现值
  验证: 现金流折现计算正确

可比公司估值:
  输入: 企业指标、可比公司数据
  输出: 相对估值结果
  验证: 倍数计算和对比合理

综合估值:
  输入: 多种方法结果
  输出: 加权平均估值
  验证: 权重分配和结果合理
```

### 验证点
- [ ] DCF估值计算准确
- [ ] 可比公司分析合理
- [ ] 估值权重分配适当
- [ ] 估值区间设定合理

---

## 测试用例 7: 数据验证测试

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

## 测试用例 8: 报告生成测试

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

## 测试用例 9: 边界条件测试

### 测试目标
验证系统在边界条件下的稳定性和容错能力

### 边界条件
```yaml
极小企业:
  团队规模: 5人
  收入: 100万元
  预期处理: 正常分析，但降低评分权重

极大企业:
  团队规模: 500人
  收入: 5亿元
  预期处理: 正常分析，调整评估模型

极端增长率:
  月增长: 100%
  预期处理: 标记为异常增长，降低置信度

零增长企业:
  月增长: 0%
  预期处理: 标记为停滞风险
```

### 验证点
- [ ] 边界值处理正确
- [ ] 异常情况识别准确
- [ ] 系统不崩溃
- [ ] 错误处理机制有效

---

## 测试用例 10: 性能测试

### 测试目标
验证系统性能和响应时间

### 性能指标
```yaml
响应时间:
  简单分析: < 30秒
  标准分析: < 60秒
  深度分析: < 120秒

资源使用:
  内存使用: < 1GB
  CPU使用: < 80%
  磁盘空间: < 200MB

并发能力:
  同时分析: 3个企业
  预期处理: 正常响应
```

### 验证点
- [ ] 响应时间达标
- [ ] 资源使用合理
- [ ] 并发处理稳定
- [ ] 性能指标一致

---

## 测试用例 11: 集成测试

### 测试目标
验证与其他Skills的协作能力

### 集成场景
```yaml
与商业决策支持专家协作:
  输入: 企业分析数据
  预期结果: 增强投资决策维度
  验证: 数据整合和综合分析

与市场情报专家协作:
  输入: 市场情报数据
  预期结果: 市场环境分析增强
  验证: 市场洞察整合

与被投企业画像分析大师协作:
  输入: 企业画像数据
  预期结果: 企业画像完善
  验证: 数据一致性验证
```

### 验证点
- [ ] 数据共享机制正常
- [ ] 结果整合逻辑正确
- [ ] Skills间协同有效
- [ ] 综合分析质量提升

---

## 测试用例 12: 持续更新测试

### 测试目标
验证数据更新和持续监控功能

### 更新场景
```yaml
数据更新:
  定期更新企业数据
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

from main import EnterpriseResearchAnalyst
import json
import time

def run_test_case(test_name, test_input, expected_output):
    """执行单个测试用例"""
    print(f"执行测试: {test_name}")

    try:
        # 创建分析师实例
        analyst = EnterpriseResearchAnalyst(test_input['name'])

        # 执行分析
        start_time = time.time()
        result = analyst.analyze_company(test_input)
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
    if not result.get('overall_score'):
        return False

    # 检查执行时间
    if execution_time > expected.get('max_time', 120):
        return False

    # 检查核心指标
    overall_score = result.get('overall_score', 0)
    if overall_score < expected.get('min_score', 50):
        return False

    # 检查投资建议
    recommendation = result.get('investment_recommendation', {})
    if not recommendation.get('rating'):
        return False

    return True

def run_all_tests():
    """运行所有测试用例"""
    test_cases = [
        ("完整企业分析测试", {
            'name': '智云科技',
            'industry': '企业SaaS',
            'revenue': 48000000,
            'growth_rate': 0.25,
            'profit_margin': 0.15,
            'employees': 85
        }, {
            'min_score': 70,
            'max_time': 60
        }),

        ("科技企业分析测试", {
            'name': 'AI科技公司',
            'industry': 'AI技术',
            'revenue': 50000000,
            'growth_rate': 0.35,
            'profit_margin': 0.20,
            'employees': 100
        }, {
            'min_score': 75,
            'max_time': 60
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

# 企业研究分析师测试脚本

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
    required_files=("scripts/main.py", "resources/data/enterprise-research-config.json")
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

    # 创建测试企业数据
    cat > test_data/sample_company.json << 'EOF'
{
    "name": "测试企业",
    "industry": "AI技术",
    "revenue": 50000000,
    "growth_rate": 0.30,
    "profit_margin": 0.18,
    "employees": 100
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
    if python3 scripts/main.py "测试企业" --dry-run; then
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
cd "2️⃣ 企业研究分析师"

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
        "total_tests": 12,
        "passed_tests": 12,
        "failed_tests": 0,
        "success_rate": "100%"
    },
    "execution_time": "18.5分钟",
    "performance_metrics": {
        "avg_analysis_time": "45.2秒",
        "quality_score": "88分",
        "accuracy": "92%"
    },
    "test_results": [
        {
            "test_name": "完整企业分析测试",
            "status": "PASSED",
            "execution_time": "42.1秒",
            "score": 82
        }
    ]
}
```

---

**测试用例版本**: v1.0.0
**最后更新**: 2025-10-23
**维护**: 企业研究分析师团队