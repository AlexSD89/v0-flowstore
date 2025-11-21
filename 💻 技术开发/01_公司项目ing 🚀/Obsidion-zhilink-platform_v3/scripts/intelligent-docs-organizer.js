#!/usr/bin/env node

/**
 * 🧠 zhilink-v3 智能文档整理器
 * 
 * 功能：
 * 1. 根据文档内容价值自动分类
 * 2. 智能合并重复内容
 * 3. 建立清晰的文档架构
 * 4. 生成文档清单和健康报告
 */

const fs = require('fs');
const path = require('path');

class IntelligentDocsOrganizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, 'archive', `backup_${this.getTimestamp()}`);
    this.docsManifest = {
      version: '1.0.0',
      lastUpdate: new Date().toISOString(),
      documents: {
        core: {},
        professional: {},
        archived: {}
      }
    };
    
    // 核心文档定义
    this.coreDocuments = {
      'README.md': { priority: 'P0', category: 'overview' },
      'LAUNCHX_DESIGN_SYSTEM_V3.md': { priority: 'P0', category: 'design' },
      'PROJECT_DEVELOPMENT_METHODOLOGY.md': { priority: 'P0', category: 'methodology' }
    };
    
    // 需要归档的过程文档模式
    this.archivePatterns = [
      /^COMPLETE_INTERACTION_HISTORY\.md$/,
      /^.*IMPLEMENTATION.*SUMMARY\.md$/,
      /^.*OPTIMIZATION.*REPORT\.md$/,
      /^SYSTEM_FIXES_SUMMARY\.md$/,
      /^PROGRESS_TRACKING\.md$/,
      /^DEVELOPMENT_LOG\.md$/,
      /^S_LEVEL_.*\.md$/
    ];
  }
  
  getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  }
  
  // 扫描所有Markdown文档
  scanDocuments() {
    console.log('🔍 扫描项目文档...');
    
    const documents = {
      root: [],
      docs: [],
      other: []
    };
    
    // 扫描根目录
    const rootFiles = fs.readdirSync(this.projectRoot)
      .filter(file => file.endsWith('.md'))
      .map(file => ({ path: file, fullPath: path.join(this.projectRoot, file) }));
    documents.root = rootFiles;
    
    // 扫描docs目录
    const docsPath = path.join(this.projectRoot, 'docs');
    if (fs.existsSync(docsPath)) {
      const docsFiles = fs.readdirSync(docsPath)
        .filter(file => file.endsWith('.md'))
        .map(file => ({ path: path.join('docs', file), fullPath: path.join(docsPath, file) }));
      documents.docs = docsFiles;
    }
    
    console.log(`📄 发现文档: 根目录${documents.root.length}个, docs目录${documents.docs.length}个`);
    return documents;
  }
  
  // 创建备份目录
  createBackup() {
    if (!fs.existsSync(path.join(this.projectRoot, 'archive'))) {
      fs.mkdirSync(path.join(this.projectRoot, 'archive'));
    }
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    console.log(`📦 备份目录创建: ${this.backupDir}`);\n  }\n  \n  // 分析文档内容价值\n  analyzeDocumentValue(filePath) {\n    const content = fs.readFileSync(filePath, 'utf8');\n    const fileName = path.basename(filePath);\n    \n    // 核心文档检查\n    if (this.coreDocuments[fileName]) {\n      return {\n        category: 'core',\n        priority: this.coreDocuments[fileName].priority,\n        reason: '核心价值文档',\n        action: 'keep',\n        ...this.coreDocuments[fileName]\n      };\n    }\n    \n    // 检查是否为过程文档\n    const isProcessDoc = this.archivePatterns.some(pattern => pattern.test(fileName));\n    if (isProcessDoc) {\n      return {\n        category: 'process',\n        priority: 'P2',\n        reason: '开发过程记录文档',\n        action: 'archive'\n      };\n    }\n    \n    // docs目录下的专业文档\n    if (filePath.includes('docs/')) {\n      return {\n        category: 'professional',\n        priority: 'P1', \n        reason: '专业技术文档',\n        action: 'keep'\n      };\n    }\n    \n    // 内容质量分析\n    const contentScore = this.calculateContentScore(content);\n    if (contentScore >= 80) {\n      return {\n        category: 'valuable',\n        priority: 'P1',\n        reason: '高质量内容文档',\n        action: 'keep',\n        contentScore\n      };\n    } else {\n      return {\n        category: 'low-value',\n        priority: 'P2',\n        reason: '低质量或重复内容',\n        action: 'review',\n        contentScore\n      };\n    }\n  }\n  \n  // 计算内容质量分数\n  calculateContentScore(content) {\n    let score = 0;\n    \n    // 长度评分 (30%)\n    const lengthScore = Math.min(content.length / 10000 * 30, 30);\n    score += lengthScore;\n    \n    // 结构化程度 (30%)\n    const headers = (content.match(/^#+\\s/gm) || []).length;\n    const lists = (content.match(/^[-*+]\\s/gm) || []).length;\n    const codeBlocks = (content.match(/```/g) || []).length / 2;\n    const structureScore = Math.min((headers * 2 + lists + codeBlocks * 3) / 20 * 30, 30);\n    score += structureScore;\n    \n    // 技术关键词密度 (20%)\n    const techKeywords = ['typescript', 'react', 'nextjs', 'api', 'component', 'hook', 'store', 'design', 'architecture'];\n    const keywordMatches = techKeywords.filter(keyword => \n      content.toLowerCase().includes(keyword)\n    ).length;\n    const keywordScore = Math.min(keywordMatches / techKeywords.length * 20, 20);\n    score += keywordScore;\n    \n    // 独特性评分 (20%)\n    const uniqueLines = [...new Set(content.split('\\n'))].length;\n    const totalLines = content.split('\\n').length;\n    const uniquenessScore = uniqueLines / totalLines * 20;\n    score += uniquenessScore;\n    \n    return Math.round(score);\n  }\n  \n  // 执行文档整理\n  organizeDocs() {\n    console.log('🧹 开始执行智能文档整理...');\n    \n    const documents = this.scanDocuments();\n    this.createBackup();\n    \n    const actions = {\n      keep: [],\n      archive: [],\n      review: []\n    };\n    \n    // 分析所有文档\n    [...documents.root, ...documents.docs].forEach(doc => {\n      const analysis = this.analyzeDocumentValue(doc.fullPath);\n      console.log(`📋 ${doc.path}: ${analysis.reason} (${analysis.priority}) -> ${analysis.action}`);\n      \n      actions[analysis.action].push({\n        ...doc,\n        analysis\n      });\n      \n      // 更新文档清单\n      if (analysis.action === 'keep') {\n        if (analysis.category === 'core') {\n          this.docsManifest.documents.core[doc.path] = {\n            priority: analysis.priority,\n            category: analysis.category,\n            lastModified: fs.statSync(doc.fullPath).mtime.toISOString().split('T')[0],\n            contentScore: analysis.contentScore\n          };\n        } else {\n          this.docsManifest.documents.professional[doc.path] = {\n            priority: analysis.priority,\n            category: analysis.category,\n            lastModified: fs.statSync(doc.fullPath).mtime.toISOString().split('T')[0],\n            contentScore: analysis.contentScore\n          };\n        }\n      }\n    });\n    \n    // 执行归档操作\n    this.executeArchiving(actions.archive);\n    \n    // 生成报告\n    this.generateReport(actions);\n    \n    // 保存文档清单\n    this.saveManifest();\n    \n    console.log('✅ 文档整理完成!');\n  }\n  \n  // 执行归档\n  executeArchiving(archiveDocs) {\n    if (archiveDocs.length === 0) {\n      console.log('📁 没有需要归档的文档');\n      return;\n    }\n    \n    console.log(`📁 归档 ${archiveDocs.length} 个文档...`);\n    \n    archiveDocs.forEach(doc => {\n      const fileName = path.basename(doc.path);\n      const backupPath = path.join(this.backupDir, fileName);\n      \n      // 复制到备份目录\n      fs.copyFileSync(doc.fullPath, backupPath);\n      console.log(`  📦 ${doc.path} -> archive/backup_${this.getTimestamp()}/${fileName}`);\n      \n      // 从原位置删除\n      fs.unlinkSync(doc.fullPath);\n      \n      // 记录到清单\n      this.docsManifest.documents.archived[`archive/backup_${this.getTimestamp()}/${fileName}`] = {\n        originalPath: doc.path,\n        archivedAt: new Date().toISOString(),\n        reason: doc.analysis.reason\n      };\n    });\n  }\n  \n  // 生成整理报告\n  generateReport(actions) {\n    const report = {\n      timestamp: new Date().toISOString(),\n      summary: {\n        total: Object.values(actions).flat().length,\n        kept: actions.keep.length,\n        archived: actions.archive.length,\n        needReview: actions.review.length\n      },\n      actions: actions,\n      recommendations: this.generateRecommendations(actions)\n    };\n    \n    const reportPath = path.join(this.projectRoot, 'docs-organization-report.json');\n    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));\n    \n    console.log('📊 整理报告:');\n    console.log(`  ✅ 保留: ${report.summary.kept} 个文档`);\n    console.log(`  📁 归档: ${report.summary.archived} 个文档`);\n    console.log(`  ⚠️  需审查: ${report.summary.needReview} 个文档`);\n    console.log(`  📋 详细报告: docs-organization-report.json`);\n  }\n  \n  // 生成建议\n  generateRecommendations(actions) {\n    const recommendations = [];\n    \n    if (actions.review.length > 0) {\n      recommendations.push({\n        type: 'review',\n        message: `有 ${actions.review.length} 个文档需要人工审查`,\n        files: actions.review.map(doc => doc.path)\n      });\n    }\n    \n    if (actions.keep.filter(doc => doc.analysis.category === 'core').length < 3) {\n      recommendations.push({\n        type: 'missing',\n        message: '核心文档数量不足，建议检查是否有遗漏的重要文档'\n      });\n    }\n    \n    const docsDir = actions.keep.filter(doc => doc.path.startsWith('docs/'));\n    if (docsDir.length === 0) {\n      recommendations.push({\n        type: 'structure',\n        message: '建议创建docs/目录，将专业文档集中管理'\n      });\n    }\n    \n    return recommendations;\n  }\n  \n  // 保存文档清单\n  saveManifest() {\n    const manifestPath = path.join(this.projectRoot, '.docs-manifest.json');\n    fs.writeFileSync(manifestPath, JSON.stringify(this.docsManifest, null, 2));\n    console.log('📋 文档清单已更新: .docs-manifest.json');\n  }\n  \n  // 创建标准化的核心文档结构\n  createStandardStructure() {\n    console.log('🏗️  创建标准化文档结构...');\n    \n    // 确保docs目录存在\n    const docsPath = path.join(this.projectRoot, 'docs');\n    if (!fs.existsSync(docsPath)) {\n      fs.mkdirSync(docsPath);\n    }\n    \n    // 重命名核心文档（如果需要）\n    const renames = {\n      'PROJECT_DEVELOPMENT_METHODOLOGY.md': 'METHODOLOGY.md',\n      'LAUNCHX_DESIGN_SYSTEM_V3.md': 'DESIGN_SYSTEM.md'\n    };\n    \n    Object.entries(renames).forEach(([oldName, newName]) => {\n      const oldPath = path.join(this.projectRoot, oldName);\n      const newPath = path.join(this.projectRoot, newName);\n      \n      if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {\n        fs.renameSync(oldPath, newPath);\n        console.log(`📝 重命名: ${oldName} -> ${newName}`);\n      }\n    });\n  }\n}\n\n// 主执行函数\nasync function main() {\n  console.log('🚀 启动智能文档整理器...');\n  \n  const organizer = new IntelligentDocsOrganizer();\n  \n  try {\n    organizer.createStandardStructure();\n    organizer.organizeDocs();\n    \n    console.log('\\n🎉 文档整理完成!');\n    console.log('\\n下一步建议:');\n    console.log('1. 查看 docs-organization-report.json 了解详细变更');\n    console.log('2. 检查需要审查的文档');\n    console.log('3. 运行 npm run docs:health-check 验证文档健康状态');\n    \n  } catch (error) {\n    console.error('❌ 文档整理失败:', error.message);\n    process.exit(1);\n  }\n}\n\n// 如果直接运行此脚本\nif (require.main === module) {\n  main();\n}\n\nmodule.exports = IntelligentDocsOrganizer;