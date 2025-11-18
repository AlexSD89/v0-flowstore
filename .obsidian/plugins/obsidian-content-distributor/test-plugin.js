#!/usr/bin/env node

/**
 * Content Distributor Plugin Test Script
 * 测试插件的基本功能和配置
 */

const fs = require('fs');
const path = require('path');

// 测试文件是否存在
function testFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${description}: ${filePath}`);
        return true;
    } else {
        console.log(`❌ ${description}: ${filePath} (文件不存在)`);
        return false;
    }
}

// 测试 JSON 配置
function testJSONConfig(filePath, description) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content);
        console.log(`✅ ${description}: ${filePath}`);
        return true;
    } catch (error) {
        console.log(`❌ ${description}: ${filePath} (JSON格式错误: ${error.message})`);
        return false;
    }
}

// 测试 TypeScript 编译
function testTypeScriptCompilation() {
    console.log('\n🔍 测试 TypeScript 编译...');
    const { execSync } = require('child_process');

    try {
        execSync('npx tsc --noEmit', { stdio: 'inherit' });
        console.log('✅ TypeScript 编译通过');
        return true;
    } catch (error) {
        console.log('❌ TypeScript 编译失败');
        return false;
    }
}

// 测试 esbuild 构建
function testEsbuildBuild() {
    console.log('\n🏗️ 测试 esbuild 构建...');
    const { execSync } = require('child_process');

    try {
        const result = execSync('npx esbuild main.ts --bundle --external:obsidian --format=cjs --outfile=main.js --target=es2018', {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        if (fs.existsSync('main.js')) {
            const stats = fs.statSync('main.js');
            console.log(`✅ esbuild 构建成功: main.js (${stats.size} bytes)`);
            return true;
        } else {
            console.log('❌ esbuild 构建失败：未生成 main.js');
            return false;
        }
    } catch (error) {
        console.log(`❌ esbuild 构建失败: ${error.message}`);
        return false;
    }
}

// 主测试函数
function runTests() {
    console.log('🧪 Content Distributor Plugin 测试');
    console.log('=====================================');

    let allTestsPassed = true;

    // 测试核心文件
    allTestsPassed &= testFileExists('main.ts', 'TypeScript 源文件');
    allTestsPassed &= testFileExists('manifest.json', '插件清单文件');
    allTestsPassed &= testFileExists('package.json', 'npm 包配置文件');
    allTestsPassed &= testFileExists('tsconfig.json', 'TypeScript 配置文件');
    allTestsPassed &= testFileExists('esbuild.config.mjs', 'esbuild 配置文件');
    allTestsPassed &= testFileExists('README.md', '说明文档');
    allTestsPassed &= testFileExists('claude.md', 'Claude 角色卡');

    // 测试配置文件
    console.log('\n📋 测试配置文件...');
    allTestsPassed &= testJSONConfig('manifest.json', 'manifest.json 配置');
    allTestsPassed &= testJSONConfig('package.json', 'package.json 配置');
    allTestsPassed &= testJSONConfig('versions.json', 'versions.json 配置');

    // 测试编译和构建
    allTestsPassed &= testTypeScriptCompilation();
    allTestsPassed &= testEsbuildBuild();

    // 测试结果
    console.log('\n📊 测试结果');
    console.log('=====================================');
    if (allTestsPassed) {
        console.log('🎉 所有测试通过！插件已准备就绪。');
        console.log('\n📦 下一步：');
        console.log('1. 将插件文件夹复制到 Obsidian 插件目录');
        console.log('2. 在 Obsidian 设置中启用插件');
        console.log('3. 配置 AI 模型 API 密钥');
        console.log('4. 开始使用内容分发功能！');
    } else {
        console.log('⚠️  部分测试失败，请检查上述错误信息。');
        process.exit(1);
    }
}

// 运行测试
if (require.main === module) {
    runTests();
}

module.exports = { runTests };