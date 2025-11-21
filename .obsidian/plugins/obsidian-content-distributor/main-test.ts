import { App, Plugin, PluginSettingTab, Setting, MarkdownView, Notice, Modal, ButtonComponent, TextAreaComponent, DropdownComponent } from 'obsidian';

// AI模型配置接口 - 基于成功插件的模式
interface AIModelConfig {
	name: string;
	apiKey: string;
	endpoint: string;
	modelId: string;
	maxTokens: number;
	temperature: number;
	// 新增配置项
	timeout: number; // 请求超时时间
	headers?: Record<string, string>; // 自定义请求头
	proxyUrl?: string; // 可选代理URL
	useStream?: boolean; // 是否使用流式响应
}

// 平台配置接口
interface PlatformConfig {
	id: string;
	name: string;
	icon: string;
	promptTemplate: string;
	maxLength: number;
	supportsHashtags: boolean;
	supportsImages: boolean;
}

// 插件设置接口
interface ContentDistributorSettings {
	aiModels: AIModelConfig[];
	selectedModelId: string;
	platforms: PlatformConfig[];
	defaultPlatform: string;
	autoCopy: boolean;
	showPreview: boolean;
	// 新增设置
	enableProxy: boolean;
	globalTimeout: number;
	retryStrategy: 'exponential' | 'linear' | 'none';
}

// 基于智谱AI官方推荐的默认设置
const DEFAULT_SETTINGS: ContentDistributorSettings = {
	aiModels: [
		{
			name: 'GLM-4.6-官方模式',
			apiKey: '720ce7aeeca047e9aa2788c7f4346aea.BbkmxXWxYvhj7iEV',
			endpoint: 'https://open.bigmodel.cn/api/paas/v4',
			modelId: 'glm-4.6',
			maxTokens: 3000, // 官方推荐值
			temperature: 0.7,
			timeout: 30000, // 30秒超时
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'Obsidian-ContentDistributor/1.2.0'
			},
			useStream: false // 使用非流式响应，更稳定
		},
		{
			name: 'GLM-4.6-兼容模式',
			apiKey: '720ce7aeeca047e9aa2788c7f4346aea.BbkmxXWxYvhj7iEV',
			endpoint: 'https://open.bigmodel.cn/api/paas/v4',
			modelId: 'glm-4.6',
			maxTokens: 2000, // 保守值
			temperature: 0.5, // 较低的temperature更稳定
			timeout: 45000, // 45秒超时，更宽松
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer 720ce7aeeca047e9aa2788c7f4346aea.BbkmxXWxYvhj7iEV',
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
			},
			useStream: false
		}
	],
	selectedModelId: 'GLM-4.6-官方模式',
	platforms: [
		{
			id: 'xiaohongshu',
			name: '小红书',
			icon: '📱',
			promptTemplate: '请将以下内容转换为小红书风格文案：\n\n1. 使用吸引人的标题和表情符号\n2. 内容简洁明了，分段清晰\n3. 适当添加相关标签\n4. 语言要活泼有趣，贴近年轻人\n\n原文内容：\n{content}\n\n请生成符合小红书风格的文案：',
			maxLength: 1000,
			supportsHashtags: true,
			supportsImages: true
		},
		{
			id: 'jike',
			name: '即刻',
			icon: '💬',
			promptTemplate: '请将以下内容转换为即刻风格：\n\n1. 简洁明了，观点鲜明\n2. 适合短平快的表达\n3. 可以适当使用网络流行语\n4. 保持理性讨论的氛围\n\n原文内容：\n{content}\n\n请生成即刻风格的文案：',
			maxLength: 500,
			supportsHashtags: false,
			supportsImages: false
		},
		{
			id: 'x-twitter',
			name: 'X(Twitter)',
			icon: '🐦',
			promptTemplate: '请将以下内容转换为X/Twitter风格：\n\n1. 控制在280字符以内\n2. 使用简洁有力的语言\n3. 可以适当使用hashtag\n4. 考虑国际化表达\n\n原文内容：\n{content}\n\n请生成X/Twitter风格的文案：',
			maxLength: 280,
			supportsHashtags: true,
			supportsImages: true
		},
		{
			id: 'wechat',
			name: '微信公众号',
			icon: '📊',
			promptTemplate: '请将以下内容优化为微信公众号文章：\n\n1. 保持专业性，但增加可读性\n2. 适当添加小标题和分隔\n3. 开头要有吸引人的导语\n4. 结尾要有总结或呼吁行动\n\n原文内容：\n{content}\n\n请优化为微信公众号文章：',
			maxLength: 5000,
			supportsHashtags: false,
			supportsImages: true
		}
	],
	defaultPlatform: 'xiaohongshu',
	autoCopy: true,
	showPreview: true,
	enableProxy: false,
	globalTimeout: 30000,
	retryStrategy: 'exponential'
};

// 改进的内容分发模态框
class ContentDistributorModal extends Modal {
	plugin: ContentDistributorPlugin;
	originalContent: string;
	processedContent: string;
	selectedPlatform: string;
	selectedModel: AIModelConfig;
	resultTextArea: TextAreaComponent;
	isProcessing: boolean;

	constructor(app: App, plugin: ContentDistributorPlugin, content: string) {
		super(app);
		this.plugin = plugin;
		this.originalContent = content;
		this.processedContent = '';
		this.selectedPlatform = plugin.settings.defaultPlatform;
		this.selectedModel = plugin.settings.aiModels.find(m => m.name === plugin.settings.selectedModelId) || plugin.settings.aiModels[0];
		this.isProcessing = false;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: '智能内容分发助手 v2.0' });

		// 原始内容预览
		const originalSection = contentEl.createDiv();
		originalSection.createEl('h3', { text: '原始内容' });
		const originalTextArea = new TextAreaComponent(originalSection);
		originalTextArea.setValue(this.originalContent);
		originalTextArea.inputEl.rows = 8;
		originalTextArea.inputEl.style.width = '100%';
		originalTextArea.inputEl.style.marginBottom = '20px';

		// 平台选择
		const platformSection = contentEl.createDiv();
		platformSection.createEl('h3', { text: '选择目标平台' });
		const platformDropdown = new DropdownComponent(platformSection);

		this.plugin.settings.platforms.forEach(platform => {
			platformDropdown.addOption(platform.id, `${platform.icon} ${platform.name}`);
		});

		platformDropdown.setValue(this.selectedPlatform);
		platformDropdown.onChange(async (value: string) => {
			this.selectedPlatform = value;
		});

		// AI模型选择
		const modelSection = contentEl.createDiv();
		modelSection.createEl('h3', { text: '选择AI模型' });
		const modelDropdown = new DropdownComponent(modelSection);

		this.plugin.settings.aiModels.forEach(model => {
			modelDropdown.addOption(model.name, model.name);
		});

		modelDropdown.setValue(this.selectedModel.name);
		modelDropdown.onChange(async (value: string) => {
			this.selectedModel = this.plugin.settings.aiModels.find(m => m.name === value) || this.plugin.settings.aiModels[0];
		});

		// 处理按钮
		const buttonContainer = contentEl.createDiv();
		buttonContainer.style.marginTop = '20px';
		buttonContainer.style.textAlign = 'center';

		const processButton = new ButtonComponent(buttonContainer);
		processButton.setButtonText('🚀 开始转换');
		processButton.setCta();
		processButton.onClick(() => {
			this.processContent();
		});

		// 结果显示区域
		const resultSection = contentEl.createDiv();
		resultSection.createEl('h3', { text: '转换结果' });
		this.resultTextArea = new TextAreaComponent(resultSection);
		this.resultTextArea.setValue('');
		this.resultTextArea.inputEl.rows = 10;
		this.resultTextArea.inputEl.style.width = '100%';
		this.resultTextArea.inputEl.style.marginBottom = '20px';

		// 操作按钮
		const actionContainer = contentEl.createDiv();
		actionContainer.style.textAlign = 'center';

		const copyButton = new ButtonComponent(actionContainer);
		copyButton.setButtonText('📋 复制内容');
		copyButton.onClick(() => {
			this.copyToClipboard();
		});

		const regenerateButton = new ButtonComponent(actionContainer);
		regenerateButton.setButtonText('🔄 重新生成');
		regenerateButton.onClick(() => {
			this.processContent();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async processContent() {
		if (this.isProcessing) {
			new Notice('正在处理中，请稍候...');
			return;
		}

		if (!this.selectedModel.apiKey) {
			new Notice('请先在设置中配置AI模型的API密钥');
			return;
		}

		const platform = this.plugin.settings.platforms.find(p => p.id === this.selectedPlatform);
		if (!platform) return;

		this.isProcessing = true;
		const notice = new Notice('正在处理内容...', 0);

		try {
			const prompt = platform.promptTemplate.replace('{content}', this.originalContent);
			this.processedContent = await this.callAIImproved(prompt);

			if (this.resultTextArea) {
				this.resultTextArea.setValue(this.processedContent);
			}

			if (this.plugin.settings.autoCopy) {
				await this.copyToClipboard();
			}

			notice.hide();
			new Notice('内容转换完成！');
		} catch (error) {
			notice.hide();
			new Notice('处理失败：' + error.message);
			console.error('Content processing error:', error);
		} finally {
			this.isProcessing = false;
		}
	}

	// 改进的AI调用方法 - 基于成功插件的模式
	async callAIImproved(prompt: string): Promise<string> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.selectedModel.timeout);

		try {
			// 构建请求体 - 使用智谱AI官方格式
			const requestBody = {
				model: this.selectedModel.modelId,
				messages: [
					{
						role: "user",
						content: prompt.length > 4000 ? prompt.substring(0, 4000) + "..." : prompt
					}
				],
				max_tokens: this.selectedModel.maxTokens,
				temperature: this.selectedModel.temperature,
				stream: false
			};

			const response = await fetch(`${this.selectedModel.endpoint}/chat/completions`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.selectedModel.apiKey}`,
					'Content-Type': 'application/json',
					...this.selectedModel.headers
				},
				body: JSON.stringify(requestBody),
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				if (response.status === 429) {
					throw new Error(`请求频率过高，请稍后再试 (状态码: ${response.status})`);
				} else if (response.status === 401) {
					throw new Error(`API密钥无效，请检查配置 (状态码: ${response.status})`);
				} else if (response.status === 403) {
					throw new Error(`API配额不足，请检查账户 (状态码: ${response.status})`);
				} else {
					throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
				}
			}

			const data = await response.json();

			if (!data.choices || !data.choices[0] || !data.choices[0].message) {
				throw new Error('API返回格式异常');
			}

			return data.choices[0].message.content;

		} catch (error) {
			clearTimeout(timeoutId);

			if (error.name === 'AbortError') {
				throw new Error('请求超时，请检查网络连接或稍后重试');
			}

			throw error;
		}
	}

	async copyToClipboard() {
		try {
			await navigator.clipboard.writeText(this.processedContent);
			new Notice('内容已复制到剪贴板');
		} catch (error) {
			new Notice('复制失败：' + error.message);
		}
	}
}

export default class ContentDistributorPlugin extends Plugin {
	settings: ContentDistributorSettings;

	async onload() {
		await this.loadSettings();

		// 添加侧边栏图标
		const ribbonIconEl = this.addRibbonIcon('send', '内容分发助手', (evt: MouseEvent) => {
			this.openContentDistributor();
		});
		ribbonIconEl.addClass('obsidian-content-distributor-ribbon');

		// 添加状态栏
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('内容分发助手 v2.0');
		statusBarItemEl.onClickEvent(() => {
			this.openContentDistributor();
		});

		// 添加命令
		this.addCommand({
			id: 'open-content-distributor',
			name: '打开内容分发助手',
			callback: () => {
				this.openContentDistributor();
			}
		});

		this.addCommand({
			id: 'distribute-current-note',
			name: '分发当前笔记',
			editorCallback: (editor, view) => {
				const content = editor.getValue();
				this.distributeContent(content);
			}
		});

		this.addCommand({
			id: 'distribute-selected-text',
			name: '分发选中文本',
			editorCallback: (editor, view) => {
				const selectedText = editor.getSelection();
				if (selectedText) {
					this.distributeContent(selectedText);
				} else {
					new Notice('请先选择要分发的文本');
				}
			}
		});

		// 添加设置选项卡
		this.addSettingTab(new ContentDistributorSettingTab(this.app, this));
	}

	onunload() {
		// 清理资源
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	openContentDistributor() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		let content = '';

		if (activeView) {
			const editor = activeView.editor;
			const selectedText = editor.getSelection();
			content = selectedText || editor.getValue();
		}

		new ContentDistributorModal(this.app, this, content).open();
	}

	distributeContent(content: string) {
		new ContentDistributorModal(this.app, this, content).open();
	}
}

class ContentDistributorSettingTab extends PluginSettingTab {
	plugin: ContentDistributorPlugin;

	constructor(app: App, plugin: ContentDistributorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: '内容分发助手设置 v2.0' });

		// AI模型配置
		containerEl.createEl('h3', { text: 'AI模型配置' });

		this.plugin.settings.aiModels.forEach((model, index) => {
			const modelContainer = containerEl.createDiv();
			modelContainer.style.marginBottom = '20px';
			modelContainer.style.padding = '10px';
			modelContainer.style.border = '1px solid #ccc';
			modelContainer.style.borderRadius = '5px';

			modelContainer.createEl('h4', { text: model.name });

			new Setting(modelContainer)
				.setName('API密钥')
				.setDesc('输入AI模型的API密钥')
				.addText(text => text
					.setPlaceholder('输入API密钥')
					.setValue(model.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.aiModels[index].apiKey = value;
						await this.plugin.saveSettings();
					}));

			new Setting(modelContainer)
				.setName('端点')
				.setDesc('API端点地址')
				.addText(text => text
					.setPlaceholder('https://api.example.com/v1')
					.setValue(model.endpoint)
					.onChange(async (value) => {
						this.plugin.settings.aiModels[index].endpoint = value;
						await this.plugin.saveSettings();
					}));

			new Setting(modelContainer)
				.setName('超时时间(秒)')
				.setDesc('请求超时时间，单位：秒')
				.addText(text => text
					.setPlaceholder('30')
					.setValue(String(model.timeout / 1000))
					.onChange(async (value) => {
						const timeout = parseInt(value) * 1000;
						if (!isNaN(timeout) && timeout > 0) {
							this.plugin.settings.aiModels[index].timeout = timeout;
							await this.plugin.saveSettings();
						}
					}));

			const testButton = new ButtonComponent(modelContainer);
			testButton.setButtonText('测试连接');
			testButton.onClick(() => {
				this.testModelConnection(model);
			});
		});

		// 平台配置
		containerEl.createEl('h3', { text: '平台配置' });

		new Setting(containerEl)
			.setName('默认平台')
			.setDesc('选择默认的内容分发平台')
			.addDropdown(dropdown => {
				this.plugin.settings.platforms.forEach(platform => {
					dropdown.addOption(platform.id, `${platform.icon} ${platform.name}`);
				});
				dropdown.setValue(this.plugin.settings.defaultPlatform)
					.onChange(async (value) => {
						this.plugin.settings.defaultPlatform = value;
						await this.plugin.saveSettings();
					});
			});

		// 通用设置
		containerEl.createEl('h3', { text: '通用设置' });

		new Setting(containerEl)
			.setName('自动复制')
			.setDesc('处理完成后自动复制到剪贴板')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoCopy)
				.onChange(async (value) => {
					this.plugin.settings.autoCopy = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('显示预览')
			.setDesc('处理完成后显示预览')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showPreview)
				.onChange(async (value) => {
					this.plugin.settings.showPreview = value;
					await this.plugin.saveSettings();
				}));
	}

	async testModelConnection(model: AIModelConfig) {
		if (!model.apiKey) {
			new Notice('请先配置API密钥');
			return;
		}

		const notice = new Notice('正在测试连接...', 0);

		try {
			const response = await fetch(`${model.endpoint}/models`, {
				headers: {
					'Authorization': `Bearer ${model.apiKey}`,
					...model.headers
				}
			});

			notice.hide();

			if (response.ok) {
				new Notice('连接测试成功！');
			} else {
				new Notice('连接测试失败：' + response.statusText);
			}
		} catch (error) {
			notice.hide();
			new Notice('连接测试失败：' + error.message);
		}
	}
}