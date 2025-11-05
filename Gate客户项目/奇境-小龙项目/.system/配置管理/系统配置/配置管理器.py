#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
配置文件存储管理器
管理系统配置、客户配置和模板配置
"""

import os
import json
import yaml
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime

class ConfigurationManager:
    """配置文件管理器"""

    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.setup_directories()

    def setup_directories(self):
        """设置目录结构"""
        self.system_config_path = self.base_path / "系统配置"
        self.customer_config_path = self.base_path / "客户配置"
        self.template_config_path = self.base_path / "模板配置"

        for path in [self.system_config_path, self.customer_config_path,
                    self.template_config_path]:
            path.mkdir(parents=True, exist_ok=True)

    def save_system_config(self, config_name: str, config_data: Dict,
                          config_format: str = "yaml") -> bool:
        """保存系统配置"""
        try:
            filename = f"{config_name}.{config_format}"
            file_path = self.system_config_path / filename

            with open(file_path, 'w', encoding='utf-8') as f:
                if config_format == "yaml":
                    yaml.dump(config_data, f, default_flow_style=False,
                             allow_unicode=True)
                elif config_format == "json":
                    json.dump(config_data, f, ensure_ascii=False, indent=2)

            return True
        except Exception as e:
            print(f"保存系统配置失败: {e}")
            return False

    def load_system_config(self, config_name: str, config_format: str = "yaml") -> Optional[Dict]:
        """加载系统配置"""
        try:
            filename = f"{config_name}.{config_format}"
            file_path = self.system_config_path / filename

            if not file_path.exists():
                return None

            with open(file_path, 'r', encoding='utf-8') as f:
                if config_format == "yaml":
                    return yaml.safe_load(f)
                elif config_format == "json":
                    return json.load(f)

        except Exception as e:
            print(f"加载系统配置失败: {e}")
            return None

    def save_customer_config(self, customer_id: str, config_name: str,
                           config_data: Dict, config_format: str = "yaml") -> bool:
        """保存客户配置"""
        try:
            # 创建客户目录
            customer_dir = self.customer_config_path / customer_id
            customer_dir.mkdir(exist_ok=True)

            filename = f"{config_name}.{config_format}"
            file_path = customer_dir / filename

            with open(file_path, 'w', encoding='utf-8') as f:
                if config_format == "yaml":
                    yaml.dump(config_data, f, default_flow_style=False,
                             allow_unicode=True)
                elif config_format == "json":
                    json.dump(config_data, f, ensure_ascii=False, indent=2)

            return True
        except Exception as e:
            print(f"保存客户配置失败: {e}")
            return False

    def load_customer_config(self, customer_id: str, config_name: str,
                           config_format: str = "yaml") -> Optional[Dict]:
        """加载客户配置"""
        try:
            filename = f"{config_name}.{config_format}"
            file_path = self.customer_config_path / customer_id / filename

            if not file_path.exists():
                return None

            with open(file_path, 'r', encoding='utf-8') as f:
                if config_format == "yaml":
                    return yaml.safe_load(f)
                elif config_format == "json":
                    return json.load(f)

        except Exception as e:
            print(f"加载客户配置失败: {e}")
            return None

    def save_template_config(self, template_type: str, template_name: str,
                           config_data: Dict, config_format: str = "yaml") -> bool:
        """保存模板配置"""
        try:
            # 创建模板类型目录
            template_dir = self.template_config_path / template_type
            template_dir.mkdir(exist_ok=True)

            filename = f"{template_name}.{config_format}"
            file_path = template_dir / filename

            with open(file_path, 'w', encoding='utf-8') as f:
                if config_format == "yaml":
                    yaml.dump(config_data, f, default_flow_style=False,
                             allow_unicode=True)
                elif config_format == "json":
                    json.dump(config_data, f, ensure_ascii=False, indent=2)

            return True
        except Exception as e:
            print(f"保存模板配置失败: {e}")
            return False

    def load_template_config(self, template_type: str, template_name: str,
                           config_format: str = "yaml") -> Optional[Dict]:
        """加载模板配置"""
        try:
            filename = f"{template_name}.{config_format}"
            file_path = self.template_config_path / template_type / filename

            if not file_path.exists():
                return None

            with open(file_path, 'r', encoding='utf-8') as f:
                if config_format == "yaml":
                    return yaml.safe_load(f)
                elif config_format == "json":
                    return json.load(f)

        except Exception as e:
            print(f"加载模板配置失败: {e}")
            return None

    def list_customer_configs(self, customer_id: str) -> List[str]:
        """列出客户的所有配置文件"""
        customer_dir = self.customer_config_path / customer_id
        if not customer_dir.exists():
            return []

        configs = []
        for file_path in customer_dir.glob("*"):
            if file_path.is_file():
                configs.append(file_path.name)
        return configs

    def list_template_configs(self, template_type: str = None) -> Dict[str, List[str]]:
        """列出模板配置文件"""
        templates = {}

        if template_type:
            # 只列出指定类型的模板
            template_dir = self.template_config_path / template_type
            if template_dir.exists():
                templates[template_type] = [f.name for f in template_dir.glob("*") if f.is_file()]
        else:
            # 列出所有类型的模板
            for template_dir in self.template_config_path.iterdir():
                if template_dir.is_dir():
                    template_name = template_dir.name
                    configs = [f.name for f in template_dir.glob("*") if f.is_file()]
                    if configs:
                        templates[template_name] = configs

        return templates

    def delete_config(self, config_type: str, config_path: str) -> bool:
        """删除配置文件"""
        try:
            if config_type == "system":
                file_path = self.system_config_path / config_path
            elif config_type == "customer":
                file_path = self.customer_config_path / config_path
            elif config_type == "template":
                file_path = self.template_config_path / config_path
            else:
                return False

            if file_path.exists():
                file_path.unlink()
                return True

            return False
        except Exception as e:
            print(f"删除配置文件失败: {e}")
            return False

    def backup_configs(self, backup_path: str) -> bool:
        """备份所有配置文件"""
        try:
            import shutil
            backup_dir = Path(backup_path)
            backup_dir.mkdir(parents=True, exist_ok=True)

            # 备份系统配置
            if self.system_config_path.exists():
                shutil.copytree(self.system_config_path,
                               backup_dir / "系统配置")

            # 备份客户配置
            if self.customer_config_path.exists():
                shutil.copytree(self.customer_config_path,
                               backup_dir / "客户配置")

            # 备份模板配置
            if self.template_config_path.exists():
                shutil.copytree(self.template_config_path,
                               backup_dir / "模板配置")

            return True
        except Exception as e:
            print(f"备份配置文件失败: {e}")
            return False

    def restore_configs(self, backup_path: str) -> bool:
        """恢复配置文件"""
        try:
            import shutil
            backup_dir = Path(backup_path)

            if not backup_dir.exists():
                return False

            # 恢复系统配置
            system_backup = backup_dir / "系统配置"
            if system_backup.exists():
                if self.system_config_path.exists():
                    shutil.rmtree(self.system_config_path)
                shutil.copytree(system_backup, self.system_config_path)

            # 恢复客户配置
            customer_backup = backup_dir / "客户配置"
            if customer_backup.exists():
                if self.customer_config_path.exists():
                    shutil.rmtree(self.customer_config_path)
                shutil.copytree(customer_backup, self.customer_config_path)

            # 恢复模板配置
            template_backup = backup_dir / "模板配置"
            if template_backup.exists():
                if self.template_config_path.exists():
                    shutil.rmtree(self.template_config_path)
                shutil.copytree(template_backup, self.template_config_path)

            return True
        except Exception as e:
            print(f"恢复配置文件失败: {e}")
            return False

    def validate_config(self, config_data: Dict, schema: Dict) -> tuple[bool, List[str]]:
        """验证配置文件格式"""
        errors = []

        def validate_field(field_name: str, field_value: Any, field_schema: Dict):
            if "required" in field_schema and field_schema["required"] and field_value is None:
                errors.append(f"必填字段 {field_name} 缺失")
                return

            if field_value is None:
                return

            if "type" in field_schema:
                expected_type = field_schema["type"]
                if expected_type == "string" and not isinstance(field_value, str):
                    errors.append(f"字段 {field_name} 应为字符串类型")
                elif expected_type == "number" and not isinstance(field_value, (int, float)):
                    errors.append(f"字段 {field_name} 应为数字类型")
                elif expected_type == "boolean" and not isinstance(field_value, bool):
                    errors.append(f"字段 {field_name} 应为布尔类型")
                elif expected_type == "array" and not isinstance(field_value, list):
                    errors.append(f"字段 {field_name} 应为数组类型")
                elif expected_type == "object" and not isinstance(field_value, dict):
                    errors.append(f"字段 {field_name} 应为对象类型")

            if "min_length" in field_schema and len(str(field_value)) < field_schema["min_length"]:
                errors.append(f"字段 {field_name} 长度不能小于 {field_schema['min_length']}")

            if "max_length" in field_schema and len(str(field_value)) > field_schema["max_length"]:
                errors.append(f"字段 {field_name} 长度不能大于 {field_schema['max_length']}")

            if "enum" in field_schema and field_value not in field_schema["enum"]:
                errors.append(f"字段 {field_name} 值应为 {field_schema['enum']} 中的一个")

        for field_name, field_schema in schema.items():
            if field_name in config_data:
                validate_field(field_name, config_data[field_name], field_schema)
            elif field_schema.get("required", False):
                errors.append(f"必填字段 {field_name} 缺失")

        return len(errors) == 0, errors

# 使用示例
if __name__ == "__main__":
    # 创建配置管理器
    manager = ConfigurationManager("./配置文件存储")

    # 保存系统配置示例
    system_config = {
        "max_file_size": 100 * 1024 * 1024,  # 100MB
        "supported_formats": ["xlsx", "xls", "csv", "jpg", "png"],
        "processing_timeout": 300
    }
    manager.save_system_config("processing_limits", system_config)

    # 保存客户配置示例
    customer_config = {
        "quality_standards": "high",
        "priority_fields": ["品牌", "价格", "库存"],
        "output_format": "markdown"
    }
    manager.save_customer_config("customer_001", "preferences", customer_config)

    # 保存模板配置示例
    template_config = {
        "industry_type": "manufacturing",
        "required_fields": ["产品名称", "规格", "数量"],
        "validation_rules": {
            "价格": {"min": 0, "max": 999999}
        }
    }
    manager.save_template_config("industry", "manufacturing_template", template_config)

    print("配置文件保存完成")