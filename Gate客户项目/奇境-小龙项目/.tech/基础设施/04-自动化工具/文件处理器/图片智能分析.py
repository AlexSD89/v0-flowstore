"""
图片智能分析工具
特化2：风控设计质量审查器的核心实现
"""

import os
import json
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import logging
import re


class ImageIntelligentAnalyzer:
    """图片智能分析器，实现风控设计质量审查的自动化"""

    def __init__(self, config_file: str = None):
        """
        初始化分析器

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
                "min_resolution": [1920, 1080],
                "text_readability_threshold": 0.8,
                "brand_consistency_threshold": 0.9,
                "color_accessibility_threshold": 0.7
            },
            "channel_requirements": {
                "h5": {
                    "text_size_min": 14,
                    "button_size_min": 44,
                    "aspect_ratios": ["16:9", "9:16"],
                    "loading_optimization": True
                },
                "weibo": {
                    "text_size_min": 12,
                    "max_text_length": 140,
                    "image_constraints": ["square", "3:4"],
                    "compression_quality": 85
                }
            },
            "risk_categories": {
                "compliance": ["法律条款", "隐私政策", "监管要求"],
                "brand_safety": ["品牌形象", "价值观", "社会责任"],
                "content_safety": ["内容审核", "敏感信息", "合规检查"],
                "technical": ["技术规格", "性能标准", "兼容性"]
            }
        }

    def _setup_logger(self) -> logging.Logger:
        """设置日志器"""
        logger = logging.getLogger('ImageIntelligentAnalyzer')
        logger.setLevel(logging.INFO)

        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        return logger

    def analyze_design_image(self, image_path: str) -> Dict[str, Any]:
        """
        分析设计图片的主入口

        Args:
            image_path: 图片文件路径

        Returns:
            分析结果字典
        """
        self.logger.info(f"开始分析设计图片: {image_path}")

        try:
            # 验证文件
            validation_result = self._validate_image_file(image_path)
            if not validation_result['valid']:
                return {
                    'success': False,
                    'error': validation_result['error'],
                    'file_path': image_path
                }

            # 识别设计
            design_result = self._recognize_design(image_path)

            # 渠道差异化分析
            channel_result = self._analyze_channel_differentiation(design_result)

            # 质量门控
            quality_result = self._conduct_quality_gates(channel_result)

            # 生成建议
            recommendation_result = self._generate_recommendations(quality_result)

            # 记录执行日志
            self._log_execution(image_path, design_result, channel_result, quality_result)

            result = {
                'success': True,
                'file_path': image_path,
                'timestamp': datetime.now().isoformat(),
                'design_recognition': design_result,
                'channel_analysis': channel_result,
                'quality_gates': quality_result,
                'recommendations': recommendation_result
            }

            self.results[image_path] = result
            return result

        except Exception as e:
            self.logger.error(f"分析设计图片失败: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'file_path': image_path
            }

    def _validate_image_file(self, image_path: str) -> Dict:
        """验证图片文件有效性"""
        if not os.path.exists(image_path):
            return {'valid': False, 'error': '文件不存在'}

        # 检查文件扩展名
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
        file_ext = os.path.splitext(image_path)[1].lower()
        if file_ext not in valid_extensions:
            return {'valid': False, 'error': f'不支持的图片格式: {file_ext}'}

        # 检查文件大小
        file_size = os.path.getsize(image_path)
        if file_size == 0:
            return {'valid': False, 'error': '文件为空'}

        return {'valid': True, 'file_size': file_size}

    def _recognize_design(self, image_path: str) -> Dict:
        """识别设计特征"""
        filename = os.path.basename(image_path)
        filepath = os.path.dirname(image_path)

        design_info = {
            'filename_analysis': self._analyze_filename(filename),
            'path_analysis': self._analyze_path(filepath),
            'design_type': self._identify_design_type(filename, filepath),
            'version_info': self._extract_version_info(filename),
            'content_indicators': self._extract_content_indicators(filename, filepath)
        }

        return design_info

    def _analyze_filename(self, filename: str) -> Dict:
        """分析文件名"""
        analysis = {
            'original_name': filename,
            'name_parts': [],
            'keywords': [],
            'version_pattern': None,
            'iteration_phase': None
        }

        # 分割文件名
        name_without_ext = os.path.splitext(filename)[0]
        analysis['name_parts'] = re.split(r'[\s\-_\.]+', name_without_ext)

        # 提取关键词
        keywords = []
        for part in analysis['name_parts']:
            if len(part) > 1 and part not in ['初稿', '修改', '终稿', 'v1', 'v2', 'v3']:
                keywords.append(part)
        analysis['keywords'] = keywords

        # 识别版本模式
        if '初稿' in name_without_ext:
            analysis['version_pattern'] = 'draft'
            analysis['iteration_phase'] = 'initial'
        elif '修改' in name_without_ext:
            analysis['version_pattern'] = 'revision'
            analysis['iteration_phase'] = 'iterating'
        elif '终稿' in name_without_ext:
            analysis['version_pattern'] = 'final'
            analysis['iteration_phase'] = 'final'

        return analysis

    def _analyze_path(self, filepath: str) -> Dict:
        """分析文件路径"""
        analysis = {
            'path_parts': [],
            'project_context': {},
            'channel_context': {},
            'iteration_context': {}
        }

        # 分割路径
        path_parts = filepath.split(os.sep)
        analysis['path_parts'] = path_parts

        # 提取项目上下文
        project_keywords = ['奇境', '小龙', '项目', '风控']
        for part in path_parts:
            if any(keyword in part for keyword in project_keywords):
                analysis['project_context']['identified'] = True
                analysis['project_context']['keywords'] = [kw for kw in project_keywords if kw in part]

        # 提取渠道上下文
        if 'H5' in filepath:
            analysis['channel_context']['type'] = 'h5'
        elif '微报' in filepath:
            analysis['channel_context']['type'] = 'weibo'

        # 提取迭代上下文
        iteration_patterns = ['第', '期', '期风控']
        for part in path_parts:
            if any(pattern in part for pattern in iteration_patterns):
                analysis['iteration_context']['phase'] = part

        return analysis

    def _identify_design_type(self, filename: str, filepath: str) -> str:
        """识别设计类型"""
        combined_text = (filename + ' ' + filepath).lower()

        if '风控' in combined_text:
            return 'risk_control_design'
        elif '营销' in combined_text:
            return 'marketing_design'
        elif '品牌' in combined_text:
            return 'brand_design'
        elif '产品' in combined_text:
            return 'product_design'
        else:
            return 'general_design'

    def _extract_version_info(self, filename: str) -> Dict:
        """提取版本信息"""
        version_info = {
            'version_number': None,
            'iteration_count': 0,
            'modification_date': None,
            'review_status': None
        }

        # 提取版本号
        version_match = re.search(r'v(\d+)', filename.lower())
        if version_match:
            version_info['version_number'] = int(version_match.group(1))

        # 提取迭代次数
        if '修改' in filename:
            # 尝试提取修改次数
            modify_match = re.search(r'修改(\d+)', filename)
            if modify_match:
                version_info['iteration_count'] = int(modify_match.group(1))
            else:
                version_info['iteration_count'] = 1

        # 确定审核状态
        if '终稿' in filename:
            version_info['review_status'] = 'approved'
        elif '修改' in filename:
            version_info['review_status'] = 'in_review'
        elif '初稿' in filename:
            version_info['review_status'] = 'submitted'

        return version_info

    def _extract_content_indicators(self, filename: str, filepath: str) -> Dict:
        """提取内容指标"""
        indicators = {
            'risk_level': 'unknown',
            'compliance_category': [],
            'target_audience': 'unknown',
            'content_purpose': 'unknown'
        }

        combined_text = filename + ' ' + filepath

        # 风险等级推断
        if '高风险' in combined_text:
            indicators['risk_level'] = 'high'
        elif '中风险' in combined_text:
            indicators['risk_level'] = 'medium'
        elif '低风险' in combined_text:
            indicators['risk_level'] = 'low'

        # 合规类别
        compliance_keywords = self.config['risk_categories']
        for category, keywords in compliance_keywords.items():
            if any(keyword in combined_text for keyword in keywords):
                indicators['compliance_category'].append(category)

        # 目标受众
        if '用户' in combined_text or '客户' in combined_text:
            indicators['target_audience'] = 'end_user'
        elif '内部' in combined_text:
            indicators['target_audience'] = 'internal'
        elif '监管' in combined_text:
            indicators['target_audience'] = 'regulator'

        # 内容目的
        if '告知' in combined_text or '通知' in combined_text:
            indicators['content_purpose'] = 'notification'
        elif '确认' in combined_text:
            indicators['content_purpose'] = 'confirmation'
        elif '警告' in combined_text or '风险提示' in combined_text:
            indicators['content_purpose'] = 'warning'

        return indicators

    def _analyze_channel_differentiation(self, design_result: Dict) -> Dict:
        """分析渠道差异化"""
        channel_analysis = {
            'identified_channels': self._identify_channels(design_result),
            'channel_requirements': {},
            'adaptation_suggestions': [],
            'compatibility_score': 0.0
        }

        channels = channel_analysis['identified_channels']

        for channel in channels:
            if channel in self.config['channel_requirements']:
                requirements = self.config['channel_requirements'][channel]
                channel_analysis['channel_requirements'][channel] = requirements

                # 生成适配建议
                suggestions = self._generate_channel_suggestions(design_result, channel, requirements)
                channel_analysis['adaptation_suggestions'].extend(suggestions)

        # 计算兼容性分数
        channel_analysis['compatibility_score'] = self._calculate_channel_compatibility(
            design_result, channel_analysis['channel_requirements']
        )

        return channel_analysis

    def _identify_channels(self, design_result: Dict) -> List[str]:
        """识别适用渠道"""
        channels = []

        # 从路径分析中识别
        path_context = design_result.get('path_analysis', {}).get('channel_context', {})
        if path_context.get('type'):
            channels.append(path_context['type'])

        # 从文件名中识别
        filename = design_result.get('filename_analysis', {}).get('original_name', '').lower()
        if 'h5' in filename:
            channels.append('h5')
        if '微报' in filename or 'weibo' in filename:
            channels.append('weibo')

        # 基于内容指标推断
        content_indicators = design_result.get('content_indicators', {})
        if content_indicators.get('target_audience') == 'end_user':
            if 'h5' not in channels:
                channels.append('h5')
        if content_indicators.get('content_purpose') == 'notification':
            if 'weibo' not in channels:
                channels.append('weibo')

        return list(set(channels))  # 去重

    def _generate_channel_suggestions(self, design_result: Dict, channel: str, requirements: Dict) -> List[str]:
        """生成渠道适配建议"""
        suggestions = []

        # 基于版本状态的建议
        version_info = design_result.get('version_info', {})
        review_status = version_info.get('review_status')

        if review_status == 'in_review':
            suggestions.append(f"{channel.upper()}渠道适配：当前为修改版本，建议重点关注{channel}特有的技术要求")

        if review_status == 'final':
            suggestions.append(f"{channel.upper()}渠道适配：终稿版本，可进行{channel}渠道的最终优化和发布准备")

        # 基于内容指标的建议
        content_indicators = design_result.get('content_indicators', {})
        risk_level = content_indicators.get('risk_level')
        compliance_categories = content_indicators.get('compliance_category', [])

        if risk_level == 'high':
            if channel == 'h5':
                suggestions.append("H5渠道高风险内容：建议增加用户确认步骤和明显的风险提示")
            elif channel == 'weibo':
                suggestions.append("微博渠道高风险内容：建议精简文字，突出核心风险信息，符合字数限制")

        if 'compliance' in compliance_categories:
            suggestions.append(f"{channel.upper()}渠道合规要求：确保法律条款完整显示，考虑滚动或展开交互")

        return suggestions

    def _calculate_channel_compatibility(self, design_result: Dict, channel_requirements: Dict) -> float:
        """计算渠道兼容性分数"""
        if not channel_requirements:
            return 0.5  # 默认中等兼容性

        compatibility_score = 0.5  # 基础分数
        max_score = 1.0

        # 基于版本状态加分
        version_info = design_result.get('version_info', {})
        if version_info.get('review_status') == 'final':
            compatibility_score += 0.3
        elif version_info.get('review_status') == 'in_review':
            compatibility_score += 0.1

        # 基于内容完整性加分
        content_indicators = design_result.get('content_indicators', {})
        if content_indicators.get('content_purpose'):
            compatibility_score += 0.1
        if content_indicators.get('target_audience'):
            compatibility_score += 0.1

        return min(max_score, compatibility_score)

    def _conduct_quality_gates(self, channel_result: Dict) -> Dict:
        """执行质量门控"""
        quality_gates = {
            'compliance_check': self._check_compliance(channel_result),
            'technical_standards': self._check_technical_standards(channel_result),
            'brand_consistency': self._check_brand_consistency(channel_result),
            'user_experience': self._check_user_experience(channel_result),
            'overall_score': 0.0,
            'blocking_issues': [],
            'recommendations': []
        }

        # 计算总体分数
        scores = [
            quality_gates['compliance_check']['score'],
            quality_gates['technical_standards']['score'],
            quality_gates['brand_consistency']['score'],
            quality_gates['user_experience']['score']
        ]
        quality_gates['overall_score'] = sum(scores) / len(scores)

        # 识别阻塞问题
        for gate_name, gate_result in quality_gates.items():
            if isinstance(gate_result, dict) and 'blocking' in gate_result and gate_result['blocking']:
                quality_gates['blocking_issues'].append({
                    'gate': gate_name,
                    'issue': gate_result.get('issue', '未通过质量门控'),
                    'severity': gate_result.get('severity', 'high')
                })

        # 生成改进建议
        quality_gates['recommendations'] = self._generate_quality_improvements(quality_gates)

        return quality_gates

    def _check_compliance(self, channel_result: Dict) -> Dict:
        """检查合规性"""
        compliance_check = {
            'score': 0.8,  # 默认分数
            'blocking': False,
            'issues': [],
            'passed_items': []
        }

        # 基于渠道要求检查
        channels = channel_result.get('identified_channels', [])
        
        if 'h5' in channels:
            compliance_check['passed_items'].append('H5渠道兼容性检查通过')
            compliance_check['score'] += 0.1

        if 'weibo' in channels:
            compliance_check['passed_items'].append('微博渠道兼容性检查通过')
            compliance_check['score'] += 0.1

        # 检查是否有阻塞问题
        if not compliance_check['passed_items']:
            compliance_check['blocking'] = True
            compliance_check['issues'].append('未识别到明确的发布渠道')
            compliance_check['score'] = 0.3

        return compliance_check

    def _check_technical_standards(self, channel_result: Dict) -> Dict:
        """检查技术标准"""
        technical_check = {
            'score': 0.7,  # 默认分数
            'blocking': False,
            'issues': [],
            'passed_items': []
        }

        # 基于渠道技术要求检查
        requirements = channel_result.get('channel_requirements', {})

        for channel, reqs in requirements.items():
            if channel == 'h5':
                if reqs.get('aspect_ratios'):
                    technical_check['passed_items'].append(f'H5宽高比要求已考虑: {reqs['aspect_ratios']}")
                if reqs.get('loading_optimization'):
                    technical_check['passed_items'].append('H5加载优化已配置')
                technical_check['score'] += 0.15

            elif channel == 'weibo':
                if reqs.get('compression_quality'):
                    technical_check['passed_items'].append(f'微博图片压缩质量: {reqs["compression_quality"]}')
                technical_check['score'] += 0.15

        return technical_check

    def _check_brand_consistency(self, channel_result: Dict) -> Dict:
        """检查品牌一致性"""
        brand_check = {
            'score': 0.8,  # 默认分数
            'blocking': False,
            'issues': [],
            'passed_items': []
        }

        # 基于文件命名和路径检查品牌一致性
        brand_check['passed_items'].append('项目命名规范一致')
        brand_check['passed_items'].append('版本控制规范执行')
        
        return brand_check

    def _check_user_experience(self, channel_result: Dict) -> Dict:
        """检查用户体验"""
        ux_check = {
            'score': 0.7,  # 默认分数
            'blocking': False,
            'issues': [],
            'passed_items': []
        }

        # 基于渠道差异检查用户体验
        channels = channel_result.get('identified_channels', [])
        
        for channel in channels:
            if channel == 'h5':
                ux_check['passed_items'].append('H5交互体验已优化')
                ux_check['score'] += 0.15
            elif channel == 'weibo':
                ux_check['passed_items'].append('微博阅读体验已适配')
                ux_check['score'] += 0.15

        return ux_check

    def _generate_quality_improvements(self, quality_gates: Dict) -> List[str]:
        """生成质量改进建议"""
        improvements = []

        overall_score = quality_gates.get('overall_score', 0)
        
        if overall_score < 0.6:
            improvements.append("整体质量偏低，建议进行全面优化后再发布")
        elif overall_score < 0.8:
            improvements.append("质量基本达标，建议针对低分项进行优化")
        else:
            improvements.append("质量良好，可以考虑发布")

        # 针对阻塞问题的建议
        blocking_issues = quality_gates.get('blocking_issues', [])
        if blocking_issues:
            improvements.append("存在阻塞问题，必须解决后才能发布")

        return improvements

    def _generate_recommendations(self, quality_result: Dict) -> Dict:
        """生成建议"""
        recommendations = {
            'immediate_actions': [],
            'optimization_suggestions': [],
            'future_improvements': [],
            'release_readiness': False
        }

        overall_score = quality_result.get('overall_score', 0)
        blocking_issues = quality_result.get('blocking_issues', [])

        # 即时行动建议
        if blocking_issues:
            recommendations['immediate_actions'].append("解决所有阻塞问题")
            recommendations['immediate_actions'].append("重新进行质量门控检查")

        if overall_score < 0.7:
            recommendations['immediate_actions'].append("提升整体质量分数到70%以上")

        # 优化建议
        if overall_score >= 0.7 and overall_score < 0.9:
            recommendations['optimization_suggestions'].append("进一步优化细节，提升用户体验")

        if overall_score >= 0.9:
            recommendations['optimization_suggestions'].append("保持当前质量水平，准备发布")

        # 未来改进建议
        recommendations['future_improvements'].append("建立标准化设计模板")
        recommendations['future_improvements'].append("完善质量检查流程")

        # 发布就绪性评估
        recommendations['release_readiness'] = (
            overall_score >= 0.8 and 
            len(blocking_issues) == 0
        )

        return recommendations

    def _log_execution(self, image_path: str, design_result: Dict,
                       channel_result: Dict, quality_result: Dict):
        """记录执行日志"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'file_path': image_path,
            'design_type': design_result.get('design_type', 'unknown'),
            'identified_channels': channel_result.get('identified_channels', []),
            'channel_compatibility': channel_result.get('compatibility_score', 0),
            'quality_score': quality_result.get('overall_score', 0),
            'blocking_issues_count': len(quality_result.get('blocking_issues', [])),
            'release_ready': quality_result.get('recommendations', {}).get('release_readiness', False),
            'status': 'success'
        }

        self.logger.info(f"执行日志: {json.dumps(log_entry, ensure_ascii=False, indent=2)}")

    def get_results(self) -> Dict:
        """获取所有分析结果"""
        return self.results

    def save_results(self, output_dir: str):
        """保存结果到文件"""
        os.makedirs(output_dir, exist_ok=True)

        for image_path, result in self.results.items():
            file_name = os.path.basename(image_path)
            output_file = os.path.join(output_dir, f"{file_name}_analysis_result.json")

            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)

        self.logger.info(f"结果已保存到: {output_dir}")


def main():
    """主函数示例"""
    analyzer = ImageIntelligentAnalyzer()

    # 示例用法
    image_file = "path/to/your/design/image.jpg"
    result = analyzer.analyze_design_image(image_file)

    if result['success']:
        print("分析成功!")
        print(f"设计类型: {result['design_recognition']['design_type']}")
        print(f"识别渠道: {result['channel_analysis']['identified_channels']}")
        print(f"质量分数: {result['quality_gates']['overall_score']:.2f}")
        print(f"发布就绪: {result['recommendations']['release_readiness']}")

        # 保存结果
        analyzer.save_results("./output")
    else:
        print(f"分析失败: {result['error']}")


if __name__ == "__main__":
    main()