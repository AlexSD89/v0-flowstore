"""
数据质量检查工具
跨特化的质量保障组件
"""

import os
import json
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any, Optional, Union
import logging
import re


class DataQualityChecker:
    """数据质量检查器，为3个特化提供统一的质量保障"""

    def __init__(self, config_file: str = None):
        """
        初始化质量检查器

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
                "completeness_threshold": 0.9,
                "consistency_threshold": 0.85,
                "accuracy_threshold": 0.8,
                "validity_threshold": 0.9
            },
            "specialization_requirements": {
                "excel_analyzer": {
                    "min_rows": 10,
                    "min_columns": 3,
                    "required_data_types": ["text", "numeric"],
                    "max_null_ratio": 0.2
                },
                "design_reviewer": {
                    "min_resolution": [1920, 1080],
                    "valid_formats": ["jpg", "png", "gif"],
                    "max_file_size_mb": 10,
                    "metadata_required": True
                },
                "project_coordinator": {
                    "min_project_info_completeness": 0.8,
                    "required_sections": ["objectives", "timeline", "resources"],
                    "max_ambiguity_score": 0.3
                }
            },
            "validation_rules": {
                "data_types": ["string", "integer", "float", "boolean", "datetime"],
                "text_patterns": {
                    "email": r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                    "phone": r'^[\+]?[1-9][\d]{0,15}$',
                    "date": r'^\d{4}-\d{2}-\d{2}$'
                },
                "numeric_ranges": {
                    "percentage": [0, 100],
                    "rating": [1, 5],
                    "quantity": [0, float('inf')]
                }
            }
        }

    def _setup_logger(self) -> logging.Logger:
        """设置日志器"""
        logger = logging.getLogger('DataQualityChecker')
        logger.setLevel(logging.INFO)

        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        return logger

    def check_data_quality(self, data_source: str, specialization: str = None) -> Dict[str, Any]:
        """
        检查数据质量的主入口

        Args:
            data_source: 数据源路径或内容
            specialization: 特化类型 (excel_analyzer, design_reviewer, project_coordinator)

        Returns:
            质量检查结果字典
        """
        self.logger.info(f"开始检查数据质量: {data_source}, 特化: {specialization}")

        try:
            # 基础质量检查
            basic_result = self._perform_basic_quality_checks(data_source, specialization)

            # 完整性检查
            completeness_result = self._check_completeness(data_source, specialization)

            # 一致性检查
            consistency_result = self._check_consistency(data_source, specialization)

            # 准确性检查
            accuracy_result = self._check_accuracy(data_source, specialization)

            # 格式标准化检查
            format_result = self._check_format_standardization(data_source, specialization)

            # 业务逻辑检查
            business_logic_result = self._check_business_logic(data_source, specialization)

            # 综合质量评估
            overall_result = self._calculate_overall_quality(
                basic_result, completeness_result, consistency_result,
                accuracy_result, format_result, business_logic_result
            )

            # 记录执行日志
            self._log_execution(data_source, specialization, overall_result)

            result = {
                'success': True,
                'data_source': data_source,
                'specialization': specialization,
                'timestamp': datetime.now().isoformat(),
                'basic_checks': basic_result,
                'completeness': completeness_result,
                'consistency': consistency_result,
                'accuracy': accuracy_result,
                'format_standardization': format_result,
                'business_logic': business_logic_result,
                'overall_assessment': overall_result
            }

            self.results[data_source] = result
            return result

        except Exception as e:
            self.logger.error(f"数据质量检查失败: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'data_source': data_source,
                'specialization': specialization
            }

    def _perform_basic_quality_checks(self, data_source: str, specialization: str) -> Dict:
        """执行基础质量检查"""
        basic_checks = {
            'file_exists': False,
            'file_readable': False,
            'file_size': 0,
            'file_type': 'unknown',
            'encoding_issues': False,
            'corruption_detected': False,
            'passed': False
        }

        # 检查文件是否存在
        if os.path.exists(data_source):
            basic_checks['file_exists'] = True

            # 检查文件大小
            basic_checks['file_size'] = os.path.getsize(data_source)

            # 检查文件类型
            basic_checks['file_type'] = self._identify_file_type(data_source)

            # 检查文件可读性
            try:
                if specialization == 'excel_analyzer' and data_source.endswith(('.xlsx', '.xls')):
                    basic_checks['file_readable'] = self._check_excel_readable(data_source)
                elif specialization == 'design_reviewer' and data_source.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                    basic_checks['file_readable'] = self._check_image_readable(data_source)
                else:
                    basic_checks['file_readable'] = self._check_text_readable(data_source)
            except Exception as e:
                basic_checks['file_readable'] = False
                self.logger.warning(f"文件可读性检查失败: {str(e)}")

            # 检查编码问题
            if specialization != 'design_reviewer':
                basic_checks['encoding_issues'] = self._check_encoding_issues(data_source)

        # 基础检查通过条件
        basic_checks['passed'] = (
            basic_checks['file_exists'] and
            basic_checks['file_readable'] and
            basic_checks['file_size'] > 0 and
            not basic_checks['encoding_issues']
        )

        return basic_checks

    def _identify_file_type(self, file_path: str) -> str:
        """识别文件类型"""
        ext = os.path.splitext(file_path)[1].lower()
        
        type_mapping = {
            '.xlsx': 'excel',
            '.xls': 'excel',
            '.csv': 'csv',
            '.json': 'json',
            '.txt': 'text',
            '.md': 'markdown',
            '.jpg': 'image',
            '.jpeg': 'image',
            '.png': 'image',
            '.gif': 'image'
        }

        return type_mapping.get(ext, 'unknown')

    def _check_excel_readable(self, file_path: str) -> bool:
        """检查Excel文件可读性"""
        try:
            import zipfile
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                # 检查必要的Excel文件结构
                required_files = ['xl/workbook.xml', 'xl/worksheets/']
                for req_file in required_files:
                    if not any(name.startswith(req_file.rstrip('/')) for name in zip_ref.namelist()):
                        return False
            return True
        except:
            return False

    def _check_image_readable(self, file_path: str) -> bool:
        """检查图片文件可读性"""
        try:
            from PIL import Image
            with Image.open(file_path) as img:
                img.verify()
            return True
        except:
            return False

    def _check_text_readable(self, file_path: str) -> bool:
        """检查文本文件可读性"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                f.read(1024)  # 尝试读取前1024个字符
            return True
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='gbk') as f:
                    f.read(1024)
                return True
            except:
                return False
        except:
            return False

    def _check_encoding_issues(self, file_path: str) -> bool:
        """检查编码问题"""
        try:
            with open(file_path, 'rb') as f:
                raw_data = f.read(1024)
            
            # 尝试不同的编码
            encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1']
            for encoding in encodings:
                try:
                    raw_data.decode(encoding)
                    return False  # 找到可用编码，没有编码问题
                except UnicodeDecodeError:
                    continue
            
            return True  # 所有编码都失败，存在编码问题
        except:
            return True

    def _check_completeness(self, data_source: str, specialization: str) -> Dict:
        """检查完整性"""
        completeness = {
            'overall_score': 0.0,
            'missing_data_ratio': 0.0,
            'required_fields_present': 0,
            'total_required_fields': 0,
            'data_density': 0.0,
            'passed': False,
            'issues': []
        }

        try:
            if specialization == 'excel_analyzer':
                completeness = self._check_excel_completeness(data_source)
            elif specialization == 'design_reviewer':
                completeness = self._check_image_completeness(data_source)
            elif specialization == 'project_coordinator':
                completeness = self._check_project_completeness(data_source)
            else:
                completeness = self._check_general_completeness(data_source)

        except Exception as e:
            completeness['issues'].append(f"完整性检查失败: {str(e)}")
            self.logger.error(f"完整性检查失败: {str(e)}")

        return completeness

    def _check_excel_completeness(self, file_path: str) -> Dict:
        """检查Excel数据完整性"""
        completeness = {
            'overall_score': 0.0,
            'missing_data_ratio': 0.0,
            'required_fields_present': 0,
            'total_required_fields': 0,
            'data_density': 0.0,
            'passed': False,
            'issues': []
        }

        try:
            # 使用pandas读取Excel
            df = pd.read_excel(file_path, sheet_name=0, nrows=100)  # 读取前100行检查

            # 计算数据密度
            total_cells = len(df) * len(df.columns)
            non_null_cells = df.count().sum()
            completeness['data_density'] = non_null_cells / max(total_cells, 1)
            completeness['missing_data_ratio'] = 1 - completeness['data_density']

            # 检查必需字段（基于特化要求）
            reqs = self.config['specialization_requirements']['excel_analyzer']
            completeness['total_required_fields'] = 3  # 假设需要3个基本字段

            # 检查最小行数和列数
            if len(df) >= reqs['min_rows']:
                completeness['required_fields_present'] += 1
            else:
                completeness['issues'].append(f"行数不足: {len(df)} < {reqs['min_rows']}")

            if len(df.columns) >= reqs['min_columns']:
                completeness['required_fields_present'] += 1
            else:
                completeness['issues'].append(f"列数不足: {len(df.columns)} < {reqs['min_columns']}")

            # 检查空值比例
            null_ratio = completeness['missing_data_ratio']
            if null_ratio <= reqs['max_null_ratio']:
                completeness['required_fields_present'] += 1
            else:
                completeness['issues'].append(f"空值比例过高: {null_ratio:.2%} > {reqs['max_null_ratio']:.2%}")

            # 计算完整性分数
            completeness['overall_score'] = (
                completeness['data_density'] * 0.6 +
                (completeness['required_fields_present'] / completeness['total_required_fields']) * 0.4
            )

            completeness['passed'] = completeness['overall_score'] >= self.config['quality_standards']['completeness_threshold']

        except Exception as e:
            completeness['issues'].append(f"Excel完整性检查失败: {str(e)}")

        return completeness

    def _check_image_completeness(self, file_path: str) -> Dict:
        """检查图片完整性"""
        completeness = {
            'overall_score': 0.0,
            'missing_data_ratio': 0.0,
            'required_fields_present': 0,
            'total_required_fields': 0,
            'data_density': 1.0,  # 图片没有缺失数据的概念
            'passed': False,
            'issues': []
        }

        try:
            from PIL import Image
            with Image.open(file_path) as img:
                # 检查分辨率
                reqs = self.config['specialization_requirements']['design_reviewer']
                min_resolution = reqs['min_resolution']
                
                completeness['total_required_fields'] = 3

                if img.size[0] >= min_resolution[0] and img.size[1] >= min_resolution[1]:
                    completeness['required_fields_present'] += 1
                else:
                    completeness['issues'].append(f"分辨率不足: {img.size} < {min_resolution}")

                # 检查文件大小
                file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
                if file_size_mb <= reqs['max_file_size_mb']:
                    completeness['required_fields_present'] += 1
                else:
                    completeness['issues'].append(f"文件过大: {file_size_mb:.2f}MB > {reqs['max_file_size_mb']}MB")

                # 检查格式
                file_ext = os.path.splitext(file_path)[1].lower()
                if file_ext in reqs['valid_formats']:
                    completeness['required_fields_present'] += 1
                else:
                    completeness['issues'].append(f"格式不支持: {file_ext}")

                completeness['overall_score'] = completeness['required_fields_present'] / completeness['total_required_fields']
                completeness['passed'] = completeness['overall_score'] >= self.config['quality_standards']['completeness_threshold']

        except Exception as e:
            completeness['issues'].append(f"图片完整性检查失败: {str(e)}")

        return completeness

    def _check_project_completeness(self, file_path: str) -> Dict:
        """检查项目信息完整性"""
        completeness = {
            'overall_score': 0.0,
            'missing_data_ratio': 0.0,
            'required_fields_present': 0,
            'total_required_fields': 0,
            'data_density': 0.0,
            'passed': False,
            'issues': []
        }

        try:
            # 读取项目文件
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            reqs = self.config['specialization_requirements']['project_coordinator']
            required_sections = reqs['required_sections']
            completeness['total_required_fields'] = len(required_sections)

            # 检查必需章节
            for section in required_sections:
                if section.lower() in content.lower():
                    completeness['required_fields_present'] += 1
                else:
                    completeness['issues'].append(f"缺少必需章节: {section}")

            # 计算信息密度（基于内容长度）
            content_length = len(content)
            completeness['data_density'] = min(1.0, content_length / 1000)  # 假设1000字符为满密度

            # 计算完整性分数
            completeness['overall_score'] = (
                (completeness['required_fields_present'] / completeness['total_required_fields']) * 0.7 +
                completeness['data_density'] * 0.3
            )

            completeness['passed'] = completeness['overall_score'] >= self.config['quality_standards']['completeness_threshold']

        except Exception as e:
            completeness['issues'].append(f"项目完整性检查失败: {str(e)}")

        return completeness

    def _check_general_completeness(self, file_path: str) -> Dict:
        """检查通用文件完整性"""
        completeness = {
            'overall_score': 0.5,  # 默认分数
            'missing_data_ratio': 0.0,
            'required_fields_present': 1,
            'total_required_fields': 1,
            'data_density': 0.5,
            'passed': True,
            'issues': []
        }

        # 通用完整性检查主要是文件存在和可读
        file_size = os.path.getsize(file_path)
        if file_size > 0:
            completeness['data_density'] = min(1.0, file_size / 1024)  # 1KB为满密度
            completeness['overall_score'] = completeness['data_density']

        return completeness

    def _check_consistency(self, data_source: str, specialization: str) -> Dict:
        """检查一致性"""
        consistency = {
            'overall_score': 0.8,  # 默认分数
            'format_consistency': 0.8,
            'naming_consistency': 0.8,
            'data_consistency': 0.8,
            'passed': False,
            'issues': []
        }

        try:
            if specialization == 'excel_analyzer':
                consistency = self._check_excel_consistency(data_source)
            elif specialization == 'design_reviewer':
                consistency = self._check_design_consistency(data_source)

            # 计算总体一致性分数
            consistency['overall_score'] = (
                consistency['format_consistency'] * 0.3 +
                consistency['naming_consistency'] * 0.3 +
                consistency['data_consistency'] * 0.4
            )

            consistency['passed'] = consistency['overall_score'] >= self.config['quality_standards']['consistency_threshold']

        except Exception as e:
            consistency['issues'].append(f"一致性检查失败: {str(e)}")

        return consistency

    def _check_excel_consistency(self, file_path: str) -> Dict:
        """检查Excel数据一致性"""
        consistency = {
            'overall_score': 0.8,
            'format_consistency': 0.8,
            'naming_consistency': 0.8,
            'data_consistency': 0.8,
            'passed': False,
            'issues': []
        }

        try:
            # 读取Excel文件检查一致性
            df = pd.read_excel(file_path, sheet_name=0, nrows=50)

            # 检查列名一致性
            column_names = df.columns.tolist()
            if len(set(column_names)) == len(column_names):
                consistency['naming_consistency'] = 1.0
            else:
                consistency['naming_consistency'] = 0.5
                consistency['issues'].append("列名存在重复")

            # 检查数据格式一致性
            for col in df.columns:
                if df[col].dtype == 'object':
                    # 检查文本列的格式一致性
                    sample_values = df[col].dropna().head(10).tolist()
                    if sample_values:
                        # 检查日期格式一致性
                        if any(self._is_date_string(str(val)) for val in sample_values):
                            date_consistency = all(self._is_date_string(str(val)) for val in sample_values if pd.notna(val))
                            if not date_consistency:
                                consistency['issues'].append(f"列 '{col}' 日期格式不一致")
                                consistency['format_consistency'] -= 0.1

            # 检查数据一致性
            numeric_columns = df.select_dtypes(include=[np.number]).columns
            for col in numeric_columns:
                if df[col].notna().sum() > 0:
                    # 检查数值范围合理性
                    min_val, max_val = df[col].min(), df[col].max()
                    if min_val < 0 and '数量' in str(col):
                        consistency['issues'].append(f"列 '{col}' 数量出现负值")
                        consistency['data_consistency'] -= 0.1

        except Exception as e:
            consistency['issues'].append(f"Excel一致性检查失败: {str(e)}")

        return consistency

    def _check_design_consistency(self, file_path: str) -> Dict:
        """检查设计一致性"""
        consistency = {
            'overall_score': 0.8,
            'format_consistency': 0.8,
            'naming_consistency': 0.8,
            'data_consistency': 0.8,
            'passed': False,
            'issues': []
        }

        # 检查文件命名一致性
        filename = os.path.basename(file_path)
        if self._is_valid_design_filename(filename):
            consistency['naming_consistency'] = 1.0
        else:
            consistency['naming_consistency'] = 0.5
            consistency['issues'].append("文件命名不规范")

        return consistency

    def _is_date_string(self, value: str) -> bool:
        """检查是否为日期字符串"""
        date_patterns = [
            r'^\d{4}-\d{2}-\d{2}$',
            r'^\d{4}/\d{2}/\d{2}$',
            r'^\d{2}-\d{2}-\d{4}$'
        ]
        
        for pattern in date_patterns:
            if re.match(pattern, value):
                return True
        return False

    def _is_valid_design_filename(self, filename: str) -> bool:
        """检查设计文件名是否有效"""
        # 检查是否包含项目信息、版本信息等
        required_patterns = [
            r'[a-zA-Z\u4e00-\u9fff]',  # 包含中英文字符
            r'\d',  # 包含数字
        ]
        
        score = 0
        for pattern in required_patterns:
            if re.search(pattern, filename):
                score += 1
        
        return score >= 2  # 至少满足2个模式

    def _check_accuracy(self, data_source: str, specialization: str) -> Dict:
        """检查准确性"""
        accuracy = {
            'overall_score': 0.8,  # 默认分数
            'validation_passed': 0,
            'validation_total': 0,
            'error_count': 0,
            'passed': False,
            'issues': []
        }

        try:
            if specialization == 'excel_analyzer':
                accuracy = self._check_excel_accuracy(data_source)
            elif specialization == 'design_reviewer':
                accuracy = self._check_design_accuracy(data_source)

            accuracy['passed'] = accuracy['overall_score'] >= self.config['quality_standards']['accuracy_threshold']

        except Exception as e:
            accuracy['issues'].append(f"准确性检查失败: {str(e)}")

        return accuracy

    def _check_excel_accuracy(self, file_path: str) -> Dict:
        """检查Excel数据准确性"""
        accuracy = {
            'overall_score': 0.8,
            'validation_passed': 0,
            'validation_total': 0,
            'error_count': 0,
            'passed': False,
            'issues': []
        }

        try:
            df = pd.read_excel(file_path, sheet_name=0, nrows=100)

            # 验证数据类型
            validation_rules = self.config['validation_rules']
            
            for col in df.columns:
                accuracy['validation_total'] += 1
                
                # 检查邮箱格式
                if 'email' in col.lower() or '邮箱' in col.lower():
                    email_pattern = validation_rules['text_patterns']['email']
                    valid_emails = df[col].dropna().apply(
                        lambda x: bool(re.match(email_pattern, str(x))) if pd.notna(x) else True
                    ).sum()
                    total_emails = df[col].dropna().shape[0]
                    
                    if total_emails > 0:
                        email_accuracy = valid_emails / total_emails
                        if email_accuracy >= 0.9:
                            accuracy['validation_passed'] += 1
                        else:
                            accuracy['error_count'] += total_emails - valid_emails
                            accuracy['issues'].append(f"列 '{col}' 邮箱格式错误: {total_emails - valid_emails}个")

                # 检查电话格式
                elif 'phone' in col.lower() or '电话' in col.lower() or '手机' in col.lower():
                    phone_pattern = validation_rules['text_patterns']['phone']
                    valid_phones = df[col].dropna().apply(
                        lambda x: bool(re.match(phone_pattern, str(x))) if pd.notna(x) else True
                    ).sum()
                    total_phones = df[col].dropna().shape[0]
                    
                    if total_phones > 0:
                        phone_accuracy = valid_phones / total_phones
                        if phone_accuracy >= 0.9:
                            accuracy['validation_passed'] += 1
                        else:
                            accuracy['error_count'] += total_phones - valid_phones
                            accuracy['issues'].append(f"列 '{col}' 电话格式错误: {total_phones - valid_phones}个")

                else:
                    # 其他列默认通过
                    accuracy['validation_passed'] += 1

            # 计算准确性分数
            if accuracy['validation_total'] > 0:
                accuracy['overall_score'] = accuracy['validation_passed'] / accuracy['validation_total']

        except Exception as e:
            accuracy['issues'].append(f"Excel准确性检查失败: {str(e)}")

        return accuracy

    def _check_design_accuracy(self, file_path: str) -> Dict:
        """检查设计准确性"""
        accuracy = {
            'overall_score': 0.8,
            'validation_passed': 0,
            'validation_total': 1,
            'error_count': 0,
            'passed': False,
            'issues': []
        }

        # 检查设计文件的基本属性
        try:
            from PIL import Image
            with Image.open(file_path) as img:
                # 检查图片模式
                if img.mode in ['RGB', 'RGBA']:
                    accuracy['validation_passed'] = 1
                else:
                    accuracy['issues'].append(f"图片模式不支持: {img.mode}")
                    accuracy['error_count'] = 1

            accuracy['overall_score'] = accuracy['validation_passed'] / accuracy['validation_total']

        except Exception as e:
            accuracy['issues'].append(f"设计准确性检查失败: {str(e)}")

        return accuracy

    def _check_format_standardization(self, data_source: str, specialization: str) -> Dict:
        """检查格式标准化"""
        format_check = {
            'overall_score': 0.8,
            'standard_compliance': 0.8,
            'naming_convention': 0.8,
            'passed': False,
            'issues': []
        }

        try:
            # 检查文件命名规范
            filename = os.path.basename(data_source)
            if self._check_naming_convention(filename, specialization):
                format_check['naming_convention'] = 1.0
            else:
                format_check['naming_convention'] = 0.5
                format_check['issues'].append("文件命名不符合规范")

            # 检查标准合规性
            if specialization == 'excel_analyzer':
                if data_source.endswith(('.xlsx', '.xls')):
                    format_check['standard_compliance'] = 1.0
            elif specialization == 'design_reviewer':
                if data_source.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                    format_check['standard_compliance'] = 1.0

            # 计算总体分数
            format_check['overall_score'] = (
                format_check['standard_compliance'] * 0.6 +
                format_check['naming_convention'] * 0.4
            )

            format_check['passed'] = format_check['overall_score'] >= self.config['quality_standards']['validity_threshold']

        except Exception as e:
            format_check['issues'].append(f"格式标准化检查失败: {str(e)}")

        return format_check

    def _check_naming_convention(self, filename: str, specialization: str) -> bool:
        """检查命名规范"""
        # 基本命名规范检查
        if len(filename) < 3:
            return False

        # 检查是否包含特殊字符（允许的除外）
        allowed_chars = set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.()（）中文')
        if not all(char in allowed_chars or ord(char) > 127 for char in filename):
            return False

        return True

    def _check_business_logic(self, data_source: str, specialization: str) -> Dict:
        """检查业务逻辑"""
        business_logic = {
            'overall_score': 0.7,
            'logic_consistency': 0.7,
            'business_rules_compliance': 0.7,
            'passed': False,
            'issues': []
        }

        try:
            if specialization == 'excel_analyzer':
                business_logic = self._check_excel_business_logic(data_source)
            elif specialization == 'design_reviewer':
                business_logic = self._check_design_business_logic(data_source)

            business_logic['passed'] = business_logic['overall_score'] >= 0.6

        except Exception as e:
            business_logic['issues'].append(f"业务逻辑检查失败: {str(e)}")

        return business_logic

    def _check_excel_business_logic(self, file_path: str) -> Dict:
        """检查Excel业务逻辑"""
        business_logic = {
            'overall_score': 0.7,
            'logic_consistency': 0.7,
            'business_rules_compliance': 0.7,
            'passed': False,
            'issues': []
        }

        try:
            df = pd.read_excel(file_path, sheet_name=0, nrows=100)

            # 检查业务逻辑一致性
            # 例如：检查金额列是否为正数
            for col in df.columns:
                col_lower = col.lower()
                if '金额' in col_lower or '价格' in col_lower or '数量' in col_lower:
                    if df[col].dtype in ['int64', 'float64']:
                        negative_count = (df[col] < 0).sum()
                        if negative_count > 0:
                            business_logic['issues'].append(f"列 '{col}' 存在负值: {negative_count}个")
                            business_logic['logic_consistency'] -= 0.1

            # 检查数据范围合理性
            business_logic['business_rules_compliance'] = 0.8  # 默认合规
            business_logic['overall_score'] = (
                business_logic['logic_consistency'] * 0.5 +
                business_logic['business_rules_compliance'] * 0.5
            )

        except Exception as e:
            business_logic['issues'].append(f"Excel业务逻辑检查失败: {str(e)}")

        return business_logic

    def _check_design_business_logic(self, file_path: str) -> Dict:
        """检查设计业务逻辑"""
        business_logic = {
            'overall_score': 0.7,
            'logic_consistency': 0.7,
            'business_rules_compliance': 0.7,
            'passed': False,
            'issues': []
        }

        # 基于文件名和路径检查业务逻辑
        filepath = os.path.dirname(file_path)
        filename = os.path.basename(file_path)

        # 检查版本逻辑
        if '初稿' in filename and '修改' in filename:
            business_logic['issues'].append("版本状态逻辑冲突")
            business_logic['logic_consistency'] -= 0.2

        business_logic['overall_score'] = (
            business_logic['logic_consistency'] * 0.6 +
            business_logic['business_rules_compliance'] * 0.4
        )

        return business_logic

    def _calculate_overall_quality(self, basic_result: Dict, completeness_result: Dict,
                                  consistency_result: Dict, accuracy_result: Dict,
                                  format_result: Dict, business_logic_result: Dict) -> Dict:
        """计算总体质量评估"""
        overall = {
            'overall_score': 0.0,
            'grade': 'unknown',
            'passed_all_checks': True,
            'critical_issues': [],
            'improvement_areas': [],
            'quality_level': 'unknown'
        }

        # 收集各项分数
        scores = []
        
        if basic_result.get('passed', False):
            scores.append(1.0)
        else:
            scores.append(0.0)
            overall['critical_issues'].append("基础检查失败")

        scores.append(completeness_result.get('overall_score', 0))
        scores.append(consistency_result.get('overall_score', 0))
        scores.append(accuracy_result.get('overall_score', 0))
        scores.append(format_result.get('overall_score', 0))
        scores.append(business_logic_result.get('overall_score', 0))

        # 计算总体分数
        overall['overall_score'] = sum(scores) / len(scores)

        # 确定质量等级
        if overall['overall_score'] >= 0.9:
            overall['grade'] = 'A'
            overall['quality_level'] = 'excellent'
        elif overall['overall_score'] >= 0.8:
            overall['grade'] = 'B'
            overall['quality_level'] = 'good'
        elif overall['overall_score'] >= 0.7:
            overall['grade'] = 'C'
            overall['quality_level'] = 'acceptable'
        elif overall['overall_score'] >= 0.6:
            overall['grade'] = 'D'
            overall['quality_level'] = 'poor'
        else:
            overall['grade'] = 'F'
            overall['quality_level'] = 'failing'

        # 检查是否通过所有检查
        checks = [
            basic_result.get('passed', False),
            completeness_result.get('passed', False),
            consistency_result.get('passed', False),
            accuracy_result.get('passed', False),
            format_result.get('passed', False),
            business_logic_result.get('passed', False)
        ]
        
        overall['passed_all_checks'] = all(checks)

        # 收集改进建议
        if completeness_result.get('overall_score', 0) < 0.8:
            overall['improvement_areas'].append("提升数据完整性")
        
        if consistency_result.get('overall_score', 0) < 0.8:
            overall['improvement_areas'].append("改善数据一致性")
        
        if accuracy_result.get('overall_score', 0) < 0.8:
            overall['improvement_areas'].append("增强数据准确性")

        return overall

    def _log_execution(self, data_source: str, specialization: str, overall_result: Dict):
        """记录执行日志"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'data_source': data_source,
            'specialization': specialization,
            'overall_score': overall_result.get('overall_score', 0),
            'grade': overall_result.get('grade', 'unknown'),
            'passed_all_checks': overall_result.get('passed_all_checks', False),
            'critical_issues_count': len(overall_result.get('critical_issues', [])),
            'status': 'success'
        }

        self.logger.info(f"执行日志: {json.dumps(log_entry, ensure_ascii=False, indent=2)}")

    def get_results(self) -> Dict:
        """获取所有检查结果"""
        return self.results

    def save_results(self, output_dir: str):
        """保存结果到文件"""
        os.makedirs(output_dir, exist_ok=True)

        for data_source, result in self.results.items():
            source_name = os.path.basename(data_source)
            output_file = os.path.join(output_dir, f"{source_name}_quality_check_result.json")

            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)

        self.logger.info(f"结果已保存到: {output_dir}")


def main():
    """主函数示例"""
    checker = DataQualityChecker()

    # 示例用法
    data_file = "path/to/your/data.xlsx"
    result = checker.check_data_quality(data_file, specialization='excel_analyzer')

    if result['success']:
        print("质量检查成功!")
        print(f"总体分数: {result['overall_assessment']['overall_score']:.2f}")
        print(f"质量等级: {result['overall_assessment']['grade']}")
        print(f"通过所有检查: {result['overall_assessment']['passed_all_checks']}")

        # 保存结果
        checker.save_results("./output")
    else:
        print(f"质量检查失败: {result['error']}")


if __name__ == "__main__":
    main()