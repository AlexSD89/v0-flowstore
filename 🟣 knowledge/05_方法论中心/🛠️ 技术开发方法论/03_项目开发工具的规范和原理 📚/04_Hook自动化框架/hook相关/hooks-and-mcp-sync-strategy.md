# LaunchX Hooks & MCP 同步策略 / LaunchX Hooks & MCP Sync Strategy

## 现状分析 / Current State Analysis

### 🔗 Hooks 存储机制 / Hooks Storage Mechanism
- **位置**: 本地文件系统 `~/.claude-code/hooks/`
- **特性**: 不跟账号同步，纯本地存储
- **影响**: 换设备需重新配置

### 🔌 MCP 存储机制 / MCP Storage Mechanism  
- **配置位置**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **服务类型**: 混合（本地 + 云端）
- **账号关联**: 部分服务通过 API key 关联

## 📊 您当前的 MCP 配置分析

```json
{
  "本地服务": ["basic-memory"],
  "云端服务": ["obsidian-mcp", "memory-bank-mcp"],  
  "托管服务": ["@mzxrai-mcp-webresearch", "@smithery-ai-server-sequential-thinking"],
  "混合服务": ["mcp-obsidian"]
}
```

## 🎯 LaunchX 同步策略设计

### 方案一：项目级配置同步（推荐）

#### 优势
- ✅ 版本控制友好
- ✅ 团队协作便利  
- ✅ 项目特定配置
- ✅ 易于备份和恢复

#### 实现方案
```bash
# 项目结构
launchx-project/
├── .ruler/
│   ├── instructions.md     # Ruler 统一规则
│   ├── mcp.json           # 项目 MCP 配置  
│   └── hooks.json         # Hooks 配置清单
├── .claude-hooks/         # 项目专用 hooks
│   ├── user-prompt-submit-hook.sh
│   ├── tool-call-hook.sh
│   └── project-completion-hook.sh
└── 开发规范工具/
    └── sound-system/      # 声音系统
```

### 方案二：云端配置同步

#### 通过 Git + 脚本实现
```bash
#!/bin/bash
# sync-launchx-config.sh

# 备份当前配置
backup_config() {
    cp ~/Library/Application\ Support/Claude/claude_desktop_config.json \
       ./config/backup/claude_config_$(date +%Y%m%d_%H%M%S).json
}

# 同步配置到项目
sync_to_project() {
    # 提取 LaunchX 相关的 MCP 配置
    jq '.mcpServers | with_entries(select(.key | test("launchx|obsidian|memory")))' \
       ~/Library/Application\ Support/Claude/claude_desktop_config.json > \
       ./.ruler/mcp_subset.json
}

# 从项目恢复配置
restore_from_project() {
    # 合并项目配置到系统配置
    jq -s '.[0] * .[1]' \
       ~/Library/Application\ Support/Claude/claude_desktop_config.json \
       ./.ruler/mcp_subset.json > \
       /tmp/merged_config.json
    
    cp /tmp/merged_config.json \
       ~/Library/Application\ Support/Claude/claude_desktop_config.json
}
```

### 方案三：智能配置管理器

#### 创建配置管理工具
```python
# config_manager.py
class LaunchXConfigManager:
    def __init__(self):
        self.claude_config_path = Path.home() / "Library/Application Support/Claude/claude_desktop_config.json"
        self.project_config_path = Path(".ruler/mcp.json")
        self.hooks_config_path = Path(".claude-hooks/")
    
    def sync_mcp_config(self, direction="to_project"):
        """同步 MCP 配置"""
        if direction == "to_project":
            # 从系统配置提取项目相关配置
            self._extract_project_mcp()
        else:
            # 从项目配置更新系统配置
            self._update_system_mcp()
    
    def install_hooks(self):
        """安装项目 hooks 到系统"""
        system_hooks_dir = Path.home() / ".claude-code/hooks"
        system_hooks_dir.mkdir(parents=True, exist_ok=True)
        
        for hook_file in self.hooks_config_path.glob("*.sh"):
            target = system_hooks_dir / hook_file.name
            shutil.copy2(hook_file, target)
            target.chmod(0o755)
    
    def generate_setup_script(self):
        """生成一键配置脚本"""
        script_content = f"""#!/bin/bash
# LaunchX 环境配置脚本
echo "🚀 配置 LaunchX 开发环境..."

# 1. 安装 Ruler
npm install -g @intellectronica/ruler

# 2. 应用 Ruler 配置  
ruler apply

# 3. 安装项目 Hooks
python3 {self.project_config_path.parent}/config_manager.py install-hooks

# 4. 同步 MCP 配置
python3 {self.project_config_path.parent}/config_manager.py sync-mcp

echo "✅ LaunchX 环境配置完成！"
"""
        return script_content
```

## 🔧 推荐实施步骤

### 第一阶段：本地项目配置标准化
1. ✅ 将 hooks 和 MCP 配置模板化
2. ✅ 创建项目级配置文件  
3. ✅ 编写同步脚本

### 第二阶段：版本控制集成
1. 📝 配置文件加入 Git 追踪
2. 🔄 设置 Git hooks 自动同步
3. 👥 团队配置标准化

### 第三阶段：云端协作增强
1. ☁️ 关键配置云端备份
2. 🔑 敏感信息环境变量化
3. 🌐 跨设备配置同步

## 🎯 针对您的具体情况

### 当前 MCP 服务优化建议

1. **整理现有配置**
   ```bash
   # 检查哪些 MCP 服务实际在使用
   for server in basic-memory obsidian-mcp memory-bank-mcp; do
       echo "测试 $server 连接状态..."
       # 测试连接逻辑
   done
   ```

2. **项目特定 MCP 配置**
   ```json
   {
     "launchx_core": {
       "filesystem": "~/Documents/obsidion/launch x",
       "knowledge_base": "🟣 knowledge",
       "sound_system": "开发规范工具/sound-system"
     },
     "development_tools": {
       "zhilink": "💻 技术开发/01_平台项目/zhilink-v2",
       "pocketcorn": "💻 技术开发/01_平台项目/pocketcorn_v4"
     }
   }
   ```

3. **Hooks 统一管理**
   ```bash
   # 在项目根目录创建 hooks 管理脚本
   ./scripts/setup-hooks.sh install    # 安装 hooks
   ./scripts/setup-hooks.sh sync       # 同步配置
   ./scripts/setup-hooks.sh backup     # 备份配置
   ```

## 🔮 未来扩展可能性

### Claude Code 可能的官方同步功能
- 账号级配置云端同步
- 团队级配置共享
- 项目模板化配置

### LaunchX 系统集成增强
- Obsidian + Claude Code 深度集成
- 知识库自动索引和 MCP 暴露
- 项目上下文智能切换

## 💡 立即可行的解决方案

基于您当前的设置，我建议：

1. **短期**：使用 Ruler + Git 管理配置
2. **中期**：开发配置同步工具  
3. **长期**：等待官方同步功能或开发云端方案

这样既能保持现有工作流的稳定性，又为未来的扩展留下了空间。