import { App, Plugin, PluginSettingTab, Setting, MarkdownView, Notice, Modal, ButtonComponent, TextAreaComponent, DropdownComponent, requestUrl } from 'obsidian';

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
	presetId?: string; // 使用的模型预设模板ID（可选）
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

// 智谱GLM模型预设模板配置
interface ZhipuModelPreset {
	id: string;
	name: string;
	modelId: string;
	maxTokens: number;
	temperature: number;
}

const ZHIPU_MODEL_PRESETS: ZhipuModelPreset[] = [
	{
		id: 'glm-4.6-standard',
		name: 'GLM-4.6 高质量（推荐）',
		modelId: 'glm-4.6',
		maxTokens: 3000,
		temperature: 0.7,
	},
	{
		id: 'glm-4.5-standard',
		name: 'GLM-4.5 通用',
		modelId: 'glm-4.5',
		maxTokens: 2000,
		temperature: 0.7,
	},
	{
		id: 'glm-4.5-air-lowcost',
		name: 'GLM-4.5-Air 低成本模板',
		modelId: 'glm-4.5-air',
		maxTokens: 1500,
		temperature: 0.6,
	},
];

// 基于智谱AI官方推荐的默认设置
const DEFAULT_SETTINGS: ContentDistributorSettings = {
	aiModels: [
		{
			name: 'GLM-4.6-官方模式',
			apiKey: '85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
			endpoint: 'https://open.bigmodel.cn/api/paas/v4',
			modelId: 'glm-4.6',
			maxTokens: 3000, // 官方推荐值
			temperature: 0.7,
			presetId: 'glm-4.6-standard',
			timeout: 30000, // 30秒超时
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'Obsidian-ContentDistributor/1.2.0'
			},
			useStream: false // 使用非流式响应，更稳定
		},
		{
			name: 'GLM-4.6-兼容模式',
			apiKey: '85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
			endpoint: 'https://open.bigmodel.cn/api/paas/v4',
			modelId: 'glm-4.6',
			maxTokens: 2000, // 保守值
			temperature: 0.5, // 较低的temperature更稳定
			presetId: 'glm-4.6-standard',
			timeout: 45000, // 45秒超时，更宽松
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer 85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
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

	// 基于BMO Chatbot的成功API调用模式 - 使用Obsidian内置requestUrl
	async callAIImproved(prompt: string): Promise<string> {
		try {
			// 使用BMO Chatbot相同的请求格式和Obsidian的requestUrl方法
			const response = await requestUrl({
				url: `${this.selectedModel.endpoint}/chat/completions`,
				method: 'POST',
				headers: {
					// 允许自定义请求头，但 Authorization 始终以当前配置的 apiKey 为准
					...(this.selectedModel.headers || {}),
					'Content-Type': 'application/json',
					'Authorization': 'Bearer 85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA'
				},
				body: JSON.stringify({
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
				}),
			});

			// BMO Chatbot格式的响应处理
			const data = response.json;

			if (response.status >= 400) {
				// 智谱API在429时既可能表示频率限制，也可能表示余额/资源包问题
				const errorInfo = (data && (data as any).error) || {};
				const errorCode = (errorInfo as any).code as string | undefined;
				const errorMessage = (errorInfo as any).message as string | undefined;

				if (response.status === 429) {
					// 智谱返回 code=1113 时，明确表示“余额不足或无可用资源包”
					if (errorCode === '1113' || (errorMessage && errorMessage.includes('余额不足'))) {
						throw new Error(
							`余额不足或未开通对应API资源包，请登录智谱AI控制台检查账户余额和GLM-4.6资源包配置（错误码: ${errorCode ?? '1113'}）。`
						);
					}
					throw new Error(
						`请求频率过高或受限，请稍后重试（HTTP状态码: ${response.status}，错误码: ${errorCode ?? '未知'}）。`
					);
				} else if (response.status === 401) {
					throw new Error(
						`API密钥无效或未配置，请在插件设置中检查密钥（HTTP状态码: ${response.status}，错误码: ${errorCode ?? '未知'}）。`
					);
				} else if (response.status === 403) {
					throw new Error(
						`API权限或配额不足，请检查是否开通对应模型权限（HTTP状态码: ${response.status}，错误码: ${errorCode ?? '未知'}）。`
					);
				} else {
					throw new Error(
						`API调用失败（HTTP状态码: ${response.status}，错误信息: ${errorMessage ?? '未知错误'}）。`
					);
				}
			}

			if (!data.choices || !data.choices[0] || !data.choices[0].message) {
				throw new Error('API返回格式异常');
			}

			return data.choices[0].message.content;

		} catch (error) {
			// BMO Chatbot风格的错误处理
			if (error.message.includes('Request was aborted.')) {
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

			// 模型显示名称配置
			new Setting(modelContainer)
				.setName('模型名称')
				.setDesc('用于在下拉列表中显示的名称，例如：GLM-4.6 高质量')
				.addText(text => text
					.setPlaceholder('请输入模型名称')
					.setValue(model.name)
					.onChange(async (value) => {
						this.plugin.settings.aiModels[index].name = value || model.name;
						await this.plugin.saveSettings();
					}));

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

			// 智谱GLM模型预设模板
			new Setting(modelContainer)
				.setName('模型模板')
				.setDesc('选择一个智谱GLM模型预设，一键应用推荐的 modelId / max_tokens / temperature')
				.addDropdown(dropdown => {
					dropdown.addOption('custom', '自定义配置');
					ZHIPU_MODEL_PRESETS.forEach(preset => {
						dropdown.addOption(preset.id, preset.name);
					});
					dropdown.setValue(model.presetId ?? 'custom');
					dropdown.onChange(async (value) => {
						const targetModel = this.plugin.settings.aiModels[index];

						if (value === 'custom') {
							targetModel.presetId = undefined;
						} else {
							const preset = ZHIPU_MODEL_PRESETS.find(p => p.id === value);
							if (preset) {
								targetModel.presetId = preset.id;
								targetModel.modelId = preset.modelId;
								targetModel.maxTokens = preset.maxTokens;
								targetModel.temperature = preset.temperature;
								// 若端点为空，自动补齐智谱官方端点
								if (!targetModel.endpoint) {
									targetModel.endpoint = 'https://open.bigmodel.cn/api/paas/v4';
								}
							}
						}

						await this.plugin.saveSettings();
						// 重新渲染设置界面以刷新展示
						this.display();
					});
				});

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
			// 使用BMO Chatbot相同的requestUrl方法进行连接测试
			const response = await requestUrl({
				url: `${model.endpoint}/models`,
				method: 'GET',
				headers: {
					// 自定义请求头优先，但 Authorization 始终与当前 apiKey 保持一致
					...(model.headers || {}),
					'Authorization': 'Bearer 85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA'
				}
			});

			notice.hide();

			if (response.status < 400) {
				new Notice('连接测试成功！');
			} else {
				new Notice('连接测试失败：' + response.status);
			}
		} catch (error) {
			notice.hide();
			new Notice('连接测试失败：' + error.message);
		}
	}
}
