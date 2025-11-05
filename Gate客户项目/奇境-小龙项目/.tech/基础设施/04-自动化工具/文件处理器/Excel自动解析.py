"""
Excel文件自动解析工具
特化1：Excel品牌信息分析器的核心实现
"""

import os
import json
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging


class ExcelAutoParser:
    """Excel自动解析器，实现品牌信息分析的自动化"""

    def __init__(self, config_file: str = None):
        """
        初始化解析器

        Args:
            config_file: 配置文件路径
        """
        self.config = self._load_config(config_file)
        self.logger = self._setup_logger()
        self.results = {}

    def _load_config(self, config_file: str) -> Dict:
        """加载配置文件"""
        if config_file and os.path.exists(config_file):
            with open(config_file, 'r', encoding='utf-8') as f:
                return json.load(f)

        # 默认配置
        return {
            "quality_standards": {
                "min_rows": 10,
                "required_columns": 3,
                "data_completeness_threshold": 0.8
            },
            "industry_priorities": {
                "manufacturing": ["品牌", "规格", "数量", "价格"],
                "service": ["客户", "服务类型", "时长", "费用"],
                "technology": ["产品", "技术", "版本", "兼容性"]
            },
            "output_format": {
                "include_summary": True,
                "include_recommendations": True,
                "language": "zh"
            }
        }

    def _setup_logger(self) -> logging.Logger:
        """设置日志器"""
        logger = logging.getLogger('ExcelAutoParser')
        logger.setLevel(logging.INFO)

        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        return logger

    def parse_excel_file(self, file_path: str) -> Dict[str, Any]:
        """
        解析Excel文件的主入口

        Args:
            file_path: Excel文件路径

        Returns:
            解析结果字典
        """
        self.logger.info(f"开始解析Excel文件: {file_path}")

        try:
            # 验证文件
            validation_result = self._validate_file(file_path)
            if not validation_result['valid']:
                return {
                    'success': False,
                    'error': validation_result['error'],
                    'file_path': file_path
                }

            # 解析结构
            structure_result = self._parse_xlsx_structure(file_path)

            # 分析业务逻辑
            business_result = self._analyze_business_logic(structure_result)

            # 生成内容
            content_result = self._generate_content(business_result)

            # 质量评估
            quality_result = self._assess_quality(content_result)

            # 记录执行日志
            self._log_execution(file_path, structure_result, business_result, quality_result)

            result = {
                'success': True,
                'file_path': file_path,
                'timestamp': datetime.now().isoformat(),
                'structure_analysis': structure_result,
                'business_analysis': business_result,
                'generated_content': content_result,
                'quality_assessment': quality_result
            }

            self.results[file_path] = result
            return result

        except Exception as e:
            self.logger.error(f"解析Excel文件失败: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'file_path': file_path
            }

    def _validate_file(self, file_path: str) -> Dict:
        """验证文件有效性"""
        if not os.path.exists(file_path):
            return {'valid': False, 'error': '文件不存在'}

        if not file_path.endswith(('.xlsx', '.xls')):
            return {'valid': False, 'error': '文件格式不支持'}

        # 检查文件是否可读
        try:
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                if 'xl/worksheets/' not in [name for name in zip_ref.namelist() if 'xl/worksheets/' in name]:
                    return {'valid': False, 'error': '无效的Excel文件结构'}
        except:
            return {'valid': False, 'error': '文件损坏或格式错误'}

        return {'valid': True}

    def _parse_xlsx_structure(self, file_path: str) -> Dict:
        """解析XLSX文件结构"""
        structure_info = {
            'file_size': os.path.getsize(file_path),
            'worksheets': [],
            'shared_strings': [],
            'data_summary': {}
        }

        try:
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                # 获取工作表信息
                if 'xl/workbook.xml' in zip_ref.namelist():
                    workbook_content = zip_ref.read('xl/workbook.xml')
                    workbook_root = ET.fromstring(workbook_content)

                    # 查找工作表
                    for sheet in workbook_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet'):
                        sheet_name = sheet.get('name', '未知工作表')
                        sheet_id = sheet.get('sheetId', '未知ID')
                        structure_info['worksheets'].append({
                            'name': sheet_name,
                            'id': sheet_id,
                            'data_rows': 0,
                            'columns': []
                        })

                # 获取共享字符串
                if 'xl/sharedStrings.xml' in zip_ref.namelist():
                    shared_strings_content = zip_ref.read('xl/sharedStrings.xml')
                    shared_strings_root = ET.fromstring(shared_strings_content)

                    for si in shared_strings_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                        t = si.find('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                        if t is not None:
                            structure_info['shared_strings'].append(t.text)

                # 分析工作表数据
                for filename in zip_ref.namelist():
                    if filename.startswith('xl/worksheets/sheet') and filename.endswith('.xml'):
                        worksheet_content = zip_ref.read(filename)
                        worksheet_root = ET.fromstring(worksheet_content)

                        # 分析数据行数和列
                        rows = worksheet_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
                        if rows:
                            sheet_idx = filename.split('sheet')[1].split('.')[0]
                            if len(structure_info['worksheets']) > int(sheet_idx) - 1:
                                structure_info['worksheets'][int(sheet_idx) - 1]['data_rows'] = len(rows)

                                # 分析列信息
                                first_row = rows[0] if rows else None
                                if first_row is not None:
                                    cells = first_row.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')
                                    columns = []
                                    for cell in cells:
                                        cell_value = self._get_cell_value(cell, structure_info['shared_strings'])
                                        columns.append(cell_value)
                                    structure_info['worksheets'][int(sheet_idx) - 1]['columns'] = columns

        except Exception as e:
            self.logger.error(f"解析XLSX结构失败: {str(e)}")
            raise

        return structure_info

    def _get_cell_value(self, cell, shared_strings: List[str]) -> str:
        """获取单元格值"""
        # 查找值
        v = cell.find('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
        if v is not None:
            # 检查是否是共享字符串
            cell_type = cell.get('t', '')
            if cell_type == 's':
                # 共享字符串索引
                try:
                    index = int(v.text)
                    if 0 <= index < len(shared_strings):
                        return shared_strings[index]
                except (ValueError, IndexError):
                    pass
            else:
                return v.text

        return ''

    def _analyze_business_logic(self, structure_result: Dict) -> Dict:
        """分析业务逻辑"""
        business_analysis = {
            'file_type': self._identify_file_type(structure_result),
            'industry_type': self._identify_industry_type(structure_result),
            'business_patterns': [],
            'data_quality_score': 0.0,
            'recommendations': []
        }

        # 计算数据质量分数
        total_rows = sum(sheet['data_rows'] for sheet in structure_result['worksheets'])
        avg_columns = sum(len(sheet['columns']) for sheet in structure_result['worksheets']) / max(len(structure_result['worksheets']), 1)

        quality_score = min(100, (total_rows / 100) * 50 + (avg_columns / 10) * 50)
        business_analysis['data_quality_score'] = quality_score

        # 识别业务模式
        business_analysis['business_patterns'] = self._identify_business_patterns(structure_result)

        # 生成建议
        business_analysis['recommendations'] = self._generate_business_recommendations(business_analysis)

        return business_analysis

    def _identify_file_type(self, structure_result: Dict) -> str:
        """识别文件类型"""
        worksheets = structure_result.get('worksheets', [])
        if not worksheets:
            return 'unknown'

        # 分析列名来推断文件类型
        all_columns = []
        for sheet in worksheets:
            all_columns.extend(sheet.get('columns', []))

        column_text = ' '.join(all_columns).lower()

        if any(keyword in column_text for keyword in ['品牌', '商标', 'brand', 'logo']):
            return 'brand_information'
        elif any(keyword in column_text for keyword in ['客户', 'customer', '会员', 'member']):
            return 'customer_information'
        elif any(keyword in column_text for keyword in ['产品', 'product', '商品', 'item']):
            return 'product_catalog'
        elif any(keyword in column_text for keyword in ['订单', 'order', '销售', 'sales']):
            return 'sales_data'
        else:
            return 'general_data'

    def _identify_industry_type(self, structure_result: Dict) -> str:
        """识别行业类型"""
        worksheets = structure_result.get('worksheets', [])
        if not worksheets:
            return 'unknown'

        # 分析内容特征
        all_content = []
        for sheet in worksheets:
            all_content.extend(sheet.get('columns', []))
            all_content.extend(structure_result.get('shared_strings', []))

        content_text = ' '.join(all_content).lower()

        # 行业关键词匹配
        industry_keywords = {
            'manufacturing': ['制造', '生产', '工厂', '设备', '产品'],
            'service': ['服务', '咨询', '解决方案', '支持'],
            'technology': ['技术', '软件', '系统', '平台', '开发'],
            'retail': ['零售', '商店', '销售', '商品', '门店'],
            'finance': ['金融', '银行', '投资', '资金', '保险']
        }

        for industry, keywords in industry_keywords.items():
            if any(keyword in content_text for keyword in keywords):
                return industry

        return 'general'

    def _identify_business_patterns(self, structure_result: Dict) -> List[Dict]:
        """识别业务模式"""
        patterns = []

        for sheet in structure_result['worksheets']:
            if sheet['data_rows'] > 0:
                pattern = {
                    'sheet_name': sheet['name'],
                    'data_structure': self._analyze_data_structure(sheet),
                    'business_intent': self._infer_business_intent(sheet)
                }
                patterns.append(pattern)

        return patterns

    def _analyze_data_structure(self, sheet: Dict) -> Dict:
        """分析数据结构"""
        columns = sheet.get('columns', [])
        rows = sheet.get('data_rows', 0)

        return {
            'column_count': len(columns),
            'row_count': rows,
            'data_density': min(1.0, rows / 100),  # 假设100行为满密度
            'column_types': self._infer_column_types(columns)
        }

    def _infer_column_types(self, columns: List[str]) -> List[str]:
        """推断列类型"""
        column_types = []

        for column in columns:
            column_lower = column.lower()
            if any(keyword in column_lower for keyword in ['id', '编号', '序号']):
                column_types.append('identifier')
            elif any(keyword in column_lower for keyword in ['名称', 'name', '标题', 'title']):
                column_types.append('name')
            elif any(keyword in column_lower for keyword in ['时间', 'date', '日期', 'time']):
                column_types.append('datetime')
            elif any(keyword in column_lower for keyword in ['数量', 'quantity', 'amount', '金额']):
                column_types.append('numeric')
            else:
                column_types.append('text')

        return column_types

    def _infer_business_intent(self, sheet: Dict) -> str:
        """推断业务意图"""
        columns = sheet.get('columns', [])
        column_text = ' '.join(columns).lower()

        if any(keyword in column_text for keyword in ['收集', 'collection', '信息', 'information']):
            return 'data_collection'
        elif any(keyword in column_text for keyword in ['分析', 'analysis', '统计', 'statistics']):
            return 'data_analysis'
        elif any(keyword in column_text for keyword in ['管理', 'management', '维护', 'maintenance']):
            return 'data_management'
        else:
            return 'general_processing'

    def _generate_business_recommendations(self, business_analysis: Dict) -> List[str]:
        """生成业务建议"""
        recommendations = []

        # 基于数据质量分数的建议
        if business_analysis['data_quality_score'] < 50:
            recommendations.append("数据质量较低，建议增加数据验证和清洗流程")

        # 基于文件类型的建议
        file_type = business_analysis['file_type']
        if file_type == 'brand_information':
            recommendations.append("品牌信息文件，建议增加品牌分类和标准化处理")
        elif file_type == 'customer_information':
            recommendations.append("客户信息文件，建议加强数据隐私保护和合规性检查")

        # 基于行业类型的建议
        industry = business_analysis['industry_type']
        if industry in self.config['industry_priorities']:
            priorities = self.config['industry_priorities'][industry]
            recommendations.append(f"针对{industry}行业，建议重点关注：{', '.join(priorities)}")

        return recommendations

    def _generate_content(self, business_result: Dict) -> Dict:
        """生成分析内容"""
        content = {
            'summary': self._generate_summary(business_result),
            'detailed_analysis': self._generate_detailed_analysis(business_result),
            'actionable_insights': self._generate_insights(business_result)
        }

        return content

    def _generate_summary(self, business_result: Dict) -> str:
        """生成摘要"""
        file_type = business_result['file_type']
        industry = business_result['industry_type']
        quality_score = business_result['data_quality_score']

        summary = f"""
## Excel文件分析摘要

**文件类型**: {file_type}
**行业类型**: {industry}
**数据质量分数**: {quality_score:.1f}/100

### 主要发现
"""

        for pattern in business_result['business_patterns']:
            summary += f"- **{pattern['sheet_name']}**: {pattern['data_structure']['row_count']}行数据，业务意图为{pattern['business_intent']}\n"

        if business_result['recommendations']:
            summary += "\n### 关键建议\n"
            for rec in business_result['recommendations']:
                summary += f"- {rec}\n"

        return summary

    def _generate_detailed_analysis(self, business_result: Dict) -> Dict:
        """生成详细分析"""
        analysis = {
            'data_structure_analysis': {},
            'business_logic_analysis': {},
            'quality_assessment': {}
        }

        for pattern in business_result['business_patterns']:
            sheet_name = pattern['sheet_name']
            analysis['data_structure_analysis'][sheet_name] = pattern['data_structure']
            analysis['business_logic_analysis'][sheet_name] = pattern['business_intent']

        analysis['quality_assessment'] = {
            'overall_score': business_result['data_quality_score'],
            'strengths': self._identify_strengths(business_result),
            'weaknesses': self._identify_weaknesses(business_result)
        }

        return analysis

    def _identify_strengths(self, business_result: Dict) -> List[str]:
        """识别优势"""
        strengths = []

        if business_result['data_quality_score'] > 70:
            strengths.append("数据质量较高，结构清晰")

        if len(business_result['business_patterns']) > 1:
            strengths.append("多工作表数据，信息维度丰富")

        return strengths

    def _identify_weaknesses(self, business_result: Dict) -> List[str]:
        """识别弱点"""
        weaknesses = []

        if business_result['data_quality_score'] < 50:
            weaknesses.append("数据质量需要提升")

        if not business_result['business_patterns']:
            weaknesses.append("业务模式不清晰")

        return weaknesses

    def _generate_insights(self, business_result: Dict) -> List[str]:
        """生成洞察"""
        insights = []

        # 基于文件类型和行业类型的洞察
        file_type = business_result['file_type']
        industry = business_result['industry_type']

        if file_type == 'brand_information' and industry == 'manufacturing':
            insights.append("制造业品牌信息，建议关注品牌与产品线的关联性")

        if business_result['data_quality_score'] > 80:
            insights.append("数据质量优秀，可直接用于自动化流程")

        return insights

    def _assess_quality(self, content_result: Dict) -> Dict:
        """评估内容质量"""
        quality_assessment = {
            'completeness_score': 0.0,
            'accuracy_score': 0.0,
            'usefulness_score': 0.0,
            'overall_score': 0.0,
            'improvement_suggestions': []
        }

        # 计算完整性分数
        completeness = 0
        if content_result.get('summary'):
            completeness += 33
        if content_result.get('detailed_analysis'):
            completeness += 33
        if content_result.get('actionable_insights'):
            completeness += 34

        quality_assessment['completeness_score'] = completeness

        # 计算准确性分数（基于内容长度和结构）
        detailed_analysis = content_result.get('detailed_analysis', {})
        if len(str(detailed_analysis)) > 500:
            quality_assessment['accuracy_score'] = 80
        else:
            quality_assessment['accuracy_score'] = 60

        # 计算有用性分数（基于洞察数量）
        insights = content_result.get('actionable_insights', [])
        quality_assessment['usefulness_score'] = min(100, len(insights) * 25)

        # 计算总体分数
        quality_assessment['overall_score'] = (
            quality_assessment['completeness_score'] * 0.3 +
            quality_assessment['accuracy_score'] * 0.4 +
            quality_assessment['usefulness_score'] * 0.3
        )

        # 生成改进建议
        if quality_assessment['overall_score'] < 70:
            quality_assessment['improvement_suggestions'].append("建议增加更多细节分析和深度洞察")

        return quality_assessment

    def _log_execution(self, file_path: str, structure_result: Dict,
                      business_result: Dict, quality_result: Dict):
        """记录执行日志"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'file_path': file_path,
            'file_size': structure_result.get('file_size', 0),
            'worksheets_count': len(structure_result.get('worksheets', [])),
            'data_quality_score': business_result.get('data_quality_score', 0),
            'content_quality_score': quality_result.get('overall_score', 0),
            'business_patterns_found': len(business_result.get('business_patterns', [])),
            'status': 'success'
        }

        self.logger.info(f"执行日志: {json.dumps(log_entry, ensure_ascii=False, indent=2)}")

    def get_results(self) -> Dict:
        """获取所有解析结果"""
        return self.results

    def save_results(self, output_dir: str):
        """保存结果到文件"""
        os.makedirs(output_dir, exist_ok=True)

        for file_path, result in self.results.items():
            file_name = os.path.basename(file_path)
            output_file = os.path.join(output_dir, f"{file_name}_analysis_result.json")

            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)

        self.logger.info(f"结果已保存到: {output_dir}")


def main():
    """主函数示例"""
    parser = ExcelAutoParser()

    # 示例用法
    excel_file = "path/to/your/excel/file.xlsx"
    result = parser.parse_excel_file(excel_file)

    if result['success']:
        print("解析成功!")
        print(f"文件类型: {result['business_analysis']['file_type']}")
        print(f"行业类型: {result['business_analysis']['industry_type']}")
        print(f"数据质量分数: {result['business_analysis']['data_quality_score']}")

        # 保存结果
        parser.save_results("./output")
    else:
        print(f"解析失败: {result['error']}")


if __name__ == "__main__":
    main()