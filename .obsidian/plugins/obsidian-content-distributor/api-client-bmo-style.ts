/**
 * 基于BMO Chatbot插件实现的简洁API客户端
 * 专注于正确的API调用格式和错误处理
 */

import { requestUrl, Notice } from 'obsidian';

// AI提供商配置 - 与BMO保持一致
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
 * 基于BMO插件的简洁API客户端
 */
export class BMOStyleAPIClient {
	private provider: AIProvider;

	constructor(provider: AIProvider) {
		this.provider = provider;
	}

	/**
	 * 核心API调用方法 - 完全按照BMO的实现
	 */
	async call(prompt: string): Promise<string> {

		try {
			console.log('🤖 开始API调用 (BMO模式)...');
			console.log(`📋 提供商: ${this.provider.name}`);
			console.log(`📋 模型: ${this.provider.model}`);
			console.log(`📋 端点: ${this.provider.baseUrl}/chat/completions`);

			// 完全按照BMO的请求格式
			const response = await requestUrl({
				url: `${this.provider.baseUrl}/chat/completions`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.provider.apiKey}`,
					...(this.provider.headers || {})
				},
				body: JSON.stringify({
					model: this.provider.model,
					messages: [
						{
							role: 'user',
							content: prompt
						}
					],
					max_tokens: this.provider.maxTokens,
					temperature: this.provider.temperature
				}),
				throw: true
			});

			console.log(`📊 HTTP状态: ${response.status}`);

			const result: APIResponse = response.json;

			if (result.error) {
				console.error(`❌ API错误 (${result.error.code}): ${result.error.message}`);

				// BMO风格的错误处理 - 直接显示错误信息
				if (result.error.code === '1113') {
					throw new Error(`智谱AI账户配置问题: ${result.error.message}`);
				} else if (result.error.code === '429') {
					throw new Error(`请求过于频繁: ${result.error.message}`);
				} else {
					throw new Error(`API错误 (${result.error.code}): ${result.error.message}`);
				}
			}

			const content = result.choices[0]?.message?.content;
			if (!content) {
				throw new Error('AI返回空内容');
			}

			console.log('✅ API调用成功');
			console.log(`📝 响应长度: ${content.length} 字符`);

			return content;

		} catch (error) {
			console.error('❌ API调用失败:', error.message);

			// BMO风格的错误处理
			if (error.message.includes('1113')) {
				throw new Error('智谱AI账户余额不足，请充值或更换免费模型');
			} else if (error.message.includes('429')) {
				throw new Error('请求过于频繁，请稍后重试');
			} else if (error.message.includes('timeout')) {
				throw new Error('请求超时，请检查网络连接');
			} else if (error.status >= 500) {
				throw new Error('服务器错误，请稍后重试');
			} else if (error.status === 401) {
				throw new Error('API密钥无效，请检查配置');
			} else if (error.status === 403) {
				throw new Error('访问被拒绝，请检查权限');
			}

			throw error;
		}
	}

	
	/**
	 * 测试连接 - BMO风格
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
	 * 获取当前提供商信息
	 */
	getProvider(): AIProvider {
		return { ...this.provider };
	}
}

/**
 * API错误类 - 保持与原有代码兼容
 */
export class APIError extends Error {
	constructor(
		public code: string,
		public message: string,
		public status: number
	) {
		super(`${message} (错误码: ${code})`);
		this.name = 'APIError';
	}

	getUserMessage(): string {
		return this.message;
	}
}

// 导出类型
export type { AIProvider, APIResponse };