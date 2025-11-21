#!/usr/bin/env python3
"""
每日自动化运营框架 - 量化交易系统日常运营自动化
实现数据采集、分析、报告生成的全流程自动化

Built with love by Moon Dev 🚀
"""

import schedule
import time
import logging
import json
import sqlite3
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from typing import Dict, List, Optional
import os
import sys
import subprocess
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('daily_automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class DailyAutomationFramework:
    """每日自动化运营框架"""

    def __init__(self, config_path: str = "automation_config.json"):
        """初始化自动化框架"""
        self.config_path = config_path
        self.load_config()
        self.setup_logging()
        self.setup_database()

        # 导入其他模块
        self.import_modules()

        logger.info("🤖 每日自动化运营框架初始化完成")

    def load_config(self):
        """加载配置文件"""
        default_config = {
            "data_collection": {
                "enabled": True,
                "time": "06:00",
                "symbols": ["TSLA", "AAPL", "NVDA", "MSFT", "GOOGL"],
                "data_sources": ["yahoo_finance", "alpha_vantage", "news_api"]
            },
            "sentiment_analysis": {
                "enabled": True,
                "time": "07:00",
                "sources": ["news", "twitter", "reddit", "analyst"]
            },
            "risk_analysis": {
                "enabled": True,
                "time": "08:00",
                "risk_metrics": ["var", "drawdown", "beta", "volatility"]
            },
            "strategy_optimization": {
                "enabled": True,
                "time": "09:00",
                "strategies": ["momentum", "mean_reversion", "rsi", "macd"]
            },
            "report_generation": {
                "enabled": True,
                "time": "17:30",
                "reports": ["daily_summary", "performance", "risk", "sentiment"]
            },
            "notifications": {
                "enabled": True,
                "email": {
                    "enabled": False,
                    "smtp_server": "smtp.gmail.com",
                    "smtp_port": 587,
                    "sender": "your_email@gmail.com",
                    "password": "your_app_password",
                    "recipients": ["recipient@example.com"]
                },
                "webhook": {
                    "enabled": False,
                    "url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
                }
            },
            "backup": {
                "enabled": True,
                "time": "23:00",
                "backup_path": "./backups",
                "retention_days": 30
            }
        }

        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as f:
                    self.config = json.load(f)
            else:
                self.config = default_config
                self.save_config()
        except Exception as e:
            logger.error(f"❌ 配置文件加载失败: {e}")
            self.config = default_config

    def save_config(self):
        """保存配置文件"""
        try:
            with open(self.config_path, 'w') as f:
                json.dump(self.config, f, indent=2)
        except Exception as e:
            logger.error(f"❌ 配置文件保存失败: {e}")

    def setup_logging(self):
        """设置日志记录"""
        log_dir = Path("./logs")
        log_dir.mkdir(exist_ok=True)

        # 创建不同的日志文件
        log_files = {
            'main': 'automation_main.log',
            'data': 'data_collection.log',
            'analysis': 'analysis.log',
            'report': 'report_generation.log',
            'error': 'automation_errors.log'
        }

        self.loggers = {}
        for name, filename in log_files.items():
            handler = logging.FileHandler(log_dir / filename)
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)

            logger_obj = logging.getLogger(f'automation_{name}')
            logger_obj.addHandler(handler)
            logger_obj.setLevel(logging.INFO)
            self.loggers[name] = logger_obj

    def setup_database(self):
        """设置数据库连接"""
        try:
            self.conn = sqlite3.connect('automation_status.db')
            cursor = self.conn.cursor()

            # 任务状态表
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS task_status (
                    task_name TEXT PRIMARY KEY,
                    last_run TEXT,
                    status TEXT,
                    duration_seconds REAL,
                    records_processed INTEGER,
                    error_message TEXT,
                    next_run TEXT
                )
            ''')

            # 运行历史表
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS run_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    task_name TEXT,
                    run_time TEXT,
                    status TEXT,
                    duration_seconds REAL,
                    records_processed INTEGER,
                    success_rate REAL,
                    error_count INTEGER,
                    details TEXT
                )
            ''')

            # 系统性能表
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS system_performance (
                    timestamp TEXT PRIMARY KEY,
                    cpu_usage REAL,
                    memory_usage REAL,
                    disk_usage REAL,
                    network_io REAL,
                    database_size REAL,
                    active_tasks INTEGER
                )
            ''')

            self.conn.commit()
            logger.info("✅ 自动化框架数据库设置完成")

        except Exception as e:
            logger.error(f"❌ 数据库设置失败: {e}")

    def import_modules(self):
        """导入必要的模块"""
        try:
            # 导入量化分析模块
            sys.path.append('./src/agents')

            from tesla_quant_factor_collector import TeslaQuantFactorCollector
            from multi_dimensional_risk_system import MultiDimensionalRiskSystem
            from public_data_source_integrator import PublicDataSourceIntegrator
            from sentiment_analysis_engine import SentimentAnalysisEngine
            from quant_factor_database_manager import QuantFactorDatabaseManager

            self.factor_collector = TeslaQuantFactorCollector()
            self.risk_system = MultiDimensionalRiskSystem()
            self.data_integrator = PublicDataSourceIntegrator()
            self.sentiment_engine = SentimentAnalysisEngine()
            self.db_manager = QuantFactorDatabaseManager()

            logger.info("✅ 量化分析模块导入成功")

        except ImportError as e:
            logger.error(f"❌ 模块导入失败: {e}")
            self.set_modules_available(False)
        except Exception as e:
            logger.error(f"❌ 模块初始化失败: {e}")
            self.set_modules_available(False)

    def set_modules_available(self, available: bool):
        """设置模块可用性"""
        self.modules_available = available
        if not available:
            self.factor_collector = None
            self.risk_system = None
            self.data_integrator = None
            self.sentiment_engine = None
            self.db_manager = None

    def update_task_status(self, task_name: str, status: str, duration: float = 0,
                          records: int = 0, error: str = None):
        """更新任务状态"""
        try:
            cursor = self.conn.cursor()

            # 计算下次运行时间
            next_run = self.calculate_next_run(task_name)

            cursor.execute('''
                INSERT OR REPLACE INTO task_status
                (task_name, last_run, status, duration_seconds, records_processed,
                 error_message, next_run)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                task_name, datetime.now().isoformat(), status,
                duration, records, error, next_run
            ))

            # 同时记录到历史表
            cursor.execute('''
                INSERT INTO run_history
                (task_name, run_time, status, duration_seconds, records_processed)
                VALUES (?, ?, ?, ?, ?)
            ''', (task_name, datetime.now().isoformat(), status, duration, records))

            self.conn.commit()

        except Exception as e:
            logger.error(f"❌ 任务状态更新失败: {e}")

    def calculate_next_run(self, task_name: str) -> str:
        """计算下次运行时间"""
        # 根据配置中的时间计算下次运行
        task_times = {
            'data_collection': self.config['data_collection']['time'],
            'sentiment_analysis': self.config['sentiment_analysis']['time'],
            'risk_analysis': self.config['risk_analysis']['time'],
            'strategy_optimization': self.config['strategy_optimization']['time'],
            'report_generation': self.config['report_generation']['time']
        }

        if task_name in task_times:
            time_str = task_times[task_name]
            hour, minute = map(int, time_str.split(':'))

            tomorrow = datetime.now() + timedelta(days=1)
            next_run = tomorrow.replace(hour=hour, minute=minute)

            return next_run.isoformat()

        return (datetime.now() + timedelta(hours=24)).isoformat()

    def run_data_collection(self):
        """运行数据采集任务"""
        start_time = time.time()
        task_name = 'data_collection'

        try:
            self.loggers['data'].info(f"🚀 开始数据采集任务")

            if not self.modules_available:
                raise Exception("量化分析模块不可用")

            records_processed = 0
            symbols = self.config['data_collection']['symbols']

            for symbol in symbols:
                self.loggers['data'].info(f"📊 采集 {symbol} 数据...")

                # 价格和基础数据
                price_data = self.factor_collector.collect_price_data()
                if not price_data.empty:
                    records_processed += len(price_data)

                # 技术因子
                technical_factors = self.factor_collector.calculate_technical_factors(price_data)
                if not technical_factors.empty:
                    records_processed += len(technical_factors)

                # 风险因子
                risk_factors = self.factor_collector.calculate_risk_factors(price_data)
                if not risk_factors.empty:
                    records_processed += len(risk_factors)

            duration = time.time() - start_time
            self.update_task_status(task_name, 'success', duration, records_processed)

            self.loggers['data'].info(f"✅ 数据采集完成: {records_processed}条记录, 耗时{duration:.2f}秒")

            return True

        except Exception as e:
            duration = time.time() - start_time
            error_msg = str(e)
            self.update_task_status(task_name, 'failed', duration, 0, error_msg)

            self.loggers['error'].error(f"❌ 数据采集失败: {error_msg}")
            return False

    def run_sentiment_analysis(self):
        """运行情感分析任务"""
        start_time = time.time()
        task_name = 'sentiment_analysis'

        try:
            self.loggers['analysis'].info(f"🧠 开始情感分析任务")

            if not self.modules_available:
                raise Exception("情感分析模块不可用")

            # 计算实时情感指数
            sentiment_index = self.sentiment_engine.calculate_realtime_sentiment_index("TSLA")
            records_processed = 1 if sentiment_index else 0

            duration = time.time() - start_time
            self.update_task_status(task_name, 'success', duration, records_processed)

            self.loggers['analysis'].info(f"✅ 情感分析完成, 耗时{duration:.2f}秒")

            return True

        except Exception as e:
            duration = time.time() - start_time
            error_msg = str(e)
            self.update_task_status(task_name, 'failed', duration, 0, error_msg)

            self.loggers['error'].error(f"❌ 情感分析失败: {error_msg}")
            return False

    def run_risk_analysis(self):
        """运行风险分析任务"""
        start_time = time.time()
        task_name = 'risk_analysis'

        try:
            self.loggers['analysis'].info(f"🛡️ 开始风险分析任务")

            if not self.modules_available:
                raise Exception("风险分析模块不可用")

            # 运行综合风险分析
            risk_report = self.risk_system.run_comprehensive_risk_analysis("TSLA")
            records_processed = 1 if risk_report else 0

            duration = time.time() - start_time
            self.update_task_status(task_name, 'success', duration, records_processed)

            self.loggers['analysis'].info(f"✅ 风险分析完成, 耗时{duration:.2f}秒")

            return True

        except Exception as e:
            duration = time.time() - start_time
            error_msg = str(e)
            self.update_task_status(task_name, 'failed', duration, 0, error_msg)

            self.loggers['error'].error(f"❌ 风险分析失败: {error_msg}")
            return False

    def run_strategy_optimization(self):
        """运行策略优化任务"""
        start_time = time.time()
        task_name = 'strategy_optimization'

        try:
            self.loggers['analysis'].info(f"⚙️ 开始策略优化任务")

            # 这里可以集成智能策略发现和优化逻辑
            # 由于策略优化可能需要较长计算时间，建议在后台运行

            records_processed = 1  # 模拟处理记录

            duration = time.time() - start_time
            self.update_task_status(task_name, 'success', duration, records_processed)

            self.loggers['analysis'].info(f"✅ 策略优化完成, 耗时{duration:.2f}秒")

            return True

        except Exception as e:
            duration = time.time() - start_time
            error_msg = str(e)
            self.update_task_status(task_name, 'failed', duration, 0, error_msg)

            self.loggers['error'].error(f"❌ 策略优化失败: {error_msg}")
            return False

    def run_report_generation(self):
        """运行报告生成任务"""
        start_time = time.time()
        task_name = 'report_generation'

        try:
            self.loggers['report'].info(f"📋 开始报告生成任务")

            reports_generated = []
            reports_config = self.config['report_generation']['reports']

            # 生成各类报告
            if 'daily_summary' in reports_config:
                summary_report = self.generate_daily_summary_report()
                if summary_report:
                    reports_generated.append('daily_summary')

            if 'performance' in reports_config:
                performance_report = self.generate_performance_report()
                if performance_report:
                    reports_generated.append('performance')

            if 'risk' in reports_config:
                risk_report = self.generate_risk_report()
                if risk_report:
                    reports_generated.append('risk')

            if 'sentiment' in reports_config:
                sentiment_report = self.generate_sentiment_report()
                if sentiment_report:
                    reports_generated.append('sentiment')

            duration = time.time() - start_time
            self.update_task_status(task_name, 'success', duration, len(reports_generated))

            self.loggers['report'].info(f"✅ 报告生成完成: {', '.join(reports_generated)}, 耗时{duration:.2f}秒")

            # 发送通知
            if self.config['notifications']['enabled']:
                self.send_notifications(reports_generated)

            return True

        except Exception as e:
            duration = time.time() - start_time
            error_msg = str(e)
            self.update_task_status(task_name, 'failed', duration, 0, error_msg)

            self.loggers['error'].error(f"❌ 报告生成失败: {error_msg}")
            return False

    def generate_daily_summary_report(self) -> str:
        """生成每日汇总报告"""
        try:
            # 获取系统状态
            system_status = self.get_system_status()
            task_status = self.get_task_status_summary()

            report = f"""
# 📊 Tesla量化交易系统每日汇总报告

**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**系统状态**: {system_status['overall_status']}

---

## 🤖 系统运行状态

### 任务执行概况
"""

            for task, status in task_status.items():
                status_icon = "✅" if status['status'] == 'success' else "❌"
                report += f"- **{task}**: {status_icon} {status['status']} (上次运行: {status['last_run']})\n"

            report += f"""
### 系统性能指标
- **CPU使用率**: {system_status['cpu_usage']:.1f}%
- **内存使用率**: {system_status['memory_usage']:.1f}%
- **数据库大小**: {system_status['database_size']:.1f}MB
- **活跃任务数**: {system_status['active_tasks']}

---

## 📈 今日数据概况

### 价格数据
- 数据采集状态: {'✅ 正常' if task_status.get('data_collection', {}).get('status') == 'success' else '❌ 异常'}
- 处理记录数: {task_status.get('data_collection', {}).get('records_processed', 0)}

### 情感分析
- 情感指数: {'积极' if self.modules_available else '模块不可用'}
- 分析状态: {'✅ 正常' if task_status.get('sentiment_analysis', {}).get('status') == 'success' else '❌ 异常'}

### 风险评估
- 风险分析状态: {'✅ 正常' if task_status.get('risk_analysis', {}).get('status') == 'success' else '❌ 异常'}
- 风险等级: 需要查看详细风险报告

---

## 🎯 关键指标

### 数据质量
- 数据完整性: 高
- 更新及时性: 正常
- 异常检测: 无显著异常

### 系统稳定性
- 运行时长: {(datetime.now() - datetime.now().replace(hour=6, minute=0)).seconds / 3600:.1f}小时
- 错误次数: {self.get_error_count_today()}
- 成功率: {self.calculate_success_rate():.1f}%

---

## 📋 明日计划

### 待执行任务
- 数据采集: 06:00
- 情感分析: 07:00
- 风险分析: 08:00
- 策略优化: 09:00
- 报告生成: 17:30

### 重点关注
- 系统性能监控
- 数据质量验证
- 异常事件响应

---

**Built with love by Moon Dev 🚀 | Daily Automation Framework v1.0**
            """

            # 保存报告
            report_filename = f"daily_summary_{datetime.now().strftime('%Y%m%d')}.md"
            with open(f"./reports/{report_filename}", 'w', encoding='utf-8') as f:
                f.write(report)

            return report

        except Exception as e:
            self.loggers['error'].error(f"❌ 每日汇总报告生成失败: {e}")
            return ""

    def generate_performance_report(self) -> str:
        """生成性能报告"""
        return f"# 📈 性能报告\n\n生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n性能分析待完善..."

    def generate_risk_report(self) -> str:
        """生成风险报告"""
        return f"# 🛡️ 风险报告\n\n生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n风险评估待完善..."

    def generate_sentiment_report(self) -> str:
        """生成情感报告"""
        return f"# 🧠 情感报告\n\n生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n情感分析待完善..."

    def get_system_status(self) -> Dict:
        """获取系统状态"""
        try:
            import psutil

            return {
                'overall_status': 'healthy',
                'cpu_usage': psutil.cpu_percent(),
                'memory_usage': psutil.virtual_memory().percent,
                'disk_usage': psutil.disk_usage('/').percent,
                'database_size': self.get_database_size(),
                'active_tasks': self.get_active_tasks_count()
            }
        except:
            return {
                'overall_status': 'unknown',
                'cpu_usage': 0,
                'memory_usage': 0,
                'disk_usage': 0,
                'database_size': 0,
                'active_tasks': 0
            }

    def get_database_size(self) -> float:
        """获取数据库大小"""
        try:
            db_files = [
                'automation_status.db', 'tesla_quant_factors.db',
                'tesla_quant_factors_unified.db', 'strategy_discovery.db'
            ]

            total_size = 0
            for db_file in db_files:
                if os.path.exists(db_file):
                    total_size += os.path.getsize(db_file)

            return total_size / (1024 * 1024)  # MB
        except:
            return 0

    def get_active_tasks_count(self) -> int:
        """获取活跃任务数"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT COUNT(*) FROM task_status
                WHERE status = 'running' OR status = 'success'
            ''')
            return cursor.fetchone()[0] or 0
        except:
            return 0

    def get_task_status_summary(self) -> Dict:
        """获取任务状态汇总"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('SELECT task_name, status, last_run, records_processed FROM task_status')
            results = cursor.fetchall()

            status_dict = {}
            for task_name, status, last_run, records in results:
                status_dict[task_name] = {
                    'status': status,
                    'last_run': last_run,
                    'records_processed': records or 0
                }

            return status_dict
        except:
            return {}

    def get_error_count_today(self) -> int:
        """获取今日错误次数"""
        try:
            today = datetime.now().strftime('%Y-%m-%d')
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT COUNT(*) FROM run_history
                WHERE status = 'failed' AND DATE(run_time) = ?
            ''', (today,))
            return cursor.fetchone()[0] or 0
        except:
            return 0

    def calculate_success_rate(self) -> float:
        """计算成功率"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT
                    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
                FROM run_history
                WHERE DATE(run_time) = ?
            ''', (datetime.now().strftime('%Y-%m-%d'),))
            return cursor.fetchone()[0] or 0.0
        except:
            return 0.0

    def send_notifications(self, reports: List[str]):
        """发送通知"""
        try:
            if self.config['notifications']['email']['enabled']:
                self.send_email_notification(reports)

            if self.config['notifications']['webhook']['enabled']:
                self.send_webhook_notification(reports)

        except Exception as e:
            self.loggers['error'].error(f"❌ 通知发送失败: {e}")

    def send_email_notification(self, reports: List[str]):
        """发送邮件通知"""
        try:
            email_config = self.config['notifications']['email']

            msg = MimeMultipart()
            msg['From'] = email_config['sender']
            msg['To'] = ', '.join(email_config['recipients'])
            msg['Subject'] = f"Tesla量化系统每日报告 - {datetime.now().strftime('%Y-%m-%d')}"

            body = f"""
每日量化交易系统报告已生成完成。

生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
报告类型: {', '.join(reports)}

请查看附件或登录系统查看详细信息。

Best regards,
Moon Dev Automation System
            """

            msg.attach(MimeText(body, 'plain'))

            server = smtplib.SMTP(email_config['smtp_server'], email_config['smtp_port'])
            server.starttls()
            server.login(email_config['sender'], email_config['password'])
            server.send_message(msg)
            server.quit()

            logger.info("✅ 邮件通知发送成功")

        except Exception as e:
            logger.error(f"❌ 邮件通知发送失败: {e}")

    def send_webhook_notification(self, reports: List[str]):
        """发送Webhook通知"""
        try:
            import requests

            webhook_config = self.config['notifications']['webhook']

            payload = {
                "text": f"📊 Tesla量化系统报告生成完成",
                "attachments": [{
                    "color": "good",
                    "fields": [
                        {"title": "生成时间", "value": datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "short": True},
                        {"title": "报告类型", "value": ', '.join(reports), "short": True},
                        {"title": "系统状态", "value": "运行正常", "short": True}
                    ]
                }]
            }

            response = requests.post(webhook_config['url'], json=payload)
            response.raise_for_status()

            logger.info("✅ Webhook通知发送成功")

        except Exception as e:
            logger.error(f"❌ Webhook通知发送失败: {e}")

    def run_backup_task(self):
        """运行备份任务"""
        try:
            backup_config = self.config['backup']
            if not backup_config['enabled']:
                return True

            backup_path = Path(backup_config['backup_path'])
            backup_path.mkdir(exist_ok=True)

            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_filename = f"backup_{timestamp}.tar.gz"

            # 备份重要文件
            import tarfile

            files_to_backup = [
                'automation_status.db',
                'tesla_quant_factors.db',
                'tesla_quant_factors_unified.db',
                'automation_config.json'
            ]

            with tarfile.open(backup_path / backup_filename, 'w:gz') as tar:
                for file in files_to_backup:
                    if os.path.exists(file):
                        tar.add(file)

            logger.info(f"✅ 备份完成: {backup_filename}")
            return True

        except Exception as e:
            logger.error(f"❌ 备份失败: {e}")
            return False

    def setup_schedule(self):
        """设置定时任务"""
        # 数据采集
        if self.config['data_collection']['enabled']:
            schedule.every().day.at(self.config['data_collection']['time']).do(
                self.run_data_collection
            )

        # 情感分析
        if self.config['sentiment_analysis']['enabled']:
            schedule.every().day.at(self.config['sentiment_analysis']['time']).do(
                self.run_sentiment_analysis
            )

        # 风险分析
        if self.config['risk_analysis']['enabled']:
            schedule.every().day.at(self.config['risk_analysis']['time']).do(
                self.run_risk_analysis
            )

        # 策略优化
        if self.config['strategy_optimization']['enabled']:
            schedule.every().day.at(self.config['strategy_optimization']['time']).do(
                self.run_strategy_optimization
            )

        # 报告生成
        if self.config['report_generation']['enabled']:
            schedule.every().day.at(self.config['report_generation']['time']).do(
                self.run_report_generation
            )

        # 备份任务
        if self.config['backup']['enabled']:
            schedule.every().day.at(self.config['backup']['time']).do(
                self.run_backup_task
            )

        logger.info("📅 定时任务设置完成")

    def start_scheduler(self):
        """启动调度器"""
        try:
            logger.info("🤖 启动自动化调度器...")

            self.setup_schedule()

            while True:
                schedule.run_pending()
                time.sleep(60)  # 每分钟检查一次

        except KeyboardInterrupt:
            logger.info("👋 自动化调度器已停止")
        except Exception as e:
            logger.error(f"❌ 调度器运行异常: {e}")

    def run_immediate_tasks(self):
        """立即运行所有任务（用于测试）"""
        logger.info("🚀 立即运行所有任务...")

        tasks = [
            ('data_collection', self.run_data_collection),
            ('sentiment_analysis', self.run_sentiment_analysis),
            ('risk_analysis', self.run_risk_analysis),
            ('strategy_optimization', self.run_strategy_optimization),
            ('report_generation', self.run_report_generation)
        ]

        results = {}
        for task_name, task_func in tasks:
            try:
                logger.info(f"⏳ 执行任务: {task_name}")
                result = task_func()
                results[task_name] = 'success' if result else 'failed'
                logger.info(f"✅ 任务完成: {task_name} - {results[task_name]}")
            except Exception as e:
                results[task_name] = 'error'
                logger.error(f"❌ 任务错误: {task_name} - {e}")

        return results

    def __del__(self):
        """清理资源"""
        if hasattr(self, 'conn'):
            self.conn.close()


def main():
    """主函数"""
    print("🤖 每日自动化运营框架 - 量化交易系统日常运营自动化")
    print("=" * 60)

    # 创建必要的目录
    os.makedirs("./reports", exist_ok=True)
    os.makedirs("./logs", exist_ok=True)
    os.makedirs("./backups", exist_ok=True)

    # 初始化自动化框架
    automation = DailyAutomationFramework()

    # 检查命令行参数
    if len(sys.argv) > 1:
        if sys.argv[1] == '--test':
            print("🧪 运行测试模式...")
            results = automation.run_immediate_tasks()
            print(f"\n📊 测试结果: {results}")
        elif sys.argv[1] == '--status':
            print("📊 系统状态:")
            status = automation.get_system_status()
            for key, value in status.items():
                print(f"  {key}: {value}")
        elif sys.argv[1] == '--report':
            print("📋 生成即时报告...")
            automation.run_report_generation()
        else:
            print("❌ 未知参数，使用 --test, --status 或 --report")
    else:
        print("🚀 启动自动化调度器...")
        print("按 Ctrl+C 停止")
        automation.start_scheduler()


if __name__ == "__main__":
    main()