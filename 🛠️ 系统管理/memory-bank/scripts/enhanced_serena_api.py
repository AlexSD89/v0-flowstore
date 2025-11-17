#!/usr/bin/env python3
"""
增强版Serena API服务器
集成语义搜索功能和完整的RESTful API接口
"""

import json
import os
import sys
import logging
from datetime import datetime
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# 导入语义搜索引擎
sys.path.append(str(Path(__file__).parent))
from semantic_search_engine import SemanticSearchEngine

class EnhancedSerenaAPIHandler(BaseHTTPRequestHandler):
    def __init__(self, launchx_root, *args, **kwargs):
        self.launchx_root = Path(launchx_root)
        self.serena_memories_dir = self.launchx_root / ".serena" / "memories"
        self.memory_bank_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank"

        # 配置日志
        self._setup_logging()

        # 初始化语义搜索引擎
        self.search_engine = SemanticSearchEngine(launchx_root)
        self._initialize_search_engine()

        super().__init__(*args, **kwargs)

    def _setup_logging(self):
        """配置日志"""
        log_file = self.launchx_root / ".serena" / "logs" / "enhanced_serena_api.log"
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler(sys.stdout)
            ]
        )
        self.logger = logging.getLogger('enhanced_serena_api')

    def _initialize_search_engine(self):
        """初始化搜索引擎"""
        try:
            # 尝试加载现有索引
            if not self.search_engine.load_index():
                self.logger.info("构建新的搜索索引...")
                self.search_engine.build_search_index()
                self.search_engine.save_index()
            else:
                self.logger.info("搜索索引加载成功")

        except Exception as e:
            self.logger.error(f"搜索引擎初始化失败: {str(e)}")
            # 降级到基本功能
            self.search_engine = None

    def do_GET(self):
        """处理GET请求"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)

        try:
            if path == '/api/memories':
                self._handle_get_memories(query_params)
            elif path == '/api/memories/search':
                self._handle_search_memories(query_params)
            elif path == '/api/memories/semantic-search':
                self._handle_semantic_search(query_params)
            elif path == '/api/memories/suggestions':
                self._handle_search_suggestions(query_params)
            elif path == '/api/memories/categories':
                self._handle_get_categories()
            elif path.startswith('/api/memories/') and path.count('/') == 3:
                memory_id = path.split('/')[-1]
                self._handle_get_memory(memory_id)
            elif path == '/api/health':
                self._handle_health_check()
            elif path == '/api/stats':
                self._handle_get_stats()
            elif path == '/api/search-stats':
                self._handle_search_stats()
            else:
                self._send_error(404, "API端点不存在")
        except Exception as e:
            self.logger.error(f"处理请求失败: {str(e)}")
            self._send_error(500, f"内部服务器错误: {str(e)}")

    def do_POST(self):
        """处理POST请求"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        try:
            if path == '/api/search/rebuild-index':
                self._handle_rebuild_index()
            else:
                self._send_error(404, "API端点不存在")
        except Exception as e:
            self.logger.error(f"处理POST请求失败: {str(e)}")
            self._send_error(500, f"内部服务器错误: {str(e)}")

    def _handle_semantic_search(self, query_params):
        """处理语义搜索请求"""
        try:
            query = query_params.get('q', [''])[0].strip()
            max_results = int(query_params.get('limit', ['10'])[0])
            category = query_params.get('category', [''])[0].strip()

            if not query:
                self._send_error(400, '搜索关键词不能为空')
                return

            if not self.search_engine:
                self._send_error(503, '语义搜索引擎不可用')
                return

            # 执行语义搜索
            results = self.search_engine.search(query, max_results, category)

            # 格式化结果
            formatted_results = []
            for result in results:
                formatted_results.append({
                    'id': result['doc_id'],
                    'title': result['title'],
                    'category': result['category'],
                    'similarity': round(result['similarity'], 4),
                    'preview': result['preview'],
                    'path': result['file_path'],
                    'matched_terms': result['matched_terms'],
                    'score_type': 'semantic'
                })

            response = {
                'success': True,
                'data': formatted_results,
                'query': query,
                'total_found': len(formatted_results),
                'search_type': 'semantic',
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)
            self.logger.info(f"语义搜索完成: '{query}' -> {len(formatted_results)}结果")

        except Exception as e:
            self._send_error(500, f"语义搜索失败: {str(e)}")

    def _handle_search_suggestions(self, query_params):
        """处理搜索建议请求"""
        try:
            partial_query = query_params.get('q', [''])[0].strip()
            limit = int(query_params.get('limit', ['5'])[0])

            if not self.search_engine:
                suggestions = []
            else:
                suggestions = self.search_engine.get_search_suggestions(partial_query, limit)

            response = {
                'success': True,
                'data': {
                    'query': partial_query,
                    'suggestions': suggestions
                },
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)

        except Exception as e:
            self._send_error(500, f"获取搜索建议失败: {str(e)}")

    def _handle_rebuild_index(self):
        """处理重建索引请求"""
        try:
            if not self.search_engine:
                self._send_error(503, '语义搜索引擎不可用')
                return

            # 获取POST数据
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            request_data = json.loads(post_data) if post_data else {}

            force_rebuild = request_data.get('force', False)

            self.logger.info("开始重建搜索索引...")
            start_time = datetime.now()

            self.search_engine.build_search_index()
            self.search_engine.save_index()

            build_time = (datetime.now() - start_time).total_seconds()

            response = {
                'success': True,
                'data': {
                    'message': '搜索索引重建完成',
                    'build_time_seconds': round(build_time, 2),
                    'indexed_documents': len(self.search_engine.documents),
                    'vocabulary_size': len(self.search_engine.vocabulary)
                },
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)
            self.logger.info(f"搜索索引重建完成，耗时{build_time:.2f}秒")

        except Exception as e:
            self._send_error(500, f"重建索引失败: {str(e)}")

    def _handle_search_stats(self):
        """获取搜索统计信息"""
        try:
            if self.search_engine:
                stats = self.search_engine.get_search_stats()
                stats['search_engine_available'] = True
            else:
                stats = {
                    'search_engine_available': False,
                    'error': '搜索引擎不可用'
                }

            response = {
                'success': True,
                'data': stats,
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)

        except Exception as e:
            self._send_error(500, f"获取搜索统计失败: {str(e)}")

    def _handle_get_memories(self, query_params):
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

            response = {
                'success': True,
                'data': memories,
                'total': len(memories),
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)
            self.logger.info(f"返回{len(memories)}个memories")

        except Exception as e:
            self._send_error(500, f"获取memories失败: {str(e)}")

    def _handle_search_memories(self, query_params):
        """处理传统关键词搜索"""
        try:
            query = query_params.get('q', [''])[0].strip()
            category = query_params.get('category', [''])[0].strip()

            if not query:
                self._send_error(400, '搜索关键词不能为空')
                return

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
                            'matches': content_matches,
                            'score_type': 'keyword'
                        })

                except Exception as e:
                    self.logger.warning(f"读取文件失败 {memory_file}: {e}")
                    continue

            # 按相关度排序
            memories.sort(key=lambda x: x['score'], reverse=True)

            response = {
                'success': True,
                'data': memories[:50],  # 限制返回50个结果
                'total_found': len(memories),
                'query': query,
                'search_type': 'keyword',
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)
            self.logger.info(f"关键词搜索'{query}'找到{len(memories)}个结果")

        except Exception as e:
            self._send_error(500, f"搜索memories失败: {str(e)}")

    def _handle_get_categories(self):
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

            response = {
                'success': True,
                'data': list(categories.values()),
                'total_files': total_files,
                'total_size': total_size,
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)

        except Exception as e:
            self._send_error(500, f"获取分类失败: {str(e)}")

    def _handle_get_memory(self, memory_id):
        """获取特定memory的详细内容"""
        try:
            memory_file = self.serena_memories_dir / memory_id
            if not memory_file.exists() or not memory_file.suffix == '.md':
                self._send_error(404, 'Memory文件不存在')
                return

            content = memory_file.read_text(encoding='utf-8')
            stat = memory_file.stat()

            response = {
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
            }

            self._send_json_response(response)
            self.logger.info(f"返回memory详情: {memory_id}")

        except Exception as e:
            self._send_error(500, f"获取memory详情失败: {str(e)}")

    def _handle_health_check(self):
        """健康检查端点"""
        try:
            # 检查关键目录和文件
            serena_ok = self.serena_memories_dir.exists()
            memory_bank_ok = self.memory_bank_dir.exists()
            log_dir_ok = (self.launchx_root / ".serena" / "logs").exists()
            search_engine_ok = self.search_engine is not None

            # 统计文件数量
            memory_count = len(list(self.serena_memories_dir.rglob("*.md")))

            response = {
                'success': True,
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'services': {
                    'serena_memories': 'ok' if serena_ok else 'error',
                    'memory_bank': 'ok' if memory_bank_ok else 'error',
                    'logging': 'ok' if log_dir_ok else 'error',
                    'semantic_search': 'ok' if search_engine_ok else 'error'
                },
                'stats': {
                    'total_memories': memory_count,
                    'api_version': '2.0.0',
                    'search_engine_available': search_engine_ok
                }
            }

            self._send_json_response(response)

        except Exception as e:
            self._send_error(500, f"健康检查失败: {str(e)}")

    def _handle_get_stats(self):
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

            # 搜索引擎统计
            search_stats = {}
            if self.search_engine:
                search_stats = self.search_engine.get_search_stats()

            response = {
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
                    'search_engine': search_stats,
                    'system': {
                        'uptime': datetime.now().isoformat(),
                        'version': '2.0.0'
                    }
                },
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)

        except Exception as e:
            self._send_error(500, f"获取统计信息失败: {str(e)}")

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

    def _send_json_response(self, data, status_code=200):
        """发送JSON响应"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        json_data = json.dumps(data, ensure_ascii=False, indent=2)
        self.wfile.write(json_data.encode('utf-8'))

    def _send_error(self, status_code, message):
        """发送错误响应"""
        error_response = {
            'success': False,
            'error': message,
            'timestamp': datetime.now().isoformat()
        }
        self._send_json_response(error_response, status_code)

    def log_message(self, format, *args):
        """重写日志方法，减少输出"""
        pass  # 禁用默认的HTTP日志

def run_server():
    """启动增强版服务器"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"

    def handler(*args, **kwargs):
        return EnhancedSerenaAPIHandler(launchx_root, *args, **kwargs)

    server_address = ('127.0.0.1', 24284)  # 使用不同端口避免冲突
    httpd = HTTPServer(server_address, handler)

    print("🚀 启动增强版Serena API服务器...")
    print(f"📍 服务地址: http://127.0.0.1:24284")
    print("📋 增强API端点:")
    print("  GET /api/memories - 获取所有memories")
    print("  GET /api/memories/search?q=关键词 - 关键词搜索")
    print("  GET /api/memories/semantic-search?q=查询 - 语义搜索")
    print("  GET /api/memories/suggestions?q=部分 - 搜索建议")
    print("  POST /api/search/rebuild-index - 重建搜索索引")
    print("  GET /api/search-stats - 搜索统计信息")
    print("  GET /api/health - 健康检查")
    print("  GET /api/stats - 系统统计")
    print("⏹️  按Ctrl+C停止服务器")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n⏹️  增强版服务器已停止")
        httpd.shutdown()

if __name__ == "__main__":
    run_server()