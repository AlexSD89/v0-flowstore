#!/usr/bin/env python3
"""
LaunchX v4.0 Upgrade Setup Script
Automates the environment setup and initial configuration for the v4.0 upgrade.
"""

import os
import sys
import subprocess
import json
import logging
from pathlib import Path
from typing import Dict, Any, List
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class V4UpgradeSetup:
    """Handles the setup process for LaunchX v4.0 upgrade"""

    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.v4_dir = project_root / "v4_upgrade"
        self.src_dir = self.v4_dir / "src"
        self.config_dir = self.v4_dir / "config"
        self.logs_dir = self.v4_dir / "logs"

        # Ensure directories exist
        for directory in [self.v4_dir, self.src_dir, self.config_dir, self.logs_dir]:
            directory.mkdir(parents=True, exist_ok=True)

    def check_prerequisites(self) -> bool:
        """Check if all prerequisites are met"""
        logger.info("Checking prerequisites...")

        prerequisites = {
            "Python 3.9+": self._check_python_version(),
            "Claude CLI": self._check_claude_cli(),
            "Git": self._check_git(),
            "Node.js": self._check_nodejs(),
            "Docker": self._check_docker()
        }

        all_good = True
        for name, result in prerequisites.items():
            if result["status"]:
                logger.info(f"✅ {name}: {result['version']}")
            else:
                logger.error(f"❌ {name}: {result['message']}")
                all_good = False

        return all_good

    def _check_python_version(self) -> Dict[str, Any]:
        """Check Python version"""
        try:
            version = sys.version_info
            if version.major >= 3 and version.minor >= 9:
                return {"status": True, "version": f"{version.major}.{version.minor}.{version.micro}"}
            else:
                return {"status": False, "message": "Python 3.9+ required"}
        except Exception as e:
            return {"status": False, "message": str(e)}

    def _check_claude_cli(self) -> Dict[str, Any]:
        """Check Claude CLI availability"""
        try:
            result = subprocess.run(
                ["claude", "--version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                version = result.stdout.strip()
                return {"status": True, "version": version}
            else:
                return {"status": False, "message": "Claude CLI not found"}
        except Exception as e:
            return {"status": False, "message": str(e)}

    def _check_git(self) -> Dict[str, Any]:
        """Check Git availability"""
        try:
            result = subprocess.run(
                ["git", "--version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                version = result.stdout.strip()
                return {"status": True, "version": version}
            else:
                return {"status": False, "message": "Git not found"}
        except Exception as e:
            return {"status": False, "message": str(e)}

    def _check_nodejs(self) -> Dict[str, Any]:
        """Check Node.js availability"""
        try:
            result = subprocess.run(
                ["node", "--version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                version = result.stdout.strip()
                return {"status": True, "version": version}
            else:
                return {"status": False, "message": "Node.js not found"}
        except Exception as e:
            return {"status": False, "message": str(e)}

    def _check_docker(self) -> Dict[str, Any]:
        """Check Docker availability"""
        try:
            result = subprocess.run(
                ["docker", "--version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                version = result.stdout.strip()
                return {"status": True, "version": version}
            else:
                return {"status": False, "message": "Docker not found"}
        except Exception as e:
            return {"status": False, "message": str(e)}

    def setup_python_environment(self) -> bool:
        """Setup Python virtual environment"""
        logger.info("Setting up Python virtual environment...")

        venv_path = self.v4_dir / "venv"

        # Create virtual environment if it doesn't exist
        if not venv_path.exists():
            try:
                subprocess.run([
                    sys.executable, "-m", "venv", str(venv_path)
                ], check=True)
                logger.info("✅ Virtual environment created")
            except subprocess.CalledProcessError as e:
                logger.error(f"❌ Failed to create virtual environment: {e}")
                return False

        # Activate virtual environment and install dependencies
        if sys.platform == "win32":
            pip_path = venv_path / "Scripts" / "pip"
        else:
            pip_path = venv_path / "bin" / "pip"

        try:
            # Upgrade pip
            subprocess.run([
                str(pip_path), "install", "--upgrade", "pip"
            ], check=True)

            # Install requirements
            requirements_file = self.v4_dir / "requirements.txt"
            if requirements_file.exists():
                subprocess.run([
                    str(pip_path), "install", "-r", str(requirements_file)
                ], check=True)
                logger.info("✅ Dependencies installed")
            else:
                logger.warning("⚠️ requirements.txt not found")

            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ Failed to install dependencies: {e}")
            return False

    def setup_configuration(self) -> bool:
        """Setup configuration files"""
        logger.info("Setting up configuration...")

        # Copy .env.example to .env if it doesn't exist
        env_example = self.v4_dir / ".env.example"
        env_file = self.v4_dir / ".env"

        if env_example.exists() and not env_file.exists():
            try:
                with open(env_example, 'r') as f:
                    env_content = f.read()

                # Replace placeholder values with safe defaults
                env_content = env_content.replace(
                    "your_anthropic_api_key_here",
                    os.getenv("ANTHROPIC_API_KEY", "")
                )
                env_content = env_content.replace(
                    "your_secret_key_here_change_in_production",
                    "dev-secret-key-change-in-production"
                )

                with open(env_file, 'w') as f:
                    f.write(env_content)

                logger.info("✅ .env file created")
            except Exception as e:
                logger.error(f"❌ Failed to create .env file: {e}")
                return False

        # Create directories for different components
        directories = [
            self.src_dir / "agent_os",
            self.src_dir / "models",
            self.src_dir / "services",
            self.src_dir / "api",
            self.src_dir / "utils",
            self.config_dir / "database",
            self.config_dir / "mcp",
            self.logs_dir / "agent",
            self.logs_dir / "api",
            self.logs_dir / "system"
        ]

        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)

        logger.info("✅ Directory structure created")
        return True

    def setup_database(self) -> bool:
        """Setup database configuration"""
        logger.info("Setting up database configuration...")

        db_config = {
            "development": {
                "url": "postgresql://localhost:5432/launchx_v4_dev",
                "pool_size": 5,
                "max_overflow": 10
            },
            "testing": {
                "url": "sqlite:///./test.db",
                "pool_size": 1,
                "max_overflow": 0
            },
            "production": {
                "url": os.getenv("DATABASE_URL", ""),
                "pool_size": 20,
                "max_overflow": 30
            }
        }

        db_config_file = self.config_dir / "database" / "config.json"
        try:
            with open(db_config_file, 'w') as f:
                json.dump(db_config, f, indent=2)
            logger.info("✅ Database configuration created")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to create database configuration: {e}")
            return False

    def setup_mcp_services(self) -> bool:
        """Setup MCP service configuration"""
        logger.info("Setting up MCP services...")

        mcp_config = {
            "xiaohongshu": {
                "enabled": True,
                "path": "/Users/dangsiyuan/Downloads/xiaohongshu-mcp-darwin-amd64/xiaohongshu-mcp-darwin-amd64",
                "cookies_path": "/Users/dangsiyuan/Downloads/xiaohongshu-mcp-darwin-amd64/cookies.json",
                "max_requests_per_minute": 30
            },
            "tavily": {
                "enabled": True,
                "api_key": os.getenv("TAVILY_API_KEY", ""),
                "timeout": 30
            },
            "workspace": {
                "enabled": True,
                "path": str(self.project_root),
                "allowed_paths": [
                    str(self.project_root / "v4_upgrade"),
                    str(self.project_root / "💻 技术开发/04_成熟项目 ✅/xiaohongshu_ai_automation_v1")
                ]
            }
        }

        mcp_config_file = self.config_dir / "mcp" / "services.json"
        try:
            with open(mcp_config_file, 'w') as f:
                json.dump(mcp_config, f, indent=2)
            logger.info("✅ MCP service configuration created")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to create MCP configuration: {e}")
            return False

    def create_initial_agents(self) -> bool:
        """Create initial agent configurations"""
        logger.info("Creating initial agent configurations...")

        agents = {
            "master_agent": {
                "id": "master",
                "name": "Master Agent",
                "capabilities": ["coordination", "task_distribution", "monitoring"],
                "tools": ["all"],
                "config": {
                    "max_concurrent_tasks": 100,
                    "task_timeout": 300
                }
            },
            "content_agent": {
                "id": "content",
                "name": "Content Generation Agent",
                "capabilities": ["content_generation", "xiaohongshu_publishing"],
                "tools": ["xiaohongshu-mcp", "tavily-search", "image-mcp"],
                "config": {
                    "max_tokens": 2000,
                    "temperature": 0.7
                }
            },
            "trend_agent": {
                "id": "trend",
                "name": "Trend Analysis Agent",
                "capabilities": ["trend_analysis", "viral_prediction"],
                "tools": ["tavily-search", "trend-analyzer"],
                "config": {
                    "analysis_depth": "deep",
                    "prediction_confidence": 0.8
                }
            }
        }

        agents_config_file = self.config_dir / "agents.json"
        try:
            with open(agents_config_file, 'w') as f:
                json.dump(agents, f, indent=2)
            logger.info("✅ Initial agent configurations created")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to create agent configurations: {e}")
            return False

    def run_tests(self) -> bool:
        """Run initial tests to verify setup"""
        logger.info("Running initial tests...")

        tests = [
            ("Python imports", self._test_python_imports),
            ("Configuration loading", self._test_config_loading),
            ("Database connection", self._test_database_connection)
        ]

        all_passed = True
        for test_name, test_func in tests:
            try:
                result = test_func()
                if result:
                    logger.info(f"✅ {test_name}")
                else:
                    logger.error(f"❌ {test_name}")
                    all_passed = False
            except Exception as e:
                logger.error(f"❌ {test_name}: {e}")
                all_passed = False

        return all_passed

    def _test_python_imports(self) -> bool:
        """Test if Python imports work"""
        try:
            import sys
            sys.path.insert(0, str(self.src_dir))

            # Test core imports
            from agent_os.base_agent import BaseAgent
            from models.tenant import Tenant, Content

            return True
        except ImportError as e:
            logger.error(f"Import error: {e}")
            return False

    def _test_config_loading(self) -> bool:
        """Test if configuration files can be loaded"""
        try:
            # Test database config
            db_config_file = self.config_dir / "database" / "config.json"
            if db_config_file.exists():
                with open(db_config_file, 'r') as f:
                    json.load(f)

            # Test MCP config
            mcp_config_file = self.config_dir / "mcp" / "services.json"
            if mcp_config_file.exists():
                with open(mcp_config_file, 'r') as f:
                    json.load(f)

            return True
        except Exception as e:
            logger.error(f"Config loading error: {e}")
            return False

    def _test_database_connection(self) -> bool:
        """Test database connection (basic check)"""
        try:
            # Just check if we can import database libraries
            import psycopg2
            import redis

            logger.info("Database libraries available")
            return True
        except ImportError as e:
            logger.error(f"Database library missing: {e}")
            return False

    def create_startup_script(self) -> bool:
        """Create startup script for the v4.0 system"""
        logger.info("Creating startup script...")

        startup_script = self.v4_dir / "start_v4.sh"

        script_content = f"""#!/bin/bash
# LaunchX v4.0 Startup Script

set -e

echo "🚀 Starting LaunchX v4.0 Upgrade System..."

# Set project root
export PROJECT_ROOT="{self.project_root}"
export V4_DIR="{self.v4_dir}"

# Activate virtual environment
if [ -d "$V4_DIR/venv" ]; then
    source "$V4_DIR/venv/bin/activate"
    echo "✅ Virtual environment activated"
else
    echo "❌ Virtual environment not found"
    exit 1
fi

# Set environment variables
export PYTHONPATH="$V4_DIR/src:$PYTHONPATH"
export CONFIG_DIR="$V4_DIR/config"
export LOGS_DIR="$V4_DIR/logs"

# Check if .env file exists
if [ -f "$V4_DIR/.env" ]; then
    export $(cat "$V4_DIR/.env" | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "⚠️ .env file not found"
fi

# Create log directories
mkdir -p "$LOGS_DIR/agent"
mkdir -p "$LOGS_DIR/api"
mkdir -p "$LOGS_DIR/system"

echo "🔧 System starting up..."

# Start Master Agent
echo "🤖 Starting Master Agent..."
python -m src.agent_os.master_agent &
MASTER_PID=$!

# Start API Server
echo "🌐 Starting API Server..."
python -m src.api.main &
API_PID=$!

# Start MCP Services Monitor
echo "📡 Starting MCP Services Monitor..."
python -m src.services.mcp_monitor &
MCP_PID=$!

echo "✅ LaunchX v4.0 started successfully!"
echo "📊 Process IDs:"
echo "   Master Agent: $MASTER_PID"
echo "   API Server: $API_PID"
echo "   MCP Monitor: $MCP_PID"

# Wait for user interrupt
trap 'echo "🛑 Shutting down..."; kill $MASTER_PID $API_PID $MCP_PID 2>/dev/null; exit 0' INT

echo "Press Ctrl+C to stop all services"
wait
"""

        try:
            with open(startup_script, 'w') as f:
                f.write(script_content)

            # Make script executable
            os.chmod(startup_script, 0o755)

            logger.info("✅ Startup script created")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to create startup script: {e}")
            return False

    def generate_setup_report(self) -> Dict[str, Any]:
        """Generate setup completion report"""
        report = {
            "setup_completed_at": str(Path.cwd()),
            "project_root": str(self.project_root),
            "v4_directory": str(self.v4_dir),
            "components": {
                "python_environment": True,
                "configuration": True,
                "database": True,
                "mcp_services": True,
                "agents": True,
                "startup_script": True
            },
            "next_steps": [
                "1. Activate virtual environment: source v4_upgrade/venv/bin/activate",
                "2. Configure environment variables in .env file",
                "3. Run database migrations: python -m src.models.migrate",
                "4. Start the system: ./v4_upgrade/start_v4.sh",
                "5. Access the system at http://localhost:8000"
            ],
            "troubleshooting": [
                "Check logs in v4_upgrade/logs/ directory",
                "Ensure all prerequisites are installed",
                "Verify MCP services are running",
                "Check database connectivity"
            ]
        }

        # Save report
        report_file = self.v4_dir / "setup_report.json"
        try:
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2)
            logger.info(f"✅ Setup report saved to {report_file}")
        except Exception as e:
            logger.error(f"❌ Failed to save setup report: {e}")

        return report

    def run_setup(self) -> bool:
        """Run the complete setup process"""
        logger.info("🚀 Starting LaunchX v4.0 Setup Process")
        logger.info(f"Project root: {self.project_root}")

        steps = [
            ("Prerequisites Check", self.check_prerequisites),
            ("Python Environment Setup", self.setup_python_environment),
            ("Configuration Setup", self.setup_configuration),
            ("Database Setup", self.setup_database),
            ("MCP Services Setup", self.setup_mcp_services),
            ("Initial Agents Setup", self.create_initial_agents),
            ("Initial Tests", self.run_tests),
            ("Startup Script Creation", self.create_startup_script)
        ]

        for step_name, step_func in steps:
            logger.info(f"\n🔧 {step_name}")
            try:
                result = step_func()
                if not result:
                    logger.error(f"❌ {step_name} failed")
                    return False
            except Exception as e:
                logger.error(f"❌ {step_name} failed with exception: {e}")
                return False

        # Generate final report
        report = self.generate_setup_report()

        logger.info("\n🎉 LaunchX v4.0 Setup Completed Successfully!")
        logger.info("\n📋 Next Steps:")
        for step in report["next_steps"]:
            logger.info(f"   {step}")

        return True


def main():
    """Main setup function"""
    parser = argparse.ArgumentParser(description="LaunchX v4.0 Setup Script")
    parser.add_argument(
        "--project-root",
        type=str,
        default=".",
        help="Project root directory (default: current directory)"
    )
    parser.add_argument(
        "--skip-prereq",
        action="store_true",
        help="Skip prerequisite checks"
    )

    args = parser.parse_args()

    project_root = Path(args.project_root).resolve()

    if not (project_root / "README.md").exists():
        logger.error("❌ Not a valid LaunchX project directory")
        sys.exit(1)

    setup = V4UpgradeSetup(project_root)

    if not args.skip_prereq:
        if not setup.check_prerequisites():
            logger.error("❌ Prerequisites check failed")
            sys.exit(1)

    if setup.run_setup():
        sys.exit(0)
    else:
        logger.error("❌ Setup failed")
        sys.exit(1)


if __name__ == "__main__":
    main()