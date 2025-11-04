---
description: Perform comprehensive code analysis with quality metrics and recommendations / 执行综合代码分析，提供质量指标和改进建议
category: code-analysis-technical
argument-hint: "[file-or-directory-path]"
allowed-tools: Read, Grep, Glob, TodoWrite
---

# 🔍 技术代码分析 / Technical Code Analysis

# Code Analysis Command

Perform a comprehensive code analysis on the specified files or directory. If no path is provided, analyze the current working directory.

## Analysis Process:

1. **Parse Arguments**:
   - Extract the path from $ARGUMENTS (defaults to current directory if not specified)
   - Determine scope: single file, multiple files, or entire directory

2. **Language Detection**:
   - Identify programming language(s) based on file extensions
   - Apply language-specific analysis rules

3. **Code Quality Analysis**:
   - **Complexity Metrics**: Cyclomatic complexity, nesting depth, function length
   - **Code Smells**: Long methods, large classes, duplicate code patterns
   - **Best Practices**: Naming conventions, code organization, documentation
   - **Security Issues**: Common vulnerabilities, unsafe patterns, input validation
   - **Performance**: Inefficient algorithms, memory leaks, blocking operations
   - **Maintainability**: Code coupling, cohesion, test coverage indicators

4. **Generate Report**:
   - Summary with overall health score
   - Detailed findings by category
   - Priority-ranked issues (High/Medium/Low)
   - Specific file and line references
   - Actionable recommendations for improvement

5. **Track with TodoWrite**:
   - Create todos for high-priority issues found
   - Organize by fix complexity and impact

## LaunchX Specific Analysis:
- Check compliance with our CLAUDE.md development standards
- Validate AI协作开发系统 patterns
- Analyze pocketcorn and zhilink project conventions
- Review MCP integration patterns
- Assess Claude Code subagent compatibility

## Example Usage:
- `/code-analysis` - Analyze entire current directory
- `/code-analysis src/` - Analyze all code in src directory  
- `/code-analysis app.js` - Analyze specific file
- `/code-analysis "💻 技术开发/01_平台项目/"` - Analyze platform projects

Target path: $ARGUMENTS