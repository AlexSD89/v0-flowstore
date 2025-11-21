/**
 * 基于最佳实践的优化API客户端
 * 解决频率限制问题的完整实现
 */

import { requestUrl } from 'obsidian';

// AI提供商配置
interface AIProvider {
	id: string;
	name: string;
	baseUrl: string;
	model: string;
	apiKey: string;
	maxTokens: number;
	temperature: number;
	headers?: Record<string, string>;
}

// 标准化的API响应接口
interface APIResponse {
	choices: Array<{
		message?: {
			content: string;
		};
	}>;
	error?: {
		code: string;
		message: string;
	};
}

/**
 * 智能缓存系统 - 避免重复API调用
 */
class SmartCache {
	private cache = new Map<string, { result: string; timestamp: number; hitCount: number }>();
	private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
	private readonly MAX_CACHE_SIZE = 100;

	getCacheKey(prompt: string, provider: AIProvider): string {
		// 基于内容和模型生成缓存键
		const contentHash = this.simpleHash(prompt);
		return `${provider.id}-${provider.model}-${contentHash}`;
	}

	private simpleHash(str: string): string {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return Math.abs(hash).toString(36);
	}

	get(prompt: string, provider: AIProvider): string | null {
		const key = this.getCacheKey(prompt, provider);
		const cached = this.cache.get(key);

		if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
			cached.hitCount++;
			console.log(`📋 缓存命中 (第${cached.hitCount}次) - 避免API调用`);
			return cached.result;
		}

		return null;
	}

	set(prompt: string, provider: AIProvider, result: string): void {
		const key = this.getCacheKey(prompt, provider);
		this.cache.set(key, {
			result,
			timestamp: Date.now(),
			hitCount: 0
		});

	// 限制缓存大小，删除最旧的条目
		if (this.cache.size > this.MAX_CACHE_SIZE) {
			const oldestKey = this.cache.keys().next().value;
			this.cache.delete(oldestKey);
		}
	}

	getStats() {
		return {
			size: this.cache.size,
			maxSize: this.MAX_CACHE_SIZE,
			hitRate: this.calculateHitRate()
		};
	}

	private calculateHitRate(): number {
		const totalHits = Array.from(this.cache.values()).reduce((sum, item) => sum + item.hitCount, 0);
		return this.cache.size > 0 ? totalHits / this.cache.size : 0;
	}

	clear(): void {
		this.cache.clear();
		console.log('🗑️ 缓存已清空');
	}
}

/**
 * 智能请求队列 - 解决频率限制
 */
class RequestQueue {
	private queue: Array<() => Promise<any>> = [];
	private isProcessing = false;
	private lastRequestTime = 0;
	private readonly BASE_DELAY = 4000; // 基础延迟4秒（更保守）
	private readonly MAX_DELAY = 15000; // 最大延迟15秒
	private readonly ERROR_BACKOFF = 8000; // 错误退避8秒
	private consecutiveErrors = 0;

	async add<T>(request: () => Promise<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			this.queue.push(async () => {
				try {
					const result = await request();
					this.consecutiveErrors = 0; // 重置错误计数
					resolve(result);
				} catch (error) {
					this.consecutiveErrors++;
					console.error(`❌ 请求失败 (连续第${this.consecutiveErrors}次):`, error);
					reject(error);
				}
			});
			this.process();
		});
	}

	private async process(): Promise<void> {
		if (this.isProcessing || this.queue.length === 0) return;

		this.isProcessing = true;

		while (this.queue.length > 0) {
			const now = Date.now();
			const timeSinceLastRequest = now - this.lastRequestTime;

			// 计算所需延迟时间
			let delayNeeded = this.BASE_DELAY;

			// 根据错误次数调整延迟
			if (this.consecutiveErrors > 0) {
				delayNeeded = this.BASE_DELAY + (this.consecutiveErrors * this.ERROR_BACKOFF);
			}

			// 确保最小间隔
			const minInterval = this.BASE_DELAY - 1000; // 3秒最小间隔
			if (timeSinceLastRequest < minInterval) {
				delayNeeded = Math.max(delayNeeded, minInterval - timeSinceLastRequest);
			} else {
				delayNeeded = Math.max(delayNeeded, 0);
			}

			if (delayNeeded > 0) {
				console.log(`⏱️ 智能等待 ${delayNeeded}ms (错误次数: ${this.consecutiveErrors})`);
				await this.delay(delayNeeded);
			}

			const request = this.queue.shift();
			if (request) {
				try {
					await request();
					this.lastRequestTime = Date.now();
				} catch (error) {
					console.error('队列请求执行失败:', error);
					// 错误后延长等待时间
					await this.delay(this.ERROR_BACKOFF);
					this.lastRequestTime = Date.now();
				}
			}
		}

		this.isProcessing = false;
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	getStats() {
		return {
			queueLength: this.queue.length,
			isProcessing: this.isProcessing,
			consecutiveErrors: this.consecutiveErrors,
			lastRequestAgo: Date.now() - this.lastRequestTime
		};
	}

	clear(): void {
		this.queue = [];
		this.isProcessing = false;
		this.consecutiveErrors = 0;
		console.log('🗑️ 请求队列已清空');
	}
}

/**
 * 优化的API客户端
 */
export class OptimizedAPIClient {
	private cache: SmartCache;
	private queue: RequestQueue;
	private rateLimitTracker = new Map<string, number[]>();
	private readonly RATE_LIMIT_WINDOW = 60000; // 1分钟窗口
	private readonly MAX_REQUESTS_PER_WINDOW = 8; // 每分钟最多8个请求

	constructor(private provider: AIProvider) {
		this.cache = new SmartCache();
		this.queue = new RequestQueue();
	}

	/**
	 * 优化的API调用
	 */
	async call(prompt: string): Promise<string> {
		try {
			// 1. 检查缓存
			const cachedResult = this.cache.get(prompt, this.provider);
			if (cachedResult) {
				return cachedResult;
			}

			// 2. 检查速率限制
			this.checkRateLimit();

			// 3. 使用队列处理请求
			const result = await this.queue.add(async () => {
				console.log('🤖 开始API调用...');
				console.log(`📋 提供商: ${this.provider.name}`);
				console.log(`📋 模型: ${this.provider.model}`);

				const startTime = Date.now();
				const requestBody = this.buildRequestBody(prompt);

				const response = await requestUrl({
					url: `${this.provider.baseUrl}/chat/completions`,
					method: 'POST',
					headers: this.buildHeaders(),
					body: JSON.stringify(requestBody),
					throw: true,
					timeout: 45000 // 45秒超时
				});

				const duration = Date.now() - startTime;
				console.log(`📊 API调用完成 (${duration}ms) - 状态: ${response.status}`);

				const result: APIResponse = response.json;

				if (result.error) {
					// 智谱API特殊错误处理
					if (result.error.code === '1113') {
						throw new Error('智谱AI账户配置问题 (1113) - 请检查账户余额和资源包绑定');
					} else if (result.error.code === '429') {
						throw new Error('请求过于频繁，请稍后重试 (429)');
					} else if (result.error.code === '402') {
						throw new Error('API密钥无效或余额不足 (402)');
					}
					throw new Error(`API错误 (${result.error.code}): ${result.error.message}`);
				}

				const content = result.choices[0]?.message?.content;
				if (!content) {
					throw new Error('AI返回空内容，请检查输入或模型限制');
				}

				// 4. 缓存成功的结果
				this.cache.set(prompt, this.provider, content);

				// 5. 记录速率限制
				this.recordRequest();

				console.log(`✅ API调用成功 - 长度: ${content.length} 字符`);
				console.log(`💡 缓存命中率: ${(this.cache.getStats().hitRate * 100).toFixed(1)}%`);

				return content;
			});

			return result;

		} catch (error) {
			console.error('❌ API调用失败:', error.message);

			// 提供用户友好的错误提示
			if (error.message.includes('1113')) {
				throw new Error('智谱AI账户配置问题 - 请登录智谱开放平台检查账户余额');
			} else if (error.message.includes('429')) {
				throw new Error('请求过于频繁 - 请稍等片刻再试');
			} else if (error.message.includes('timeout')) {
				throw new Error('请求超时 - 网络可能较慢，请检查连接');
			}

			throw error;
		}
	}

	/**
	 * 检查速率限制
	 */
	private checkRateLimit(): void {
		const now = Date.now();
		const key = `${this.provider.id}-${this.provider.model}`;

		if (!this.rateLimitTracker.has(key)) {
			this.rateLimitTracker.set(key, []);
		}

		const requests = this.rateLimitTracker.get(key)!;

		// 清理过期的请求记录
		const validRequests = requests.filter(timestamp => now - timestamp < this.RATE_LIMIT_WINDOW);
		this.rateLimitTracker.set(key, validRequests);

		// 检查是否超过限制
		if (validRequests.length >= this.MAX_REQUESTS_PER_WINDOW) {
			const oldestRequest = Math.min(...validRequests);
			const waitTime = this.RATE_LIMIT_WINDOW - (now - oldestRequest);

			if (waitTime > 0) {
				throw new Error(`速率限制 - 请等待 ${Math.ceil(waitTime / 1000)} 秒后重试`);
			}
		}
	}

	/**
	 * 记录请求
	 */
	private recordRequest(): void {
		const now = Date.now();
		const key = `${this.provider.id}-${this.provider.model}`;

		if (!this.rateLimitTracker.has(key)) {
			this.rateLimitTracker.set(key, []);
		}

		const requests = this.rateLimitTracker.get(key)!;
		requests.push(now);
	}

	/**
	 * 构建请求体
	 */
	private buildRequestBody(prompt: string): any {
		return {
			model: this.provider.model,
			messages: [{
				role: 'user',
				content: this.truncatePrompt(prompt)
			}],
			max_tokens: Math.min(this.provider.maxTokens, 2000), // 限制Token数量
			temperature: this.provider.temperature,
			stream: false,
			top_p: 0.9,
			frequency_penalty: 0,
			presence_penalty: 0
			};
	}

	/**
	 * 截断过长的提示词
	 */
	private truncatePrompt(prompt: string): string {
		const maxLength = 1000; // 限制输入长度
		if (prompt.length <= maxLength) {
			return prompt;
		}
		return prompt.substring(0, maxLength) + '...[内容已截断]';
	}

	/**
	 * 构建请求头
	 */
	private buildHeaders(): Record<string, string> {
		const baseHeaders = {
			'Authorization': `Bearer ${this.provider.apiKey}`,
			'Content-Type': 'application/json',
			'User-Agent': 'Obsidian-ContentDistributor/2.0',
			'Accept': 'application/json',
			'Connection': 'keep-alive'
		};

		return { ...baseHeaders, ...this.provider.headers };
	}

	/**
	 * 测试连接
	 */
	async testConnection(): Promise<boolean> {
		try {
			const testPrompt = '测试连接，请简单回复：连接成功';
			await this.call(testPrompt);
			return true;
		} catch (error) {
			console.error('连接测试失败:', error.message);
			return false;
		}
	}

	/**
	 * 获取统计信息
	 */
	getStats() {
		return {
			cache: this.cache.getStats(),
			queue: this.queue.getStats(),
			rateLimit: {
				windowSize: this.RATE_LIMIT_WINDOW / 1000,
				maxRequests: this.MAX_REQUESTS_PER_WINDOW,
				currentRequests: Array.from(this.rateLimitTracker.values())
					.reduce((sum, requests) => sum + requests.length, 0)
			}
		};
	}

	/**
	 * 清理所有缓存和队列
	 */
	clearCache(): void {
		this.cache.clear();
		this.queue.clear();
		this.rateLimitTracker.clear();
		console.log('🧹 所有缓存和队列已清理');
	}
}

/**
 * 标准化的API错误类
 */
class APIError extends Error {
	constructor(
		public code: string,
		public message: string,
		public status: number
	) {
		super(`${message} (错误码: ${code})`);
		this.name = 'APIError';
	}

	/**
	 * 检查是否为特定类型的错误
	 */
	isAuthError(): boolean {
		return this.code === 'INVALID_API_KEY' || this.status === 401;
	}

	isRateLimit(): boolean {
		return this.code === 'RATE_LIMIT' || this.status === 429;
	}

	isServerError(): boolean {
		return this.status >= 500;
	}

	/**
	 * 获取用户友好的错误消息
	 */
	getUserMessage(): string {
		// 智谱AI的1113错误特殊处理
		if (this.code === '1113' || (this.status === 429 && this.message.includes('余额不足'))) {
			return '账户余额不足或无可用API资源包，请登录智谱AI控制台检查配置（错误码: 1113）';
		}

		if (this.isAuthError()) {
			return 'API密钥无效，请在插件设置中重新配置密钥';
		}

		if (this.isRateLimit()) {
			return '请求过于频繁，请稍后重试或降低请求频率';
		}

		if (this.isServerError()) {
			return '服务器暂时不可用，请稍后重试';
		}

		return this.message;
	}
}

// 导出优化的客户端类和相关接口
export { OptimizedAPIClient as APIClient, APIError };
export type { AIProvider, APIResponse };