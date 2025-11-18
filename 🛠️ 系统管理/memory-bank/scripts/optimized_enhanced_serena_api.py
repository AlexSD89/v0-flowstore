#!/usr/bin/env python3
"""
优化版增强版Serena API服务器
修复搜索引擎频繁重建问题，使用单例模式和缓存机制
"""

import json
import sys
import time
import threading
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, BaseHTTPRequestHandler
import logging

# 全局搜索引擎缓存
_search_engine_instance = None
_search_engine_lock = threading.Lock()

class OptimizedSemanticSearchEngine:
    """优化的语义搜索引擎 - 单例模式"""
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, launchx_root):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self, launchx_root):
        if self._initialized:
            return

        self.launchx_root = Path(launchx_root)
        self.serena_memories_dir = self.launchx_root / ".serena" / "memories"
        self.memory_bank_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank"

        # 配置日志
        self._setup_logging()

        # 搜索索引
        self.inverted_index = {}
        self.document_vectors = {}
        self.idf_scores = {}
        self.documents = {}
        self.vocabulary = set()

        # 缓存和性能统计
        self.search_cache = {}
        self.cache_max_size = 100
        self.last_cache_cleanup = time.time()

        # 搜索统计
        self.search_stats = {
            'total_searches': 0,
            'avg_response_time': 0,
            'cache_hits': 0,
            'last_rebuild': None,
            'total_rebuilds': 0
        }

        # 索引文件路径
        self.index_file = self.launchx_root / ".serena" / "optimized_search_index.json"

        # 初始化搜索引擎（只执行一次）
        self._initialize_search_engine()
        self._initialized = True

        self.logger.info("优化版语义搜索引擎初始化完成")

    def _setup_logging(self):
        """配置日志"""
        log_file = self.launchx_root / ".serena" / "logs" / "optimized_search_engine.log"
        log_file.parent.mkdir(parents=True, exist_ok=True)

        # 创建logger
        self.logger = logging.getLogger('optimized_search_engine')
        self.logger.setLevel(logging.INFO)

        # 避免重复添加handler
        if not self.logger.handlers:
            handler = logging.FileHandler(log_file, encoding='utf-8')
            formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def _initialize_search_engine(self):
        """初始化搜索引擎 - 只执行一次"""
        try:
            if not self.load_index():
                self.logger.info("🔨 构建新的优化搜索索引...")
                self.build_search_index()
                self.save_index()
                self.search_stats['total_rebuilds'] += 1
            else:
                self.logger.info("📂 优化搜索索引加载成功")

        except Exception as e:
            self.logger.error(f"❌ 搜索引擎初始化失败: {str(e)}")
            raise

    def load_index(self):
        """加载搜索索引"""
        if not self.index_file.exists():
            self.logger.info("⚠️ 索引文件不存在，需要重新构建")
            return False

        try:
            with open(self.index_file, 'r', encoding='utf-8') as f:
                index_data = json.load(f)

            self.inverted_index = index_data.get('inverted_index', {})
            self.document_vectors = index_data.get('document_vectors', {})
            self.idf_scores = index_data.get('idf_scores', {})
            self.vocabulary = set(index_data.get('vocabulary', []))
            self.search_stats = index_data.get('stats', self.search_stats)

            self.logger.info(f"📂 搜索索引已加载: {len(self.document_vectors)}个文档")
            return True

        except Exception as e:
            self.logger.error(f"❌ 索引加载失败: {str(e)}")
            return False

    def build_search_index(self):
        """构建搜索索引"""
        self.logger.info("🔍 开始构建优化搜索索引...")
        start_time = datetime.now()

        # 清空现有索引
        self.inverted_index = {}
        self.document_vectors = {}
        self.idf_scores = {}
        self.documents = {}
        self.vocabulary = set()

        # 收集所有文档
        docs_processed = 0

        # 处理serena memories
        if self.serena_memories_dir.exists():
            for memory_file in self.serena_memories_dir.rglob("*.md"):
                if memory_file.name.startswith('.'):
                    continue

                try:
                    content = memory_file.read_text(encoding='utf-8', errors='ignore')
                    rel_path = memory_file.relative_to(self.serena_memories_dir)

                    self.documents[str(rel_path)] = {
                        'content': content,
                        'path': str(memory_file),
                        'category': 'serena_memory',
                        'modified': memory_file.stat().st_mtime
                    }
                    docs_processed += 1

                except Exception as e:
                    self.logger.warning(f"处理文档失败 {memory_file}: {e}")

        # 处理memory bank文档
        if self.memory_bank_dir.exists():
            for memory_file in self.memory_bank_dir.rglob("*.md"):
                if memory_file.name.startswith('.'):
                    continue

                try:
                    content = memory_file.read_text(encoding='utf-8', errors='ignore')
                    rel_path = memory_file.relative_to(self.memory_bank_dir)

                    self.documents[f"memory_bank/{rel_path}"] = {
                        'content': content,
                        'path': str(memory_file),
                        'category': 'memory_bank',
                        'modified': memory_file.stat().st_mtime
                    }
                    docs_processed += 1

                except Exception as e:
                    self.logger.warning(f"处理文档失败 {memory_file}: {e}")

        # 构建词汇表和基础索引
        for doc_id, doc_info in self.documents.items():
            tokens = self._tokenize(doc_info['content'])
            self.documents[doc_id]['tokens'] = tokens
            self.vocabulary.update(tokens)

        # 构建倒排索引和文档向量
        self._build_inverted_index()
        self._build_document_vectors()

        # 更新统计信息
        self.search_stats['last_rebuild'] = datetime.now().isoformat()

        duration = (datetime.now() - start_time).total_seconds()
        self.logger.info(f"✅ 搜索索引构建完成: {docs_processed}个文档，{len(self.vocabulary)}个词汇，耗时{duration:.2f}秒")

    def _tokenize(self, text):
        """简单的中英文分词"""
        import re

        # 移除特殊字符，保留中文、英文和数字
        text = re.sub(r'[^\u4e00-\u9fff\w\s]', ' ', text)

        # 中文分词（简单按字符分割）
        chinese_chars = re.findall(r'[\u4e00-\u9fff]', text)

        # 英文分词
        english_words = re.findall(r'\b[a-zA-Z]{2,}\b', text.lower())

        # 合并并过滤
        tokens = []

        # 中文（保留单字，但过滤常见停用词）
        chinese_stop_words = {'的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'}
        for char in chinese_chars:
            if char not in chinese_stop_words:
                tokens.append(char)

        # 英文
        english_stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'}
        for word in english_words:
            if word not in english_stop_words and len(word) >= 2:
                tokens.append(word)

        return tokens

    def _build_inverted_index(self):
        """构建倒排索引"""
        from collections import Counter, defaultdict

        for doc_id, doc_info in self.documents.items():
            term_freq = Counter(doc_info['tokens'])

            for term, freq in term_freq.items():
                if term not in self.inverted_index:
                    self.inverted_index[term] = []
                self.inverted_index[term].append((doc_id, freq))

    def _build_document_vectors(self):
        """构建文档向量（简化版TF-IDF）"""
        import math
        from collections import Counter

        total_docs = len(self.documents)
        if total_docs == 0:
            return

        # 计算IDF
        for term in self.vocabulary:
            doc_count = sum(1 for doc_tokens in self.documents.values() if term in doc_tokens['tokens'])
            if doc_count > 0:
                self.idf_scores[term] = math.log(total_docs / doc_count)
            else:
                self.idf_scores[term] = 0

        # 构建文档向量
        for doc_id, doc_info in self.documents.items():
            term_freq = Counter(doc_info['tokens'])
            vector = {}

            # 计算TF-IDF
            for term, tf in term_freq.items():
                tfidf = (1 + math.log(tf)) * self.idf_scores.get(term, 0)
                if tfidf > 0:
                    vector[term] = tfidf

            # 归一化
            norm = math.sqrt(sum(score**2 for score in vector.values()))
            if norm > 0:
                vector = {term: score/norm for term, score in vector.items()}

            self.document_vectors[doc_id] = vector

    def search(self, query, max_results=10, category_filter=""):
        """执行搜索（带缓存）"""
        start_time = time.time()
        self.search_stats['total_searches'] += 1

        # 检查缓存
        cache_key = f"{query}:{category_filter}:{max_results}"
        if cache_key in self.search_cache:
            self.search_stats['cache_hits'] += 1
            return self.search_cache[cache_key]

        try:
            # 分词
            query_tokens = self._tokenize(query.lower())
            if not query_tokens:
                return []

            # 构建查询向量
            query_vector = self._build_query_vector(query_tokens)

            # 计算相似度
            results = self._calculate_similarity(query_vector, category_filter)

            # 限制结果数量
            results = results[:max_results]

            # 缓存结果
            self._cache_result(cache_key, results)

            # 更新统计
            response_time = time.time() - start_time
            self.search_stats['avg_response_time'] = (
                (self.search_stats['avg_response_time'] * (self.search_stats['total_searches'] - 1) + response_time)
                / self.search_stats['total_searches']
            )

            return results

        except Exception as e:
            self.logger.error(f"搜索失败: {str(e)}")
            return []

    def _build_query_vector(self, query_tokens):
        """构建查询向量"""
        import math
        from collections import Counter

        term_freq = Counter(query_tokens)
        vector = {}

        for term, tf in term_freq.items():
            tfidf = (1 + math.log(tf)) * self.idf_scores.get(term, 0)
            if tfidf > 0:
                vector[term] = tfidf

        # 归一化
        norm = math.sqrt(sum(score**2 for score in vector.values()))
        if norm > 0:
            vector = {term: score/norm for term, score in vector.items()}

        return vector

    def _calculate_similarity(self, query_vector, category_filter=""):
        """计算相似度"""
        results = []

        for doc_id, doc_vector in self.document_vectors.items():
            # 分类过滤
            if category_filter:
                doc_info = self.documents.get(doc_id, {})
                if doc_info.get('category', '') != category_filter:
                    continue

            # 计算余弦相似度
            similarity = self._cosine_similarity(query_vector, doc_vector)

            if similarity > 0:
                doc_info = self.documents[doc_id]
                results.append({
                    'id': doc_id,
                    'title': Path(doc_info['path']).stem,
                    'path': doc_info['path'],
                    'category': doc_info['category'],
                    'similarity': similarity,
                    'preview': doc_info['content'][:200] + "..." if len(doc_info['content']) > 200 else doc_info['content']
                })

        # 按相似度排序
        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results

    def _cosine_similarity(self, vec1, vec2):
        """计算余弦相似度"""
        common_terms = set(vec1.keys()) & set(vec2.keys())
        if not common_terms:
            return 0

        dot_product = sum(vec1[term] * vec2[term] for term in common_terms)
        return dot_product  # 向量已归一化

    def _cache_result(self, cache_key, result):
        """缓存搜索结果"""
        # 定期清理缓存
        current_time = time.time()
        if current_time - self.last_cache_cleanup > 300:  # 5分钟清理一次
            self._cleanup_cache()
            self.last_cache_cleanup = current_time

        # 添加到缓存
        self.search_cache[cache_key] = result

        # 限制缓存大小
        if len(self.search_cache) > self.cache_max_size:
            # 删除最旧的缓存项
            oldest_key = next(iter(self.search_cache))
            del self.search_cache[oldest_key]

    def _cleanup_cache(self):
        """清理缓存"""
        if len(self.search_cache) > self.cache_max_size * 0.8:
            # 保留最近的一半缓存
            keys_to_remove = list(self.search_cache.keys())[:len(self.search_cache)//2]
            for key in keys_to_remove:
                del self.search_cache[key]

    def save_index(self):
        """保存搜索索引"""
        try:
            index_data = {
                'inverted_index': self.inverted_index,
                'document_vectors': self.document_vectors,
                'idf_scores': self.idf_scores,
                'vocabulary': list(self.vocabulary),
                'stats': self.search_stats,
                'saved_at': datetime.now().isoformat()
            }

            self.index_file.parent.mkdir(parents=True, exist_ok=True)
            with open(self.index_file, 'w', encoding='utf-8') as f:
                json.dump(index_data, f, ensure_ascii=False, indent=2)

            self.logger.info("搜索索引已保存")

        except Exception as e:
            self.logger.error(f"保存索引失败: {str(e)}")

    def get_search_stats(self):
        """获取搜索统计"""
        return {
            **self.search_stats,
            'total_documents': len(self.documents),
            'vocabulary_size': len(self.vocabulary),
            'cache_size': len(self.search_cache),
            'cache_hit_rate': (self.search_stats['cache_hits'] / max(1, self.search_stats['total_searches'])) * 100
        }


def get_search_engine(launchx_root):
    """获取搜索引擎实例（单例模式）"""
    global _search_engine_instance

    if _search_engine_instance is None:
        with _search_engine_lock:
            if _search_engine_instance is None:
                _search_engine_instance = OptimizedSemanticSearchEngine(launchx_root)

    return _search_engine_instance


class OptimizedEnhancedSerenaAPIHandler(BaseHTTPRequestHandler):
    def __init__(self, launchx_root, *args, **kwargs):
        self.launchx_root = Path(launchx_root)
        self.serena_memories_dir = self.launchx_root / ".serena" / "memories"
        self.memory_bank_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank"

        # 配置日志
        self._setup_logging()

        # 获取搜索引擎实例（单例模式）
        self.search_engine = get_search_engine(launchx_root)

        super().__init__(*args, **kwargs)

    def _setup_logging(self):
        """配置日志"""
        log_file = self.launchx_root / ".serena" / "logs" / "optimized_enhanced_serena_api.log"
        log_file.parent.mkdir(parents=True, exist_ok=True)

        self.logger = logging.getLogger('optimized_enhanced_serena_api')
        self.logger.setLevel(logging.INFO)

        # 避免重复添加handler
        if not self.logger.handlers:
            handler = logging.FileHandler(log_file, encoding='utf-8')
            formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

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
                self._handle_get_categories(query_params)
            elif path == '/api/health':
                self._handle_health_check()
            elif path == '/api/stats':
                self._handle_get_stats()
            elif path == '/api/search-stats':
                self._handle_get_search_stats()
            else:
                self._send_error(404, 'API端点不存在')

        except Exception as e:
            self.logger.error(f"处理GET请求失败: {str(e)}")
            self._send_error(500, f"服务器内部错误: {str(e)}")

    def do_POST(self):
        """处理POST请求"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        try:
            if path == '/api/search/rebuild-index':
                self._handle_rebuild_index()
            else:
                self._send_error(404, 'API端点不存在')

        except Exception as e:
            self.logger.error(f"处理POST请求失败: {str(e)}")
            self._send_error(500, f"服务器内部错误: {str(e)}")

    def _handle_get_memories(self, query_params):
        """处理获取所有memories请求"""
        try:
            category = query_params.get('category', [''])[0].strip()
            limit = int(query_params.get('limit', [50])[0])
            offset = int(query_params.get('offset', [0])[0])

            memories = []

            # 收集所有文档信息
            all_docs = {}

            # serena memories
            if self.serena_memories_dir.exists():
                for memory_file in self.serena_memories_dir.rglob("*.md"):
                    if memory_file.name.startswith('.'):
                        continue

                    rel_path = memory_file.relative_to(self.serena_memories_dir)
                    stat = memory_file.stat()

                    try:
                        content = memory_file.read_text(encoding='utf-8', errors='ignore')
                        preview = content[:200] + "..." if len(content) > 200 else content
                    except:
                        preview = "内容读取失败"

                    all_docs[f"serena/{rel_path}"] = {
                        'id': f"serena/{rel_path}",
                        'name': memory_file.stem,
                        'path': str(rel_path),
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        'category': 'serena',
                        'preview': preview
                    }

            # memory bank文档
            if self.memory_bank_dir.exists():
                for memory_file in self.memory_bank_dir.rglob("*.md"):
                    if memory_file.name.startswith('.'):
                        continue

                    rel_path = memory_file.relative_to(self.memory_bank_dir)
                    stat = memory_file.stat()

                    try:
                        content = memory_file.read_text(encoding='utf-8', errors='ignore')
                        preview = content[:200] + "..." if len(content) > 200 else content
                    except:
                        preview = "内容读取失败"

                    all_docs[f"memory_bank/{rel_path}"] = {
                        'id': f"memory_bank/{rel_path}",
                        'name': memory_file.stem,
                        'path': str(rel_path),
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        'category': 'memory_bank',
                        'preview': preview
                    }

            # 应用过滤器和分页
            filtered_memories = list(all_docs.values())

            if category and category != '':
                filtered_memories = [m for m in filtered_memories if m['category'] == category]

            # 按修改时间排序
            filtered_memories.sort(key=lambda x: x['modified'], reverse=True)

            # 分页
            total = len(filtered_memories)
            memories = filtered_memories[offset:offset + limit]

            response = {
                'success': True,
                'data': memories,
                'pagination': {
                    'total': total,
                    'offset': offset,
                    'limit': limit,
                    'has_more': offset + limit < total
                },
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)
            self.logger.info(f"返回{len(memories)}个memories (总计: {total})")

        except Exception as e:
            self._send_error(500, f"获取memories失败: {str(e)}")

    def _handle_search_memories(self, query_params):
        """处理传统关键词搜索"""
        try:
            query = query_params.get('q', [''])[0].strip()
            category = query_params.get('category', [''])[0].strip()
            limit = int(query_params.get('limit', [10])[0])

            if not query:
                self._send_error(400, '搜索关键词不能为空')
                return

            # 使用语义搜索引擎进行关键词搜索
            results = self.search_engine.search(query, max_results=limit, category_filter=category)

            response = {
                'success': True,
                'data': {
                    'query': query,
                    'results': results,
                    'total': len(results)
                },
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)
            self.logger.info(f"关键词搜索完成: '{query}' -> {len(results)}结果")

        except Exception as e:
            self._send_error(500, f"关键词搜索失败: {str(e)}")

    def _handle_semantic_search(self, query_params):
        """处理语义搜索请求"""
        try:
            query = query_params.get('q', [''])[0].strip()
            category = query_params.get('category', [''])[0].strip()
            limit = int(query_params.get('limit', [10])[0])

            if not query:
                self._send_error(400, '搜索查询不能为空')
                return

            if not self.search_engine:
                self._send_error(503, '语义搜索引擎不可用')
                return

            # 执行语义搜索
            results = self.search_engine.search(query, max_results=limit, category_filter=category)

            # 格式化结果
            formatted_results = []
            for result in results:
                formatted_results.append({
                    'id': result['id'],
                    'title': result['title'],
                    'path': result['path'],
                    'category': result['category'],
                    'similarity': round(result['similarity'], 3),
                    'preview': result['preview']
                })

            response = {
                'success': True,
                'data': {
                    'query': query,
                    'results': formatted_results,
                    'total': len(formatted_results),
                    'search_type': 'semantic'
                },
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
            limit = int(query_params.get('limit', [5])[0])

            suggestions = []

            if partial_query and self.search_engine:
                # 简单的建议实现：基于词汇表匹配
                for term in self.search_engine.vocabulary:
                    if partial_query.lower() in term.lower():
                        suggestions.append({
                            'text': term,
                            'type': 'vocabulary'
                        })
                        if len(suggestions) >= limit:
                            break

            response = {
                'success': True,
                'data': {
                    'query': partial_query,
                    'suggestions': suggestions[:limit]
                },
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)

        except Exception as e:
            self._send_error(500, f"获取搜索建议失败: {str(e)}")

    def _handle_get_categories(self, query_params):
        """获取分类统计"""
        try:
            categories = {
                'serena': 0,
                'memory_bank': 0
            }

            # 统计serena memories
            if self.serena_memories_dir.exists():
                categories['serena'] = len(list(self.serena_memories_dir.rglob("*.md")))

            # 统计memory bank文档
            if self.memory_bank_dir.exists():
                categories['memory_bank'] = len(list(self.memory_bank_dir.rglob("*.md")))

            response = {
                'success': True,
                'data': categories,
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)

        except Exception as e:
            self._send_error(500, f"获取分类失败: {str(e)}")

    def _handle_health_check(self):
        """健康检查"""
        health_status = {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'services': {
                'api_server': 'running',
                'search_engine': 'available' if self.search_engine else 'unavailable'
            }
        }

        if self.search_engine:
            stats = self.search_engine.get_search_stats()
            health_status['search_engine'] = {
                'documents': stats['total_documents'],
                'vocabulary_size': stats['vocabulary_size'],
                'cache_hit_rate': f"{stats['cache_hit_rate']:.1f}%",
                'total_searches': stats['total_searches'],
                'avg_response_time': f"{stats['avg_response_time']*1000:.1f}ms"
            }

        response = {
            'success': True,
            'data': health_status
        }

        self._send_json_response(response)

    def _handle_get_stats(self):
        """获取系统统计"""
        try:
            stats = {
                'api_version': 'optimized_v1.0',
                'launchx_root': str(self.launchx_root),
                'timestamp': datetime.now().isoformat()
            }

            # 文档统计
            serena_count = 0
            if self.serena_memories_dir.exists():
                serena_count = len(list(self.serena_memories_dir.rglob("*.md")))

            memory_bank_count = 0
            if self.memory_bank_dir.exists():
                memory_bank_count = len(list(self.memory_bank_dir.rglob("*.md")))

            stats['documents'] = {
                'serena_memories': serena_count,
                'memory_bank': memory_bank_count,
                'total': serena_count + memory_bank_count
            }

            # 搜索引擎统计
            if self.search_engine:
                search_stats = self.search_engine.get_search_stats()
                stats['search_engine'] = {
                    'status': 'available',
                    'total_documents': search_stats['total_documents'],
                    'vocabulary_size': search_stats['vocabulary_size'],
                    'cache_hit_rate': f"{search_stats['cache_hit_rate']:.1f}%",
                    'total_searches': search_stats['total_searches'],
                    'avg_response_time': f"{search_stats['avg_response_time']*1000:.1f}ms",
                    'last_rebuild': search_stats.get('last_rebuild'),
                    'total_rebuilds': search_stats.get('total_rebuilds', 0)
                }
            else:
                stats['search_engine'] = {'status': 'unavailable'}

            response = {
                'success': True,
                'data': stats
            }

            self._send_json_response(response)

        except Exception as e:
            self._send_error(500, f"获取统计信息失败: {str(e)}")

    def _handle_get_search_stats(self):
        """获取搜索引擎统计"""
        try:
            if not self.search_engine:
                self._send_error(503, '搜索引擎不可用')
                return

            stats = self.search_engine.get_search_stats()

            response = {
                'success': True,
                'data': stats,
                'timestamp': datetime.now().isoformat()
            }

            self._send_json_response(response)

        except Exception as e:
            self._send_error(500, f"获取搜索统计失败: {str(e)}")

    def _handle_rebuild_index(self):
        """处理重建索引请求"""
        try:
            if not self.search_engine:
                self._send_error(503, '搜索引擎不可用')
                return

            # 获取POST数据
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else ''
            request_data = json.loads(post_data) if post_data else {}

            force_rebuild = request_data.get('force', False)

            self.logger.info("🔨 开始重建搜索索引...")
            start_time = datetime.now()

            self.search_engine.build_search_index()
            self.search_engine.save_index()

            duration = (datetime.now() - start_time).total_seconds()

            response = {
                'success': True,
                'data': {
                    'message': '搜索索引重建成功',
                    'duration_seconds': duration,
                    'timestamp': datetime.now().isoformat()
                }
            }

            self._send_json_response(response)
            self.logger.info(f"✅ 搜索索引重建完成，耗时{duration:.2f}秒")

        except Exception as e:
            self._send_error(500, f"重建索引失败: {str(e)}")

    def _send_json_response(self, data, status_code=200):
        """发送JSON响应"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

        response_json = json.dumps(data, ensure_ascii=False, indent=2)
        self.wfile.write(response_json.encode('utf-8'))

    def _send_error(self, status_code, message):
        """发送错误响应"""
        error_data = {
            'success': False,
            'error': {
                'code': status_code,
                'message': message,
                'timestamp': datetime.now().isoformat()
            }
        }
        self._send_json_response(error_data, status_code)

    def do_OPTIONS(self):
        """处理OPTIONS请求（CORS预检）"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        """覆盖默认日志消息"""
        # 使用自定义日志格式
        message = format % args
        self.logger.info(f"API请求: {message}")


def main():
    """主函数 - 启动优化版增强Serena API服务器"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"

    print("🚀 启动优化版增强Serena API服务器...")
    print(f"📍 服务地址: http://127.0.0.1:24284")
    print("📋 优化版API端点:")
    print("  GET /api/memories - 获取所有memories")
    print("  GET /api/memories/search?q=关键词 - 关键词搜索")
    print("  GET /api/memories/semantic-search?q=查询 - 语义搜索（带缓存）")
    print("  GET /api/memories/suggestions?q=部分 - 搜索建议")
    print("  GET /api/memories/categories - 分类统计")
    print("  POST /api/search/rebuild-index - 重建搜索索引")
    print("  GET /api/health - 健康检查")
    print("  GET /api/stats - 系统统计")
    print("  GET /api/search-stats - 搜索引擎统计")
    print("⏹️  按Ctrl+C停止服务器")
    print("🔧 优化特性: 单例模式 + 搜索缓存 + 性能监控")

    def handler(*args, **kwargs):
        return OptimizedEnhancedSerenaAPIHandler(launchx_root, *args, **kwargs)

    try:
        server = HTTPServer(('127.0.0.1', 24284), handler)
        print(f"✅ 优化版增强Serena API服务器启动成功 - 端口24284")
        server.serve_forever()

    except KeyboardInterrupt:
        print("\n⏹️ 正在停止优化版增强Serena API服务器...")
        server.server_close()
        print("✅ 优化版增强Serena API服务器已停止")

    except Exception as e:
        print(f"❌ 服务器启动失败: {str(e)}")


if __name__ == "__main__":
    main()