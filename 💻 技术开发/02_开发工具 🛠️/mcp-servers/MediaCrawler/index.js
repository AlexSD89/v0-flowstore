#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

class MediaCrawlerServer {
  constructor() {
    this.server = new Server(
      {
        name: 'mediacrawler-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'crawl_webpage',
          description: '抓取网页内容并提取结构化信息',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: '要抓取的网页URL',
                required: true
              },
              extract_images: {
                type: 'boolean',
                description: '是否提取图片链接 (默认true)',
                default: true
              },
              extract_links: {
                type: 'boolean',
                description: '是否提取所有链接 (默认true)',
                default: true
              }
            },
            required: ['url']
          }
        },
        {
          name: 'extract_social_media',
          description: '从网页中提取社交媒体信息',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: '网页URL',
                required: true
              }
            },
            required: ['url']
          }
        },
        {
          name: 'get_page_metadata',
          description: '提取网页的元数据信息',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: '网页URL',
                required: true
              }
            },
            required: ['url']
          }
        },
        {
          name: 'analyze_content_structure',
          description: '分析网页内容结构',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: '网页URL',
                required: true
              }
            },
            required: ['url']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'crawl_webpage':
          return await this.crawlWebpage(
            request.params.arguments.url,
            request.params.arguments?.extract_images,
            request.params.arguments?.extract_links
          );
        case 'extract_social_media':
          return await this.extractSocialMedia(request.params.arguments.url);
        case 'get_page_metadata':
          return await this.getPageMetadata(request.params.arguments.url);
        case 'analyze_content_structure':
          return await this.analyzeContentStructure(request.params.arguments.url);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async crawlWebpage(url, extractImages = true, extractLinks = true) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BMAD-MediaCrawler/1.0)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // 提取基本信息
      const title = $('title').text().trim();
      const description = $('meta[name="description"]').attr('content') || '';
      
      // 提取主要内容
      const content = this.extractMainContent($);
      
      // 提取图片
      const images = extractImages ? this.extractImages($, url) : [];
      
      // 提取链接
      const links = extractLinks ? this.extractLinks($, url) : [];

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              url: url,
              title: title,
              description: description,
              content: content,
              images: images,
              links: links,
              timestamp: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message,
              url: url
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  async extractSocialMedia(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const socialMedia = {
        og_title: $('meta[property="og:title"]').attr('content'),
        og_description: $('meta[property="og:description"]').attr('content'),
        og_image: $('meta[property="og:image"]').attr('content'),
        og_url: $('meta[property="og:url"]').attr('content'),
        twitter_card: $('meta[name="twitter:card"]').attr('content'),
        twitter_title: $('meta[name="twitter:title"]').attr('content'),
        twitter_description: $('meta[name="twitter:description"]').attr('content'),
        twitter_image: $('meta[name="twitter:image"]').attr('content'),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              url: url,
              social_media: socialMedia
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  async getPageMetadata(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const metadata = {
        title: $('title').text().trim(),
        description: $('meta[name="description"]').attr('content'),
        keywords: $('meta[name="keywords"]').attr('content'),
        author: $('meta[name="author"]').attr('content'),
        charset: $('meta[charset]').attr('charset'),
        viewport: $('meta[name="viewport"]').attr('content'),
        canonical: $('link[rel="canonical"]').attr('href'),
        robots: $('meta[name="robots"]').attr('content'),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              url: url,
              metadata: metadata
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  async analyzeContentStructure(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const structure = {
        headings: {
          h1: $('h1').length,
          h2: $('h2').length,
          h3: $('h3').length,
          h4: $('h4').length,
          h5: $('h5').length,
          h6: $('h6').length,
        },
        paragraphs: $('p').length,
        images: $('img').length,
        links: $('a').length,
        lists: $('ul, ol').length,
        tables: $('table').length,
        forms: $('form').length,
        videos: $('video').length,
        iframes: $('iframe').length,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              url: url,
              structure: structure
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  extractMainContent($) {
    // 尝试提取主要内容
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.content',
      '.main-content',
      '.post-content',
      '.entry-content',
      'main'
    ];
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        return element.text().trim();
      }
    }
    
    // 如果没有找到特定容器，返回body文本
    return $('body').text().trim().substring(0, 2000);
  }

  extractImages($, baseUrl) {
    const images = [];
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      const alt = $(elem).attr('alt') || '';
      if (src) {
        const fullUrl = new URL(src, baseUrl).href;
        images.push({ src: fullUrl, alt: alt });
      }
    });
    return images.slice(0, 20); // 限制数量
  }

  extractLinks($, baseUrl) {
    const links = [];
    $('a').each((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().trim();
      if (href && text) {
        try {
          const fullUrl = new URL(href, baseUrl).href;
          links.push({ url: fullUrl, text: text });
        } catch (e) {
          // 忽略无效URL
        }
      }
    });
    return links.slice(0, 50); // 限制数量
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Media Crawler MCP server running on stdio');
  }
}

const server = new MediaCrawlerServer();
server.run().catch(console.error);