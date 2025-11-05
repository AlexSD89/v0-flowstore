#!/usr/bin/env node

/**
 * 文件夹创建监控Hook
 * 监控根目录下的文件夹创建，识别创建进程并提供详细报告
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FolderCreationMonitor {
  constructor(basePath) {
    this.basePath = basePath;
    this.monitoredFolders = new Set();
    this.creationLog = [];
    this.knownProcesses = new Map();
    this.isMonitoring = false;
  }

  // 获取当前所有进程信息
  getCurrentProcesses() {
    try {
      const output = execSync('ps aux', { encoding: 'utf8' });
      return output.split('\n')
        .filter(line => line.includes('node') || line.includes('mcp') || line.includes('claude'))
        .map(line => {
          const parts = line.trim().split(/\s+/);
          return {
            pid: parts[1],
            cpu: parts[2],
            mem: parts[3],
            command: parts.slice(10).join(' ')
          };
        });
    } catch (error) {
      console.error('获取进程信息失败:', error.message);
      return [];
    }
  }

  // 获取文件的详细创建信息
  getFileCreationInfo(filePath) {
    try {
      const stats = fs.statSync(filePath);
      const lsofOutput = execSync(`lsof +D "${path.dirname(filePath)}" 2>/dev/null`, { encoding: 'utf8' });

      return {
        path: filePath,
        birthtime: stats.birthtime,
        mtime: stats.mtime,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        lsof: lsofOutput.split('\n').filter(line => line.trim())
      };
    } catch (error) {
      console.error(`获取文件信息失败 ${filePath}:`, error.message);
      return null;
    }
  }

  // 扫描当前目录结构
  scanCurrentDirectories() {
    const dirs = [];
    try {
      const items = fs.readdirSync(this.basePath);
      for (const item of items) {
        const itemPath = path.join(this.basePath, item);
        try {
          const stats = fs.statSync(itemPath);
          if (stats.isDirectory()) {
            dirs.push({
              name: item,
              path: itemPath,
              birthtime: stats.birthtime,
              mtime: stats.mtime
            });
          }
        } catch (error) {
          // 忽略无法访问的文件
        }
      }
    } catch (error) {
      console.error('扫描目录失败:', error.message);
    }
    return dirs.sort((a, b) => b.birthtime - a.birthtime);
  }

  // 分析可疑的文件夹创建
  analyzeSuspiciousFolders() {
    const suspiciousPatterns = [
      'analytics', 'android-', 'cache', 'codegen', 'collaboration',
      'custom-templates', 'learning', 'logs', 'memory', 'predictive',
      'prompt-library', 'swarm', 'templates'
    ];

    const currentDirs = this.scanCurrentDirectories();
    const suspicious = currentDirs.filter(dir => {
      return suspiciousPatterns.some(pattern => dir.name.includes(pattern));
    });

    console.log('\n🔍 可疑文件夹分析报告');
    console.log('='.repeat(50));

    if (suspicious.length === 0) {
      console.log('✅ 未发现可疑文件夹');
      return;
    }

    console.log(`发现 ${suspicious.length} 个可疑文件夹:`);

    suspicious.forEach((dir, index) => {
      console.log(`\n${index + 1}. ${dir.name}`);
      console.log(`   路径: ${dir.path}`);
      console.log(`   创建时间: ${dir.birthtime.toLocaleString()}`);
      console.log(`   修改时间: ${dir.mtime.toLocaleString()}`);

      // 检查文件夹内容
      try {
        const content = fs.readdirSync(dir.path);
        console.log(`   内容: ${content.length > 0 ? content.join(', ') : '(空文件夹)'}`);
      } catch (error) {
        console.log(`   内容: (无法读取)`);
      }
    });

    // 尝试关联到进程
    console.log('\n🔗 关联进程分析');
    console.log('-'.repeat(30));

    const processes = this.getCurrentProcesses();
    console.log(`当前运行的相关进程: ${processes.length} 个`);

    processes.forEach(proc => {
      if (proc.command.includes('zai-mcp-server') ||
          proc.command.includes('mcp-server') ||
          proc.command.includes('claude')) {
        console.log(`\n📱 进程: ${proc.pid}`);
        console.log(`   命令: ${proc.command.substring(0, 100)}...`);
        console.log(`   CPU: ${proc.cpu}%, 内存: ${proc.mem}%`);
      }
    });

    // 生成建议
    console.log('\n💡 建议和解决方案');
    console.log('-'.repeat(30));
    console.log('1. 检查 zai-mcp-server 配置文件');
    console.log('2. 查看该服务器的启动脚本');
    console.log('3. 考虑修改服务器配置，避免自动创建目录');
    console.log('4. 可以删除这些空文件夹，它们会被重新创建');
  }

  // 开始监控
  startMonitoring() {
    if (this.isMonitoring) {
      console.log('监控已在运行中');
      return;
    }

    console.log('🚀 开始监控文件夹创建...');
    this.isMonitoring = true;

    // 记录初始状态
    const initialDirs = this.scanCurrentDirectories();
    initialDirs.forEach(dir => {
      this.monitoredFolders.add(dir.path);
    });

    // 立即分析当前状态
    this.analyzeSuspiciousFolders();

    // 设置定期检查
    this.monitoringInterval = setInterval(() => {
      this.checkForNewFolders();
    }, 5000); // 每5秒检查一次
  }

  // 检查新创建的文件夹
  checkForNewFolders() {
    try {
      const currentDirs = this.scanCurrentDirectories();
      const newFolders = currentDirs.filter(dir => !this.monitoredFolders.has(dir.path));

      if (newFolders.length > 0) {
        console.log(`\n🚨 检测到 ${newFolders.length} 个新文件夹:`);

        newFolders.forEach(dir => {
          console.log(`   + ${dir.name} (${dir.path}) - 创建于 ${dir.birthtime.toLocaleString()}`);
          this.monitoredFolders.add(dir.path);

          // 立即分析这个新文件夹
          const info = this.getFileCreationInfo(dir.path);
          if (info && info.lsof.length > 0) {
            console.log(`     可能相关进程: ${info.lsof.slice(0, 3).join(', ')}`);
          }
        });

        // 更新进程信息
        console.log('\n当前活动进程:');
        const processes = this.getCurrentProcesses();
        processes.slice(0, 5).forEach(proc => {
          console.log(`   ${proc.pid}: ${proc.command.substring(0, 80)}...`);
        });
      }
    } catch (error) {
      console.error('监控检查失败:', error.message);
    }
  }

  // 停止监控
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('⏹️ 监控已停止');
  }

  // 生成清理脚本
  generateCleanupScript() {
    const suspiciousDirs = this.scanCurrentDirectories().filter(dir => {
      const suspiciousPatterns = [
        'analytics', 'android-', 'cache', 'codegen', 'collaboration',
        'custom-templates', 'learning', 'logs', 'memory', 'predictive',
        'prompt-library', 'swarm', 'templates'
      ];
      return suspiciousPatterns.some(pattern => dir.name.includes(pattern));
    });

    const script = `#!/bin/bash
# 自动生成的清理脚本
# 请谨慎使用，删除前请确认这些文件夹确实不需要

echo "清理可疑文件夹..."
echo "发现 ${suspiciousDirs.length} 个文件夹待清理"
echo "";

${suspiciousDirs.map(dir => {
  return `# 删除 ${dir.name}
if [ -d "${dir.path}" ]; then
    echo "删除: ${dir.path}"
    # rm -rf "${dir.path}"
    echo "   (已注释删除命令，请手动确认后取消注释)"
fi
echo "";
`).join('\n')}

echo "清理完成"
echo "注意: 如果这些文件夹被程序自动创建，它们可能会重新出现"
echo "建议找到并修改创建这些文件夹的程序配置"
`;

    const scriptPath = path.join(this.basePath, '.claude', 'cleanup-suspicious-folders.sh');
    try {
      fs.writeFileSync(scriptPath, script);
      fs.chmodSync(scriptPath, '755');
      console.log(`✅ 清理脚本已生成: ${scriptPath}`);
      console.log('   请手动检查并取消注释删除命令后执行');
    } catch (error) {
      console.error('生成清理脚本失败:', error.message);
    }
  }
}

// 主执行逻辑
function main() {
  const basePath = process.argv[2] || process.cwd();

  console.log('📁 文件夹创建监控工具');
  console.log(`监控路径: ${basePath}`);
  console.log('');

  const monitor = new FolderCreationMonitor(basePath);

  // 处理命令行参数
  const command = process.argv[3] || 'analyze';

  switch (command) {
    case 'monitor':
      monitor.startMonitoring();
      console.log('\n按 Ctrl+C 停止监控');
      process.on('SIGINT', () => {
        monitor.stopMonitoring();
        process.exit(0);
      });
      break;

    case 'analyze':
      monitor.analyzeSuspiciousFolders();
      monitor.generateCleanupScript();
      break;

    case 'cleanup':
      monitor.generateCleanupScript();
      break;

    default:
      console.log('用法:');
      console.log('  node folder-creation-monitor.js [path] analyze  - 分析现有文件夹');
      console.log('  node folder-creation-monitor.js [path] monitor  - 开始监控');
      console.log('  node folder-creation-monitor.js [path] cleanup  - 生成清理脚本');
      break;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { FolderCreationMonitor };