import { App, Plugin, PluginSettingTab, Setting, MarkdownView, Notice, Modal } from 'obsidian';
import { APIClient, AIProvider, APIError } from './api-client';

// 基于第三方插件最佳实践的设置接口
interface ContentDistributorSettings {
	providers: AIProvider[];
	selectedProviderId: string;
	platforms: PlatformConfig[];
	autoCopy: boolean;
	showPreview: boolean;
}

// 平台配置
interface PlatformConfig {
	id: string;
	name: string;
	icon: string;
	promptTemplate: string;
	maxLength: number;
	supportsHashtags: boolean;
}

// 预定义的AI提供商配置
const DEFAULT_PROVIDERS: AIProvider[] = [
	{
		id: 'zhipu-glm45',
		name: '智谱GLM-4.5',
		baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
		model: 'glm-4.5',
		apiKey: '85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
		maxTokens: 3000,
		temperature: 0.7
	},
	{
		id: 'zhipu-glm46',
		name: '智谱GLM-4.6',
		baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
		model: 'glm-4.6',
		apiKey: '85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA',
		maxTokens: 4000,
		temperature: 0.7
	},
	{
		id: 'openai-gpt4',
		name: 'OpenAI GPT-4',
		baseUrl: 'https://api.openai.com/v1',
		model: 'gpt-4',
		apiKey: '', // 需要用户配置
		maxTokens: 3000,
		temperature: 0.7
	},
	{
		id: 'deepseek-chat',
		name: 'DeepSeek Chat',
		baseUrl: 'https://api.deepseek.com/v1',
		model: 'deepseek-chat',
		apiKey: '', // 需要用户配置
		maxTokens: 4000,
		temperature: 0.7
	}
];

// 默认设置
const DEFAULT_SETTINGS: ContentDistributorSettings = {
	providers: DEFAULT_PROVIDERS,
	selectedProviderId: 'zhipu-glm45', // 默认选择GLM-4.5
	platforms: [
		{
			id: 'xiaohongshu',
			name: '小红书',
			icon: '📱',
			promptTemplate: '请将以下内容转换为小红书风格文案：\n\n1. 使用吸引人的标题和表情符号\n2. 内容简洁明了，分段清晰\n3. 适当添加相关标签\n4. 语言要活泼有趣，贴近年轻人\n\n原文内容：\n{content}\n\n请生成符合小红书风格的文案：',
			maxLength: 1000,
			supportsHashtags: true
		},
		{
			id: 'jike',
			name: '即刻',
			icon: '💬',
			promptTemplate: '请将以下内容转换为即刻风格：\n\n1. 简洁明了，观点鲜明\n2. 适合短平快的表达\n3. 可以适当使用网络流行语\n4. 保持理性讨论的氛围\n\n原文内容：\n{content}\n\n请生成即刻风格的文案：',
			maxLength: 500,
			supportsHashtags: false
		},
		{
			id: 'twitter',
			name: 'X(Twitter)',
			icon: '🐦',
			promptTemplate: '请将以下内容转换为X/Twitter风格：\n\n1. 控制在280字符以内\n2. 使用简洁有力的语言\n3. 可以适当使用hashtag\n4. 考虑国际化表达\n\n原文内容：\n{content}\n\n请生成X/Twitter风格的文案：',
			maxLength: 280,
			supportsHashtags: false
		}
	],
	autoCopy: true,
	showPreview: true
};

/**
 * 基于第三方插件最佳实践的主插件类
 */
export default class ContentDistributorPlugin extends Plugin {
	settings: ContentDistributorSettings;
	apiClient: APIClient | null = null;

	async onload() {
		await this.loadSettings();
		this.initializeAPIClient();

		// 添加Ribbon图标
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
		this.apiClient = null;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.initializeAPIClient();
	}

	/**
	 * 初始化API客户端
	 */
	private initializeAPIClient() {
		const selectedProvider = this.settings.providers.find(p => p.id === this.settings.selectedProviderId);
		if (selectedProvider && selectedProvider.apiKey) {
			this.apiClient = new APIClient(selectedProvider);
		} else {
			this.apiClient = null;
		}
	}

	/**
	 * 获取当前API客户端
	 */
	getCurrentAPIClient(): APIClient | null {
		return this.apiClient;
	}

	/**
	 * 打开内容分发模态框
	 */
	openDistributorModal() {
		new ContentDistributorModal(this.app, this).open();
	}

	/**
	 * 测试当前提供商的连接
	 */
	async testCurrentConnection(): Promise<boolean> {
		const selectedProvider = this.settings.providers.find(p => p.id === this.settings.selectedProviderId);
		if (!selectedProvider || !selectedProvider.apiKey) {
			new Notice('请先配置API密钥');
			return false;
		}

		const client = new APIClient(selectedProvider);
		return await client.testConnection();
	}
}

/**
 * 设置选项卡 - 基于第三方插件的最佳实践
 */
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

		// AI提供商设置
		containerEl.createEl('h3', { text: 'AI模型设置' });

		new Setting(containerEl)
			.setName('AI提供商')
			.setDesc('选择要使用的AI模型提供商')
			.addDropdown(dropdown => {
				dropdown.addOptions(
					this.plugin.settings.providers.reduce((acc, provider) => {
						acc[provider.id] = provider.name;
						return acc;
					}, {} as Record<string, string>)
				);
				dropdown.setValue(this.plugin.settings.selectedProviderId);
				dropdown.onChange(async (value) => {
					this.plugin.settings.selectedProviderId = value;
					await this.plugin.saveSettings();
				});
			});

		// API密钥配置
		const selectedProvider = this.plugin.settings.providers.find(p => p.id === this.plugin.settings.selectedProviderId);
		if (selectedProvider) {
			new Setting(containerEl)
				.setName(`${selectedProvider.name} API密钥`)
				.setDesc('输入您的API密钥')
				.addText(text => text
					.setPlaceholder('输入API密钥')
					.setValue(selectedProvider.apiKey)
					.onChange(async (value) => {
						selectedProvider.apiKey = value;
						await this.plugin.saveSettings();
					}));
		}

		// 连接测试
		new Setting(containerEl)
			.setName('测试连接')
			.setDesc('测试当前AI提供商的连接状态')
			.addButton(button => button
				.setButtonText('测试连接')
				.onClick(async () => {
					button.setDisabled(true);
					button.setText('测试中...');

					const notice = new Notice('正在测试连接...', 0);

					try {
						const isConnected = await this.plugin.testCurrentConnection();
						notice.hide();

						if (isConnected) {
							new Notice('✅ 连接测试成功！');
						} else {
							new Notice('❌ 连接测试失败，请检查配置');
						}
					} catch (error) {
						notice.hide();
						if (error instanceof APIError) {
							new Notice(`❌ ${error.getUserMessage()}`);
						} else {
							new Notice(`❌ 测试失败: ${error.message}`);
						}
					} finally {
						button.setDisabled(false);
						button.setText('测试连接');
					}
				}));

		// 高级设置
		containerEl.createEl('h3', { text: '高级设置' });

		new Setting(containerEl)
			.setName('自动复制结果')
			.setDesc('转换成功后自动复制到剪贴板')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoCopy)
				.onChange(async (value) => {
					this.plugin.settings.autoCopy = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('显示预览')
			.setDesc('在转换前显示内容预览')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showPreview)
				.onChange(async (value) => {
					this.plugin.settings.showPreview = value;
					await this.plugin.saveSettings();
				}));
	}
}

/**
 * 内容分发模态框
 */
class ContentDistributorModal extends Modal {
	plugin: ContentDistributorPlugin;
	private contentInput: HTMLTextAreaElement;
	private platformSelect: HTMLSelectElement;
	private resultArea: HTMLDivElement;

	constructor(app: App, plugin: ContentDistributorPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: '🚀 内容分发助手' });

		// 输入区域
		contentEl.createEl('h3', { text: '输入内容' });
		this.contentInput = contentEl.createEl('textarea', {
			text: '',
			cls: 'content-input',
			attr: {
				placeholder: '请输入要转换的内容...',
				rows: '6',
				style: 'width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;'
			}
		});

		// 平台选择
		contentEl.createEl('h3', { text: '目标平台' });
		this.platformSelect = contentEl.createEl('select', {
			attr: {
				style: 'width: 100%; padding: 8px; margin-bottom: 15px;'
			}
		});

		this.plugin.settings.platforms.forEach(platform => {
			this.platformSelect.createEl('option', {
				value: platform.id,
				text: `${platform.icon} ${platform.name}`
			});
		});

		// 操作按钮
		const buttonContainer = contentEl.createDiv('button-container');
		buttonContainer.style.cssText = 'margin: 15px 0; text-align: center;';

		const convertButton = buttonContainer.createEl('button', {
			text: '🔄 开始转换',
			cls: 'mod-cta'
		});
		convertButton.style.cssText = 'margin-right: 10px; padding: 8px 16px;';

		const testButton = buttonContainer.createEl('button', {
			text: '🧪 测试连接',
			cls: ''
		});
		testButton.style.cssText = 'padding: 8px 16px;';

		// 结果区域
		contentEl.createEl('h3', { text: '转换结果' });
		this.resultArea = contentEl.createDiv('result-area');
		this.resultArea.style.cssText = 'border: 1px solid #ddd; border-radius: 4px; padding: 15px; min-height: 100px; background: #f9f9f9;';

		// 绑定事件
		convertButton.onclick = () => this.handleConvert();
		testButton.onclick = () => this.handleTest();
	}

	async handleConvert() {
		const content = this.contentInput.value.trim();
		if (!content) {
			new Notice('请输入要转换的内容');
			return;
		}

		const platformId = this.platformSelect.value;
		const platform = this.plugin.settings.platforms.find(p => p.id === platformId);
		if (!platform) {
			new Notice('请选择目标平台');
			return;
		}

		const client = this.plugin.getCurrentAPIClient();
		if (!client) {
			new Notice('请先配置AI提供商');
			return;
		}

		this.resultArea.innerHTML = '<p>🔄 正在转换中，请稍候...</p>';

		try {
			const prompt = platform.promptTemplate.replace('{content}', content);
			const result = await client.call(prompt);

			this.displayResult(result, platform);

			if (this.plugin.settings.autoCopy) {
				await navigator.clipboard.writeText(result);
				new Notice('✅ 结果已复制到剪贴板');
			}

		} catch (error) {
			if (error instanceof APIError) {
				this.resultArea.innerHTML = `<p style="color: red;">❌ ${error.getUserMessage()}</p>`;
			} else {
				this.resultArea.innerHTML = `<p style="color: red;">❌ 转换失败: ${error.message}</p>`;
			}
		}
	}

	async handleTest() {
		const client = this.plugin.getCurrentAPIClient();
		if (!client) {
			new Notice('请先配置AI提供商');
			return;
		}

		this.resultArea.innerHTML = '<p>🧪 正在测试连接...</p>';

		try {
			const isConnected = await client.testConnection();
			if (isConnected) {
				this.resultArea.innerHTML = '<p style="color: green;">✅ 连接测试成功！</p>';
			} else {
				this.resultArea.innerHTML = '<p style="color: red;">❌ 连接测试失败</p>';
			}
		} catch (error) {
			this.resultArea.innerHTML = `<p style="color: red;">❌ 测试失败: ${error.message}</p>`;
		}
	}

	displayResult(result: string, platform: PlatformConfig) {
		this.resultArea.innerHTML = `
			<div style="margin-bottom: 10px;">
				<strong>📱 ${platform.name}风格结果：</strong>
			</div>
			<textarea readonly style="width: 100%; min-height: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; resize: vertical;">${result}</textarea>
			<div style="margin-top: 10px; text-align: right;">
				<button onclick="navigator.clipboard.writeText('${result.replace(/'/g, "\\'").replace(/\n/g, "\\n")}').then(() => new Notice('已复制'))" style="padding: 6px 12px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">
					📋 复制结果
				</button>
			</div>
		`;
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}