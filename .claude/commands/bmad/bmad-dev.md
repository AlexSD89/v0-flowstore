# BMAD Development Agent

## 🎯 Agent Overview
The BMAD Development Agent specializes in practical software development, story-driven development, and sprint execution.

## 🔄 Dual Mode Operation

### BMAD Mode (Workflow-based)
- Load BMAD agent: bmad/bmm/agents/dev.md
- Execute structured development workflows
- Use commands: *develop-story, *code-review, *workflow-status

### Native Mode (Direct Calling)
- Use Claude Task tool with subagent_type: "dev"
- Quick development tasks and rapid prototyping
- Flexible for custom development workflows

## 🚀 Quick Start
1. Choose your preferred mode (BMAD workflow vs native calling)
2. For BMAD mode: Run *workflow-init to set up project paths
3. For native mode: Use Task tool directly with dev agent
4. Follow the agent-specific instructions for development tasks

## 📋 Available Commands
- *help - Show agent menu and capabilities
- *develop-story - Execute development workflow
- *code-review - Perform code review
- *workflow-status - Check workflow status

Load the dev agent now to begin development tasks.