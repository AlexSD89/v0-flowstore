#!/usr/bin/env python3
"""
增强版日志管理器
提供完整的日志系统管理、监控和分析功能
"""

import json
import os
import sys
import time
import gzip
import shutil
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import logging
import re

class EnhancedLoggingManager:
    def __init__(self, launchx_root):
        self.launchx_root = Path(launchx_root)
        self.logs_dir = self.launchx_root / ".serena" / "logs"
        self.config_file = self.logs_dir / "enhanced_logging_config.json"

        # 确保目录存在
        self.logs_dir.mkdir(parents=True, exist_ok=True)

        # 配置日志
        self._setup_logging()

        # 加载配置
        self.logging_config = self._load_logging_config()

        # 日志类别定义
        self.log_categories = {
            'serena_main': {
                'file': 'serena.log',
                'description': 'Serena主服务日志',
                'importance': 'critical'
            },
            'memory_sync': {
                'file': 'memory_sync.log',
                'description': 'Memory Bank同步日志',
                'importance': 'high'
            },
            'web_dashboard': {
                'file': 'web_dashboard.log',
                'description': 'Web仪表板访问日志',
                'importance': 'medium'
            },
            'ai_enhancement': {
                'file': 'ai_enhancement.log',
                'description': 'AI功能增强日志',
                'importance': 'high'
            },
            'system_monitor': {
                'file': 'system_monitor.log',
                'description': '系统监控日志',
                'importance': 'critical'
            },
            'api_requests': {
                'file': 'api_requests.log',
                'description': 'API请求日志（JSON格式）',
                'importance': 'high'
            },
            'search_engine': {
                'file': 'search_engine.log',
                'description': '搜索引擎日志',
                'importance': 'high'
            },
            'automation_tasks': {
                'file': 'automation/automation_tasks.log',
                'description': '自动化任务日志',
                'importance': 'medium'
            },
            'security': {
                'file': 'security.log',
                'description': '安全事件日志',
                'importance': 'critical'
            },
            'performance': {
                'file': 'performance.log',
                'description': '性能指标日志（JSON格式）',
                'importance': 'high'
            },
            'errors': {
                'file': 'errors.log',
                'description': '错误日志',
                'importance': 'critical'
            }
        }

        self.logger.info("增强版日志管理器初始化完成")

    def _setup_logging(self):
        """配置日志"""
        log_file = self.logs_dir / "logging_manager.log"

        # 创建logger
        self.logger = logging.getLogger('enhanced_logging_manager')
        self.logger.setLevel(logging.INFO)

        # 避免重复添加handler
        if not self.logger.handlers:
            handler = logging.FileHandler(log_file, encoding='utf-8')
            formatter = logging.Formatter(
                '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def _load_logging_config(self) -> Dict:
        """加载日志配置"""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                self.logger.info("日志配置加载成功")
                return config
            except Exception as e:
                self.logger.error(f"加载日志配置失败: {e}")

        # 返回默认配置
        self.logger.info("使用默认日志配置")
        return {}

    def validate_logging_system(self) -> Dict:
        """验证日志系统完整性"""
        self.logger.info("开始验证日志系统...")

        validation_results = {
            'overall_score': 0,
            'categories': {},
            'issues': [],
            'recommendations': [],
            'timestamp': datetime.now().isoformat()
        }

        category_scores = []

        for category, config in self.log_categories.items():
            log_file = self.logs_dir / config['file']
            category_result = {
                'name': category,
                'description': config['description'],
                'importance': config['importance'],
                'file_exists': log_file.exists(),
                'file_size': 0,
                'file_age_hours': 0,
                'is_writable': False,
                'backup_count': 0,
                'score': 0
            }

            try:
                if log_file.exists():
                    # 文件大小
                    category_result['file_size'] = log_file.stat().st_size

                    # 文件年龄
                    mtime = log_file.stat().st_mtime
                    category_result['file_age_hours'] = (time.time() - mtime) / 3600

                    # 写入权限
                    category_result['is_writable'] = os.access(log_file, os.W_OK)

                    # 备份文件数量
                    backup_pattern = f"{log_file.name}.*"
                    backup_count = len(list(log_file.parent.glob(backup_pattern))) - 1
                    category_result['backup_count'] = backup_count

                    # 评分
                    score = 0
                    if category_result['file_size'] > 0:
                        score += 25  # 文件存在且有内容
                    if category_result['is_writable']:
                        score += 25  # 可写入
                    if category_result['backup_count'] >= 3:
                        score += 25  # 有备份
                    if category_result['file_age_hours'] < 24:
                        score += 25  # 最近有更新

                    category_result['score'] = min(100, score)
                else:
                    category_result['score'] = 0
                    validation_results['issues'].append(f"{category}: 日志文件不存在")
                    validation_results['recommendations'].append(f"创建 {category} 日志文件")

            except Exception as e:
                category_result['score'] = 0
                validation_results['issues'].append(f"{category}: 检查失败 - {str(e)}")

            validation_results['categories'][category] = category_result
            category_scores.append(category_result['score'])

        # 计算总体评分
        if category_scores:
            validation_results['overall_score'] = sum(category_scores) / len(category_scores)

        # 生成建议
        if validation_results['overall_score'] < 70:
            validation_results['recommendations'].append("建议运行日志系统修复程序")

        if not any(cat['file_exists'] for cat in validation_results['categories'].values()):
            validation_results['recommendations'].append("建议初始化完整的日志系统")

        self.logger.info(f"日志系统验证完成，总体评分: {validation_results['overall_score']:.1f}%")

        return validation_results

    def fix_logging_system(self) -> Dict:
        """修复日志系统问题"""
        self.logger.info("开始修复日志系统...")

        fix_results = {
            'success': True,
            'fixed_items': [],
            'failed_items': [],
            'timestamp': datetime.now().isoformat()
        }

        for category, config in self.log_categories.items():
            log_file = self.logs_dir / config['file']

            try:
                # 确保目录存在
                log_file.parent.mkdir(parents=True, exist_ok=True)

                # 创建日志文件（如果不存在）
                if not log_file.exists():
                    log_file.write_text(
                        f"# {config['description']}\n"
                        f"# Created: {datetime.now().isoformat()}\n"
                        f"# Category: {category}\n"
                        f"# Importance: {config['importance']}\n\n",
                        encoding='utf-8'
                    )
                    fix_results['fixed_items'].append(f"创建 {category} 日志文件")

                # 设置权限
                os.chmod(log_file, 0o644)

                # 写入测试日志
                with open(log_file, 'a', encoding='utf-8') as f:
                    f.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} [INFO] logging_manager: 日志系统修复完成\n")

                fix_results['fixed_items'].append(f"修复 {category} 日志权限和内容")

            except Exception as e:
                fix_results['failed_items'].append(f"{category}: {str(e)}")
                self.logger.error(f"修复 {category} 日志失败: {e}")

        if fix_results['failed_items']:
            fix_results['success'] = False

        self.logger.info(f"日志系统修复完成，成功修复: {len(fix_results['fixed_items'])}项，失败: {len(fix_results['failed_items'])}项")

        return fix_results

    def analyze_log_health(self) -> Dict:
        """分析日志健康状态"""
        self.logger.info("开始分析日志健康状态...")

        health_analysis = {
            'overall_health': 'unknown',
            'categories': {},
            'metrics': {},
            'alerts': [],
            'timestamp': datetime.now().isoformat()
        }

        total_size = 0
        total_files = 0
        error_count = 0

        for category, config in self.log_categories.items():
            log_file = self.logs_dir / config['file']

            category_health = {
                'status': 'unknown',
                'size_mb': 0,
                'line_count': 0,
                'error_count': 0,
                'warning_count': 0,
                'last_activity': None,
                'growth_rate': 'unknown'
            }

            try:
                if log_file.exists():
                    # 文件大小
                    size_bytes = log_file.stat().st_size
                    category_health['size_mb'] = round(size_bytes / (1024 * 1024), 2)
                    total_size += size_bytes
                    total_files += 1

                    # 统计行数和错误
                    with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        category_health['line_count'] = len(lines)

                        for line in lines:
                            if 'ERROR' in line.upper():
                                category_health['error_count'] += 1
                                error_count += 1
                            elif 'WARNING' in line.upper():
                                category_health['warning_count'] += 1

                    # 最后活动时间
                    mtime = log_file.stat().st_mtime
                    category_health['last_activity'] = datetime.fromtimestamp(mtime).isoformat()

                    # 健康状态评估
                    if category_health['error_count'] == 0:
                        if category_health['warning_count'] == 0:
                            category_health['status'] = 'excellent'
                        elif category_health['warning_count'] < 5:
                            category_health['status'] = 'good'
                        else:
                            category_health['status'] = 'warning'
                    elif category_health['error_count'] < 3:
                        category_health['status'] = 'warning'
                    else:
                        category_health['status'] = 'critical'

                        # 添加告警
                        health_analysis['alerts'].append({
                            'category': category,
                            'level': 'critical',
                            'message': f"发现 {category_health['error_count']} 个错误",
                            'importance': config['importance']
                        })

                health_analysis['categories'][category] = category_health

            except Exception as e:
                category_health['status'] = 'error'
                health_analysis['categories'][category] = category_health
                self.logger.error(f"分析 {category} 日志失败: {e}")

        # 计算总体指标
        health_analysis['metrics'] = {
            'total_size_mb': round(total_size / (1024 * 1024), 2),
            'total_files': total_files,
            'total_errors': error_count,
            'avg_size_mb': round(total_size / max(1, total_files) / (1024 * 1024), 2)
        }

        # 总体健康状态
        critical_count = sum(1 for cat in health_analysis['categories'].values() if cat['status'] == 'critical')
        if critical_count > 0:
            health_analysis['overall_health'] = 'critical'
        elif error_count > 0:
            health_analysis['overall_health'] = 'warning'
        elif total_files >= len(self.log_categories) * 0.8:
            health_analysis['overall_health'] = 'good'
        else:
            health_analysis['overall_health'] = 'poor'

        self.logger.info(f"日志健康分析完成，总体状态: {health_analysis['overall_health']}")

        return health_analysis

    def rotate_old_logs(self, days_to_keep: int = 30) -> Dict:
        """轮转旧日志"""
        self.logger.info(f"开始轮转 {days_to_keep} 天前的旧日志...")

        rotation_results = {
            'rotated_files': [],
            'compressed_files': [],
            'deleted_files': [],
            'errors': [],
            'timestamp': datetime.now().isoformat()
        }

        cutoff_time = time.time() - (days_to_keep * 24 * 3600)

        try:
            for log_file in self.logs_dir.rglob("*.log*"):
                if log_file.is_file() and log_file.stat().st_mtime < cutoff_time:
                    try:
                        # 压缩旧日志
                        if not log_file.name.endswith('.gz'):
                            compressed_file = log_file.with_suffix(log_file.suffix + '.gz')

                            with open(log_file, 'rb') as f_in:
                                with gzip.open(compressed_file, 'wb') as f_out:
                                    shutil.copyfileobj(f_in, f_out)

                            rotation_results['compressed_files'].append(str(compressed_file))
                            log_file.unlink()
                            rotation_results['rotated_files'].append(str(log_file))

                        # 删除非常旧的压缩文件
                        elif log_file.stat().st_mtime < time.time() - (90 * 24 * 3600):  # 90天
                            log_file.unlink()
                            rotation_results['deleted_files'].append(str(log_file))

                    except Exception as e:
                        rotation_results['errors'].append(f"{log_file}: {str(e)}")

        except Exception as e:
            self.logger.error(f"日志轮转失败: {e}")
            rotation_results['errors'].append(f"轮转过程错误: {str(e)}")

        self.logger.info(f"日志轮转完成，压缩: {len(rotation_results['compressed_files'])}，删除: {len(rotation_results['deleted_files'])}")

        return rotation_results

    def generate_logging_report(self) -> Dict:
        """生成日志系统报告"""
        self.logger.info("生成日志系统报告...")

        # 验证日志系统
        validation = self.validate_logging_system()

        # 分析日志健康
        health = self.analyze_log_health()

        # 生成报告
        report = {
            'report_type': 'logging_system_report',
            'generated_at': datetime.now().isoformat(),
            'summary': {
                'overall_score': validation['overall_score'],
                'overall_health': health['overall_health'],
                'total_categories': len(self.log_categories),
                'active_categories': len([cat for cat in validation['categories'].values() if cat['file_exists']]),
                'total_size_mb': health['metrics']['total_size_mb'],
                'total_errors': health['metrics']['total_errors']
            },
            'validation': validation,
            'health_analysis': health,
            'recommendations': self._generate_recommendations(validation, health)
        }

        # 保存报告
        report_file = self.logs_dir / f"logging_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        try:
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            self.logger.info(f"日志系统报告已保存: {report_file}")
        except Exception as e:
            self.logger.error(f"保存报告失败: {e}")

        return report

    def _generate_recommendations(self, validation: Dict, health: Dict) -> List[str]:
        """生成改进建议"""
        recommendations = []

        # 基于验证结果的建议
        if validation['overall_score'] < 50:
            recommendations.append("日志系统状态较差，建议立即修复")

        missing_files = [cat for cat, result in validation['categories'].items() if not result['file_exists']]
        if missing_files:
            recommendations.append(f"缺失日志文件: {', '.join(missing_files)}，建议创建")

        # 基于健康分析的建议
        if health['metrics']['total_errors'] > 10:
            recommendations.append("系统错误较多，建议检查错误日志并修复问题")

        if health['metrics']['total_size_mb'] > 500:
            recommendations.append("日志文件较大，建议配置日志轮转和压缩")

        # 检查关键日志
        critical_categories = ['serena_main', 'system_monitor', 'errors']
        for cat in critical_categories:
            if cat in validation['categories']:
                cat_result = validation['categories'][cat]
                if not cat_result['file_exists'] or cat_result['score'] < 50:
                    recommendations.append(f"关键日志 {cat} 状态不佳，需要关注")

        return recommendations


def main():
    """主函数 - 运行增强版日志管理器"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    manager = EnhancedLoggingManager(launchx_root)

    print("🔧 增强版日志管理器")
    print("=" * 50)

    while True:
        print("\n选择操作:")
        print("1. 验证日志系统")
        print("2. 修复日志系统")
        print("3. 分析日志健康")
        print("4. 轮转旧日志")
        print("5. 生成完整报告")
        print("6. 退出")

        try:
            choice = input("\n请输入选择 (1-6): ").strip()

            if choice == '1':
                print("\n🔍 验证日志系统...")
                validation = manager.validate_logging_system()
                print(f"总体评分: {validation['overall_score']:.1f}%")
                for category, result in validation['categories'].items():
                    status = "✅" if result['score'] > 70 else "⚠️" if result['score'] > 30 else "❌"
                    print(f"  {status} {category}: {result['score']:.1f}%")

                if validation['issues']:
                    print(f"\n发现 {len(validation['issues'])} 个问题:")
                    for issue in validation['issues']:
                        print(f"  - {issue}")

            elif choice == '2':
                print("\n🔧 修复日志系统...")
                results = manager.fix_logging_system()
                print(f"修复完成: 成功 {len(results['fixed_items'])} 项，失败 {len(results['failed_items'])} 项")
                if results['fixed_items']:
                    print("修复项目:")
                    for item in results['fixed_items']:
                        print(f"  ✅ {item}")
                if results['failed_items']:
                    print("失败项目:")
                    for item in results['failed_items']:
                        print(f"  ❌ {item}")

            elif choice == '3':
                print("\n📊 分析日志健康...")
                health = manager.analyze_log_health()
                print(f"总体健康状态: {health['overall_health']}")
                print(f"总大小: {health['metrics']['total_size_mb']} MB")
                print(f"总错误数: {health['metrics']['total_errors']}")

                if health['alerts']:
                    print(f"\n发现 {len(health['alerts'])} 个告警:")
                    for alert in health['alerts']:
                        print(f"  🚨 {alert['level'].upper()}: {alert['message']}")

            elif choice == '4':
                print("\n🗂️ 轮转旧日志...")
                days = input("保留天数 (默认30): ").strip()
                try:
                    days = int(days) if days else 30
                except:
                    days = 30

                results = manager.rotate_old_logs(days)
                print(f"轮转完成:")
                print(f"  压缩文件: {len(results['compressed_files'])}")
                print(f"  删除文件: {len(results['deleted_files'])}")
                if results['errors']:
                    print(f"  错误: {len(results['errors'])}")

            elif choice == '5':
                print("\n📋 生成完整报告...")
                report = manager.generate_logging_report()
                print(f"报告生成完成!")
                print(f"总体评分: {report['summary']['overall_score']:.1f}%")
                print(f"健康状态: {report['summary']['overall_health']}")
                print(f"活跃分类: {report['summary']['active_categories']}/{report['summary']['total_categories']}")

                if report['recommendations']:
                    print(f"\n改进建议 ({len(report['recommendations'])} 项):")
                    for i, rec in enumerate(report['recommendations'], 1):
                        print(f"  {i}. {rec}")

            elif choice == '6':
                print("\n👋 退出日志管理器")
                break

            else:
                print("❌ 无效选择，请重新输入")

        except KeyboardInterrupt:
            print("\n\n👋 用户中断，退出日志管理器")
            break
        except Exception as e:
            print(f"\n❌ 操作失败: {e}")


if __name__ == "__main__":
    main()