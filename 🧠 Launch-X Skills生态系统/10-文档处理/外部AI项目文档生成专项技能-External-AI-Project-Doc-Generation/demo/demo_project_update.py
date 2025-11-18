#!/usr/bin/env python3
"""
Demo: Project Update and Maintenance Workflow

Demonstrates the complete project update workflow:
STRUCT_SCAN → DATA_VERIFY → TREND_LINK → DELIVER_CHECK

Usage:
    python3 demo_project_update.py --project "SERVAL" --update-type "incremental"
"""

import sys
import json
import time
from pathlib import Path
from datetime import datetime, timedelta

# Import our workflow scripts
sys.path.append(str(Path(__file__).parent.parent / "scripts"))

try:
    from update_manager import UpdateManager
    from trend_analyzer import TrendAnalyzer
except ImportError as e:
    print(f"Error importing workflow scripts: {e}")
    sys.exit(1)

class ProjectUpdateDemo:
    """Demonstration of project update and maintenance workflow"""

    def __init__(self, project_name: str, update_type: str = "incremental"):
        self.project_name = project_name
        self.update_type = update_type  # incremental, comprehensive, trend_focused
        self.workflow_id = f"update_{int(time.time())}"
        self.start_time = time.time()

    def execute_demo_workflow(self) -> dict:
        """Execute complete project update workflow demo"""
        print(f"🔄 Starting Project Update Demo")
        print(f"   Project: {self.project_name}")
        print(f"   Update Type: {self.update_type}")
        print(f"   Workflow ID: {self.workflow_id}")
        print(f"   Workflow: STRUCT_SCAN → DATA_VERIFY → TREND_LINK → DELIVER_CHECK")
        print()

        workflow_results = {
            "project_name": self.project_name,
            "workflow_id": self.workflow_id,
            "workflow_type": "project_update",
            "update_type": self.update_type,
            "start_time": self.start_time,
            "steps": {}
        }

        # Step 1: STRUCT_SCAN
        print("=" * 60)
        print("📋 STEP 1: STRUCT_SCAN - Archive Structure Validation")
        print("=" * 60)
        struct_scan_result = self.structural_scan()
        workflow_results["steps"]["struct_scan"] = struct_scan_result
        print()

        if not struct_scan_result["scan_passed"]:
            print("❌ Workflow stopped: Structural issues detected")
            return workflow_results

        # Step 2: DATA_VERIFY
        print("=" * 60)
        print("🔍 STEP 2: DATA_VERIFY - Data Source Validation")
        print("=" * 60)
        data_verify_result = self.data_verification()
        workflow_results["steps"]["data_verify"] = data_verify_result
        print()

        # Step 3: TREND_LINK
        print("=" * 60)
        print("📈 STEP 3: TREND_LINK - Trend Analysis")
        print("=" * 60)
        trend_link_result = self.trend_analysis()
        workflow_results["steps"]["trend_link"] = trend_link_result
        print()

        # Step 4: DELIVER_CHECK
        print("=" * 60)
        print("✅ STEP 4: DELIVER_CHECK - Update Quality Assurance")
        print("=" * 60)
        deliver_check_result = self.delivery_check()
        workflow_results["steps"]["deliver_check"] = deliver_check_result
        print()

        # Final Results
        end_time = time.time()
        workflow_results["end_time"] = end_time
        workflow_results["duration"] = end_time - self.start_time
        workflow_results["overall_quality_score"] = deliver_check_result.get("quality_score", 0)
        workflow_results["update_approved"] = deliver_check_result.get("update_approved", False)

        print("=" * 60)
        print("🎯 WORKFLOW COMPLETION SUMMARY")
        print("=" * 60)
        print(f"   Total Duration: {workflow_results['duration']:.2f} seconds")
        print(f"   Quality Score: {workflow_results['overall_quality_score']:.1f}/100")
        print(f"   Update Status: {'✅ APPROVED' if workflow_results['update_approved'] else '❌ REQUIRES REVISION'}")

        if workflow_results['update_approved']:
            print(f"   📄 Archive Updated: v{workflow_results.get('new_version', '2.0')}")

        print()
        return workflow_results

    def structural_scan(self) -> dict:
        """Simulate STRUCT_SCAN phase"""
        print("   Validating existing archive structure...")

        # Simulate loading existing archive
        print("   📂 Loading existing archive...")
        time.sleep(0.5)

        # Check required sections
        required_sections = [
            "I. 项目概览",
            "📊 II. 融资密码解析",
            "🤖 III. AI范式突破点",
            "🚀 IV. LaunchX集成路线图",
            "V. 知识价值判断",
            "📋 VI. 完整数据溯源"
        ]

        existing_sections = required_sections  # Simulate all sections present
        missing_sections = [s for s in required_sections if s not in existing_sections]

        print("   🔍 Checking section completeness...")
        time.sleep(0.3)
        print(f"      Required sections: {len(required_sections)}")
        print(f"      Sections present: {len(existing_sections)}")
        print(f"      Missing sections: {len(missing_sections)}")

        # Check frontmatter
        frontmatter_fields = ["title", "owners", "status", "last_update", "quality_score"]
        present_frontmatter = frontmatter_fields  # Simulate complete frontmatter

        print("   🔍 Checking frontmatter completeness...")
        time.sleep(0.3)
        print(f"      Required fields: {len(frontmatter_fields)}")
        print(f"      Fields present: {len(present_frontmatter)}")

        # Calculate compliance scores
        structure_compliance = len(existing_sections) / len(required_sections) * 100
        frontmatter_compliance = len(present_frontmatter) / len(frontmatter_fields) * 100
        overall_compliance = (structure_compliance + frontmatter_compliance) / 2

        scan_passed = overall_compliance >= 80

        result = {
            "step": "STRUCT_SCAN",
            "status": "completed",
            "structure_compliance": structure_compliance,
            "frontmatter_compliance": frontmatter_compliance,
            "overall_compliance": overall_compliance,
            "scan_passed": scan_passed,
            "issues_found": len(missing_sections),
            "recommendations": [] if scan_passed else ["Fix missing sections before proceeding"]
        }

        print(f"   Structure compliance: {structure_compliance:.1f}%")
        print(f"   Frontmatter compliance: {frontmatter_compliance:.1f}%")
        print(f"   Overall compliance: {overall_compliance:.1f}%")
        print(f"   Scan result: {'✅ PASSED' if scan_passed else '❌ FAILED'}")

        return result

    def data_verification(self) -> dict:
        """Simulate DATA_VERIFY phase"""
        print("   Validating data sources and credibility...")

        # Simulate VI zone data verification
        vi_zone_data = {
            "zone_a": {"sources": [{"tier": "tier1_primary", "url": "https://example.com"}]},
            "zone_b": {"sources": [{"tier": "tier2_authoritative", "url": "https://example2.com"}]},
            "zone_c": {"sources": [{"tier": "tier3_industry", "url": "https://example3.com"}]}
        }

        print("   🔍 Checking URL accessibility...")
        time.sleep(0.5)
        total_urls = 0
        active_urls = 0

        url_status = {}
        for zone, data in vi_zone_data.items():
            for source in data["sources"]:
                url = source["url"]
                total_urls += 1
                # Simulate URL check
                is_active = "example3.com" not in url  # Simulate one broken link
                if is_active:
                    active_urls += 1
                url_status[url] = {"accessible": is_active, "tier": source["tier"]}

        print(f"      Total URLs checked: {total_urls}")
        print(f"      Active URLs: {active_urls}")
        print(f"      Activity rate: {active_urls/total_urls*100:.1f}%")

        print("   🔍 Calculating credibility scores...")
        time.sleep(0.3)

        credibility_scores = {}
        for zone, data in vi_zone_data.items():
            zone_score = 0.0
            for source in data["sources"]:
                weight = {"tier1_primary": 1.0, "tier2_authoritative": 0.8, "tier3_industry": 0.6}.get(source["tier"], 0.3)
                zone_score += weight
            credibility_scores[zone] = zone_score / len(data["sources"])

        overall_credibility = sum(credibility_scores.values()) / len(credibility_scores)

        print("   🔍 Checking cross-validation...")
        time.sleep(0.3)
        cross_validation_results = {}
        for zone, data in vi_zone_data.items():
            source_count = len(data["sources"])
            cross_validation_results[zone] = {
                "cross_validation_possible": source_count >= 2,
                "source_count": source_count
            }

        verification_passed = overall_credibility >= 0.7 and (active_urls/total_urls) >= 0.8

        result = {
            "step": "DATA_VERIFY",
            "status": "completed",
            "url_activity": {
                "total_checked": total_urls,
                "active_count": active_urls,
                "activity_rate": active_urls/total_urls
            },
            "credibility_scores": credibility_scores,
            "overall_credibility": overall_credibility,
            "cross_validation": cross_validation_results,
            "verification_passed": verification_passed,
            "update_needed": [] if verification_passed else ["Improve data sources and credibility"]
        }

        print(f"   Overall credibility: {overall_credibility:.2f}")
        print(f"   Verification result: {'✅ PASSED' if verification_passed else '❌ FAILED'}")

        return result

    def trend_analysis(self) -> dict:
        """Simulate TREND_LINK phase"""
        print("   Performing trend analysis and insight generation...")

        # Simulate change pattern analysis
        print("   📈 Analyzing change patterns...")
        time.sleep(0.5)
        change_patterns = {
            "financing": {"magnitude": 0.6, "significance": 0.7},
            "product": {"magnitude": 0.8, "significance": 0.9},
            "team": {"magnitude": 0.4, "significance": 0.5},
            "market": {"magnitude": 0.7, "significance": 0.8}
        }

        significant_changes = [
            category for category, data in change_patterns.items()
            if data["significance"] >= 0.7
        ]

        print(f"      Significant changes detected: {len(significant_changes)}")
        for change in significant_changes:
            print(f"        - {change}: {change_patterns[change]['significance']:.1f} significance")

        # Simulate similar project analysis
        print("   🎯 Analyzing similar projects...")
        time.sleep(0.5)
        similar_projects = [
            {"name": "Competitor A", "similarity": 0.85},
            {"name": "Competitor B", "similarity": 0.78},
            {"name": "Competitor C", "similarity": 0.72}
        ]

        high_similarity_count = len([p for p in similar_projects if p["similarity"] >= 0.7])
        average_similarity = sum(p["similarity"] for p in similar_projects) / len(similar_projects)

        print(f"      Similar projects found: {len(similar_projects)}")
        print(f"      High similarity projects: {high_similarity_count}")
        print(f"      Average similarity: {average_similarity:.2f}")

        # Simulate macro trend mapping
        print("   🌐 Mapping to macro trends...")
        time.sleep(0.5)
        macro_trends = {
            "industry_trends": {"relevance": 0.8, "alignment": 0.75},
            "technology_trends": {"relevance": 0.7, "alignment": 0.80},
            "market_trends": {"relevance": 0.6, "alignment": 0.70}
        }

        overall_trend_relevance = sum(t["relevance"] for t in macro_trends.values()) / len(macro_trends)
        overall_alignment = sum(t["alignment"] for t in macro_trends.values()) / len(macro_trends)

        print(f"      Trend relevance: {overall_trend_relevance:.2f}")
        print(f"      Trend alignment: {overall_alignment:.2f}")

        # Calculate overall trend strength
        change_score = sum(data["significance"] for data in change_patterns.values()) / len(change_patterns)
        similarity_score = average_similarity
        macro_score = (overall_trend_relevance + overall_alignment) / 2

        weights = {"change_patterns": 0.3, "similar_projects": 0.3, "macro_trends": 0.4}
        trend_strength = (
            change_score * weights["change_patterns"] +
            similarity_score * weights["similar_projects"] +
            macro_score * weights["macro_trends"]
        )

        trend_analysis_completed = trend_strength >= 0.5

        result = {
            "step": "TREND_LINK",
            "status": "completed",
            "change_patterns": change_patterns,
            "significant_changes": len(significant_changes),
            "similar_projects": {
                "count": len(similar_projects),
                "high_similarity_count": high_similarity_count,
                "average_similarity": average_similarity
            },
            "macro_trends": macro_trends,
            "trend_strength": trend_strength,
            "trend_analysis_completed": trend_analysis_completed,
            "insights_generated": [
                f"Strong {change} patterns detected" for change in significant_changes
            ]
        }

        print(f"   Overall trend strength: {trend_strength:.2f}")
        print(f"   Analysis result: {'✅ COMPLETED' if trend_analysis_completed else '⚠️ LIMITED DATA'}")

        return result

    def delivery_check(self) -> dict:
        """Simulate DELIVER_CHECK phase for updates"""
        print("   Performing update quality assurance...")

        # Simulate enhanced quality metrics for updates
        checks = {
            "structure_validation": {"score": 90, "weight": 0.3},
            "quality_metrics": {"score": 85, "weight": 0.4},
            "change_documentation": {"score": 88, "weight": 0.2},
            "trend_integration": {"score": 82, "weight": 0.1}
        }

        print("   🔍 Validating updated structure...")
        time.sleep(0.2)
        print(f"      Score: {checks['structure_validation']['score']}/100")

        print("   🔍 Assessing update quality metrics...")
        time.sleep(0.2)
        print(f"      Score: {checks['quality_metrics']['score']}/100")

        print("   🔍 Checking change documentation...")
        time.sleep(0.2)
        print(f"      Score: {checks['change_documentation']['score']}/100")

        print("   🔍 Verifying trend integration...")
        time.sleep(0.2)
        print(f"      Score: {checks['trend_integration']['score']}/100")

        # Calculate overall quality score
        overall_score = sum(
            check["score"] * check["weight"]
            for check in checks.values()
        )

        update_approved = overall_score >= 85

        result = {
            "step": "DELIVER_CHECK",
            "status": "completed",
            "quality_checks": checks,
            "overall_quality_score": overall_score,
            "update_approved": update_approved,
            "minimum_threshold": 85,
            "new_version": "2.1" if update_approved else None,
            "quality_level": self._get_quality_level(overall_score)
        }

        print(f"   Overall Quality Score: {overall_score:.1f}/100")
        print(f"   Quality Level: {result['quality_level']}")
        print(f"   Update Status: {'✅ APPROVED' if update_approved else '❌ REQUIRES REVISION'}")

        if update_approved:
            print(f"   New Version: {result['new_version']}")

        return result

    def _get_quality_level(self, score: float) -> str:
        """Get quality level description based on score"""
        if score >= 95:
            return "EXCELLENT_UPDATE"
        elif score >= 85:
            return "GOOD_UPDATE"
        elif score >= 70:
            return "ACCEPTABLE_UPDATE"
        else:
            return "REQUIRES_REVISION"

    def save_demo_results(self, workflow_results: dict) -> str:
        """Save demo results to file"""
        output_dir = Path("demo_results")
        output_dir.mkdir(exist_ok=True)

        output_file = output_dir / f"project_update_demo_{self.project_name}_{self.update_type}_{int(time.time())}.json"

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(workflow_results, f, indent=2, ensure_ascii=False)

        return str(output_file)


def main():
    """Main execution function"""
    if len(sys.argv) < 3:
        print("Usage: python3 demo_project_update.py --project <project_name> [--update-type <type>]")
        print("\nUpdate types:")
        print("  incremental     - Add new information, verify existing data")
        print("  comprehensive   - Complete data refresh with full trend analysis")
        print("  trend_focused   - Emphasize trend analysis and insight generation")
        print("\nExample:")
        print("  python3 demo_project_update.py --project \"SERVAL\" --update-type \"incremental\"")
        sys.exit(1)

    project_name = None
    update_type = "incremental"

    # Parse command line arguments
    i = 1
    while i < len(sys.argv):
        if sys.argv[i] == "--project" and i + 1 < len(sys.argv):
            project_name = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == "--update-type" and i + 1 < len(sys.argv):
            update_type = sys.argv[i + 1]
            i += 2
        else:
            i += 1

    if not project_name:
        print("Error: --project parameter is required")
        sys.exit(1)

    if update_type not in ["incremental", "comprehensive", "trend_focused"]:
        print(f"Error: Invalid update type '{update_type}'. Must be one of: incremental, comprehensive, trend_focused")
        sys.exit(1)

    print("🔄 External Project Analyzer - Project Update Demo")
    print("=" * 60)
    print()

    # Execute demo workflow
    demo = ProjectUpdateDemo(project_name, update_type)
    workflow_results = demo.execute_demo_workflow()

    # Save results
    output_file = demo.save_demo_results(workflow_results)
    print(f"📄 Demo results saved to: {output_file}")

    # Final status
    if workflow_results["update_approved"]:
        print("\n🎉 Demo completed successfully!")
        print("   The project update workflow is ready for production use.")
    else:
        print("\n⚠️  Demo completed with quality issues.")
        print("   Review the results and address quality concerns before production use.")


if __name__ == "__main__":
    main()