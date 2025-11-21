#!/usr/bin/env python3
"""
智谱AI API调试脚本
用于诊断1113错误码的具体原因
"""

import requests
import json
import sys

API_KEY = "85311233fbc34a288dd6427b7c1169ca.MhxPmD7VrcljE8QA"
BASE_URL = "https://open.bigmodel.cn/api/paas/v4"

def test_models_endpoint():
    """测试模型列表接口"""
    print("🔍 测试模型列表接口...")
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.get(f"{BASE_URL}/models", headers=headers)
        print(f"状态码: {response.status_code}")

        if response.status_code == 200:
            models = response.json()
            print("✅ 可用模型列表:")
            for model in models.get('data', []):
                model_id = model.get('id', '未知')
                if 'glm-4' in model_id:
                    print(f"  📱 {model_id}")
                else:
                    print(f"  🔧 {model_id}")
            return True
        else:
            print(f"❌ 错误: {response.text}")
            return False

    except Exception as e:
        print(f"❌ 异常: {e}")
        return False

def test_glm4():
    """测试GLM-4模型"""
    print("\n🧪 测试GLM-4模型...")
    return test_model("glm-4")

def test_glm46():
    """测试GLM-4.6模型"""
    print("\n🚀 测试GLM-4.6模型...")
    return test_model("glm-4.6")

def test_model(model_name):
    """测试指定模型"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Obsidian-ContentDistributor/2.0 Debug-Script"
    }

    data = {
        "model": model_name,
        "messages": [{"role": "user", "content": "测试消息"}],
        "max_tokens": 50,
        "temperature": 0.7
    }

    try:
        response = requests.post(f"{BASE_URL}/chat/completions",
                               headers=headers, json=data, timeout=30)
        print(f"状态码: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
            print(f"✅ {model_name} 调用成功!")
            print(f"📝 回复: {content[:100]}...")
            return True
        else:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
            error_code = error_data.get('error', {}).get('code', '未知')
            error_msg = error_data.get('error', {}).get('message', response.text)
            print(f"❌ {model_name} 调用失败!")
            print(f"📋 错误码: {error_code}")
            print(f"📋 错误信息: {error_msg}")

            # 详细分析
            if response.status_code == 429:
                if error_code == "1113":
                    print(f"\n🔍 详细分析:")
                    print(f"   - {model_name} 模型可能需要特殊权限")
                    print(f"   - 资源包可能不包含 {model_name}")
                    print(f"   - 当前项目可能没有 {model_name} 使用权限")

            return False

    except Exception as e:
        print(f"❌ 异常: {e}")
        return False

def main():
    print("🔧 智谱AI API调试工具")
    print("=" * 50)

    # 步骤1：检查可用模型
    if not test_models_endpoint():
        print("\n❌ 模型列表接口失败，请检查API Key和网络连接")
        return

    # 步骤2：测试GLM-4
    glm4_success = test_glm4()

    # 步骤3：测试GLM-4.6
    glm46_success = test_glm46()

    # 总结分析
    print("\n" + "=" * 50)
    print("📊 诊断结果:")

    if glm4_success and glm46_success:
        print("✅ 所有模型都可以正常调用")
        print("🎯 问题可能在Obsidian插件的配置中")
    elif glm4_success and not glm46_success:
        print("🎯 GLM-4可用，但GLM-4.6不可用")
        print("💡 可能原因:")
        print("   - GLM-4.6需要单独申请权限")
        print("   - 当前资源包不包含GLM-4.6")
        print("   - GLM-4.6对企业用户或特定用户开放")
        print("   - 建议联系智谱AI客服申请GLM-4.6权限")
    elif not glm4_success and not glm46_success:
        print("🎯 所有模型都不可用")
        print("💡 可能原因:")
        print("   - API资源包余额不足")
        print("   - 资源包未分配到当前项目")
        print("   - 网络连接问题")
        print("   - API Key配置问题")
    else:
        print("🤔 意外情况，请提供详细日志进行分析")

if __name__ == "__main__":
    main()