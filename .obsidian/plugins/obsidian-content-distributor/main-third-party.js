/*
THIRD-PARTY STYLE IMPLEMENTATION
Based on successful Obsidian AI plugins patterns
*/
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

// main-third-party-style.ts
var main_third_party_style_exports = {};
__export(main_third_party_style_exports, {
  default: () => ContentDistributorPlugin
});
module.exports = __toCommonJS(main_third_party_style_exports);
var import_obsidian = require("obsidian");
var SIMPLE_DEFAULTS = {
  aiConfig: {
    name: "\u667A\u8C31GLM-4",
    provider: "zhipu",
    apiKey: "85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4",
    maxTokens: 2e3,
    temperature: 0.7
  },
  platforms: ["xiaohongshu", "jike", "twitter"],
  autoCopy: true
};
var ThirdPartyAPIClient = class {
  constructor(config) {
    this.config = config;
  }
  // 第三方插件通常使用requestUrl而不是fetch
  async callAPI(prompt) {
    var _a, _b;
    const requestBody = this.buildRequestBody(prompt);
    try {
      const response = await requestUrl({
        url: `${this.config.baseUrl}/chat/completions`,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "Obsidian-ContentDistributor/1.0"
        },
        body: JSON.stringify(requestBody),
        throw: true
      });
      if (response.status === 200) {
        const result = response.json;
        return ((_b = (_a = result.choices[0]) == null ? void 0 : _a.message) == null ? void 0 : _b.content) || "\u751F\u6210\u5931\u8D25";
      } else {
        throw new Error(`API\u8C03\u7528\u5931\u8D25: ${response.status}`);
      }
    } catch (error) {
      console.error("API\u8C03\u7528\u9519\u8BEF:", error);
      throw this.handleError(error);
    }
  }
  // 第三方插件常见的请求体构建
  buildRequestBody(prompt) {
    switch (this.config.provider) {
      case "zhipu":
        return {
          model: this.config.model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          stream: false
        };
      case "openai":
        return {
          model: this.config.model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        };
      default:
        throw new Error(`\u4E0D\u652F\u6301\u7684\u63D0\u4F9B\u5546: ${this.config.provider}`);
    }
  }
  // 第三方插件常见的错误处理
  handleError(error) {
    if (error.status === 429) {
      return new Error("\u8BF7\u6C42\u9891\u7387\u8FC7\u9AD8\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
    } else if (error.status === 401) {
      return new Error("API\u5BC6\u94A5\u65E0\u6548\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E");
    } else if (error.status === 403) {
      return new Error("API\u8BBF\u95EE\u88AB\u62D2\u7EDD\uFF0C\u8BF7\u68C0\u67E5\u6743\u9650");
    } else {
      return new Error(`API\u8C03\u7528\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`);
    }
  }
  // 第三方插件常见的连接测试
  async testConnection() {
    try {
      const response = await requestUrl({
        url: `${this.config.baseUrl}/models`,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.config.apiKey}`
        },
        throw: true
      });
      return response.status === 200;
    } catch (error) {
      console.error("\u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25:", error);
      return false;
    }
  }
};
var ContentDistributorPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.apiClient = new ThirdPartyAPIClient(this.settings.aiConfig);
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
  }
  async loadSettings() {
    this.settings = Object.assign({}, SIMPLE_DEFAULTS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.apiClient = new ThirdPartyAPIClient(this.settings.aiConfig);
  }
  openDistributorModal() {
    new ContentDistributorModal(this.app, this.settings, this.apiClient).open();
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
    new import_obsidian.Setting(containerEl).setName("API\u5BC6\u94A5").setDesc("\u667A\u8C31AI\u7684API\u5BC6\u94A5").addText((text) => text.setPlaceholder("\u8F93\u5165API\u5BC6\u94A5").setValue(this.plugin.settings.aiConfig.apiKey).onChange(async (value) => {
      this.plugin.settings.aiConfig.apiKey = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("\u6A21\u578B").setDesc("\u9009\u62E9\u8981\u4F7F\u7528\u7684\u6A21\u578B").addDropdown((dropdown) => dropdown.addOption("glm-4", "GLM-4").addOption("glm-3-turbo", "GLM-3 Turbo").setValue(this.plugin.settings.aiConfig.model).onChange(async (value) => {
      this.plugin.settings.aiConfig.model = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("\u8FDE\u63A5\u6D4B\u8BD5").setDesc("\u6D4B\u8BD5API\u8FDE\u63A5\u662F\u5426\u6B63\u5E38").addButton((button) => button.setButtonText("\u6D4B\u8BD5\u8FDE\u63A5").onClick(async () => {
      const notice = new import_obsidian.Notice("\u6B63\u5728\u6D4B\u8BD5\u8FDE\u63A5...", 0);
      try {
        const isConnected = await this.plugin.apiClient.testConnection();
        notice.hide();
        if (isConnected) {
          new import_obsidian.Notice("\u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F\uFF01");
        } else {
          new import_obsidian.Notice("\u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E");
        }
      } catch (error) {
        notice.hide();
        new import_obsidian.Notice(`\u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25: ${error.message}`);
      }
    }));
  }
};
var ContentDistributorModal = class extends import_obsidian.Modal {
  constructor(app, settings, apiClient) {
    super(app);
    this.settings = settings;
    this.apiClient = apiClient;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "\u5185\u5BB9\u5206\u53D1\u52A9\u624B" });
    const inputArea = contentEl.createEl("textarea", {
      text: "\u8BF7\u8F93\u5165\u8981\u8F6C\u6362\u7684\u5185\u5BB9...",
      cls: "content-input"
    });
    const platformSelect = contentEl.createEl("select");
    platformSelect.createEl("option", { value: "xiaohongshu", text: "\u5C0F\u7EA2\u4E66" });
    platformSelect.createEl("option", { value: "jike", text: "\u5373\u523B" });
    platformSelect.createEl("option", { value: "twitter", text: "Twitter" });
    const convertButton = contentEl.createEl("button", {
      text: "\u5F00\u59CB\u8F6C\u6362",
      cls: "mod-cta"
    });
    convertButton.onclick = async () => {
      const content = inputArea.value;
      const platform = platformSelect.value;
      if (!content.trim()) {
        new import_obsidian.Notice("\u8BF7\u8F93\u5165\u5185\u5BB9");
        return;
      }
      try {
        convertButton.textContent = "\u8F6C\u6362\u4E2D...";
        convertButton.disabled = true;
        const prompt = this.buildPrompt(content, platform);
        const result = await this.apiClient.callAPI(prompt);
        this.showResult(result);
      } catch (error) {
        new import_obsidian.Notice(`\u8F6C\u6362\u5931\u8D25: ${error.message}`);
      } finally {
        convertButton.textContent = "\u5F00\u59CB\u8F6C\u6362";
        convertButton.disabled = false;
      }
    };
  }
  buildPrompt(content, platform) {
    const templates = {
      xiaohongshu: `\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u8F6C\u6362\u4E3A\u5C0F\u7EA2\u4E66\u98CE\u683C\uFF1A

${content}`,
      jike: `\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u8F6C\u6362\u4E3A\u5373\u523B\u98CE\u683C\uFF1A

${content}`,
      twitter: `\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u8F6C\u6362\u4E3ATwitter\u98CE\u683C\uFF08280\u5B57\u7B26\u5185\uFF09\uFF1A

${content}`
    };
    return templates[platform] || content;
  }
  showResult(result) {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: "\u8F6C\u6362\u7ED3\u679C" });
    const resultArea = contentEl.createEl("textarea", {
      text: result,
      cls: "result-output"
    });
    const copyButton = contentEl.createEl("button", {
      text: "\u590D\u5236\u7ED3\u679C"
    });
    copyButton.onclick = () => {
      navigator.clipboard.writeText(result);
      new import_obsidian.Notice("\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F");
    };
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};
