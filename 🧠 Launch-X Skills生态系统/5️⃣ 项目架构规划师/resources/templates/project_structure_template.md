# 项目结构模板

## 模板信息

**模板名称**: 标准项目结构模板
**适用类型**: Web应用、移动应用、API服务、企业系统
**创建日期**: 2025-10-24
**版本**: v1.0.0

---

## 文件夹结构模板

```
[项目名称]/
├── docs/                    # 项目文档
│   ├── requirements.md          # 需求文档
│   ├── architecture.md          # 架构设计文档
│   ├── api_design.md           # API设计文档
│   └── deployment.md            # 部署文档
├── src/                      # 源代码
│   ├── frontend/              # 前端代码
│   ├── backend/               # 后端代码
│   ├── shared/                # 共享代码
│   └── config/               # 配置文件
├── tests/                    # 测试代码
│   ├── unit/                  # 单元测试
│   ├── integration/            # 集成测试
│   └── e2e/                 # 端到端测试
├── scripts/                  # 构建和部署脚本
│   ├── build.sh               # 构建脚本
│   ├── deploy.sh              # 部署脚本
│   └── setup.sh             # 环境设置
├── config/                   # 配置文件
│   ├── development.json        # 开发环境配置
│   ├── production.json         # 生产环境配置
│   └── testing.json           # 测试环境配置
├── .gitignore               # Git忽略文件
├── README.md                # 项目说明
├── docker-compose.yml       # 容器编排
└── package.json             # 项目依赖
```

---

## 配置文件模板

### development.json
```json
{
  "project_name": "[项目名称]",
  "version": "1.0.0",
  "description": "[项目描述]",
  "author": "[作者名称]",
  "database": {
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "name": "[项目名称]_db"
  },
  "backend": {
    "framework": "Django/FastAPI",
    "port": 8000,
    "debug": true,
    "secret_key": "[开发环境密钥]"
  },
  "frontend": {
    "framework": "React",
    "port": 3000,
    "api_url": "http://localhost:8000/api",
    "build_tool": "Webpack"
  },
  "features": {
    "authentication": true,
    "user_management": true,
    "api_documentation": "Swagger/OpenAPI"
  }
}
```

### requirements.md 模板
```markdown
# [项目名称] - 项目需求文档

## 1. 项目概述
- **项目目标**: [项目目标描述]
- **项目背景**: [项目背景介绍]
- **业务价值**: [项目的商业价值]
- **成功标准**: [项目成功的标准]

## 2. 功能需求
- **核心功能**:
  - [功能1]
  - [功能2]
  - [功能3]
- **扩展功能**:
  - [扩展功能1]
  - [扩展功能2]

## 3. 非功能需求
- **性能要求**: [响应时间、并发用户数等]
- **安全要求**: [数据加密、权限控制等]
- **兼容性要求**: [浏览器支持、移动端适配等]

## 4. 技术约束
- **技术栈**: [指定的技术栈限制]
- **第三方集成**: [需要集成的第三方服务]
- **部署环境**: [目标部署环境]

## 5. 用户场景
- **目标用户**: [主要用户群体特征]
- **使用场景**: [典型使用场景描述]

## 6. 验收标准
- **功能验收**: [各功能的验收标准]
- **性能验收**: [性能指标和测试标准]
- **安全验收**: [安全测试和合规要求]

## 7. 时间规划
- **里程碑**: [关键时间节点]
- **交付计划**: [阶段性交付物]
- **资源需求**: [人力、技术、设备需求]

---

*基于Launch-X项目规划方法论v2.4生成*