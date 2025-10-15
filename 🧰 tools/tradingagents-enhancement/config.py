# -*- coding: utf-8 -*-
"""
TradingAgents Enhanced 系统配置文件
"""

# ==================== API配置 ====================
# FinnHub API配置
FINNHUB_API_KEY = "d1vm82hr01qqgeemb9r0d1vm82hr01qqgeemb9rg"
FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

# API请求配置
REQUEST_TIMEOUT = 10  # 请求超时时间(秒)
REQUEST_DELAY = 0.5   # 请求间隔时间(秒)
MAX_RETRIES = 3       # 最大重试次数

# ==================== 股票池配置 ====================
# 默认股票池 - 简化版使用
DEFAULT_STOCKS = [
    'AAPL',   # 苹果
    'NVDA',   # 英伟达
    'TSLA',   # 特斯拉
    'MSFT',   # 微软
    'GOOGL'   # 谷歌
]

# 扩展股票池 - 完整版使用
EXTENDED_STOCKS = [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA',
    'AMZN', 'META', 'NFLX', 'AMD', 'CRM',
    'INTC', 'ORCL', 'CSCO', 'ADBE', 'PYPL'
]

# 中概股股票池
CHINESE_STOCKS = [
    'BABA',   # 阿里巴巴
    'BILI',   # 哔哩哔哩
    'TCEHY',  # 腾讯
    'JD',     # 京东
    'PDD',    # 拼多多
    'NTES',   # 网易
    'BIDU'    # 百度
]

# ETF股票池
ETF_STOCKS = [
    'QQQ',    # 纳指ETF
    'SPY',    # 标普500ETF
    'IWM',    # 小盘股ETF
    'VTI',    # 全市场ETF
    'VOO'     # 标普500ETF
]

# ==================== 分析策略配置 ====================
# 移动平均线策略参数
MOMENTUM_STRATEGIES = [
    {'short_window': 5, 'long_window': 20, 'name': '快速动量'},
    {'short_window': 10, 'long_window': 30, 'name': '标准动量'},
    {'short_window': 20, 'long_window': 50, 'name': '慢速动量'}
]

# RSI策略参数
RSI_STRATEGIES = [
    {'period': 14, 'oversold': 30, 'overbought': 70, 'name': '标准RSI'},
    {'period': 21, 'oversold': 25, 'overbought': 75, 'name': '优化RSI'},
    {'period': 7, 'oversold': 20, 'overbought': 80, 'name': '激进RSI'}
]

# MACD策略参数
MACD_STRATEGIES = [
    {'fast': 12, 'slow': 26, 'signal': 9, 'name': '标准MACD'},
    {'fast': 8, 'slow': 21, 'signal': 5, 'name': '快速MACD'}
]

# ==================== 评分系统配置 ====================
# 评分权重配置
SCORING_WEIGHTS = {
    'price_momentum': 0.25,      # 价格动量权重
    'technical_score': 0.30,     # 技术指标权重
    'volume_analysis': 0.20,     # 成交量分析权重
    'market_position': 0.15,     # 市场位置权重
    'volatility_score': 0.10     # 波动率评分权重
}

# 评分阈值配置
SCORE_THRESHOLDS = {
    'strong_buy': 80,     # 强烈买入阈值
    'buy': 65,            # 买入阈值
    'hold': 45,           # 持有阈值
    'sell': 30            # 卖出阈值
}

# ==================== 回测配置 ====================
# 回测参数
BACKTEST_CONFIG = {
    'initial_capital': 10000,    # 初始资金
    'commission': 0.001,         # 交易佣金比例
    'slippage': 0.001,          # 滑点比例
    'max_position_size': 0.2,    # 最大仓位比例
    'stop_loss': 0.05,          # 止损比例
    'take_profit': 0.15         # 止盈比例
}

# 历史数据配置
HISTORICAL_DATA_CONFIG = {
    'default_period': 252,       # 默认获取天数(约1年)
    'min_data_points': 50,      # 最小数据点数
    'max_data_points': 500,     # 最大数据点数
    'resolution': 'D'           # 数据分辨率(D=日线)
}

# ==================== 系统配置 ====================
# 目录配置
DIRECTORIES = {
    'reports': 'reports',
    'data': 'data',
    'logs': 'logs',
    'cache': 'cache'
}

# 文件配置
FILE_CONFIG = {
    'report_format': 'md',       # 报告格式
    'data_format': 'json',       # 数据格式
    'encoding': 'utf-8',         # 文件编码
    'timestamp_format': '%Y%m%d_%H%M%S'  # 时间戳格式
}

# 缓存配置
CACHE_CONFIG = {
    'enable_cache': True,        # 是否启用缓存
    'cache_duration': 300,       # 缓存时长(秒)
    'max_cache_size': 100,      # 最大缓存条目数
    'cache_cleanup_interval': 3600  # 缓存清理间隔(秒)
}

# 并发配置
CONCURRENT_CONFIG = {
    'max_workers': 5,            # 最大并发数
    'batch_size': 10,           # 批处理大小
    'rate_limit_per_minute': 60, # 每分钟最大请求数
    'burst_limit': 10           # 突发请求限制
}

# ==================== 日志配置 ====================
LOGGING_CONFIG = {
    'level': 'INFO',            # 日志级别
    'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    'file': 'tradingagents.log',
    'max_size': 10 * 1024 * 1024,  # 最大日志文件大小(10MB)
    'backup_count': 5           # 日志文件备份数量
}

# ==================== 风险控制配置 ====================
RISK_CONFIG = {
    'max_daily_loss': 0.02,     # 单日最大损失比例
    'max_drawdown': 0.10,       # 最大回撤比例
    'var_confidence': 0.05,     # VaR置信水平
    'correlation_threshold': 0.7, # 相关性阈值
    'volatility_limit': 0.30    # 波动率限制
}

# ==================== 通知配置 ====================
NOTIFICATION_CONFIG = {
    'enable_email': False,       # 是否启用邮件通知
    'enable_console': True,      # 是否启用控制台输出
    'alert_threshold': 75,       # 告警阈值
    'report_frequency': 'daily'  # 报告频率
}

# ==================== 性能配置 ====================
PERFORMANCE_CONFIG = {
    'memory_limit': 512 * 1024 * 1024,  # 内存限制(512MB)
    'cpu_limit': 0.8,           # CPU使用率限制
    'timeout_limit': 300,       # 超时限制(秒)
    'optimize_for': 'speed'     # 优化目标: speed/accuracy
}

# ==================== 版本信息 ====================
VERSION_INFO = {
    'version': '1.0.0',
    'build_date': '2025-08-13',
    'author': 'Claude Code + TradingAgents Team',
    'license': 'MIT',
    'description': 'AI驱动的量化选股系统'
}

# ==================== 功能开关 ====================
FEATURES = {
    'enable_backtest': True,     # 启用回测功能
    'enable_realtime': True,     # 启用实时分析
    'enable_cache': True,        # 启用数据缓存
    'enable_alerts': True,       # 启用告警功能
    'enable_reports': True,      # 启用报告生成
    'enable_monitoring': True,   # 启用性能监控
    'debug_mode': False         # 调试模式
}