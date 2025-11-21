#!/usr/bin/env node

/**
 * 🏥 zhilink-v3 文档健康检查器
 * 
 * 功能：
 * 1. 检查文档完整性和一致性
 * 2. 验证文档结构和内容质量
 * 3. 生成健康报告和改进建议
 * 4. 监控文档维护状态
 */

const fs = require('fs');
const path = require('path');

class DocsHealthChecker {
  constructor() {
    this.projectRoot = process.cwd();
    this.issues = [];
    this.warnings = [];
    this.suggestions = [];
    
    // 加载文档清单
    this.manifest = this.loadManifest();
    
    // 核心文档要求定义
    this.coreRequirements = {
      'README.md': {
        requiredSections: [
          '项目概览',
          '快速开始', 
          '技术架构',
          '开发命令',
          '贡献指南'
        ],
        minLength: 5000,
        maxAge: 30 // 天
      },
      'METHODOLOGY.md': {
        requiredSections: [
          '项目开发总章节',
          'A级评估结果',
          '迭代优化流程',
          '质量保证体系'
        ],
        minLength: 3000,
        maxAge: 7
      },
      'DESIGN_SYSTEM.md': {
        requiredSections: [
          '设计哲学',
          '6AI专家设计',
          'Cloudsway色彩体系',
          '动画系统'
        ],
        minLength: 4000,
        maxAge: 14
      }
    };
  }
  
  // 加载文档清单
  loadManifest() {
    const manifestPath = path.join(this.projectRoot, '.docs-manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      } catch (error) {
        this.issues.push('❌ 文档清单文件格式错误: .docs-manifest.json');
        return null;
      }
    } else {
      this.warnings.push('⚠️  文档清单文件不存在，建议运行 npm run docs:organize');
      return null;
    }
  }
  
  // 检查核心文档完整性
  checkCoreDocuments() {\n    console.log('🔍 检查核心文档完整性...');\n    \n    Object.entries(this.coreRequirements).forEach(([docName, requirements]) => {\n      const docPath = path.join(this.projectRoot, docName);\n      \n      if (!fs.existsSync(docPath)) {\n        this.issues.push(`❌ 核心文档缺失: ${docName}`);\n        return;\n      }\n      \n      const content = fs.readFileSync(docPath, 'utf8');\n      const stats = fs.statSync(docPath);\n      \n      // 检查必需章节\n      requirements.requiredSections.forEach(section => {\n        if (!this.hasSectionContent(content, section)) {\n          this.issues.push(`❌ ${docName} 缺少必需章节: ${section}`);\n        }\n      });\n      \n      // 检查内容长度\n      if (content.length < requirements.minLength) {\n        this.warnings.push(`⚠️  ${docName} 内容过短 (${content.length}字符 < ${requirements.minLength}字符)`);\n      }\n      \n      // 检查更新时间\n      const daysSinceUpdate = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);\n      if (daysSinceUpdate > requirements.maxAge) {\n        this.warnings.push(`⚠️  ${docName} 超过${requirements.maxAge}天未更新 (${Math.round(daysSinceUpdate)}天)`);\n      }\n    });\n  }\n  \n  // 检查章节内容是否存在\n  hasSectionContent(content, sectionName) {\n    // 查找章节标题\n    const sectionRegex = new RegExp(`#+.*${sectionName}`, 'i');\n    const match = content.match(sectionRegex);\n    \n    if (!match) {\n      return false;\n    }\n    \n    // 检查章节后是否有实质内容\n    const sectionIndex = content.indexOf(match[0]);\n    const afterSection = content.substring(sectionIndex + match[0].length);\n    const nextSectionIndex = afterSection.search(/^#+/m);\n    \n    const sectionContent = nextSectionIndex > 0 \n      ? afterSection.substring(0, nextSectionIndex)\n      : afterSection;\n    \n    // 去除空白和markdown符号，检查实质内容\n    const cleanContent = sectionContent\n      .replace(/\\s+/g, ' ')\n      .replace(/[#*`-]/g, '')\n      .trim();\n    \n    return cleanContent.length > 50; // 至少50个字符的实质内容\n  }\n  \n  // 检查文档结构规范\n  checkDocumentStructure() {\n    console.log('🔍 检查文档结构规范...');\n    \n    // 检查根目录MD文件数量\n    const rootMdFiles = fs.readdirSync(this.projectRoot)\n      .filter(file => file.endsWith('.md'));\n    \n    if (rootMdFiles.length > 5) {\n      this.warnings.push(`⚠️  根目录MD文件过多 (${rootMdFiles.length}个)，建议整理到docs/目录`);\n    }\n    \n    // 检查docs目录结构\n    const docsPath = path.join(this.projectRoot, 'docs');\n    if (fs.existsSync(docsPath)) {\n      const docsFiles = fs.readdirSync(docsPath)\n        .filter(file => file.endsWith('.md'));\n      \n      if (docsFiles.length === 0) {\n        this.warnings.push('⚠️  docs/目录存在但为空，建议添加专业文档');\n      }\n      \n      // 检查文档命名规范\n      docsFiles.forEach(file => {\n        if (!/^\\d{2}_[\\u4e00-\\u9fa5\\w]+\\.md$/.test(file)) {\n          this.warnings.push(`⚠️  docs/${file} 命名不符合规范 (应为: 数字_中文名称.md)`);\n        }\n      });\n    } else {\n      this.suggestions.push('💡 建议创建docs/目录管理专业文档');\n    }\n    \n    // 检查archive目录\n    const archivePath = path.join(this.projectRoot, 'archive');\n    if (!fs.existsSync(archivePath)) {\n      this.suggestions.push('💡 建议创建archive/目录管理历史文档');\n    }\n  }\n  \n  // 检查文档内容质量\n  checkContentQuality() {\n    console.log('🔍 检查文档内容质量...');\n    \n    const allDocs = this.getAllMarkdownFiles();\n    \n    allDocs.forEach(docPath => {\n      const relativePath = path.relative(this.projectRoot, docPath);\n      const content = fs.readFileSync(docPath, 'utf8');\n      \n      // 检查空文档\n      if (content.trim().length < 100) {\n        this.issues.push(`❌ ${relativePath} 内容过少 (${content.length}字符)`);\n        return;\n      }\n      \n      // 检查文档结构\n      const headers = content.match(/^#+\\s/gm) || [];\n      if (headers.length < 2) {\n        this.warnings.push(`⚠️  ${relativePath} 缺少层次结构 (只有${headers.length}个标题)`);\n      }\n      \n      // 检查代码块格式\n      const codeBlocks = content.match(/```[\\s\\S]*?```/g) || [];\n      const unformattedCode = content.match(/`[^`\\n]+`/g) || [];\n      \n      if (unformattedCode.length > codeBlocks.length * 3) {\n        this.suggestions.push(`💡 ${relativePath} 建议将内联代码整理为代码块`);\n      }\n      \n      // 检查链接有效性\n      const internalLinks = content.match(/\\[.*?\\]\\(\\..*?\\)/g) || [];\n      internalLinks.forEach(link => {\n        const linkPath = link.match(/\\(\\.([^)]+)\\)/)?.[1];\n        if (linkPath) {\n          const fullLinkPath = path.join(this.projectRoot, linkPath);\n          if (!fs.existsSync(fullLinkPath)) {\n            this.warnings.push(`⚠️  ${relativePath} 包含无效链接: ${linkPath}`);\n          }\n        }\n      });\n    });\n  }\n  \n  // 获取所有Markdown文件\n  getAllMarkdownFiles() {\n    const files = [];\n    \n    const scanDirectory = (dir) => {\n      const items = fs.readdirSync(dir, { withFileTypes: true });\n      \n      items.forEach(item => {\n        const fullPath = path.join(dir, item.name);\n        \n        if (item.isDirectory() && !['node_modules', '.git', '.next'].includes(item.name)) {\n          scanDirectory(fullPath);\n        } else if (item.isFile() && item.name.endsWith('.md')) {\n          files.push(fullPath);\n        }\n      });\n    };\n    \n    scanDirectory(this.projectRoot);\n    return files;\n  }\n  \n  // 检查文档一致性\n  checkConsistency() {\n    console.log('🔍 检查文档一致性...');\n    \n    // 检查版本信息一致性\n    const versionPattern = /版本[：:]\\s*([v\\d\\.]+)/gi;\n    const versions = new Set();\n    \n    this.getAllMarkdownFiles().forEach(docPath => {\n      const content = fs.readFileSync(docPath, 'utf8');\n      const matches = content.matchAll(versionPattern);\n      \n      for (const match of matches) {\n        versions.add(match[1]);\n      }\n    });\n    \n    if (versions.size > 3) {\n      this.warnings.push(`⚠️  发现多个不一致的版本号: ${Array.from(versions).join(', ')}`);\n    }\n    \n    // 检查日期格式一致性\n    const datePattern = /\\d{4}[年-]\\d{1,2}[月-]\\d{1,2}[日]?/g;\n    const dateFormats = new Set();\n    \n    this.getAllMarkdownFiles().forEach(docPath => {\n      const content = fs.readFileSync(docPath, 'utf8');\n      const matches = content.match(datePattern);\n      \n      if (matches) {\n        matches.forEach(date => {\n          if (date.includes('年')) dateFormats.add('中文格式');\n          if (date.includes('-')) dateFormats.add('国际格式');\n        });\n      }\n    });\n    \n    if (dateFormats.size > 1) {\n      this.suggestions.push('💡 建议统一日期格式 (发现格式: ' + Array.from(dateFormats).join(', ') + ')');\n    }\n  }\n  \n  // 生成健康报告\n  generateHealthReport() {\n    const healthScore = this.calculateHealthScore();\n    \n    const report = {\n      timestamp: new Date().toISOString(),\n      overallHealth: this.getHealthLevel(healthScore),\n      healthScore: healthScore,\n      summary: {\n        issues: this.issues.length,\n        warnings: this.warnings.length,\n        suggestions: this.suggestions.length\n      },\n      details: {\n        issues: this.issues,\n        warnings: this.warnings,\n        suggestions: this.suggestions\n      },\n      recommendations: this.generateRecommendations(),\n      nextCheckDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 一周后\n    };\n    \n    const reportPath = path.join(this.projectRoot, 'docs-health-report.json');\n    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));\n    \n    return report;\n  }\n  \n  // 计算健康分数\n  calculateHealthScore() {\n    let score = 100;\n    \n    // 严重问题扣分\n    score -= this.issues.length * 15;\n    \n    // 警告扣分\n    score -= this.warnings.length * 5;\n    \n    // 建议不扣分，但影响改进空间\n    \n    return Math.max(0, score);\n  }\n  \n  // 获取健康等级\n  getHealthLevel(score) {\n    if (score >= 90) return '健康';\n    if (score >= 70) return '良好';\n    if (score >= 50) return '需要关注';\n    return '需要修复';\n  }\n  \n  // 生成改进建议\n  generateRecommendations() {\n    const recommendations = [];\n    \n    if (this.issues.length > 0) {\n      recommendations.push({\n        priority: 'high',\n        action: '修复严重问题',\n        description: `发现 ${this.issues.length} 个严重问题，需要立即修复`,\n        estimate: '1-2小时'\n      });\n    }\n    \n    if (this.warnings.length > 5) {\n      recommendations.push({\n        priority: 'medium',\n        action: '处理警告问题',\n        description: `有 ${this.warnings.length} 个警告，建议逐步处理`,\n        estimate: '2-4小时'\n      });\n    }\n    \n    if (this.suggestions.length > 0) {\n      recommendations.push({\n        priority: 'low',\n        action: '考虑改进建议',\n        description: `有 ${this.suggestions.length} 个改进建议，可以提升文档质量`,\n        estimate: '1-3小时'\n      });\n    }\n    \n    // 基于具体问题的建议\n    if (this.issues.some(issue => issue.includes('核心文档缺失'))) {\n      recommendations.push({\n        priority: 'high',\n        action: '补充核心文档',\n        description: '缺少核心文档会影响项目理解和维护',\n        estimate: '2-4小时'\n      });\n    }\n    \n    if (this.warnings.some(warning => warning.includes('根目录MD文件过多'))) {\n      recommendations.push({\n        priority: 'medium',\n        action: '执行文档整理',\n        description: '运行 npm run docs:organize 整理文档结构',\n        estimate: '30分钟'\n      });\n    }\n    \n    return recommendations;\n  }\n  \n  // 执行完整的健康检查\n  runHealthCheck() {\n    console.log('🏥 开始文档健康检查...');\n    \n    this.checkCoreDocuments();\n    this.checkDocumentStructure();\n    this.checkContentQuality();\n    this.checkConsistency();\n    \n    const report = this.generateHealthReport();\n    \n    // 输出结果\n    console.log('\\n📊 健康检查结果:');\n    console.log(`🎯 总体健康度: ${report.overallHealth} (${report.healthScore}分)`);\n    console.log(`❌ 严重问题: ${report.summary.issues} 个`);\n    console.log(`⚠️  警告: ${report.summary.warnings} 个`);\n    console.log(`💡 建议: ${report.summary.suggestions} 个`);\n    \n    if (report.details.issues.length > 0) {\n      console.log('\\n❌ 需要修复的问题:');\n      report.details.issues.forEach(issue => console.log(`  ${issue}`));\n    }\n    \n    if (report.details.warnings.length > 0) {\n      console.log('\\n⚠️  警告:');\n      report.details.warnings.slice(0, 5).forEach(warning => console.log(`  ${warning}`));\n      if (report.details.warnings.length > 5) {\n        console.log(`  ... 还有 ${report.details.warnings.length - 5} 个警告`);\n      }\n    }\n    \n    console.log(`\\n📋 详细报告已保存到: docs-health-report.json`);\n    \n    // 返回退出码\n    return report.healthScore >= 70 ? 0 : 1;\n  }\n}\n\n// 主执行函数\nasync function main() {\n  const checker = new DocsHealthChecker();\n  const exitCode = checker.runHealthCheck();\n  \n  if (exitCode === 0) {\n    console.log('\\n✅ 文档健康状态良好');\n  } else {\n    console.log('\\n⚠️  文档需要改进，请查看上述建议');\n  }\n  \n  process.exit(exitCode);\n}\n\n// 如果直接运行此脚本\nif (require.main === module) {\n  main();\n}\n\nmodule.exports = DocsHealthChecker;