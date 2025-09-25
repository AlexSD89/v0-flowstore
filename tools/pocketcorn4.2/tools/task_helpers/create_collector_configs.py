from __future__ import annotations

import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONFIG_ROOT = ROOT / "config"

TEMPLATES = {
    CONFIG_ROOT / "mindspider" / "weibo.yaml": textwrap.dedent(
        """
        # MindSpider 微博采集配置模板
        # -------------------------------------------------------------
        # 说明：
        #   - credentials: 微博账号及加密后的密码/Token
        #   - cookies_path: MindSpider 生成的 cookie 存储路径
        #   - proxy: 可选代理配置(HTTP/SOCKS)
        #   - rate_limit: 单位分钟内最大请求次数
        #   - keywords: 需要监控的关键词或话题
        #   - storage: 原始数据落库配置（MongoDB/MySQL 等）
        credentials:
          username: "YOUR_WEIBO_USERNAME"
          password: "YOUR_WEIBO_PASSWORD_OR_TOKEN"
        cookies_path: "secrets/weibo_cookies.json"
        proxy:
          enabled: false
          url: "http://127.0.0.1:7890"
        rate_limit:
          requests_per_minute: 90
        keywords:
          - "AI 初创"
          - "大模型融资"
        storage:
          type: "mongodb"
          uri: "mongodb://localhost:27017"
          database: "pocketcorn_raw"
          collection: "weibo_signals"
        scheduler:
          cadence: "*/30 * * * *"  # cron 表达式：每 30 分钟
        """
    ).strip()
    + "\n",
    CONFIG_ROOT / "mcp" / "playwith.yaml": textwrap.dedent(
        """
        # Playwith MCP 客户端配置模板
        # -------------------------------------------------------------
        # 说明：
        #   - endpoint: Playwith MCP 服务地址
        #   - auth: 鉴权信息（API Key 或 Basic Auth）
        #   - browsers: 需要并发的浏览器实例设置
        #   - platforms: 针对特定平台（如 LinkedIn/GitHub）的采集策略
        endpoint: "http://localhost:9000"
        auth:
          type: "token"
          token: "PLAYWITH_MCP_TOKEN"
        browsers:
          pool_size: 2
          headless: true
        platforms:
          linkedin:
            login:
              username: "YOUR_LINKEDIN_USERNAME"
              password: "YOUR_LINKEDIN_PASSWORD"
            rate_limit:
              requests_per_minute: 30
            selectors:
              post_container: "div.feed-shared-update-v2"
              timestamp: "span.feed-shared-actor__sub-description"
          github:
            rate_limit:
              requests_per_minute: 60
            selectors:
              repo_list: "div.Box-row"
        """
    ).strip()
    + "\n",
    CONFIG_ROOT / "mcp" / "rube.yaml": textwrap.dedent(
        """
        # Rube MCP 客户端配置模板
        # -------------------------------------------------------------
        # 说明：
        #   - endpoint: Rube 服务地址
        #   - auth: 鉴权信息
        #   - tasks: 预置的结构化采集任务
        endpoint: "http://localhost:9100"
        auth:
          type: "basic"
          username: "rube"
          password: "rube-password"
        tasks:
          wechat_official:
            description: "监控 AI 赛道公众号文章"
            schedule: "0 */2 * * *"  # 每 2 小时
            query:
              keywords:
                - "AI 创业"
                - "AGI"
              max_pages: 5
          news_portal:
            description: "抓取科技新闻网站 RSS"
            schedule: "*/15 * * * *"
            query:
              sources:
                - "https://36kr.com/feed"
                - "https://www.jiqizhixin.com/rss"
        storage:
          type: "mysql"
          dsn: "mysql+pymysql://root:password@localhost:3306/pocketcorn_raw"
        """
    ).strip()
    + "\n",
}


def ensure_configs() -> None:
    created_files: list[Path] = []
    for path, content in TEMPLATES.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        if path.exists():
            continue
        path.write_text(content, encoding="utf-8")
        created_files.append(path)

    if not created_files:
        print("配置文件已存在，无需更新。")
    else:
        print("已生成以下配置模板：")
        for file in created_files:
            print(f"  - {file.relative_to(ROOT)}")


if __name__ == "__main__":
    ensure_configs()
