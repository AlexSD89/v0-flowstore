#!/usr/bin/env python3
"""
一键自动化执行器: 自然语言需求 → 理解 → 生成 → 执行 → 日常运营

使用方式:
python automation/one_command_automation.py \
  --request "我是一家AI医疗器械公司，想在小红书建立权威，吸引三甲医院采购决策者" \
  --auto-run

系统自动完成:
1. 自然语言需求理解 (RUBE MCP + BMAD Agent)
2. 配置生成和文档创建 (bootstrap_client.py)  
3. 自动化运营启动 (run_client.py)
4. 日常任务调度和监控
"""

import asyncio
import json
import subprocess
import time
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
import logging
import argparse

# 项目路径配置
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
CLIENTS_ROOT = PROJECT_ROOT / "clients"
AUTOMATION_ROOT = PROJECT_ROOT / "automation"

# 日志配置
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(PROJECT_ROOT / "automation" / "one_command.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class NaturalLanguageProcessor:
    """自然语言需求理解器"""
    
    def __init__(self):
        self.industry_keywords = {
            "医疗": ["医疗", "医院", "医生", "器械", "药品", "健康", "诊断", "治疗"],
            "教育": ["教育", "学校", "培训", "课程", "学生", "老师", "知识", "学习"],
            "金融": ["金融", "银行", "投资", "理财", "保险", "证券", "基金", "风险"],
            "电商": ["电商", "购物", "商城", "销售", "商品", "客户", "转化", "GMV"],
            "SaaS": ["软件", "系统", "平台", "服务", "企业", "效率", "管理", "数据"],
            "制造": ["制造", "工厂", "生产", "设备", "质量", "供应链", "自动化"]
        }
        
        self.audience_keywords = {
            "企业决策者": ["CEO", "CTO", "决策者", "管理层", "领导", "高管"],
            "技术人员": ["开发", "工程师", "技术", "程序员", "架构师", "CTO"],
            "采购人员": ["采购", "采购员", "供应商", "采购决策", "买家"],
            "普通消费者": ["用户", "消费者", "客户", "个人", "家庭"]
        }
        
    def analyze_request(self, request: str) -> Dict:
        """分析自然语言需求，提取结构化信息"""
        analysis = {
            "industry": self._detect_industry(request),
            "target_audience": self._detect_audience(request),
            "goals": self._extract_goals(request),
            "channels": self._extract_channels(request),
            "tone": self._detect_tone(request),
            "urgency": self._detect_urgency(request)
        }
        
        logger.info(f"需求分析结果: {analysis}")
        return analysis
    
    def _detect_industry(self, text: str) -> str:
        """检测行业类型"""
        for industry, keywords in self.industry_keywords.items():
            if any(keyword in text for keyword in keywords):
                return industry
        return "通用"
    
    def _detect_audience(self, text: str) -> str:
        """检测目标受众"""
        for audience, keywords in self.audience_keywords.items():
            if any(keyword in text for keyword in keywords):
                return audience
        return "企业决策者"
    
    def _extract_goals(self, text: str) -> List[str]:
        """提取业务目标"""
        goals = []
        if "权威" in text or "专业" in text:
            goals.append("建立权威认知")
        if "获客" in text or "客户" in text:
            goals.append("获取潜在客户")
        if "品牌" in text:
            goals.append("品牌建设")
        if "销售" in text or "转化" in text:
            goals.append("销售转化")
        
        return goals if goals else ["品牌建设"]
    
    def _extract_channels(self, text: str) -> List[str]:
        """提取营销渠道"""
        channels = []
        if "小红书" in text:
            channels.append("小红书")
        if "微博" in text:
            channels.append("微博")
        if "抖音" in text:
            channels.append("抖音")
        
        return channels if channels else ["小红书"]
    
    def _detect_tone(self, text: str) -> str:
        """检测品牌调性"""
        if "专业" in text or "权威" in text:
            return "专业权威"
        elif "亲和" in text or "友好" in text:
            return "亲和友好"
        elif "创新" in text or "前沿" in text:
            return "创新前沿"
        else:
            return "专业权威"
    
    def _detect_urgency(self, text: str) -> str:
        """检测紧急程度"""
        if "紧急" in text or "立即" in text:
            return "高"
        elif "尽快" in text:
            return "中"
        else:
            return "正常"


class ConfigurationGenerator:
    """配置生成器"""
    
    def __init__(self):
        self.industry_configs = {
            "医疗": {
                "brand_voice_keywords": "权威、专业、可信、科学",
                "disallowed_phrases": "包治百病,神药,秘方",
                "content_length_rules": "图文 600-800 字，严格遵循医疗广告法",
                "manual_review_cases": "所有医疗相关内容必须人工审核",
                "legal_refs": "《医疗广告管理办法》《药品广告审查办法》"
            },
            "金融": {
                "brand_voice_keywords": "稳健、专业、可靠、合规",
                "disallowed_phrases": "保本收益,稳赚不赔,高回报零风险",
                "content_length_rules": "图文 500-700 字，必须包含风险提示",
                "manual_review_cases": "理财产品、投资建议相关内容",
                "legal_refs": "《证券投资基金法》《银行业监督管理法》"
            },
            "教育": {
                "brand_voice_keywords": "专业、启发、成长、实用",
                "disallowed_phrases": "包过,保分,内幕消息",
                "content_length_rules": "图文 400-600 字，注重教育价值",
                "manual_review_cases": "涉及未成年人教育的内容",
                "legal_refs": "《教育法》《未成年人保护法》"
            }
        }
    
    def generate_config(self, client_slug: str, analysis: Dict) -> Dict:
        """根据需求分析生成客户配置"""
        
        # 基础配置
        config = {
            "client_name": f"{client_slug.replace('-', ' ').title()}",
            "client_slug": client_slug,
            "industry": analysis["industry"],
            "target_audience": analysis["target_audience"],
            "project_goal": " + ".join(analysis["goals"]),
            
            # 品牌配置
            "brand_vision": f"在{analysis['channels'][0]}建立{analysis['industry']}领域权威认知",
            "brand_voice_keywords": self._get_industry_config(analysis["industry"], "brand_voice_keywords"),
            "disallowed_phrases": self._get_industry_config(analysis["industry"], "disallowed_phrases"),
            
            # 内容策略
            "content_length_rules": self._get_industry_config(analysis["industry"], "content_length_rules"),
            "daily_publish_limit": 3 if analysis["urgency"] == "高" else 2,
            "post_count": 5,
            
            # 技术配置
            "primary_mcp": "xiaohongshu-mcp",
            "additional_mcp": ["rube"],
            "preferred_agent": "Claude 3.5 Sonnet",
            
            # 监控配置
            "success_metrics": analysis["goals"],
            "report_frequency": "weekly",
            
            # 合规配置
            "legal_refs": self._get_industry_config(analysis["industry"], "legal_refs"),
            "manual_review_cases": self._get_industry_config(analysis["industry"], "manual_review_cases"),
            
            # 时间配置
            "timeframe": "T0+90 天三阶段里程碑",
            "created_at": datetime.now().isoformat(),
            "auto_generated": True
        }
        
        return config
    
    def _get_industry_config(self, industry: str, key: str) -> str:
        """获取行业特定配置"""
        if industry in self.industry_configs:
            return self.industry_configs[industry].get(key, "")
        return ""


class AutomationOrchestrator:
    """自动化编排器"""
    
    def __init__(self):
        self.nlp = NaturalLanguageProcessor()
        self.config_gen = ConfigurationGenerator()
        self.active_clients = {}
        
    async def execute_full_automation(self, request: str, auto_run: bool = True) -> Dict:
        """执行完整的自动化流程"""
        
        try:
            # Step 1: 需求理解
            logger.info("🧠 开始自然语言需求分析...")
            analysis = self.nlp.analyze_request(request)
            
            # Step 2: 生成客户slug和配置
            client_slug = self._generate_client_slug(analysis)
            config = self.config_gen.generate_config(client_slug, analysis)
            
            logger.info(f"📝 为客户 {client_slug} 生成配置完成")
            
            # Step 3: 保存配置文件
            config_path = self._save_config(client_slug, config)
            
            # Step 4: 执行bootstrap生成文档
            logger.info("🏗️ 开始生成客户工作空间...")
            bootstrap_result = await self._run_bootstrap(client_slug, config_path)
            
            if not bootstrap_result["success"]:
                raise Exception(f"Bootstrap失败: {bootstrap_result['error']}")
            
            # Step 5: 如果auto_run=True，启动自动化运营
            if auto_run:
                logger.info("🚀 启动自动化运营...")
                run_result = await self._run_client(client_slug)
                
                # Step 6: 设置日常任务调度
                await self._setup_daily_tasks(client_slug, config)
                
                return {
                    "success": True,
                    "client_slug": client_slug,
                    "analysis": analysis,
                    "config": config,
                    "bootstrap_result": bootstrap_result,
                    "run_result": run_result,
                    "message": f"客户 {client_slug} 自动化系统已启动，正在执行日常运营任务"
                }
            else:
                return {
                    "success": True,
                    "client_slug": client_slug,
                    "analysis": analysis,
                    "config": config,
                    "bootstrap_result": bootstrap_result,
                    "message": f"客户 {client_slug} 工作空间已准备就绪，可手动执行运营"
                }
                
        except Exception as e:
            logger.error(f"自动化执行失败: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "message": "自动化执行过程中发生错误"
            }
    
    def _generate_client_slug(self, analysis: Dict) -> str:
        """生成客户标识符"""
        # 基于行业和时间生成唯一客户标识
        industry_short = {
            "医疗": "med", "教育": "edu", "金融": "fin",
            "电商": "ecom", "SaaS": "saas", "制造": "mfg"
        }.get(analysis["industry"], "gen")
        
        timestamp = datetime.now().strftime("%m%d")
        random_id = str(uuid.uuid4())[:4]
        
        return f"{industry_short}-client-{timestamp}-{random_id}"
    
    def _save_config(self, client_slug: str, config: Dict) -> Path:
        """保存客户配置文件"""
        config_dir = AUTOMATION_ROOT / "spec-kit" / "configs"
        config_dir.mkdir(parents=True, exist_ok=True)
        
        config_path = config_dir / f"{client_slug}.json"
        config_path.write_text(
            json.dumps(config, ensure_ascii=False, indent=2), 
            encoding="utf-8"
        )
        
        logger.info(f"配置文件已保存: {config_path}")
        return config_path
    
    async def _run_bootstrap(self, client_slug: str, config_path: Path) -> Dict:
        """执行bootstrap生成文档"""
        try:
            cmd = [
                "python", str(AUTOMATION_ROOT / "spec-kit" / "bootstrap_client.py"),
                "--client", client_slug,
                "--config", str(config_path),
                "--force"
            ]
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                cwd=PROJECT_ROOT
            )
            
            if result.returncode == 0:
                return {
                    "success": True,
                    "output": result.stdout,
                    "message": "Bootstrap执行成功"
                }
            else:
                return {
                    "success": False,
                    "error": result.stderr,
                    "output": result.stdout
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _run_client(self, client_slug: str) -> Dict:
        """启动客户自动化运营"""
        try:
            # 首先执行dry-run检查
            dry_run_cmd = [
                "python", str(AUTOMATION_ROOT / "run_client.py"),
                "--client", client_slug,
                "--dry-run"
            ]
            
            dry_run_result = subprocess.run(
                dry_run_cmd,
                capture_output=True,
                text=True,
                cwd=PROJECT_ROOT
            )
            
            if dry_run_result.returncode != 0:
                return {
                    "success": False,
                    "error": f"Dry-run失败: {dry_run_result.stderr}",
                    "phase": "dry-run"
                }
            
            # 执行正式运营
            run_cmd = [
                "python", str(AUTOMATION_ROOT / "run_client.py"),
                "--client", client_slug
            ]
            
            # 使用异步执行避免阻塞
            process = await asyncio.create_subprocess_exec(
                *run_cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=PROJECT_ROOT
            )
            
            # 记录进程以便后续监控
            self.active_clients[client_slug] = {
                "process": process,
                "start_time": datetime.now(),
                "status": "running"
            }
            
            return {
                "success": True,
                "message": f"客户 {client_slug} 自动化运营已启动",
                "process_id": process.pid,
                "phase": "running"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "phase": "execution"
            }
    
    async def _setup_daily_tasks(self, client_slug: str, config: Dict):
        """设置日常任务调度"""
        logger.info(f"为客户 {client_slug} 设置日常任务调度...")
        
        # 创建任务调度文件
        schedule_config = {
            "client_slug": client_slug,
            "daily_publish_limit": config.get("daily_publish_limit", 2),
            "publish_times": ["09:00", "14:00", "19:00"],
            "monitoring_interval": 30,  # 30分钟监控一次
            "report_frequency": config.get("report_frequency", "weekly"),
            "auto_retry": True,
            "max_retries": 3
        }
        
        # 保存调度配置
        schedule_path = CLIENTS_ROOT / client_slug / "schedule.json"
        schedule_path.parent.mkdir(parents=True, exist_ok=True)
        schedule_path.write_text(
            json.dumps(schedule_config, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
        
        # 启动监控任务
        asyncio.create_task(self._monitor_client(client_slug, schedule_config))
        
        logger.info(f"客户 {client_slug} 日常任务调度已配置")
    
    async def _monitor_client(self, client_slug: str, schedule: Dict):
        """监控客户运营状态"""
        logger.info(f"开始监控客户 {client_slug}...")
        
        while client_slug in self.active_clients:
            try:
                # 检查进程状态
                if self.active_clients[client_slug]["process"].returncode is not None:
                    logger.warning(f"客户 {client_slug} 进程已结束，尝试重启...")
                    await self._restart_client(client_slug)
                
                # 检查日志和性能
                await self._check_client_health(client_slug)
                
                # 等待下次检查
                await asyncio.sleep(schedule["monitoring_interval"] * 60)
                
            except Exception as e:
                logger.error(f"监控客户 {client_slug} 时发生错误: {e}")
                await asyncio.sleep(60)  # 发生错误时等待1分钟再重试
    
    async def _restart_client(self, client_slug: str):
        """重启客户自动化服务"""
        logger.info(f"重启客户 {client_slug} 的自动化服务...")
        
        # 清理旧进程
        if client_slug in self.active_clients:
            del self.active_clients[client_slug]
        
        # 重新启动
        restart_result = await self._run_client(client_slug)
        
        if restart_result["success"]:
            logger.info(f"客户 {client_slug} 重启成功")
        else:
            logger.error(f"客户 {client_slug} 重启失败: {restart_result.get('error')}")
    
    async def _check_client_health(self, client_slug: str):
        """检查客户服务健康状态"""
        client_dir = CLIENTS_ROOT / client_slug
        
        # 检查日志文件
        logs_dir = client_dir / "logs"
        if logs_dir.exists():
            latest_log = max(logs_dir.glob("*.log"), key=lambda x: x.stat().st_mtime, default=None)
            if latest_log:
                # 检查最近的日志是否有错误
                log_content = latest_log.read_text(encoding="utf-8")[-1000:]  # 只读最后1000字符
                if "ERROR" in log_content:
                    logger.warning(f"客户 {client_slug} 日志中发现错误")
        
        # 检查状态文件
        status_file = client_dir / "status.json"
        if status_file.exists():
            try:
                status = json.loads(status_file.read_text(encoding="utf-8"))
                last_update = datetime.fromisoformat(status.get("last_update", ""))
                
                # 如果超过2小时没有更新，可能有问题
                if datetime.now() - last_update > timedelta(hours=2):
                    logger.warning(f"客户 {client_slug} 状态文件超过2小时未更新")
                    
            except Exception as e:
                logger.error(f"读取客户 {client_slug} 状态文件失败: {e}")


async def main():
    parser = argparse.ArgumentParser(description="一键自动化执行器")
    parser.add_argument("--request", required=True, help="自然语言需求描述")
    parser.add_argument("--auto-run", action="store_true", help="自动启动运营")
    parser.add_argument("--dry-run", action="store_true", help="仅生成配置，不执行")
    
    args = parser.parse_args()
    
    orchestrator = AutomationOrchestrator()
    
    logger.info("=" * 50)
    logger.info("🚀 一键自动化执行器启动")
    logger.info("=" * 50)
    logger.info(f"📝 客户需求: {args.request}")
    
    if args.dry_run:
        logger.info("🔍 执行模式: 仅生成配置")
        result = await orchestrator.execute_full_automation(args.request, auto_run=False)
    else:
        logger.info(f"⚡ 执行模式: {'自动运营' if args.auto_run else '手动运营'}")
        result = await orchestrator.execute_full_automation(args.request, auto_run=args.auto_run)
    
    # 输出结果
    if result["success"]:
        logger.info("✅ 自动化执行成功！")
        logger.info(f"📋 客户标识: {result['client_slug']}")
        logger.info(f"💬 执行结果: {result['message']}")
        
        if args.auto_run and not args.dry_run:
            logger.info("🔄 系统将持续运行日常任务...")
            logger.info("📊 可通过日志文件监控运行状态")
            
            # 保持程序运行以监控客户
            try:
                while True:
                    await asyncio.sleep(60)
            except KeyboardInterrupt:
                logger.info("🛑 用户中断，正在停止自动化服务...")
                
    else:
        logger.error("❌ 自动化执行失败！")
        logger.error(f"🚨 错误信息: {result['message']}")
        exit(1)


if __name__ == "__main__":
    asyncio.run(main())