/**
 * 基础错误检查Hook - Reddit指南零错误遗漏机制实现
 *
 * 核心原则：零错误遗漏机制 - 强制质量检查前置，确保关键节点不遗漏
 * 基于Reddit指南：工程基础设施优先，自动化强制执行
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BasicErrorCheckHook {
  constructor() {
    this.checkResults = [];
    this.errorThreshold = {
      syntax: 0,      // 语法错误零容忍
      lint: 5,        // Lint警告最多5个
      type: 0,        // 类型错误零容忍
      build: 0,       // 构建错误零容忍
      test: 80        // 测试覆盖率最低80%
    };
  }

  /**
   * 执行基础错误检查
   */
  async execute(context) {
    const { changedFiles, workspacePath } = context;

    console.log('🔍 基础错误检查Hook启动 - Reddit指南零错误遗漏机制...');

    this.checkResults = [];

    // 1. 语法检查
    await this.checkSyntax(changedFiles);

    // 2. Lint检查
    await this.checkLint(changedFiles);

    // 3. 类型检查
    await this.checkTypeScript(changedFiles);

    // 4. 构建检查
    await this.checkBuild(workspacePath);

    // 5. 测试覆盖率检查
    await this.checkTestCoverage(workspacePath);

    // 6. 生成检查报告
    const report = this.generateReport();

    return report;
  }

  /**
   * 语法检查 - 零容忍
   */
  async checkSyntax(files) {
    console.log('📝 执行语法检查...');

    const syntaxErrors = [];

    for (const file of files) {
      if (!this.isCodeFile(file)) continue;

      try {
        // Node.js语法检查
        if (file.endsWith('.js')) {
          const result = execSync(`node -c "${file}"`, {
            encoding: 'utf8',
            stdio: 'pipe'
          });

          if (result.stderr) {
            syntaxErrors.push({
              file,
              type: 'syntax',
              error: result.stderr,
              severity: 'critical'
            });
          }
        }

        // TypeScript语法检查
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          try {
            const result = execSync(`npx tsc --noEmit --skipLibCheck "${file}"`, {
              encoding: 'utf8',
              stdio: 'pipe'
            });

            if (result.stderr) {
              syntaxErrors.push({
                file,
                type: 'typescript_syntax',
                error: result.stderr,
                severity: 'critical'
              });
            }
          } catch (error) {
            syntaxErrors.push({
              file,
              type: 'typescript_syntax',
              error: error.stderr || error.message,
              severity: 'critical'
            });
          }
        }
      } catch (error) {
        syntaxErrors.push({
          file,
          type: 'syntax',
          error: error.message,
          severity: 'critical'
        });
      }
    }

    this.checkResults.push({
      category: 'syntax',
      passed: syntaxErrors.length === 0,
      errors: syntaxErrors,
      message: syntaxErrors.length === 0 ?
        '✅ 语法检查通过' :
        `❌ 发现 ${syntaxErrors.length} 个语法错误`
    });
  }

  /**
   * Lint检查 - 最多5个警告
   */
  async checkLint(files) {
    console.log('🔧 执行Lint检查...');

    const lintErrors = [];

    try {
      // 检查是否有ESLint配置
      if (fs.existsSync('.eslintrc.js') || fs.existsSync('.eslintrc.json')) {
        for (const file of files) {
          if (!this.isCodeFile(file)) continue;

          try {
            const result = execSync(`npx eslint "${file}" --format=json`, {
              encoding: 'utf8',
              stdio: 'pipe'
            });

            const issues = JSON.parse(result);
            issues.forEach(issue => {
              if (issue.severity === 2) { // Error级别
                lintErrors.push({
                  file,
                  line: issue.lineNumber,
                  column: issue.columnNumber,
                  rule: issue.ruleId,
                  message: issue.message,
                  severity: 'error'
                });
              } else if (lintErrors.length < this.errorThreshold.lint) { // Warning级别（限制数量）
                lintErrors.push({
                  file,
                  line: issue.lineNumber,
                  column: issue.columnNumber,
                  rule: issue.ruleId,
                  message: issue.message,
                  severity: 'warning'
                });
              }
            });
          } catch (error) {
            // ESLint运行失败
            console.warn(`ESLint检查失败: ${error.message}`);
          }
        }
      } else {
        console.warn('⚠️ 未找到ESLint配置文件，跳过Lint检查');
      }
    } catch (error) {
      console.error('❌ Lint检查执行失败:', error.message);
    }

    this.checkResults.push({
      category: 'lint',
      passed: lintErrors.filter(e => e.severity === 'error').length === 0,
      errors: lintErrors,
      message: lintErrors.length === 0 ?
        '✅ Lint检查通过' :
        `⚠️ 发现 ${lintErrors.length} 个Lint问题（${lintErrors.filter(e => e.severity === 'error').length} 个错误）`
    });
  }

  /**
   * TypeScript类型检查 - 零容忍
   */
  async checkTypeScript(files) {
    console.log('🔷 执行TypeScript类型检查...');

    const typeErrors = [];
    const tsFiles = files.filter(file =>
      file.endsWith('.ts') || file.endsWith('.tsx')
    );

    if (tsFiles.length === 0) {
      this.checkResults.push({
        category: 'typescript',
        passed: true,
        errors: [],
        message: '✅ 无TypeScript文件，跳过类型检查'
      });
      return;
    }

    try {
      // 检查是否有tsconfig.json
      if (fs.existsSync('tsconfig.json')) {
        const result = execSync('npx tsc --noEmit', {
          encoding: 'utf8',
          stdio: 'pipe'
        });

        if (result.stderr) {
          // 解析TypeScript错误
          const lines = result.stderr.split('\n');
          lines.forEach(line => {
            if (line.includes('error TS')) {
              const match = line.match(/^(.+)\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)$/);
              if (match) {
                typeErrors.push({
                  file: match[1],
                  line: parseInt(match[2]),
                  column: parseInt(match[3]),
                  code: `TS${match[4]}`,
                  message: match[5],
                  severity: 'critical'
                });
              }
            }
          });
        }
      } else {
        console.warn('⚠️ 未找到tsconfig.json，跳过TypeScript类型检查');
      }
    } catch (error) {
      // TypeScript编译失败
      const errorOutput = error.stderr || error.message;
      const lines = errorOutput.split('\n');
      lines.forEach(line => {
        if (line.includes('error TS')) {
          const match = line.match(/^(.+)\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)$/);
          if (match) {
            typeErrors.push({
              file: match[1],
              line: parseInt(match[2]),
              column: parseInt(match[3]),
              code: `TS${match[4]}`,
              message: match[5],
              severity: 'critical'
            });
          }
        }
      });
    }

    this.checkResults.push({
      category: 'typescript',
      passed: typeErrors.length === 0,
      errors: typeErrors,
      message: typeErrors.length === 0 ?
        '✅ TypeScript类型检查通过' :
        `❌ 发现 ${typeErrors.length} 个类型错误`
    });
  }

  /**
   * 构建检查 - 零容忍
   */
  async checkBuild(workspacePath) {
    console.log('🏗️ 执行构建检查...');

    const buildErrors = [];

    try {
      // 检查package.json
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

        // 检查是否有构建脚本
        if (packageJson.scripts && packageJson.scripts.build) {
          try {
            const result = execSync('npm run build', {
              encoding: 'utf8',
              stdio: 'pipe',
              timeout: 60000 // 60秒超时
            });

            console.log('✅ 构建成功');
          } catch (error) {
            buildErrors.push({
              type: 'build_failure',
              error: error.stderr || error.message,
              severity: 'critical'
            });
          }
        } else {
          console.warn('⚠️ 未找到构建脚本，跳过构建检查');
        }
      } else {
        console.warn('⚠️ 未找到package.json，跳过构建检查');
      }
    } catch (error) {
      buildErrors.push({
        type: 'build_error',
        error: error.message,
        severity: 'critical'
      });
    }

    this.checkResults.push({
      category: 'build',
      passed: buildErrors.length === 0,
      errors: buildErrors,
      message: buildErrors.length === 0 ?
        '✅ 构建检查通过' :
        `❌ 构建失败: ${buildErrors[0]?.error || '未知错误'}`
    });
  }

  /**
   * 测试覆盖率检查 - 最低80%
   */
  async checkTestCoverage(workspacePath) {
    console.log('🧪 执行测试覆盖率检查...');

    const coverageInfo = {
      lines: 0,
      functions: 0,
      branches: 0,
      statements: 0
    };

    try {
      // 检查是否有测试配置
      if (fs.existsSync('jest.config.js') || fs.existsSync('jest.config.json')) {
        try {
          const result = execSync('npx jest --coverage --passWithNoTests', {
            encoding: 'utf8',
            stdio: 'pipe',
            timeout: 120000 // 2分钟超时
          });

          // 解析覆盖率报告
          if (fs.existsSync('coverage/coverage-summary.json')) {
            const coverageSummary = JSON.parse(
              fs.readFileSync('coverage/coverage-summary.json', 'utf8')
            );

            const total = coverageSummary.total;
            coverageInfo = {
              lines: Math.round(total.lines.pct),
              functions: Math.round(total.functions.pct),
              branches: Math.round(total.branches.pct),
              statements: Math.round(total.statements.pct)
            };
          }
        } catch (error) {
          console.warn('⚠️ 测试执行失败:', error.message);
        }
      } else {
        console.warn('⚠️ 未找到Jest配置，跳过测试覆盖率检查');
      }
    } catch (error) {
      console.error('❌ 测试覆盖率检查失败:', error.message);
    }

    const minCoverage = this.errorThreshold.test;
    const passed = Object.values(coverageInfo).every(coverage => coverage >= minCoverage);

    this.checkResults.push({
      category: 'test_coverage',
      passed,
      coverage: coverageInfo,
      message: passed ?
        `✅ 测试覆盖率达标 (${Object.values(coverageInfo).join('%, ')}%)` :
        `⚠️ 测试覆盖率不足 (要求≥${minCoverage}%, 当前: ${Object.values(coverageInfo).join('%, ')}%)`
    });
  }

  /**
   * 判断是否为代码文件
   */
  isCodeFile(filePath) {
    const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.py', '.java', '.cpp', '.c'];
    return codeExtensions.some(ext => filePath.endsWith(ext));
  }

  /**
   * 生成检查报告
   */
  generateReport() {
    const criticalErrors = this.checkResults
      .filter(result => result.errors.some(error => error.severity === 'critical'))
      .length;

    const totalErrors = this.checkResults.reduce((total, result) =>
      total + result.errors.length, 0
    );

    const passed = this.checkResults.every(result => result.passed);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed,
        criticalErrors,
        totalErrors,
        status: criticalErrors === 0 ? 'PASSED' : 'FAILED'
      },
      details: this.checkResults,
      recommendations: this.generateRecommendations(),
      shouldBlock: criticalErrors > 0
    };

    console.log('\n📊 错误检查报告:');
    console.log(`- 状态: ${report.summary.status}`);
    console.log(`- 严重错误: ${report.summary.criticalErrors}`);
    console.log(`- 总问题数: ${report.summary.totalErrors}`);

    if (report.recommendations.length > 0) {
      console.log('\n💡 修复建议:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    return report;
  }

  /**
   * 生成修复建议
   */
  generateRecommendations() {
    const recommendations = [];

    this.checkResults.forEach(result => {
      if (!result.passed) {
        switch (result.category) {
          case 'syntax':
            recommendations.push('修复所有语法错误 - 这些是阻塞性问题，必须立即解决');
            break;
          case 'lint':
            recommendations.push('修复Lint错误 - 这些代码质量问题可能影响维护性');
            break;
          case 'typescript':
            recommendations.push('修复TypeScript类型错误 - 确保类型安全');
            break;
          case 'build':
            recommendations.push('解决构建问题 - 确保项目可以正常构建');
            break;
          case 'test_coverage':
            recommendations.push('提高测试覆盖率至80%以上 - 确保代码质量');
            break;
        }
      }
    });

    return recommendations;
  }
}

// 导出Hook实例
module.exports = new BasicErrorCheckHook();