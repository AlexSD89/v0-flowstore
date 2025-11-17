#!/usr/bin/env python3
"""
Serena Memory Bank API服务器
提供完整的RESTful API接口用于Memory管理
"""

import json
import os
import logging
from datetime import datetime
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

class SerenaAPIServer:
    def __init__(self, launchx_root):
        self.launchx_root = Path(launchx_root)
        self.serena_memories_dir = self.launchx_root / ".serena" / "memories"
        self.memory_bank_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank"

        # 确保目录存在
        self.serena_memories_dir.mkdir(parents=True, exist_ok=True)

        # 初始化Flask应用
        self.app = Flask(__name__)
        CORS(self.app)  # 启用跨域支持

        # 配置日志
        self._setup_logging()

        # 注册路由
        self._register_routes()

    def _setup_logging(self):
        """配置日志系统"""
        # 加载日志配置
        log_config_file = self.launchx_root / ".serena" / "logs" / "logging_config.json"
        if log_config_file.exists():
            with open(log_config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            import logging.config
            logging.config.dictConfig(config)

        self.logger = logging.getLogger('serena.main')
        self.logger.info("Serena API服务器初始化...")

    def _register_routes(self):
        """注册所有API路由"""

        @self.app.route('/api/memories', methods=['GET'])
        def get_memories():
            """获取所有memories"""
            try:
                memories = []

                # 扫描Serena memories目录
                for memory_file in self.serena_memories_dir.rglob("*.md"):
                    if memory_file.name.startswith('.'):
                        continue

                    rel_path = memory_file.relative_to(self.serena_memories_dir)
                    stat = memory_file.stat()

                    # 读取文件内容预览
                    try:
                        content = memory_file.read_text(encoding='utf-8', errors='ignore')
                        preview = content[:200] + "..." if len(content) > 200 else content
                    except:
                        preview = "内容读取失败"

                    memories.append({
                        'id': str(rel_path),
                        'name': memory_file.stem,
                        'path': str(rel_path),
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        'category': rel_path.parent.name if rel_path.parent != Path('.') else 'root',
                        'preview': preview
                    })

                # 按修改时间排序
                memories.sort(key=lambda x: x['modified'], reverse=True)

                return jsonify({
                    'success': True,
                    'data': memories,
                    'total': len(memories),
                    'timestamp': datetime.now().isoformat()
                })

            except Exception as e:
                self.logger.error(f"获取memories失败: {str(e)}")
                return jsonify({
                    'success': False,
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }), 500

        @self.app.route('/api/memories/search', methods=['GET'])
        def search_memories():
            """搜索memories"""
            try:
                query = request.args.get('q', '').strip()
                category = request.args.get('category', '')

                if not query:
                    return jsonify({
                        'success': False,
                        'error': '搜索关键词不能为空'
                    }), 400

                memories = []
                query_lower = query.lower()

                # 搜索所有memory文件
                for memory_file in self.serena_memories_dir.rglob("*.md"):
                    if memory_file.name.startswith('.'):
                        continue

                    # 类别过滤
                    rel_path = memory_file.relative_to(self.serena_memories_dir)
                    file_category = rel_path.parent.name if rel_path.parent != Path('.') else 'root'
                    if category and file_category != category:
                        continue

                    # 读取内容进行匹配
                    try:
                        content = memory_file.read_text(encoding='utf-8', errors='ignore')
                        content_lower = content.lower()

                        # 检查匹配
                        if (query_lower in memory_file.name.lower() or
                            query_lower in content_lower):

                            # 计算相关度分数
                            score = 0
                            if query_lower in memory_file.name.lower():
                                score += 10  # 文件名匹配权重高

                            # 计算内容中的出现次数
                            content_matches = content_lower.count(query_lower)
                            score += content_matches

                            memories.append({
                                'id': str(rel_path),
                                'name': memory_file.stem,
                                'path': str(rel_path),
                                'category': file_category,
                                'score': score,
                                'preview': self._extract_preview(content, query_lower),
                                'matches': content_matches
                            })

                    except Exception as e:
                        self.logger.warning(f"读取文件失败 {memory_file}: {e}")
                        continue

                # 按相关度排序
                memories.sort(key=lambda x: x['score'], reverse=True)

                return jsonify({
                    'success': True,
                    'data': memories[:50],  # 限制返回50个结果
                    'total_found': len(memories),
                    'query': query,
                    'timestamp': datetime.now().isoformat()
                })

            except Exception as e:
                self.logger.error(f"搜索memories失败: {str(e)}")
                return jsonify({
                    'success': False,
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }), 500

        @self.app.route('/api/memories/categories', methods=['GET'])
        def get_categories():
            """获取memory分类统计"""
            try:
                categories = {}
                total_files = 0
                total_size = 0

                for memory_file in self.serena_memories_dir.rglob("*.md"):
                    if memory_file.name.startswith('.'):
                        continue

                    rel_path = memory_file.relative_to(self.serena_memories_dir)
                    category = rel_path.parent.name if rel_path.parent != Path('.') else 'root'
                    stat = memory_file.stat()

                    if category not in categories:
                        categories[category] = {
                            'name': category,
                            'count': 0,
                            'size': 0,
                            'description': self._get_category_description(category)
                        }

                    categories[category]['count'] += 1
                    categories[category]['size'] += stat.st_size
                    total_files += 1
                    total_size += stat.st_size

                return jsonify({
                    'success': True,
                    'data': list(categories.values()),
                    'total_files': total_files,
                    'total_size': total_size,
                    'timestamp': datetime.now().isoformat()
                })

            except Exception as e:
                self.logger.error(f"获取分类失败: {str(e)}")
                return jsonify({
                    'success': False,
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }), 500

        @self.app.route('/api/memories/<path:memory_id>', methods=['GET'])
        def get_memory(memory_id):
            """获取特定memory的详细内容"""
            try:
                memory_file = self.serena_memories_dir / memory_id
                if not memory_file.exists() or not memory_file.suffix == '.md':
                    return jsonify({
                        'success': False,
                        'error': 'Memory文件不存在'
                    }), 404

                content = memory_file.read_text(encoding='utf-8')
                stat = memory_file.stat()

                return jsonify({
                    'success': True,
                    'data': {
                        'id': memory_id,
                        'name': memory_file.stem,
                        'path': str(memory_file.relative_to(self.serena_memories_dir)),
                        'content': content,
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        'created': datetime.fromtimestamp(stat.st_ctime).isoformat()
                    },
                    'timestamp': datetime.now().isoformat()
                })

            except Exception as e:
                self.logger.error(f"获取memory详情失败: {str(e)}")
                return jsonify({
                    'success': False,
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }), 500

        @self.app.route('/api/health', methods=['GET'])
        def health_check():
            """健康检查端点"""
            try:
                # 检查关键目录和文件
                serena_ok = self.serena_memories_dir.exists()
                memory_bank_ok = self.memory_bank_dir.exists()
                log_dir_ok = (self.launchx_root / ".serena" / "logs").exists()

                # 统计文件数量
                memory_count = len(list(self.serena_memories_dir.rglob("*.md")))

                return jsonify({
                    'success': True,
                    'status': 'healthy',
                    'timestamp': datetime.now().isoformat(),
                    'services': {
                        'serena_memories': 'ok' if serena_ok else 'error',
                        'memory_bank': 'ok' if memory_bank_ok else 'error',
                        'logging': 'ok' if log_dir_ok else 'error'
                    },
                    'stats': {
                        'total_memories': memory_count,
                        'api_version': '1.0.0'
                    }
                })

            except Exception as e:
                return jsonify({
                    'success': False,
                    'status': 'unhealthy',
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }), 500

        @self.app.route('/api/stats', methods=['GET'])
        def get_stats():
            """获取系统统计信息"""
            try:
                # Memory统计
                memory_count = 0
                memory_size = 0
                categories = {}

                for memory_file in self.serena_memories_dir.rglob("*.md"):
                    if memory_file.name.startswith('.'):
                        continue

                    memory_count += 1
                    stat = memory_file.stat()
                    memory_size += stat.st_size

                    rel_path = memory_file.relative_to(self.serena_memories_dir)
                    category = rel_path.parent.name if rel_path.parent != Path('.') else 'root'
                    categories[category] = categories.get(category, 0) + 1

                # Memory Bank统计
                mb_count = 0
                mb_size = 0
                for mb_file in self.memory_bank_dir.rglob("*.md"):
                    if mb_file.name.startswith('.'):
                        continue
                    mb_count += 1
                    mb_size += mb_file.stat().st_size

                return jsonify({
                    'success': True,
                    'data': {
                        'serena_memories': {
                            'count': memory_count,
                            'size': memory_size,
                            'categories': categories
                        },
                        'memory_bank': {
                            'count': mb_count,
                            'size': mb_size
                        },
                        'system': {
                            'uptime': self._get_uptime(),
                            'version': '1.0.0'
                        }
                    },
                    'timestamp': datetime.now().isoformat()
                })

            except Exception as e:
                self.logger.error(f"获取统计信息失败: {str(e)}")
                return jsonify({
                    'success': False,
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }), 500

        # 错误处理
        @self.app.errorhandler(404)
        def not_found(error):
            return jsonify({
                'success': False,
                'error': 'API端点不存在',
                'timestamp': datetime.now().isoformat()
            }), 404

        @self.app.errorhandler(500)
        def internal_error(error):
            return jsonify({
                'success': False,
                'error': '内部服务器错误',
                'timestamp': datetime.now().isoformat()
            }), 500

    def _extract_preview(self, content, query):
        """提取包含查询关键词的内容预览"""
        lines = content.split('\n')
        preview_lines = []

        for line in lines:
            if query.lower() in line.lower() and line.strip():
                preview_lines.append(line.strip())
                if len(preview_lines) >= 3:  # 最多3行预览
                    break

        return ' | '.join(preview_lines) if preview_lines else content[:200] + "..."

    def _get_category_description(self, category):
        """获取分类描述"""
        descriptions = {
            'support_modules': '支持模块',
            'data': '数据文件',
            'business': '业务相关',
            'documentation': '文档',
            'other': '其他',
            'root': '根目录'
        }
        return descriptions.get(category, category)

    def _get_uptime(self):
        """获取系统运行时间"""
        try:
            import psutil
            process = psutil.Process()
            return datetime.fromtimestamp(process.create_time()).isoformat()
        except:
            return datetime.now().isoformat()

    def run(self, host='127.0.0.1', port=24283, debug=False):
        """启动API服务器"""
        self.logger.info(f"启动Serena API服务器在 http://{host}:{port}")
        self.logger.info("API端点:")
        self.logger.info("  GET /api/memories - 获取所有memories")
        self.logger.info("  GET /api/memories/search?q=关键词 - 搜索memories")
        self.logger.info("  GET /api/memories/categories - 获取分类统计")
        self.logger.info("  GET /api/memories/<id> - 获取memory详情")
        self.logger.info("  GET /api/health - 健康检查")
        self.logger.info("  GET /api/stats - 系统统计")

        self.app.run(host=host, port=port, debug=debug, threaded=True)

def main():
    """主函数"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    api_server = SerenaAPIServer(launchx_root)
    api_server.run()

if __name__ == "__main__":
    main()