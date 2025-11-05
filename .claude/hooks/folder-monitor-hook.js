#!/usr/bin/env node

/**
 * Folder Monitor Hook
 * 集成到LaunchX Hook系统中的文件夹创建监控器
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Hook主函数
function folderMonitorHook(context) {
  const { trigger, timestamp, sessionId } = context;

  console.log('🔍 [Folder Monitor Hook] 检测文件夹创建情况...');

  const projectPath = process.cwd();
  const suspiciousFolders = getSuspiciousFolders(projectPath);

  if (suspiciousFolders.length > 0) {
    console.log(`⚠️  发现 ${suspiciousFolders.length} 个可疑文件夹:`);

    suspiciousFolders.forEach(folder => {
      console.log(`   📁 ${folder.name} - 创建于 ${folder.birthtime.toLocaleString()}`);
    });

    // 尝试识别创建进程
    identifyCreatingProcess();

    // 生成报告和建议
    generateReportAndSuggestions(suspiciousFolders, projectPath);

    // 记录到日志
    logToHistory(suspiciousFolders, context);

  } else {
    console.log('✅ 未发现可疑文件夹');
  }
}

// 获取可疑文件夹列表
function getSuspiciousFolders(projectPath) {
  const suspiciousPatterns = [
    'analytics', 'android-', 'cache', 'codegen', 'collaboration',
    'custom-templates', 'learning', 'logs', 'memory', 'predictive',
    'prompt-library', 'swarm', 'templates'
  ];

  try {
    const items = fs.readdirSync(projectPath);
    return items
      .filter(item => {
        const itemPath = path.join(projectPath, item);
        try {
          const stats = fs.statSync(itemPath);
          return stats.isDirectory() &&
                 suspiciousPatterns.some(pattern => item.includes(pattern));
        } catch (error) {
          return false;
        }
      })
      .map(item => {
        const itemPath = path.join(projectPath, item);
        const stats = fs.statSync(itemPath);
        return {
          name: item,
          path: itemPath,
          birthtime: stats.birthtime,
          mtime: stats.mtime
        };
      })
      .sort((a, b) => b.birthtime - a.birthtime);
  } catch (error) {
    console.error('读取目录失败:', error.message);
    return [];
  }
}

// 尝试识别创建进程
function identifyCreatingProcess() {
  console.log('\n🔍 分析可能的创建进程...');

  try {
    // 检查zai-mcp-server进程
    const zaiProcesses = execSync('ps aux | grep zai-mcp-server | grep -v grep', { encoding: 'utf8' });
    if (zaiProcesses.trim()) {
      console.log('🎯 发现 zai-mcp-server 进程:');
      console.log('   这个进程很可能是文件夹创建的源头');
      console.log('   建议检查其配置文件，禁用自动目录创建功能');
    }
  } catch (error) {
    // 没有找到进程
  }

  try {
    // 检查其他MCP服务器
    const mcpProcesses = execSync('ps aux | grep mcp-server | grep -v grep', { encoding: 'utf8' });
    if (mcpProcesses.trim()) {
      console.log('🔧 发现其他MCP服务器进程:');
      const lines = mcpProcesses.trim().split('\n').slice(0, 3);
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const command = parts.slice(10).join(' ');
        console.log(`   ${command.substring(0, 80)}...`);
      });
    }
  } catch (error) {
    // 没有找到进程
  }
}

// 生成报告和建议
function generateReportAndSuggestions(suspiciousFolders, projectPath) {
  console.log('\n📋 生成分析报告...');

  const report = {
    timestamp: new Date().toISOString(),
    suspiciousFolders: suspiciousFolders,
    analysis: {
      likelySource: 'zai-mcp-server 或其他MCP服务器',
      patterns: suspiciousFolders.map(f => f.name),
      recommendations: [
        '检查 zai-mcp-server 配置文件',
        '查找并修改自动创建目录的设置',
        '考虑禁用不必要的目录创建功能',
        '定期清理这些自动生成的空文件夹'
      ]
    }
  };

  // 写入报告文件
  const reportPath = path.join(projectPath, '.claude', 'folder-monitor-report.json');
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 报告已保存: ${reportPath}`);
  } catch (error) {
    console.error('保存报告失败:', error.message);
  }

  // 生成清理脚本
  generateCleanupScript(suspiciousFolders, projectPath);

  // 显示建议
  console.log('\n💡 建议解决方案:');
  console.log('1. 运行 ./cleanup-suspicious-folders.sh 清理这些文件夹');
  console.log('2. 检查 zai-mcp-server 配置: npm list zai-mcp-server');
  console.log('3. 查找配置文件并修改自动创建目录的设置');
  console.log('4. 如果需要永久禁用，考虑使用不同的MCP服务器');
}

// 生成清理脚本
function generateCleanupScript(suspiciousFolders, projectPath) {
  const scriptContent = `#!/bin/bash
# 自动生成的可疑文件夹清理脚本
# 生成时间: ${new Date().toLocaleString()}

echo "🧹 清理可疑文件夹..."
echo "发现 ${suspiciousFolders.length} 个待清理文件夹"
echo ""

# 备份函数
backup_if_needed() {
    local dir="$1"
    if [ -d "$dir" ] && [ "$(ls -A "$dir" 2>/dev/null)" ]; then
        echo "⚠️  目录 $dir 不为空，跳过删除"
        return 1
    fi
    return 0
}

# 清理函数
cleanup_folder() {
    local folder="$1"
    local folder_path="$2"

    echo "检查: $folder ($folder_path)"

    if backup_if_needed "$folder_path"; then
        echo "  → 删除空文件夹"
        # 取消注释下一行来实际删除
        # rmdir "$folder_path"
        echo "  → (删除命令已注释，请手动确认后取消注释)"
    fi
    echo ""
}

${suspiciousFolders.map(folder =>
  `cleanup_folder "${folder.name}" "${folder.path}"`
).join('\n')}

echo "✅ 清理检查完成"
echo ""
echo "📝 注意事项:"
echo "- 这些文件夹可能被程序自动重新创建"
echo "- 建议找到并修改创建这些文件夹的程序配置"
echo "- 如果文件夹包含重要内容，请先备份"
echo ""
echo "🔧 要永久解决这个问题，请:"
echo "1. 检查 zai-mcp-server 配置"
echo "2. 查找其他可能创建这些文件夹的程序"
echo "3. 修改或禁用自动目录创建功能"
`;

  const scriptPath = path.join(projectPath, 'cleanup-suspicious-folders.sh');
  try {
    fs.writeFileSync(scriptPath, scriptContent);
    fs.chmodSync(scriptPath, '755');
    console.log(`🧹 清理脚本已生成: ${scriptPath}`);
  } catch (error) {
    console.error('生成清理脚本失败:', error.message);
  }
}

// 记录到历史日志
function logToHistory(suspiciousFolders, context) {
  const logEntry = {
    timestamp: context.timestamp,
    sessionId: context.sessionId,
    trigger: context.trigger,
    findings: suspiciousFolders.length,
    folders: suspiciousFolders.map(f => ({
      name: f.name,
      created: f.birthtime
    }))
  };

  const logPath = path.join(process.cwd(), '.claude', 'logs', 'folder-monitor.log');

  try {
    // 确保日志目录存在
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(logPath, logLine);
  } catch (error) {
    console.error('写入日志失败:', error.message);
  }
}

// 导出Hook函数
module.exports = { folderMonitorHook };

// 如果直接运行
if (require.main === module) {
  const context = {
    trigger: 'manual',
    timestamp: new Date().toISOString(),
    sessionId: 'manual-' + Date.now()
  };

  folderMonitorHook(context);
}