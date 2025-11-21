#!/usr/bin/env python3
"""
AI项目文档生成工作流程执行器
完整的端到端文档生成工作流程编排

Usage:
  python scripts/workflow_executor.py --project "Project Name" --company "Company Name" --output project_doc.md
  python scripts/workflow_executor.py --workflow "full" --data-file project_data.json --output project_doc.md
"""

import json
import argparse
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

class WorkflowExecutor:
    def __init__(self):
        """初始化工作流程执行器"""
        self.script_dir = Path(__file__).parent
        self.workflows = {
            "validation_only": self.validation_workflow,
            "collection_only": self.collection_workflow,
            "full": self.full_workflow,
            "quick": self.quick_workflow
        }

    def execute_workflow(self, workflow_name: str, **kwargs) -> Dict[str, Any]:
        """执行指定的工作流程"""
        if workflow_name not in self.workflows:
            raise ValueError(f"未知工作流程: {workflow_name}")

        print(f"🚀 开始执行工作流程: {workflow_name}")
        print(f"⏰ 开始时间: {datetime.now().isoformat()}")

        try:
            result = self.workflows[workflow_name](**kwargs)
            print(f"✅ 工作流程完成: {workflow_name}")
            print(f"⏰ 完成时间: {datetime.now().isoformat()}")
            return result
        except Exception as e:
            print(f"❌ 工作流程失败: {workflow_name}")
            print(f"错误: {str(e)}")
            return {
                "success": False,
                "workflow": workflow_name,
                "error": str(e)
            }

    def validation_workflow(self, project_name: str = None, company_name: str = None, **kwargs) -> Dict[str, Any]:
        """验证工作流程：仅进行项目验证"""
        print("📋 Phase 1: 项目存在性验证")

        validation_result = self.run_validation_script(project_name, company_name)

        return {
            "success": True,
            "workflow": "validation_only",
            "validation_result": validation_result,
            "next_steps": self.get_next_steps(validation_result)
        }

    def collection_workflow(self, project_name: str = None, company_name: str = None,
                            sources: List[str] = None, **kwargs) -> Dict[str, Any]:
        """数据收集工作流程：收集项目数据"""
        print("📋 Phase 1: 项目存在性验证")

        # 首先验证项目存在性
        validation_result = self.run_validation_script(project_name, company_name)

        if not validation_result.get('exists', False):
            print("⚠️ 项目存在性验证未通过，跳过数据收集")
            return {
                "success": True,
                "workflow": "collection_only",
                "validation_result": validation_result,
                "data_collected": False,
                "recommendation": "请确认项目信息后再执行数据收集"
            }

        print("📋 Phase 2: 数据收集")

        # 收集数据
        collection_result = self.run_collection_script(project_name, company_name, sources)

        return {
            "success": True,
            "workflow": "collection_only",
            "validation_result": validation_result,
            "collection_result": collection_result,
            "data_collected": True
        }

    def full_workflow(self, project_name: str = None, company_name: str = None,
                      sources: List[str] = None, output_path: str = None, **kwargs) -> Dict[str, Any]:
        """完整工作流程：验证 → 收集 → 生成文档"""

        # 自动生成输出文件名
        if output_path is None:
            safe_project_name = project_name.replace(' ', '_').replace('/', '_')
            output_path = f"{safe_project_name}_project_documentation.md"

        print("📋 Phase 1: 项目存在性验证")
        validation_result = self.run_validation_script(project_name, company_name)

        if not validation_result.get('exists', False):
            print("⚠️ 项目存在性验证未通过")
            print("💡 建议: 请确认项目名称和公司名称的正确性")
            print("📄 将生成基于有限信息的文档")

        print("📋 Phase 2: 数据收集")
        collection_result = self.run_collection_script(project_name, company_name, sources)

        print("📋 Phase 3: 文档生成")

        # 准备生成文档的数据
        doc_data = {
            "project_name": project_name,
            "company_name": company_name,
            "validation_result": validation_result,
            "collection_result": collection_result
        }

        # 生成临时数据文件
        temp_data_file = self.create_temp_data_file(doc_data)

        try:
            # 生成文档
            doc_result = self.run_document_generation_script(temp_data_file, output_path)

            print("📋 Phase 4: 最终验证")
            final_validation = self.validate_generated_document(output_path)

            result = {
                "success": True,
                "workflow": "full",
                "validation_result": validation_result,
                "collection_result": collection_result,
                "document_generated": output_path,
                "final_validation": final_validation
            }

        finally:
            # 清理临时文件
            Path(temp_data_file).unlink()

        return result

    def quick_workflow(self, data_file: str, output_path: str = None, **kwargs) -> Dict[str, Any]:
        """快速工作流程：从现有数据文件生成文档"""

        # 自动生成输出文件名
        if output_path is None:
            output_path = "quick_generated_documentation.md"

        print("📋 Phase 1: 数据验证")
        validation_result = self.run_data_validation_script(data_file)

        print("📋 Phase 2: 文档生成")
        doc_result = self.run_document_generation_script(data_file, output_path)

        print("📋 Phase 3: 质量检查")
        quality_check = self.validate_generated_document(output_path)

        return {
            "success": True,
            "workflow": "quick",
            "validation_result": validation_result,
            "document_generated": output_path,
            "quality_check": quality_check
        }

    def run_validation_script(self, project_name: str, company_name: str) -> Dict[str, Any]:
        """运行验证脚本"""
        try:
            result = subprocess.run([
                sys.executable, str(self.script_dir / "data_validator.py"),
                "--project", project_name,
                "--company", company_name,
                "--validate-existence"
            ], capture_output=True, text=True, cwd=self.script_dir)

            if result.returncode == 0:
                return {
                    "success": True,
                    "exists": True,
                    "output": result.stdout
                }
            else:
                return {
                    "success": False,
                    "exists": False,
                    "output": result.stderr or result.stdout
                }

        except Exception as e:
            return {
                "success": False,
                "exists": False,
                "error": str(e)
            }

    def run_collection_script(self, project_name: str, company_name: str,
                               sources: List[str] = None) -> Dict[str, Any]:
        """运行数据收集脚本"""
        try:
            cmd = [
                sys.executable, str(self.script_dir / "data_collector.py"),
                "--project", project_name,
                "--company", company_name
            ]

            if sources:
                cmd.extend(["--sources", ",".join(sources)])

            result = subprocess.run(cmd, capture_output=True, text=True, cwd=self.script_dir)

            if result.returncode == 0:
                return {
                    "success": True,
                    "output": result.stdout
                }
            else:
                return {
                    "success": False,
                    "error": result.stderr or result.stdout
                }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def run_document_generation_script(self, data_file: str, output_path: str) -> Dict[str, Any]:
        """运行文档生成脚本"""
        try:
            result = subprocess.run([
                sys.executable, str(self.script_dir / "doc_generator.py"),
                "--data-file", data_file,
                "--output", output_path
            ], capture_output=True, text=True, cwd=self.script_dir)

            if result.returncode == 0:
                return {
                    "success": True,
                    "output_path": output_path,
                    "output": result.stdout
                }
            else:
                return {
                    "success": False,
                    "error": result.stderr or result.stdout
                }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def run_data_validation_script(self, data_file: str) -> Dict[str, Any]:
        """运行数据验证脚本"""
        try:
            result = subprocess.run([
                sys.executable, str(self.script_dir / "data_validator.py"),
                "--data-file", data_file,
                "--benchmark-validation"
            ], capture_output=True, text=True, cwd=self.script_dir)

            if result.returncode == 0:
                return {
                    "success": True,
                    "validation": "PASS",
                    "output": result.stdout
                }
            else:
                return {
                    "success": False,
                    "validation": "FAIL",
                    "output": result.stderr or result.stdout
                }

        except Exception as e:
            return {
                "success": False,
                "validation": "ERROR",
                "error": str(e)
            }

    def create_temp_data_file(self, data: Dict[str, Any]) -> str:
        """创建临时数据文件"""
        import tempfile

        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as tmp_file:
            json.dump(data, tmp_file, indent=2, ensure_ascii=False)
            return tmp_file.name

    def validate_generated_document(self, doc_path: str) -> Dict[str, Any]:
        """验证生成的文档质量"""
        try:
            with open(doc_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 简单的质量检查
            file_size = len(content)
            has_sections = "##" in content
            has_metadata = "---" in content

            quality_score = 0
            if file_size > 1000:
                quality_score += 25
            if has_sections:
                quality_score += 25
            if has_metadata:
                quality_score += 25
            if "# " in content:
                quality_score += 25

            return {
                "file_size": file_size,
                "has_sections": has_sections,
                "has_metadata": has_metadata,
                "quality_score": quality_score,
                "quality_grade": self.get_quality_grade(quality_score)
            }

        except Exception as e:
            return {
                "error": str(e),
                "quality_score": 0,
                "quality_grade": "F"
            }

    def get_quality_grade(self, score: int) -> str:
        """获取质量等级"""
        if score >= 90:
            return "A+"
        elif score >= 80:
            return "A"
        elif score >= 70:
            return "B"
        elif score >= 60:
            return "C"
        else:
            return "F"

    def get_next_steps(self, validation_result: Dict[str, Any]) -> List[str]:
        """获取下一步建议"""
        steps = []

        if validation_result.get('exists', False):
            steps.append("✅ 项目存在性验证通过，可以进行数据收集")
            steps.append("🔍 建议收集更多项目信息：技术栈、团队背景、市场定位")
        else:
            steps.append("❌ 项目存在性验证未通过")
            steps.append("🔍 请确认项目名称和公司名称的正确性")
            steps.append("📋 建议检查：公司官方网站、GitHub仓库、LinkedIn页面")

        return steps

def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description='AI项目文档生成工作流程执行器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
工作流程选项:
  validation_only  - 仅验证项目存在性
  collection_only  - 仅收集项目数据
  full            - 完整工作流程（验证→收集→生成文档）
  quick           - 快速工作流程（从数据文件生成文档）

示例用法:
  # 完整工作流程
  python scripts/workflow_executor.py --workflow full --project "AI推荐系统" --company "TechCorp"

  # 快速工作流程
  python scripts/workflow_executor.py --workflow quick --data-file project_data.json

  # 仅验证
  python scripts/workflow_executor.py --workflow validation_only --project "AI推荐系统" --company "TechCorp"
        """
    )

    parser.add_argument('--workflow', choices=['validation_only', 'collection_only', 'full', 'quick'],
                       default='full', help='工作流程类型')

    # 项目信息参数（用于非quick工作流程）
    parser.add_argument('--project', help='项目名称')
    parser.add_argument('--company', help='公司名称')

    # 数据和输出参数
    parser.add_argument('--data-file', help='项目数据JSON文件路径（quick工作流程使用）')
    parser.add_argument('--output', help='输出文档文件路径')
    parser.add_argument('--sources', help='数据源列表，逗号分隔 (github,linkedin,crunchbase,web)')

    args = parser.parse_args()

    # 验证参数
    if args.workflow != 'quick' and not (args.project and args.company):
        parser.error(f"{args.workflow} 工作流程需要 --project 和 --company 参数")

    if args.workflow == 'quick' and not args.data_file:
        parser.error("quick 工作流程需要 --data-file 参数")

    # 初始化执行器
    executor = WorkflowExecutor()

    # 准备工作参数
    workflow_kwargs = {}

    if args.workflow != 'quick':
        workflow_kwargs.update({
            'project': args.project,
            'company': args.company
        })
        if args.sources:
            workflow_kwargs['sources'] = [s.strip() for s in args.sources.split(',')]

    if args.data_file:
        workflow_kwargs['data_file'] = args.data_file

    if args.output:
        workflow_kwargs['output_path'] = args.output

    # 执行工作流程
    try:
        result = executor.execute_workflow(args.workflow, **workflow_kwargs)

        if result.get('success', False):
            print("🎉 工作流程执行成功!")

            # 显示关键结果
            if 'document_generated' in result:
                print(f"📄 文档已生成: {result['document_generated']}")

            if 'final_validation' in result:
                validation = result['final_validation']
                print(f"📊 文档质量: {validation['quality_grade']} ({validation['quality_score']}分)")

            if 'next_steps' in result:
                print("\n📋 下一步建议:")
                for step in result['next_steps']:
                    print(f"  {step}")
        else:
            print("❌ 工作流程执行失败!")
            if 'error' in result:
                print(f"错误: {result['error']}")
            sys.exit(1)

    except Exception as e:
        print(f"❌ 执行出错: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()