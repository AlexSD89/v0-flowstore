#!/usr/bin/env python3
"""
语义搜索引擎
实现基于TF-IDF和余弦相似度的智能搜索功能
"""

import re
import math
import json
import logging
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Set
from collections import Counter, defaultdict

class SemanticSearchEngine:
    def __init__(self, launchx_root):
        self.launchx_root = Path(launchx_root)
        self.serena_memories_dir = self.launchx_root / ".serena" / "memories"
        self.memory_bank_dir = self.launchx_root / "🛠️ 系统管理" / "memory-bank"

        # 配置日志
        self._setup_logging()

        # 搜索索引
        self.inverted_index = defaultdict(list)  # 倒排索引
        self.document_vectors = {}  # 文档向量
        self.idf_scores = {}  # IDF分数
        self.documents = {}  # 文档内容
        self.vocabulary = set()  # 词汇表

        # 中文分词简单实现
        self.chinese_pattern = re.compile(r'[\u4e00-\u9fff]+')
        self.word_pattern = re.compile(r'\b[a-zA-Z]+\b')

        # 搜索统计
        self.search_stats = {
            'total_searches': 0,
            'avg_response_time': 0,
            'cache_hits': 0,
            'last_rebuild': None
        }

        self.logger.info("语义搜索引擎初始化完成")

    def _setup_logging(self):
        """配置日志"""
        log_file = self.launchx_root / ".serena" / "logs" / "semantic_search.log"
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('semantic_search')

    def build_search_index(self):
        """构建搜索索引"""
        print("🔍 构建语义搜索索引...")
        start_time = datetime.now()

        # 清空现有索引
        self.inverted_index.clear()
        self.document_vectors.clear()
        self.documents.clear()
        self.vocabulary.clear()

        # 收集所有文档
        all_documents = []

        # 添加Memory Bank文档
        for doc_file in self.memory_bank_dir.rglob("*.md"):
            if doc_file.name.startswith('.'):
                continue
            all_documents.append(doc_file)

        # 添加Serena Memories文档
        for doc_file in self.serena_memories_dir.rglob("*.md"):
            if doc_file.name.startswith('.'):
                continue
            all_documents.append(doc_file)

        print(f"  📄 处理 {len(all_documents)} 个文档...")

        # 处理每个文档
        for i, doc_file in enumerate(all_documents):
            if (i + 1) % 20 == 0:
                print(f"    处理进度: {i+1}/{len(all_documents)}")

            try:
                doc_id = str(doc_file.relative_to(self.launchx_root))
                content = doc_file.read_text(encoding='utf-8', errors='ignore')

                # 提取标题和内容
                title, main_content = self._extract_title_and_content(content)
                full_text = f"{title} {main_content}"

                # 预处理和分词
                tokens = self._tokenize(full_text)

                # 存储文档信息
                self.documents[doc_id] = {
                    'file': doc_file,
                    'title': title,
                    'content': main_content,
                    'tokens': tokens,
                    'category': self._get_category(doc_file)
                }

                # 构建词汇表
                self.vocabulary.update(tokens)

            except Exception as e:
                self.logger.warning(f"处理文档失败 {doc_file}: {e}")

        # 计算IDF
        self._calculate_idf()

        # 构建倒排索引和文档向量
        self._build_inverted_index()

        # 构建文档向量
        self._build_document_vectors()

        # 更新统计信息
        self.search_stats['last_rebuild'] = datetime.now().isoformat()
        build_time = (datetime.now() - start_time).total_seconds()

        print(f"✅ 搜索索引构建完成!")
        print(f"   文档数量: {len(self.documents)}")
        print(f"   词汇表大小: {len(self.vocabulary)}")
        print(f"   构建耗时: {build_time:.2f}秒")

        self.logger.info(f"搜索索引构建完成: {len(self.documents)}文档, {len(self.vocabulary)}词汇")

    def _extract_title_and_content(self, content: str) -> Tuple[str, str]:
        """提取标题和主要内容"""
        lines = content.split('\n')
        title = ""
        main_content = []
        in_frontmatter = False
        frontmatter_ended = False

        for line in lines:
            # 处理frontmatter
            if line.strip() == '---':
                if not in_frontmatter:
                    in_frontmatter = True
                elif not frontmatter_ended:
                    in_frontmatter = False
                    frontmatter_ended = True
                continue

            if in_frontmatter:
                continue

            # 提取标题
            if not title and line.strip().startswith('#'):
                title = line.strip().lstrip('#').strip()
                continue

            # 收集主要内容（跳过空行和标题行）
            if line.strip() and not line.strip().startswith('#'):
                main_content.append(line.strip())

        if not title:
            # 如果没有找到标题，使用文件名的一部分作为标题
            title = "Untitled"

        return title, ' '.join(main_content)

    def _tokenize(self, text: str) -> List[str]:
        """分词处理"""
        # 转换为小写
        text = text.lower()

        # 提取英文单词
        english_words = self.word_pattern.findall(text)

        # 提取中文字符（简单分词）
        chinese_text = ' '.join(self.chinese_pattern.findall(text))
        chinese_chars = list(chinese_text.replace(' ', ''))

        # 中文2-gram分词
        chinese_bigrams = []
        for i in range(len(chinese_chars) - 1):
            bigram = chinese_chars[i] + chinese_chars[i + 1]
            if len(bigram) == 2:  # 确保是两个汉字
                chinese_bigrams.append(bigram)

        # 合并所有tokens
        tokens = english_words + chinese_chars + chinese_bigrams

        # 过滤停用词和短词
        stop_words = {'的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'}

        filtered_tokens = []
        for token in tokens:
            if (len(token) >= 2 and token not in stop_words and
                not token.isdigit() and token.strip()):
                filtered_tokens.append(token)

        return filtered_tokens

    def _get_category(self, doc_file: Path) -> str:
        """获取文档分类"""
        relative_path = doc_file.relative_to(self.launchx_root)
        parts = str(relative_path).split('/')

        if 'support_modules' in parts:
            return 'support_modules'
        elif 'scripts' in parts:
            return 'scripts'
        elif 'MCP服务资产库' in parts:
            return 'mcp_assets'
        elif 'archives' in parts:
            return 'archives'
        elif 'validation_results' in parts:
            return 'validation'
        elif 'serena_memories' in parts:
            if 'documentation' in parts:
                return 'documentation'
            elif 'data' in parts:
                return 'data'
            elif 'business' in parts:
                return 'business'
            elif 'support_modules' in parts:
                return 'support_modules'
            else:
                return 'other'
        else:
            return 'other'

    def _calculate_idf(self):
        """计算IDF分数"""
        total_docs = len(self.documents)
        if total_docs == 0:
            return

        for term in self.vocabulary:
            doc_count = sum(1 for doc_tokens in self.documents.values()
                           if term in doc_tokens['tokens'])

            if doc_count > 0:
                self.idf_scores[term] = math.log(total_docs / doc_count)
            else:
                self.idf_scores[term] = 0

    def _build_inverted_index(self):
        """构建倒排索引"""
        for doc_id, doc_info in self.documents.items():
            term_freq = Counter(doc_info['tokens'])

            for term, freq in term_freq.items():
                self.inverted_index[term].append((doc_id, freq))

    def _build_document_vectors(self):
        """构建文档向量"""
        for doc_id, doc_info in self.documents.items():
            term_freq = Counter(doc_info['tokens'])
            vector = {}

            # 计算TF-IDF向量
            for term, tf in term_freq.items():
                tfidf = (1 + math.log(tf)) * self.idf_scores.get(term, 0)
                if tfidf > 0:
                    vector[term] = tfidf

            # 归一化向量
            vector_norm = math.sqrt(sum(score**2 for score in vector.values()))
            if vector_norm > 0:
                vector = {term: score/vector_norm for term, score in vector.items()}

            self.document_vectors[doc_id] = vector

    def search(self, query: str, max_results: int = 10, category_filter: str = "") -> List[Dict]:
        """执行语义搜索"""
        start_time = datetime.now()
        self.search_stats['total_searches'] += 1

        try:
            # 预处理查询
            query_tokens = self._tokenize(query)

            if not query_tokens:
                return []

            # 构建查询向量
            query_vector = self._build_query_vector(query_tokens)

            # 计算相似度
            results = self._calculate_similarity(query_vector, category_filter)

            # 排序并返回结果
            results = results[:max_results]

            # 更新统计信息
            response_time = (datetime.now() - start_time).total_seconds()
            total_time = self.search_stats['avg_response_time'] * (self.search_stats['total_searches'] - 1) + response_time
            self.search_stats['avg_response_time'] = total_time / self.search_stats['total_searches']

            self.logger.info(f"搜索完成: '{query}' -> {len(results)}结果, 耗时{response_time:.3f}秒")
            return results

        except Exception as e:
            self.logger.error(f"搜索失败: '{query}' - {str(e)}")
            return []

    def _build_query_vector(self, query_tokens: List[str]) -> Dict[str, float]:
        """构建查询向量"""
        term_freq = Counter(query_tokens)
        vector = {}

        for term, tf in term_freq.items():
            tfidf = (1 + math.log(tf)) * self.idf_scores.get(term, 0)
            if tfidf > 0:
                vector[term] = tfidf

        # 归一化
        vector_norm = math.sqrt(sum(score**2 for score in vector.values()))
        if vector_norm > 0:
            vector = {term: score/vector_norm for term, score in vector.items()}

        return vector

    def _calculate_similarity(self, query_vector: Dict[str, float], category_filter: str) -> List[Dict]:
        """计算余弦相似度"""
        results = []

        for doc_id, doc_vector in self.document_vectors.items():
            # 类别过滤
            if category_filter and self.documents[doc_id]['category'] != category_filter:
                continue

            # 计算余弦相似度
            similarity = self._cosine_similarity(query_vector, doc_vector)

            if similarity > 0.1:  # 相似度阈值
                doc_info = self.documents[doc_id]

                # 提取匹配的关键词片段
                preview = self._extract_relevant_preview(doc_info['content'], query_vector.keys())

                results.append({
                    'doc_id': doc_id,
                    'title': doc_info['title'],
                    'category': doc_info['category'],
                    'similarity': similarity,
                    'preview': preview,
                    'file_path': str(doc_info['file'].relative_to(self.launchx_root)),
                    'matched_terms': self._get_matched_terms(doc_info['tokens'], query_vector.keys())
                })

        # 按相似度排序
        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results

    def _cosine_similarity(self, vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
        """计算余弦相似度"""
        if not vec1 or not vec2:
            return 0

        # 找到共同的terms
        common_terms = set(vec1.keys()) & set(vec2.keys())

        if not common_terms:
            return 0

        # 计算点积
        dot_product = sum(vec1[term] * vec2[term] for term in common_terms)

        # 向量已经是归一化的，所以余弦相似度就是点积
        return dot_product

    def _extract_relevant_preview(self, content: str, query_terms: Set[str]) -> str:
        """提取相关的预览文本"""
        content_lower = content.lower()
        query_terms_lower = {term.lower() for term in query_terms}

        # 分割内容为句子
        sentences = re.split(r'[.!?。！？]', content)

        # 找到包含查询词的句子
        relevant_sentences = []
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(term in sentence_lower for term in query_terms_lower):
                relevant_sentences.append(sentence.strip())

        # 返回前3个相关句子
        if relevant_sentences:
            preview = ' '.join(relevant_sentences[:3])
            if len(preview) > 200:
                preview = preview[:200] + "..."
            return preview

        # 如果没有找到相关句子，返回前200个字符
        return content[:200] + "..." if len(content) > 200 else content

    def _get_matched_terms(self, doc_tokens: List[str], query_terms: Set[str]) -> List[str]:
        """获取匹配的词条"""
        doc_token_set = set(doc_tokens)
        matched = list(doc_token_set & set(query_terms))
        return matched[:10]  # 最多返回10个匹配词

    def get_search_suggestions(self, partial_query: str, limit: int = 5) -> List[str]:
        """获取搜索建议"""
        if len(partial_query) < 2:
            return []

        partial_lower = partial_query.lower()
        suggestions = []

        # 基于词汇表的建议
        for term in self.vocabulary:
            if term.startswith(partial_lower) or partial_lower in term:
                suggestions.append(term)

        return list(set(suggestions))[:limit]

    def get_search_stats(self) -> Dict:
        """获取搜索统计信息"""
        return {
            **self.search_stats,
            'indexed_documents': len(self.documents),
            'vocabulary_size': len(self.vocabulary),
            'avg_index_time': 0  # 可以添加平均索引时间
        }

    def save_index(self, index_file: str = None):
        """保存搜索索引"""
        if index_file is None:
            index_file = self.launchx_root / ".serena" / "search_index.json"

        index_data = {
            'inverted_index': {k: v for k, v in self.inverted_index.items()},
            'document_vectors': {k: v for k, v in self.document_vectors.items()},
            'idf_scores': self.idf_scores,
            'vocabulary': list(self.vocabulary),
            'documents_meta': {
                doc_id: {
                    'title': info['title'],
                    'category': info['category'],
                    'file_path': str(info['file'].relative_to(self.launchx_root))
                } for doc_id, info in self.documents.items()
            },
            'stats': self.search_stats,
            'last_updated': datetime.now().isoformat()
        }

        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, ensure_ascii=False, indent=2)

        print(f"💾 搜索索引已保存: {index_file}")

    def load_index(self, index_file: str = None):
        """加载搜索索引"""
        if index_file is None:
            index_file = self.launchx_root / ".serena" / "search_index.json"

        if not index_file.exists():
            print("⚠️ 索引文件不存在，需要重新构建")
            return False

        try:
            with open(index_file, 'r', encoding='utf-8') as f:
                index_data = json.load(f)

            self.inverted_index = defaultdict(list, index_data['inverted_index'])
            self.document_vectors = index_data['document_vectors']
            self.idf_scores = index_data['idf_scores']
            self.vocabulary = set(index_data['vocabulary'])
            self.search_stats = index_data['stats']

            # 注意：这里不加载完整的文档内容，只加载元数据
            # 实际使用时需要重新读取文件内容

            print(f"📂 搜索索引已加载: {len(self.document_vectors)}个文档")
            return True

        except Exception as e:
            print(f"❌ 索引加载失败: {str(e)}")
            return False

def main():
    """主函数 - 测试搜索引擎"""
    launchx_root = "/Users/dangsiyuan/Documents/obsidion/launch x"
    search_engine = SemanticSearchEngine(launchx_root)

    # 构建索引
    search_engine.build_search_index()

    # 保存索引
    search_engine.save_index()

    # 测试搜索
    test_queries = [
        "serena",
        "memory bank",
        "同步",
        "API",
        "frontmatter",
        "日志系统",
        "搜索功能"
    ]

    print("\n🔍 测试语义搜索:")
    for query in test_queries:
        results = search_engine.search(query, max_results=3)
        print(f"\n  搜索 '{query}':")
        for i, result in enumerate(results, 1):
            print(f"    {i}. {result['title']} (相似度: {result['similarity']:.3f})")
            print(f"       分类: {result['category']}")
            print(f"       匹配词: {', '.join(result['matched_terms'])}")

    # 显示统计信息
    stats = search_engine.get_search_stats()
    print(f"\n📊 搜索统计:")
    print(f"   索引文档: {stats['indexed_documents']}")
    print(f"   词汇表大小: {stats['vocabulary_size']}")
    print(f"   总搜索次数: {stats['total_searches']}")
    print(f"   平均响应时间: {stats['avg_response_time']:.3f}秒")

if __name__ == "__main__":
    main()