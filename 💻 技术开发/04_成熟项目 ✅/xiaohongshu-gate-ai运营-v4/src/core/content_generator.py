"""
AI内容生成器

负责多模态内容创作、质量评估和优化
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass
from datetime import datetime
import json
import base64
import io
from PIL import Image

from ..integrations.gemini.client import GeminiClient
from ..integrations.rube_ecosystem.image_tools import ImageGenerator
from ..integrations.rube_ecosystem.video_tools import VideoGenerator

logger = logging.getLogger(__name__)


@dataclass
class ContentRequest:
    """内容生成请求"""
    content_type: str  # text, image, video, carousel
    topic: str
    style: str
    target_audience: str
    brand_guidelines: Dict[str, Any]
    constraints: Dict[str, Any]
    platform: str = "xiaohongshu"


@dataclass
class GeneratedContent:
    """生成的内容"""
    content_id: str
    content_type: str
    title: str
    description: str
    text_content: Optional[str] = None
    image_urls: List[str] = None
    video_url: Optional[str] = None
    tags: List[str] = None
    quality_score: float = 0.0
    metadata: Dict[str, Any] = None
    created_at: datetime = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()
        if self.image_urls is None:
            self.image_urls = []
        if self.tags is None:
            self.tags = []
        if self.metadata is None:
            self.metadata = {}


class AIContentGenerator:
    """AI内容生成器"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        初始化内容生成器
        
        Args:
            config: 配置信息
        """
        self.config = config or {}
        self.gemini_client = GeminiClient(self.config.get('gemini', {}))
        self.image_generator = ImageGenerator(self.config.get('image_generation', {}))
        self.video_generator = VideoGenerator(self.config.get('video_generation', {}))
        
        # 内容生成配置
        self.content_config = self.config.get('content_generation', {})
        
        logger.info("AI内容生成器初始化完成")
    
    async def generate_content(self, request: ContentRequest) -> GeneratedContent:
        """
        生成内容
        
        Args:
            request: 内容生成请求
            
        Returns:
            生成的内容
        """
        content_id = f"content_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}"
        
        logger.info(f"开始生成内容: {content_id}, 类型: {request.content_type}")
        
        try:
            if request.content_type == "text":
                generated_content = await self._generate_text_content(request, content_id)
            elif request.content_type == "image":
                generated_content = await self._generate_image_content(request, content_id)
            elif request.content_type == "video":
                generated_content = await self._generate_video_content(request, content_id)
            elif request.content_type == "carousel":
                generated_content = await self._generate_carousel_content(request, content_id)
            else:
                raise ValueError(f"不支持的内容类型: {request.content_type}")
            
            # 质量评估
            quality_score = await self._assess_content_quality(generated_content, request)
            generated_content.quality_score = quality_score
            
            # 添加元数据
            generated_content.metadata.update({
                'generation_time': datetime.utcnow().isoformat(),
                'request_topic': request.topic,
                'target_audience': request.target_audience,
                'platform': request.platform
            })
            
            logger.info(f"内容生成完成: {content_id}, 质量评分: {quality_score:.2f}")
            
            return generated_content
            
        except Exception as e:
            logger.error(f"内容生成失败: {content_id}, 错误: {e}")
            raise
    
    async def _generate_text_content(self, request: ContentRequest, content_id: str) -> GeneratedContent:
        """生成文本内容"""
        
        # 构建提示词
        prompt = self._build_text_prompt(request)
        
        # 生成文本
        text_response = await self.gemini_client.generate_text(prompt)
        
        # 解析生成的文本
        parsed_content = self._parse_generated_text(text_response)
        
        return GeneratedContent(
            content_id=content_id,
            content_type="text",
            title=parsed_content.get('title', ''),
            description=parsed_content.get('description', ''),
            text_content=parsed_content.get('content', ''),
            tags=parsed_content.get('tags', []),
            metadata=parsed_content.get('metadata', {})
        )
    
    async def _generate_image_content(self, request: ContentRequest, content_id: str) -> GeneratedContent:
        """生成图像内容"""
        
        # 生成图像描述
        image_prompt = await self._generate_image_description(request)
        
        # 生成图像
        image_result = await self.image_generator.generate_image(
            prompt=image_prompt,
            width=self.content_config.get('image', {}).get('width', 1080),
            height=self.content_config.get('image', {}).get('height', 1080),
            style=request.style
        )
        
        # 生成配套文本
        text_request = ContentRequest(
            content_type="text",
            topic=request.topic,
            style=request.style,
            target_audience=request.target_audience,
            brand_guidelines=request.brand_guidelines,
            constraints=request.constraints,
            platform=request.platform
        )
        
        text_content = await self._generate_text_content(text_request, f"{content_id}_text")
        
        return GeneratedContent(
            content_id=content_id,
            content_type="image",
            title=text_content.title,
            description=text_content.description,
            text_content=text_content.text_content,
            image_urls=[image_result['url']],
            tags=text_content.tags,
            metadata={
                'image_prompt': image_prompt,
                'image_metadata': image_result.get('metadata', {})
            }
        )
    
    async def _generate_video_content(self, request: ContentRequest, content_id: str) -> GeneratedContent:
        """生成视频内容"""
        
        # 生成视频描述
        video_prompt = await self._generate_video_description(request)
        
        # 生成视频
        video_result = await self.video_generator.generate_video(
            prompt=video_prompt,
            duration=self.content_config.get('video', {}).get('max_duration', 60),
            resolution=self.content_config.get('video', {}).get('resolution', '1080p')
        )
        
        # 生成配套文本
        text_request = ContentRequest(
            content_type="text",
            topic=request.topic,
            style=request.style,
            target_audience=request.target_audience,
            brand_guidelines=request.brand_guidelines,
            constraints=request.constraints,
            platform=request.platform
        )
        
        text_content = await self._generate_text_content(text_request, f"{content_id}_text")
        
        return GeneratedContent(
            content_id=content_id,
            content_type="video",
            title=text_content.title,
            description=text_content.description,
            text_content=text_content.text_content,
            video_url=video_result['url'],
            tags=text_content.tags,
            metadata={
                'video_prompt': video_prompt,
                'video_metadata': video_result.get('metadata', {})
            }
        )
    
    async def _generate_carousel_content(self, request: ContentRequest, content_id: str) -> GeneratedContent:
        """生成轮播图内容"""
        
        # 确定轮播图数量
        carousel_size = request.constraints.get('carousel_size', 5)
        
        # 生成轮播图主题
        carousel_themes = await self._generate_carousel_themes(request, carousel_size)
        
        # 生成多张图像
        image_urls = []
        for i, theme in enumerate(carousel_themes):
            image_prompt = f"{request.style}风格，主题：{theme}，{request.target_audience}喜欢的内容"
            
            image_result = await self.image_generator.generate_image(
                prompt=image_prompt,
                width=1080,
                height=1080,
                style=request.style
            )
            
            image_urls.append(image_result['url'])
        
        # 生成配套文本
        text_request = ContentRequest(
            content_type="text",
            topic=request.topic,
            style=request.style,
            target_audience=request.target_audience,
            brand_guidelines=request.brand_guidelines,
            constraints=request.constraints,
            platform=request.platform
        )
        
        text_content = await self._generate_text_content(text_request, f"{content_id}_text")
        
        return GeneratedContent(
            content_id=content_id,
            content_type="carousel",
            title=text_content.title,
            description=text_content.description,
            text_content=text_content.text_content,
            image_urls=image_urls,
            tags=text_content.tags,
            metadata={
                'carousel_size': carousel_size,
                'carousel_themes': carousel_themes
            }
        )
    
    def _build_text_prompt(self, request: ContentRequest) -> str:
        """构建文本生成提示词"""
        
        prompt = f"""
请为小红书平台生成一篇关于"{request.topic}"的内容。

目标受众: {request.target_audience}
内容风格: {request.style}

品牌指南:
{json.dumps(request.brand_guidelines, ensure_ascii=False, indent=2)}

内容要求:
1. 标题要吸引人且符合小红书风格
2. 正文要有价值，字数在{request.constraints.get('min_length', 100)}-{request.constraints.get('max_length', 2000)}字之间
3. 包含相关的标签(#话题)
4. 语气要亲和、真实

请以JSON格式返回结果，包含:
- title: 标题
- description: 描述
- content: 正文内容
- tags: 标签列表
- metadata: 其他元数据
"""
        
        return prompt
    
    async def _generate_image_description(self, request: ContentRequest) -> str:
        """生成图像描述"""
        
        prompt = f"""
请生成一个详细的图像描述，用于AI图像生成。

主题: {request.topic}
风格: {request.style}
目标受众: {request.target_audience}
平台: 小红书

要求:
1. 描述要具体、详细
2. 符合小红书视觉风格
3. 包含色彩搭配建议
4. 适合品牌调性

请直接返回图像描述，不要其他格式。
"""
        
        response = await self.gemini_client.generate_text(prompt)
        return response.strip()
    
    async def _generate_video_description(self, request: ContentRequest) -> str:
        """生成视频描述"""
        
        prompt = f"""
请生成一个详细的视频脚本描述，用于AI视频生成。

主题: {request.topic}
风格: {request.style}
目标受众: {request.target_audience}
平台: 小红书
时长: 60秒以内

要求:
1. 描述视频场景和画面
2. 包含节奏和转场建议
3. 适合短视频平台
4. 符合品牌调性

请直接返回视频描述，不要其他格式。
"""
        
        response = await self.gemini_client.generate_text(prompt)
        return response.strip()
    
    async def _generate_carousel_themes(self, request: ContentRequest, size: int) -> List[str]:
        """生成轮播图主题"""
        
        prompt = f"""
为"{request.topic}"这个主题，生成{size}个轮播图的子主题。

目标受众: {request.target_audience}
风格: {request.style}

要求:
1. 每个主题都要有差异化
2. 围绕主主题展开
3. 适合小红书用户喜好
4. 具有实用价值

请以JSON数组格式返回主题列表。
"""
        
        response = await self.gemini_client.generate_text(prompt)
        
        try:
            themes = json.loads(response)
            if isinstance(themes, list):
                return themes[:size]
        except:
            pass
        
        # 如果解析失败，返回默认主题
        return [f"{request.topic} - 第{i+1}部分" for i in range(size)]
    
    def _parse_generated_text(self, text_response: str) -> Dict[str, Any]:
        """解析生成的文本响应"""
        
        try:
            # 尝试解析JSON格式
            parsed = json.loads(text_response)
            return parsed
        except:
            # 如果不是JSON格式，尝试提取关键信息
            lines = text_response.split('\n')
            result = {
                'title': '',
                'description': '',
                'content': text_response,
                'tags': [],
                'metadata': {}
            }
            
            # 提取标题（第一行或包含标题关键词的行）
            for line in lines:
                line = line.strip()
                if line and ('标题' in line or 'title' in line.lower() or len(lines) == 1):
                    result['title'] = line
                    break
            
            # 提取标签（以#开头的行）
            tags = []
            for line in lines:
                line = line.strip()
                if line.startswith('#'):
                    tags.extend([tag.strip() for tag in line.split() if tag.startswith('#')])
            
            result['tags'] = tags
            return result
    
    async def _assess_content_quality(self, content: GeneratedContent, request: ContentRequest) -> float:
        """评估内容质量"""
        
        # 构建质量评估提示
        assessment_prompt = f"""
请评估以下内容的质量，给出0-1的评分。

内容类型: {content.content_type}
标题: {content.title}
描述: {content.description}
内容: {content.text_content or '无'}
标签: {', '.join(content.tags) if content.tags else '无'}

评估标准:
1. 内容质量和价值 (0-0.3)
2. 目标受众匹配度 (0-0.2)
3. 平台适合性 (0-0.2)
4. 创意和吸引力 (0-0.2)
5. 品牌一致性 (0-0.1)

请直接返回0-1之间的数值评分，保留两位小数。
"""
        
        try:
            response = await self.gemini_client.generate_text(assessment_prompt)
            score = float(response.strip())
            return min(max(score, 0.0), 1.0)
        except:
            # 如果评估失败，返回默认分数
            return 0.75
    
    async def batch_generate_content(self, requests: List[ContentRequest]) -> List[GeneratedContent]:
        """批量生成内容"""
        
        logger.info(f"开始批量生成内容，数量: {len(requests)}")
        
        # 并行生成内容
        tasks = []
        for request in requests:
            task = asyncio.create_task(self.generate_content(request))
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # 处理结果
        generated_contents = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"批量生成第{i+1}个内容失败: {result}")
            else:
                generated_contents.append(result)
        
        logger.info(f"批量生成完成，成功: {len(generated_contents)}/{len(requests)}")
        
        return generated_contents
    
    async def optimize_content(self, content: GeneratedContent, optimization_goals: List[str]) -> GeneratedContent:
        """优化内容"""
        
        logger.info(f"开始优化内容: {content.content_id}")
        
        # 构建优化提示
        optimization_prompt = f"""
请优化以下内容，优化目标: {', '.join(optimization_goals)}

原始内容:
标题: {content.title}
描述: {content.description}
内容: {content.text_content}
标签: {', '.join(content.tags)}

优化要求:
1. 保持核心信息不变
2. 提升内容质量和吸引力
3. 优化标签和关键词
4. 符合平台规则和用户喜好

请以JSON格式返回优化后的内容，格式与原始内容一致。
"""
        
        try:
            response = await self.gemini_client.generate_text(optimization_prompt)
            optimized_data = json.loads(response)
            
            # 创建优化后的内容
            optimized_content = GeneratedContent(
                content_id=f"{content.content_id}_optimized",
                content_type=content.content_type,
                title=optimized_data.get('title', content.title),
                description=optimized_data.get('description', content.description),
                text_content=optimized_data.get('content', content.text_content),
                image_urls=content.image_urls,
                video_url=content.video_url,
                tags=optimized_data.get('tags', content.tags),
                metadata={
                    **content.metadata,
                    'original_content_id': content.content_id,
                    'optimization_goals': optimization_goals,
                    'optimized_at': datetime.utcnow().isoformat()
                }
            )
            
            # 重新评估质量
            optimized_content.quality_score = await self._assess_content_quality(
                optimized_content, 
                ContentRequest(
                    content_type=content.content_type,
                    topic=content.metadata.get('request_topic', ''),
                    style='',
                    target_audience=content.metadata.get('target_audience', ''),
                    brand_guidelines={},
                    constraints={}
                )
            )
            
            logger.info(f"内容优化完成: {content.content_id} -> {optimized_content.content_id}")
            
            return optimized_content
            
        except Exception as e:
            logger.error(f"内容优化失败: {content.content_id}, 错误: {e}")
            return content  # 返回原始内容