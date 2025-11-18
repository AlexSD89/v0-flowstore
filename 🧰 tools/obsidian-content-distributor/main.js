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

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ContentDistributorPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  aiModels: [
    {
      name: "GLM-4.6",
      apiKey: "720ce7aeeca047e9aa2788c7f4346aea.BbkmxXWxYvhj7iEV",
      endpoint: "https://open.bigmodel.cn/api/paas/v4",
      modelId: "glm-4.6",
      maxTokens: 4e3,
      // 基于Claude Code官方推荐的token限制
      temperature: 0.7,
      requestInterval: 500,
      // 基于Claude Code集成方法的优化间隔
      maxRetries: 3
      // 基于官方推荐的重试次数
    },
    {
      name: "\u8C46\u5305-Seed-Code",
      apiKey: "",
      endpoint: "https://ark.cn-beijing.volces.com/api/v3",
      modelId: "ep-20241201113451-vj9cw",
      maxTokens: 2e3,
      temperature: 0.7,
      requestInterval: 2e3,
      maxRetries: 2
    },
    {
      name: "OpenAI GPT-4",
      apiKey: "",
      endpoint: "https://api.openai.com/v1",
      modelId: "gpt-4",
      maxTokens: 2e3,
      temperature: 0.7,
      requestInterval: 1e3,
      maxRetries: 3
    }
  ],
  selectedModelId: "GLM-4.6",
  platforms: [
    {
      id: "xiaohongshu",
      name: "\u5C0F\u7EA2\u4E66",
      icon: "\u{1F4F1}",
      promptTemplate: "\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u8F6C\u6362\u4E3A\u5C0F\u7EA2\u4E66\u98CE\u683C\u6587\u6848\uFF1A\n\n1. \u4F7F\u7528\u5438\u5F15\u4EBA\u7684\u6807\u9898\u548C\u8868\u60C5\u7B26\u53F7\n2. \u5185\u5BB9\u7B80\u6D01\u660E\u4E86\uFF0C\u5206\u6BB5\u6E05\u6670\n3. \u9002\u5F53\u6DFB\u52A0\u76F8\u5173\u6807\u7B7E\n4. \u8BED\u8A00\u8981\u6D3B\u6CFC\u6709\u8DA3\uFF0C\u8D34\u8FD1\u5E74\u8F7B\u4EBA\n\n\u539F\u6587\u5185\u5BB9\uFF1A\n{content}\n\n\u8BF7\u751F\u6210\u7B26\u5408\u5C0F\u7EA2\u4E66\u98CE\u683C\u7684\u6587\u6848\uFF1A",
      maxLength: 1e3,
      supportsHashtags: true,
      supportsImages: true
    },
    {
      id: "jike",
      name: "\u5373\u523B",
      icon: "\u{1F4AC}",
      promptTemplate: "\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u8F6C\u6362\u4E3A\u5373\u523B\u98CE\u683C\uFF1A\n\n1. \u7B80\u6D01\u660E\u4E86\uFF0C\u89C2\u70B9\u9C9C\u660E\n2. \u9002\u5408\u77ED\u5E73\u5FEB\u7684\u8868\u8FBE\n3. \u53EF\u4EE5\u9002\u5F53\u4F7F\u7528\u7F51\u7EDC\u6D41\u884C\u8BED\n4. \u4FDD\u6301\u7406\u6027\u8BA8\u8BBA\u7684\u6C1B\u56F4\n\n\u539F\u6587\u5185\u5BB9\uFF1A\n{content}\n\n\u8BF7\u751F\u6210\u5373\u523B\u98CE\u683C\u7684\u6587\u6848\uFF1A",
      maxLength: 500,
      supportsHashtags: false,
      supportsImages: false
    },
    {
      id: "x-twitter",
      name: "X(Twitter)",
      icon: "\u{1F426}",
      promptTemplate: "\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u8F6C\u6362\u4E3AX/Twitter\u98CE\u683C\uFF1A\n\n1. \u63A7\u5236\u5728280\u5B57\u7B26\u4EE5\u5185\n2. \u4F7F\u7528\u7B80\u6D01\u6709\u529B\u7684\u8BED\u8A00\n3. \u53EF\u4EE5\u9002\u5F53\u4F7F\u7528hashtag\n4. \u8003\u8651\u56FD\u9645\u5316\u8868\u8FBE\n\n\u539F\u6587\u5185\u5BB9\uFF1A\n{content}\n\n\u8BF7\u751F\u6210X/Twitter\u98CE\u683C\u7684\u6587\u6848\uFF1A",
      maxLength: 280,
      supportsHashtags: true,
      supportsImages: true
    },
    {
      id: "wechat",
      name: "\u5FAE\u4FE1\u516C\u4F17\u53F7",
      icon: "\u{1F4CA}",
      promptTemplate: "\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u4F18\u5316\u4E3A\u5FAE\u4FE1\u516C\u4F17\u53F7\u6587\u7AE0\uFF1A\n\n1. \u4FDD\u6301\u4E13\u4E1A\u6027\uFF0C\u4F46\u589E\u52A0\u53EF\u8BFB\u6027\n2. \u9002\u5F53\u6DFB\u52A0\u5C0F\u6807\u9898\u548C\u5206\u9694\n3. \u5F00\u5934\u8981\u6709\u5438\u5F15\u4EBA\u7684\u5BFC\u8BED\n4. \u7ED3\u5C3E\u8981\u6709\u603B\u7ED3\u6216\u547C\u5401\u884C\u52A8\n\n\u539F\u6587\u5185\u5BB9\uFF1A\n{content}\n\n\u8BF7\u4F18\u5316\u4E3A\u5FAE\u4FE1\u516C\u4F17\u53F7\u6587\u7AE0\uFF1A",
      maxLength: 5e3,
      supportsHashtags: false,
      supportsImages: true
    }
  ],
  defaultPlatform: "xiaohongshu",
  autoCopy: true,
  showPreview: true
};
var ContentDistributorModal = class extends import_obsidian.Modal {
  constructor(app, plugin, content) {
    super(app);
    // 添加请求时间记录和全局锁
    this.lastRequestTime = 0;
    this.plugin = plugin;
    this.originalContent = content;
    this.processedContent = "";
    this.selectedPlatform = plugin.settings.defaultPlatform;
    this.selectedModel = plugin.settings.aiModels.find((m) => m.name === plugin.settings.selectedModelId) || plugin.settings.aiModels[0];
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "\u667A\u80FD\u5185\u5BB9\u5206\u53D1\u52A9\u624B" });
    const originalSection = contentEl.createDiv();
    originalSection.createEl("h3", { text: "\u539F\u59CB\u5185\u5BB9" });
    const originalTextArea = new import_obsidian.TextAreaComponent(originalSection);
    originalTextArea.setValue(this.originalContent);
    originalTextArea.inputEl.rows = 8;
    originalTextArea.inputEl.style.width = "100%";
    originalTextArea.inputEl.style.marginBottom = "20px";
    const platformSection = contentEl.createDiv();
    platformSection.createEl("h3", { text: "\u9009\u62E9\u76EE\u6807\u5E73\u53F0" });
    const platformDropdown = new import_obsidian.DropdownComponent(platformSection);
    this.plugin.settings.platforms.forEach((platform) => {
      platformDropdown.addOption(platform.id, `${platform.icon} ${platform.name}`);
    });
    platformDropdown.setValue(this.selectedPlatform);
    platformDropdown.onChange(async (value) => {
      this.selectedPlatform = value;
    });
    const modelSection = contentEl.createDiv();
    modelSection.createEl("h3", { text: "\u9009\u62E9AI\u6A21\u578B" });
    const modelDropdown = new import_obsidian.DropdownComponent(modelSection);
    this.plugin.settings.aiModels.forEach((model) => {
      modelDropdown.addOption(model.name, model.name);
    });
    modelDropdown.setValue(this.selectedModel.name);
    modelDropdown.onChange(async (value) => {
      this.selectedModel = this.plugin.settings.aiModels.find((m) => m.name === value) || this.plugin.settings.aiModels[0];
    });
    const buttonContainer = contentEl.createDiv();
    buttonContainer.style.marginTop = "20px";
    buttonContainer.style.textAlign = "center";
    const processButton = new import_obsidian.ButtonComponent(buttonContainer);
    processButton.setButtonText("\u{1F680} \u5F00\u59CB\u8F6C\u6362");
    processButton.setCta();
    processButton.onClick(() => {
      this.processContent();
    });
    const resultSection = contentEl.createDiv();
    resultSection.createEl("h3", { text: "\u8F6C\u6362\u7ED3\u679C" });
    this.resultTextArea = new import_obsidian.TextAreaComponent(resultSection);
    this.resultTextArea.setValue("");
    this.resultTextArea.inputEl.rows = 10;
    this.resultTextArea.inputEl.style.width = "100%";
    this.resultTextArea.inputEl.style.marginBottom = "20px";
    const actionContainer = contentEl.createDiv();
    actionContainer.style.textAlign = "center";
    const copyButton = new import_obsidian.ButtonComponent(actionContainer);
    copyButton.setButtonText("\u{1F4CB} \u590D\u5236\u5185\u5BB9");
    copyButton.onClick(() => {
      this.copyToClipboard();
    });
    const regenerateButton = new import_obsidian.ButtonComponent(actionContainer);
    regenerateButton.setButtonText("\u{1F504} \u91CD\u65B0\u751F\u6210");
    regenerateButton.onClick(() => {
      this.processContent();
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
  async processContent() {
    if (!this.selectedModel.apiKey) {
      new import_obsidian.Notice("\u8BF7\u5148\u5728\u8BBE\u7F6E\u4E2D\u914D\u7F6EAI\u6A21\u578B\u7684API\u5BC6\u94A5");
      return;
    }
    const platform = this.plugin.settings.platforms.find((p) => p.id === this.selectedPlatform);
    if (!platform)
      return;
    const notice = new import_obsidian.Notice("\u6B63\u5728\u5904\u7406\u5185\u5BB9...", 0);
    try {
      const prompt = platform.promptTemplate.replace("{content}", this.originalContent);
      this.processedContent = await this.callAI(prompt);
      if (this.resultTextArea) {
        this.resultTextArea.setValue(this.processedContent);
      }
      if (this.plugin.settings.autoCopy) {
        await this.copyToClipboard();
      }
      notice.hide();
      new import_obsidian.Notice("\u5185\u5BB9\u8F6C\u6362\u5B8C\u6210\uFF01");
    } catch (error) {
      notice.hide();
      new import_obsidian.Notice("\u5904\u7406\u5931\u8D25\uFF1A" + error.message);
      console.error("Content processing error:", error);
    }
  }
  async callAI(prompt) {
    const maxRetries = this.selectedModel.maxRetries || 3;
    const baseDelay = 1e3;
    const requestInterval = this.selectedModel.requestInterval || 500;
    const now = Date.now();
    if (this.lastRequestTime) {
      const timeSinceLastRequest = now - this.lastRequestTime;
      const minInterval = requestInterval;
      if (timeSinceLastRequest < minInterval) {
        const waitTime = minInterval - timeSinceLastRequest;
        new import_obsidian.Notice(`\u667A\u8C31AI\u8BF7\u6C42\u95F4\u9694\u63A7\u5236\uFF0C\u7B49\u5F85${Math.ceil(waitTime / 1e3)}\u79D2...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
    if (ContentDistributorPlugin.isProcessingRequest) {
      new import_obsidian.Notice("\u6B63\u5728\u5904\u7406\u5176\u4ED6\u8BF7\u6C42\uFF0C\u8BF7\u7A0D\u5019...");
      while (ContentDistributorPlugin.isProcessingRequest) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    ContentDistributorPlugin.isProcessingRequest = true;
    try {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const optimizedPrompt = prompt.length > 800 ? prompt.substring(0, 800) + "..." : prompt;
          const requestBody = {
            model: this.selectedModel.modelId,
            messages: [
              {
                role: "user",
                content: optimizedPrompt
              }
            ],
            // 智谱AI免费套餐优化：严格控制token消耗
            max_tokens: Math.min(this.selectedModel.maxTokens, 800),
            // 严格控制输出长度
            temperature: 0.7,
            stream: false
          };
          const response = await fetch(`${this.selectedModel.endpoint}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.selectedModel.apiKey}`,
              "User-Agent": "Obsidian-ContentDistributor/1.0.0"
            },
            body: JSON.stringify(requestBody)
          });
          this.lastRequestTime = Date.now();
          if (!response.ok) {
            if (response.status === 429) {
              if (attempt < maxRetries) {
                const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 8e3);
                new import_obsidian.Notice(`\u667A\u8C31AI\u8BF7\u6C42\u9891\u7387\u9650\u5236\uFF0C${delay / 1e3}\u79D2\u540E\u91CD\u8BD5 (${attempt}/${maxRetries})...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
              } else {
                throw new Error(`\u667A\u8C31AI\u8BF7\u6C42\u9891\u7387\u9650\u5236\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002\u72B6\u6001\u7801: ${response.status}`);
              }
            }
            if (response.status === 401) {
              throw new Error(`API\u5BC6\u94A5\u65E0\u6548\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E\u3002\u72B6\u6001\u7801: ${response.status}`);
            }
            if (response.status === 403) {
              throw new Error(`API\u914D\u989D\u4E0D\u8DB3\uFF0C\u8BF7\u68C0\u67E5\u8D26\u6237\u4F59\u989D\u3002\u72B6\u6001\u7801: ${response.status}`);
            }
            throw new Error(`GLM-4.6 API\u8C03\u7528\u5931\u8D25: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error("API\u8FD4\u56DE\u683C\u5F0F\u5F02\u5E38");
          }
          return data.choices[0].message.content;
        } catch (error) {
          if (attempt === maxRetries) {
            throw error;
          }
          if (error.name === "TypeError" || error.message.includes("fetch")) {
            const networkDelay = 5e3;
            new import_obsidian.Notice(`\u7F51\u7EDC\u9519\u8BEF\uFF0C${networkDelay / 1e3}\u79D2\u540E\u91CD\u8BD5 (${attempt}/${maxRetries})...`);
            await new Promise((resolve) => setTimeout(resolve, networkDelay));
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      throw error;
    } finally {
      ContentDistributorPlugin.isProcessingRequest = false;
    }
    throw new Error("API\u8C03\u7528\u5931\u8D25\uFF0C\u5DF2\u8FBE\u5230\u6700\u5927\u91CD\u8BD5\u6B21\u6570");
  }
  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.processedContent);
      new import_obsidian.Notice("\u5185\u5BB9\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F");
    } catch (error) {
      new import_obsidian.Notice("\u590D\u5236\u5931\u8D25\uFF1A" + error.message);
    }
  }
};
ContentDistributorModal.isProcessingRequest = false;
var ContentDistributorPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    const ribbonIconEl = this.addRibbonIcon("send", "\u5185\u5BB9\u5206\u53D1\u52A9\u624B", (evt) => {
      this.openContentDistributor();
    });
    ribbonIconEl.addClass("obsidian-content-distributor-ribbon");
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText("\u5185\u5BB9\u5206\u53D1\u52A9\u624B");
    statusBarItemEl.onClickEvent(() => {
      this.openContentDistributor();
    });
    this.addCommand({
      id: "open-content-distributor",
      name: "\u6253\u5F00\u5185\u5BB9\u5206\u53D1\u52A9\u624B",
      callback: () => {
        this.openContentDistributor();
      }
    });
    this.addCommand({
      id: "distribute-current-note",
      name: "\u5206\u53D1\u5F53\u524D\u7B14\u8BB0",
      editorCallback: (editor, view) => {
        const content = editor.getValue();
        this.distributeContent(content);
      }
    });
    this.addCommand({
      id: "distribute-selected-text",
      name: "\u5206\u53D1\u9009\u4E2D\u6587\u672C",
      editorCallback: (editor, view) => {
        const selectedText = editor.getSelection();
        if (selectedText) {
          this.distributeContent(selectedText);
        } else {
          new import_obsidian.Notice("\u8BF7\u5148\u9009\u62E9\u8981\u5206\u53D1\u7684\u6587\u672C");
        }
      }
    });
    this.addSettingTab(new ContentDistributorSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  openContentDistributor() {
    const activeView = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    let content = "";
    if (activeView) {
      const editor = activeView.editor;
      const selectedText = editor.getSelection();
      content = selectedText || editor.getValue();
    }
    new ContentDistributorModal(this.app, this, content).open();
  }
  distributeContent(content) {
    new ContentDistributorModal(this.app, this, content).open();
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
    containerEl.createEl("h3", { text: "AI\u6A21\u578B\u914D\u7F6E" });
    this.plugin.settings.aiModels.forEach((model, index) => {
      const modelContainer = containerEl.createDiv();
      modelContainer.style.marginBottom = "20px";
      modelContainer.style.padding = "10px";
      modelContainer.style.border = "1px solid #ccc";
      modelContainer.style.borderRadius = "5px";
      modelContainer.createEl("h4", { text: model.name });
      new import_obsidian.Setting(modelContainer).setName("API\u5BC6\u94A5").setDesc("\u8F93\u5165AI\u6A21\u578B\u7684API\u5BC6\u94A5").addText((text) => text.setPlaceholder("\u8F93\u5165API\u5BC6\u94A5").setValue(model.apiKey).onChange(async (value) => {
        this.plugin.settings.aiModels[index].apiKey = value;
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(modelContainer).setName("\u7AEF\u70B9").setDesc("API\u7AEF\u70B9\u5730\u5740").addText((text) => text.setPlaceholder("https://api.example.com/v1").setValue(model.endpoint).onChange(async (value) => {
        this.plugin.settings.aiModels[index].endpoint = value;
        await this.plugin.saveSettings();
      }));
      const testButton = new import_obsidian.ButtonComponent(modelContainer);
      testButton.setButtonText("\u6D4B\u8BD5\u8FDE\u63A5");
      testButton.onClick(() => {
        this.testModelConnection(model);
      });
    });
    containerEl.createEl("h3", { text: "\u5E73\u53F0\u914D\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("\u9ED8\u8BA4\u5E73\u53F0").setDesc("\u9009\u62E9\u9ED8\u8BA4\u7684\u5185\u5BB9\u5206\u53D1\u5E73\u53F0").addDropdown((dropdown) => {
      this.plugin.settings.platforms.forEach((platform) => {
        dropdown.addOption(platform.id, `${platform.icon} ${platform.name}`);
      });
      dropdown.setValue(this.plugin.settings.defaultPlatform).onChange(async (value) => {
        this.plugin.settings.defaultPlatform = value;
        await this.plugin.saveSettings();
      });
    });
    containerEl.createEl("h3", { text: "\u901A\u7528\u8BBE\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("\u81EA\u52A8\u590D\u5236").setDesc("\u5904\u7406\u5B8C\u6210\u540E\u81EA\u52A8\u590D\u5236\u5230\u526A\u8D34\u677F").addToggle((toggle) => toggle.setValue(this.plugin.settings.autoCopy).onChange(async (value) => {
      this.plugin.settings.autoCopy = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("\u663E\u793A\u9884\u89C8").setDesc("\u5904\u7406\u5B8C\u6210\u540E\u663E\u793A\u9884\u89C8").addToggle((toggle) => toggle.setValue(this.plugin.settings.showPreview).onChange(async (value) => {
      this.plugin.settings.showPreview = value;
      await this.plugin.saveSettings();
    }));
  }
  async testModelConnection(model) {
    if (!model.apiKey) {
      new import_obsidian.Notice("\u8BF7\u5148\u914D\u7F6EAPI\u5BC6\u94A5");
      return;
    }
    const notice = new import_obsidian.Notice("\u6B63\u5728\u6D4B\u8BD5\u8FDE\u63A5...", 0);
    try {
      const response = await fetch(`${model.endpoint}/models`, {
        headers: {
          "Authorization": `Bearer ${model.apiKey}`
        }
      });
      notice.hide();
      if (response.ok) {
        new import_obsidian.Notice("\u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F\uFF01");
      } else {
        new import_obsidian.Notice("\u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25\uFF1A" + response.statusText);
      }
    } catch (error) {
      notice.hide();
      new import_obsidian.Notice("\u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25\uFF1A" + error.message);
    }
  }
};
