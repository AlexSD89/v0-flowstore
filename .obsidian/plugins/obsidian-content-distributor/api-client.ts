/**
 * 基于第三方插件最佳实践的标准化API客户端
 * 参考：BMO Chatbot、Silicon AI、Text Generator等知名插件
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

// 标准化的API响应
interface APIResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
	error?: {
		code: string;
		message: string;
	};
}

/**
 * 基于第三方插件最佳实践的API客户端
 */
class APIClient {
	private provider: AIProvider;
	private timeout: number;

	constructor(provider: AIProvider, timeout: number = 30000) {
		this.provider = provider;
		this.timeout = timeout;
	}

	/**
	 * 统一的API调用方法
	 */
	async call(prompt: string): Promise<string> {
		try {
			console.log('🤖 API调用开始...');
			console.log(`📋 提供商: ${this.provider.name}`);
			console.log(`📋 模型: ${this.provider.model}`);

			const requestBody = this.buildRequestBody(prompt);
			console.log('📋 请求体:', JSON.stringify(requestBody, null, 2));

			const response = await requestUrl({
				url: `${this.provider.baseUrl}/chat/completions`,
				method: 'POST',
				headers: this.buildHeaders(),
				body: JSON.stringify(requestBody),
				throw: true
			});

			console.log(`📊 HTTP状态: ${response.status}`);
			console.log(`📊 响应时间: ${response.headers.get('x-response-time') || 'N/A'}`);

			const result: APIResponse = response.json;

			if (result.error) {
				throw new APIError(result.error.code, result.error.message, response.status);
			}

			const content = result.choices[0]?.message?.content;
			if (!content) {
				throw new APIError('EMPTY_RESPONSE', 'AI返回空内容', response.status);
			}

			console.log('✅ API调用成功');
			console.log(`📝 AI回复: ${content.substring(0, 100)}...`);

			return content;

		} catch (error) {
			console.error('❌ API调用失败:', error);
			throw this.handleError(error);
		}
	}

	/**
	 * 测试API连接
	 */
	async testConnection(): Promise<boolean> {
		try {
			console.log('🔍 测试API连接...');

			const response = await requestUrl({
				url: `${this.provider.baseUrl}/models`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.provider.apiKey}`,
					'User-Agent': 'Obsidian-ContentDistributor/1.0'
				},
				throw: true
			});

			const isConnected = response.status === 200;
			console.log(`📊 连接测试: ${isConnected ? '成功' : '失败'} (${response.status})`);

			if (isConnected) {
				const models = response.json;
				console.log('📱 可用模型:');
				if (models.data && Array.isArray(models.data)) {
					models.data.forEach((model: any) => {
						console.log(`  📱 ${model.id}`);
					});
				}
			}

			return isConnected;

		} catch (error) {
			console.error('❌ 连接测试失败:', error);
			return false;
		}
	}

	/**
	 * 构建请求体
	 */
	private buildRequestBody(prompt: string): any {
		const baseBody = {
			model: this.provider.model,
			messages: [{ role: 'user', content: prompt }],
			max_tokens: this.provider.maxTokens,
			temperature: this.provider.temperature,
			stream: false
		};

		// 根据提供商添加特定参数
		switch (this.provider.id) {
			case 'openai':
				return {
					...baseBody,
					top_p: 0.9,
					frequency_penalty: 0,
					presence_penalty: 0
				};
			case 'anthropic':
				return {
					...baseBody,
					max_tokens: this.provider.maxTokens
				};
			case 'zhipu':
				return {
					...baseBody,
					// 智谱AI特有参数
				};
			default:
				return baseBody;
		}
	}

	/**
	 * 构建请求头
	 */
	private buildHeaders(): Record<string, string> {
		const baseHeaders = {
			'Authorization': `Bearer ${this.provider.apiKey}`,
			'Content-Type': 'application/json',
			'User-Agent': 'Obsidian-ContentDistributor/1.0'
		};

		// 合并提供商特定头
		return {
			...baseHeaders,
			...this.provider.headers
		};
	}

	/**
	 * 错误处理
	 */
	private handleError(error: any): Error {
		if (error instanceof APIError) {
			return error;
		}

		if (error.status) {
			return new APIError(
				this.mapErrorCode(error.status),
				this.mapErrorMessage(error.status),
				error.status
			);
		}

		// 网络错误或其他异常
		return new APIError(
			'NETWORK_ERROR',
			`网络连接失败: ${error.message}`,
			0
		);
	}

	/**
	 * 映射HTTP状态码到错误码
	 */
	private mapErrorCode(status: number): string {
		const errorMap: Record<number, string> = {
			400: 'INVALID_REQUEST',
			401: 'INVALID_API_KEY',
			403: 'FORBIDDEN',
			404: 'NOT_FOUND',
			429: 'RATE_LIMIT',
			500: 'SERVER_ERROR',
			502: 'SERVER_UNAVAILABLE',
			503: 'SERVICE_UNAVAILABLE'
		};

		return errorMap[status] || 'UNKNOWN_ERROR';
	}

	/**
	 * 映射错误码到用户友好的消息
	 */
	private mapErrorMessage(status: number): string {
		const messageMap: Record<number, string> = {
			400: '请求格式错误，请检查输入内容',
			401: 'API密钥无效，请重新配置',
			403: '访问被拒绝，请检查权限',
			404: 'API端点不存在',
			429: '请求过于频繁，请稍后重试',
			500: '服务器内部错误，请稍后重试',
			502: '服务器过载，请稍后重试',
			503: '服务暂时不可用，请稍后重试'
		};

		return messageMap[status] || '未知错误，请重试';
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

export { APIClient, APIError, AIProvider, APIResponse };