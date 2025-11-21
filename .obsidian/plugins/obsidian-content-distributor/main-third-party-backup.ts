import { App, Plugin, PluginSettingTab, Setting, MarkdownView, Notice, Modal, ButtonComponent, TextAreaComponent } from 'obsidian';

// 基于第三方AI插件常见模式的简化配置
interface SimpleAIConfig {
	name: string;
	provider: 'zhipu' | 'openai' | 'anthropic' | 'deepseek';
	apiKey: string;
	baseUrl?: string;
	model: string;
	maxTokens: number;
	temperature: number;
}

// 第三方插件常见的设置结构
interface SimpleSettings {
	aiConfig: SimpleAIConfig;
	platforms: string[];
	autoCopy: boolean;
}

// 第三方插件常用的默认配置
const SIMPLE_DEFAULTS: SimpleSettings = {
	aiConfig: {
		name: '智谱GLM-4.5',
		provider: 'zhipu',
		apiKey: '85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
		baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
		model: 'glm-4.5',
		maxTokens: 2000,
		temperature: 0.7
	},
	platforms: ['xiaohongshu', 'jike', 'twitter'],
	autoCopy: true
};

// 第三方插件常见的API调用格式
class ThirdPartyAPIClient {
	private config: SimpleAIConfig;

	constructor(config: SimpleAIConfig) {
		this.config = config;
	}

	// 第三方插件通常使用requestUrl而不是fetch
	async callAPI(prompt: string): Promise<string> {
		const requestBody = this.buildRequestBody(prompt);

		try {
			// 使用Obsidian的requestUrl，这是第三方插件的最佳实践
			const response = await requestUrl({
				url: `${this.config.baseUrl}/chat/completions`,
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.config.apiKey}`,
					'Content-Type': 'application/json',
					'User-Agent': 'Obsidian-ContentDistributor/1.0'
				},
				body: JSON.stringify(requestBody),
				throw: true
			});

			if (response.status === 200) {
				const result = response.json;
				return result.choices[0]?.message?.content || '生成失败';
			} else {
				throw new Error(`API调用失败: ${response.status}`);
			}
		} catch (error) {
			console.error('API调用错误:', error);
			throw this.handleError(error);
		}
	}

	// 第三方插件常见的请求体构建
	private buildRequestBody(prompt: string): any {
		switch (this.config.provider) {
			case 'zhipu':
				return {
					model: this.config.model,
					messages: [{ role: 'user', content: prompt }],
					max_tokens: this.config.maxTokens,
					temperature: this.config.temperature,
					stream: false
				};
			case 'openai':
				return {
					model: this.config.model,
					messages: [{ role: 'user', content: prompt }],
					max_tokens: this.config.maxTokens,
					temperature: this.config.temperature
				};
			default:
				throw new Error(`不支持的提供商: ${this.config.provider}`);
		}
	}

	// 第三方插件常见的错误处理
	private handleError(error: any): Error {
		if (error.status === 429) {
			return new Error('请求频率过高，请稍后重试');
		} else if (error.status === 401) {
			return new Error('API密钥无效，请检查配置');
		} else if (error.status === 403) {
			return new Error('API访问被拒绝，请检查权限');
		} else {
			return new Error(`API调用失败: ${error.message || '未知错误'}`);
		}
	}

	// 第三方插件常见的连接测试
	async testConnection(): Promise<boolean> {
		try {
			const response = await requestUrl({
				url: `${this.config.baseUrl}/models`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.config.apiKey}`
				},
				throw: true
			});
			return response.status === 200;
		} catch (error) {
			console.error('连接测试失败:', error);
			return false;
		}
	}
}

// 简化的插件主类，基于第三方插件模式
export default class ContentDistributorPlugin extends Plugin {
	settings: SimpleSettings;
	apiClient: ThirdPartyAPIClient;

	async onload() {
		await this.loadSettings();

		this.apiClient = new ThirdPartyAPIClient(this.settings.aiConfig);

		// 添加 ribbon 图标
		this.addRibbonIcon('send', '内容分发助手', () => {
			this.openDistributorModal();
		});

		// 添加命令
		this.addCommand({
			id: 'open-content-distributor',
			name: '打开内容分发助手',
			callback: () => {
				this.openDistributorModal();
			}
		});

		// 添加设置选项卡
		this.addSettingTab(new ContentDistributorSettingTab(this.app, this));
	}

	onunload() {
		// 清理资源
	}

	async loadSettings() {
		this.settings = Object.assign({}, SIMPLE_DEFAULTS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// 重新创建API客户端
		this.apiClient = new ThirdPartyAPIClient(this.settings.aiConfig);
	}

	openDistributorModal() {
		new ContentDistributorModal(this.app, this.settings, this.apiClient).open();
	}
}

// 第三方插件常见的设置选项卡
class ContentDistributorSettingTab extends PluginSettingTab {
	plugin: ContentDistributorPlugin;

	constructor(app: App, plugin: ContentDistributorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: '内容分发助手设置' });

		// AI配置
		containerEl.createEl('h3', { text: 'AI模型配置' });

		new Setting(containerEl)
			.setName('API密钥')
			.setDesc('智谱AI的API密钥')
			.addText(text => text
				.setPlaceholder('输入API密钥')
				.setValue(this.plugin.settings.aiConfig.apiKey)
				.onChange(async (value) => {
					this.plugin.settings.aiConfig.apiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('模型')
			.setDesc('选择要使用的模型')
			.addDropdown(dropdown => dropdown
				.addOption('glm-4', 'GLM-4')
				.addOption('glm-3-turbo', 'GLM-3 Turbo')
				.setValue(this.plugin.settings.aiConfig.model)
				.onChange(async (value) => {
					this.plugin.settings.aiConfig.model = value;
					await this.plugin.saveSettings();
				}));

		// 连接测试按钮
		new Setting(containerEl)
			.setName('连接测试')
			.setDesc('测试API连接是否正常')
			.addButton(button => button
				.setButtonText('测试连接')
				.onClick(async () => {
					const notice = new Notice('正在测试连接...', 0);
					try {
						const isConnected = await this.plugin.apiClient.testConnection();
						notice.hide();
						if (isConnected) {
							new Notice('连接测试成功！');
						} else {
							new Notice('连接测试失败，请检查配置');
						}
					} catch (error) {
						notice.hide();
						new Notice(`连接测试失败: ${error.message}`);
					}
				}));
	}
}

// 第三方插件常见的模态框
class ContentDistributorModal extends Modal {
	private settings: SimpleSettings;
	private apiClient: ThirdPartyAPIClient;

	constructor(app: App, settings: SimpleSettings, apiClient: ThirdPartyAPIClient) {
		super(app);
		this.settings = settings;
		this.apiClient = apiClient;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: '内容分发助手' });

		// 输入区域
		const inputArea = contentEl.createEl('textarea', {
			text: '请输入要转换的内容...',
			cls: 'content-input'
		});

		// 平台选择
		const platformSelect = contentEl.createEl('select');
		platformSelect.createEl('option', { value: 'xiaohongshu', text: '小红书' });
		platformSelect.createEl('option', { value: 'jike', text: '即刻' });
		platformSelect.createEl('option', { value: 'twitter', text: 'Twitter' });

		// 转换按钮
		const convertButton = contentEl.createEl('button', {
			text: '开始转换',
			cls: 'mod-cta'
		});

		convertButton.onclick = async () => {
			const content = inputArea.value;
			const platform = platformSelect.value;

			if (!content.trim()) {
				new Notice('请输入内容');
				return;
			}

			try {
				convertButton.textContent = '转换中...';
				convertButton.disabled = true;

				const prompt = this.buildPrompt(content, platform);
				const result = await this.apiClient.callAPI(prompt);

				this.showResult(result);
			} catch (error) {
				new Notice(`转换失败: ${error.message}`);
			} finally {
				convertButton.textContent = '开始转换';
				convertButton.disabled = false;
			}
		};
	}

	private buildPrompt(content: string, platform: string): string {
		const templates = {
			xiaohongshu: `请将以下内容转换为小红书风格：\n\n${content}`,
			jike: `请将以下内容转换为即刻风格：\n\n${content}`,
			twitter: `请将以下内容转换为Twitter风格（280字符内）：\n\n${content}`
		};

		return templates[platform] || content;
	}

	private showResult(result: string) {
		const { contentEl } = this;

		// 清除现有内容
		contentEl.empty();

		contentEl.createEl('h3', { text: '转换结果' });

		const resultArea = contentEl.createEl('textarea', {
			text: result,
			cls: 'result-output'
		});

		const copyButton = contentEl.createEl('button', {
			text: '复制结果'
		});

		copyButton.onclick = () => {
			navigator.clipboard.writeText(result);
			new Notice('已复制到剪贴板');
		};
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}