var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main-best-practice.ts
var main_best_practice_exports = {};
__export(main_best_practice_exports, {
  default: () => ContentDistributorPlugin
});
module.exports = __toCommonJS(main_best_practice_exports);
var import_obsidian = require("obsidian");
var import_api_client = require("./api-client.ts");
var DEFAULT_PROVIDERS = [
  {
    id: "zhipu-glm45",
    name: "\u667A\u8C31GLM-4.5",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4.5",
    apiKey: "85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA",
    maxTokens: 3e3,
    temperature: 0.7
  },
  {
    id: "zhipu-glm46",
    name: "\u667A\u8C31GLM-4.6",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4.6",
    apiKey: "85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA",
    maxTokens: 4e3,
    temperature: 0.7
  },
  {
    id: "openai-gpt4",
    name: "OpenAI GPT-4",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4",
    apiKey: "",
    // 需要用户配置
    maxTokens: 3e3,
    temperature: 0.7
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    apiKey: "",
    // 需要用户配置
    maxTokens: 4e3,
    temperature: 0.7
  }
];
var DEFAULT_SETTINGS = {
  providers: DEFAULT_PROVIDERS,
  selectedProviderId: "zhipu-glm45",
  // 默认选择GLM-4.5
  platforms: [
    {
      id: "xiaohongshu",
      name: "\u5C0F\u7EA2\u4E66",
      icon: "\u{1F4F1}",
      promptTemplate: "\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u8F6C\u6362\u4E3A\u5C0F\u7EA2\u4E66\u98CE\u683C\u6587\u6848\uFF1A\n\n1. \u4F7F\u7528\u5438\u5F15\u4EBA\u7684\u6807\u9898\u548C\u8868\u60C5\u7B26\u53F7\n2. \u5185\u5BB9\u7B80\u6D01\u660E\u4E86\uFF0C\u5206\u6BB5\u6E05\u6670\n3. \u9002\u5F53\u6DFB\u52A0\u76F8\u5173\u6807\u7B7E\n4. \u8BED\u8A00\u8981\u6D3B\u6CFC\u6709\u8DA3\uFF0C\u8D34\u8FD1\u5E74\u8F7B\u4EBA\n\n\u539F\u6587\u5185\u5BB9\uFF1A\n{content}\n\n\u8BF7\u751F\u6210\u7B26\u5408\u5C0F\u7EA2\u4E66\u98CE\u683C\u7684\u6587\u6848\uFF1A",
      maxLength: 1e3,
      supportsHashtags: true
    },
    {
      id: "jike",
      name: "\u5373\u523B",
      icon: "\u{1F4AC}",
      promptTemplate: "\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u8F6C\u6362\u4E3A\u5373\u523B\u98CE\u683C\uFF1A\n\n1. \u7B80\u6D01\u660E\u4E86\uFF0C\u89C2\u70B9\u9C9C\u660E\n2. \u9002\u5408\u77ED\u5E73\u5FEB\u7684\u8868\u8FBE\n3. \u53EF\u4EE5\u9002\u5F53\u4F7F\u7528\u7F51\u7EDC\u6D41\u884C\u8BED\n4. \u4FDD\u6301\u7406\u6027\u8BA8\u8BBA\u7684\u6C1B\u56F4\n\n\u539F\u6587\u5185\u5BB9\uFF1A\n{content}\n\n\u8BF7\u751F\u6210\u5373\u523B\u98CE\u683C\u7684\u6587\u6848\uFF1A",
      maxLength: 500,
      supportsHashtags: false
    },
    {
      id: "twitter",
      name: "X(Twitter)",
      icon: "\u{1F426}",
      promptTemplate: "\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u8F6C\u6362\u4E3AX/Twitter\u98CE\u683C\uFF1A\n\n1. \u63A7\u5236\u5728280\u5B57\u7B26\u4EE5\u5185\n2. \u4F7F\u7528\u7B80\u6D01\u6709\u529B\u7684\u8BED\u8A00\n3. \u53EF\u4EE5\u9002\u5F53\u4F7F\u7528hashtag\n4. \u8003\u8651\u56FD\u9645\u5316\u8868\u8FBE\n\n\u539F\u6587\u5185\u5BB9\uFF1A\n{content}\n\n\u8BF7\u751F\u6210X/Twitter\u98CE\u683C\u7684\u6587\u6848\uFF1A",
      maxLength: 280,
      supportsHashtags: false
    }
  ],
  autoCopy: true,
  showPreview: true
};
var ContentDistributorPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.apiClient = null;
  }
  async onload() {
    await this.loadSettings();
    this.initializeAPIClient();
    this.addRibbonIcon("send", "\u5185\u5BB9\u5206\u53D1\u52A9\u624B", () => {
      this.openDistributorModal();
    });
    this.addCommand({
      id: "open-content-distributor",
      name: "\u6253\u5F00\u5185\u5BB9\u5206\u53D1\u52A9\u624B",
      callback: () => {
        this.openDistributorModal();
      }
    });
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
  initializeAPIClient() {
    const selectedProvider = this.settings.providers.find((p) => p.id === this.settings.selectedProviderId);
    if (selectedProvider && selectedProvider.apiKey) {
      this.apiClient = new import_api_client.APIClient(selectedProvider);
    } else {
      this.apiClient = null;
    }
  }
  /**
   * 获取当前API客户端
   */
  getCurrentAPIClient() {
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
  async testCurrentConnection() {
    const selectedProvider = this.settings.providers.find((p) => p.id === this.settings.selectedProviderId);
    if (!selectedProvider || !selectedProvider.apiKey) {
      new import_obsidian.Notice("\u8BF7\u5148\u914D\u7F6EAPI\u5BC6\u94A5");
      return false;
    }
    const client = new import_api_client.APIClient(selectedProvider);
    return await client.testConnection();
  }
};
var ContentDistributorSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "\u5185\u5BB9\u5206\u53D1\u52A9\u624B\u8BBE\u7F6E" });
    containerEl.createEl("h3", { text: "AI\u6A21\u578B\u8BBE\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("AI\u63D0\u4F9B\u5546").setDesc("\u9009\u62E9\u8981\u4F7F\u7528\u7684AI\u6A21\u578B\u63D0\u4F9B\u5546").addDropdown((dropdown) => {
      dropdown.addOptions(
        this.plugin.settings.providers.reduce((acc, provider) => {
          acc[provider.id] = provider.name;
          return acc;
        }, {})
      );
      dropdown.setValue(this.plugin.settings.selectedProviderId);
      dropdown.onChange(async (value) => {
        this.plugin.settings.selectedProviderId = value;
        await this.plugin.saveSettings();
      });
    });
    const selectedProvider = this.plugin.settings.providers.find((p) => p.id === this.plugin.settings.selectedProviderId);
    if (selectedProvider) {
      new import_obsidian.Setting(containerEl).setName(`${selectedProvider.name} API\u5BC6\u94A5`).setDesc("\u8F93\u5165\u60A8\u7684API\u5BC6\u94A5").addText((text) => text.setPlaceholder("\u8F93\u5165API\u5BC6\u94A5").setValue(selectedProvider.apiKey).onChange(async (value) => {
        selectedProvider.apiKey = value;
        await this.plugin.saveSettings();
      }));
    }
    new import_obsidian.Setting(containerEl).setName("\u6D4B\u8BD5\u8FDE\u63A5").setDesc("\u6D4B\u8BD5\u5F53\u524DAI\u63D0\u4F9B\u5546\u7684\u8FDE\u63A5\u72B6\u6001").addButton((button) => button.setButtonText("\u6D4B\u8BD5\u8FDE\u63A5").onClick(async () => {
      button.setDisabled(true);
      button.setText("\u6D4B\u8BD5\u4E2D...");
      const notice = new import_obsidian.Notice("\u6B63\u5728\u6D4B\u8BD5\u8FDE\u63A5...", 0);
      try {
        const isConnected = await this.plugin.testCurrentConnection();
        notice.hide();
        if (isConnected) {
          new import_obsidian.Notice("\u2705 \u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F\uFF01");
        } else {
          new import_obsidian.Notice("\u274C \u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E");
        }
      } catch (error) {
        notice.hide();
        if (error instanceof import_api_client.APIError) {
          new import_obsidian.Notice(`\u274C ${error.getUserMessage()}`);
        } else {
          new import_obsidian.Notice(`\u274C \u6D4B\u8BD5\u5931\u8D25: ${error.message}`);
        }
      } finally {
        button.setDisabled(false);
        button.setText("\u6D4B\u8BD5\u8FDE\u63A5");
      }
    }));
    containerEl.createEl("h3", { text: "\u9AD8\u7EA7\u8BBE\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("\u81EA\u52A8\u590D\u5236\u7ED3\u679C").setDesc("\u8F6C\u6362\u6210\u529F\u540E\u81EA\u52A8\u590D\u5236\u5230\u526A\u8D34\u677F").addToggle((toggle) => toggle.setValue(this.plugin.settings.autoCopy).onChange(async (value) => {
      this.plugin.settings.autoCopy = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("\u663E\u793A\u9884\u89C8").setDesc("\u5728\u8F6C\u6362\u524D\u663E\u793A\u5185\u5BB9\u9884\u89C8").addToggle((toggle) => toggle.setValue(this.plugin.settings.showPreview).onChange(async (value) => {
      this.plugin.settings.showPreview = value;
      await this.plugin.saveSettings();
    }));
  }
};
var ContentDistributorModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "\u{1F680} \u5185\u5BB9\u5206\u53D1\u52A9\u624B" });
    contentEl.createEl("h3", { text: "\u8F93\u5165\u5185\u5BB9" });
    this.contentInput = contentEl.createEl("textarea", {
      text: "",
      cls: "content-input",
      attr: {
        placeholder: "\u8BF7\u8F93\u5165\u8981\u8F6C\u6362\u7684\u5185\u5BB9...",
        rows: "6",
        style: "width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;"
      }
    });
    contentEl.createEl("h3", { text: "\u76EE\u6807\u5E73\u53F0" });
    this.platformSelect = contentEl.createEl("select", {
      attr: {
        style: "width: 100%; padding: 8px; margin-bottom: 15px;"
      }
    });
    this.plugin.settings.platforms.forEach((platform) => {
      this.platformSelect.createEl("option", {
        value: platform.id,
        text: `${platform.icon} ${platform.name}`
      });
    });
    const buttonContainer = contentEl.createDiv("button-container");
    buttonContainer.style.cssText = "margin: 15px 0; text-align: center;";
    const convertButton = buttonContainer.createEl("button", {
      text: "\u{1F504} \u5F00\u59CB\u8F6C\u6362",
      cls: "mod-cta"
    });
    convertButton.style.cssText = "margin-right: 10px; padding: 8px 16px;";
    const testButton = buttonContainer.createEl("button", {
      text: "\u{1F9EA} \u6D4B\u8BD5\u8FDE\u63A5",
      cls: ""
    });
    testButton.style.cssText = "padding: 8px 16px;";
    contentEl.createEl("h3", { text: "\u8F6C\u6362\u7ED3\u679C" });
    this.resultArea = contentEl.createDiv("result-area");
    this.resultArea.style.cssText = "border: 1px solid #ddd; border-radius: 4px; padding: 15px; min-height: 100px; background: #f9f9f9;";
    convertButton.onclick = () => this.handleConvert();
    testButton.onclick = () => this.handleTest();
  }
  async handleConvert() {
    const content = this.contentInput.value.trim();
    if (!content) {
      new import_obsidian.Notice("\u8BF7\u8F93\u5165\u8981\u8F6C\u6362\u7684\u5185\u5BB9");
      return;
    }
    const platformId = this.platformSelect.value;
    const platform = this.plugin.settings.platforms.find((p) => p.id === platformId);
    if (!platform) {
      new import_obsidian.Notice("\u8BF7\u9009\u62E9\u76EE\u6807\u5E73\u53F0");
      return;
    }
    const client = this.plugin.getCurrentAPIClient();
    if (!client) {
      new import_obsidian.Notice("\u8BF7\u5148\u914D\u7F6EAI\u63D0\u4F9B\u5546");
      return;
    }
    this.resultArea.innerHTML = "<p>\u{1F504} \u6B63\u5728\u8F6C\u6362\u4E2D\uFF0C\u8BF7\u7A0D\u5019...</p>";
    try {
      const prompt = platform.promptTemplate.replace("{content}", content);
      const result = await client.call(prompt);
      this.displayResult(result, platform);
      if (this.plugin.settings.autoCopy) {
        await navigator.clipboard.writeText(result);
        new import_obsidian.Notice("\u2705 \u7ED3\u679C\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F");
      }
    } catch (error) {
      if (error instanceof import_api_client.APIError) {
        this.resultArea.innerHTML = `<p style="color: red;">\u274C ${error.getUserMessage()}</p>`;
      } else {
        this.resultArea.innerHTML = `<p style="color: red;">\u274C \u8F6C\u6362\u5931\u8D25: ${error.message}</p>`;
      }
    }
  }
  async handleTest() {
    const client = this.plugin.getCurrentAPIClient();
    if (!client) {
      new import_obsidian.Notice("\u8BF7\u5148\u914D\u7F6EAI\u63D0\u4F9B\u5546");
      return;
    }
    this.resultArea.innerHTML = "<p>\u{1F9EA} \u6B63\u5728\u6D4B\u8BD5\u8FDE\u63A5...</p>";
    try {
      const isConnected = await client.testConnection();
      if (isConnected) {
        this.resultArea.innerHTML = '<p style="color: green;">\u2705 \u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F\uFF01</p>';
      } else {
        this.resultArea.innerHTML = '<p style="color: red;">\u274C \u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25</p>';
      }
    } catch (error) {
      this.resultArea.innerHTML = `<p style="color: red;">\u274C \u6D4B\u8BD5\u5931\u8D25: ${error.message}</p>`;
    }
  }
  displayResult(result, platform) {
    this.resultArea.innerHTML = `
			<div style="margin-bottom: 10px;">
				<strong>\u{1F4F1} ${platform.name}\u98CE\u683C\u7ED3\u679C\uFF1A</strong>
			</div>
			<textarea readonly style="width: 100%; min-height: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; resize: vertical;">${result}</textarea>
			<div style="margin-top: 10px; text-align: right;">
				<button onclick="navigator.clipboard.writeText('${result.replace(/'/g, "\\'").replace(/\n/g, "\\n")}').then(() => new Notice('\u5DF2\u590D\u5236'))" style="padding: 6px 12px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">
					\u{1F4CB} \u590D\u5236\u7ED3\u679C
				</button>
			</div>
		`;
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};
