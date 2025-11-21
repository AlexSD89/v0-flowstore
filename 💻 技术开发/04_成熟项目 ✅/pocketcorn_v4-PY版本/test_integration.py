#!/usr/bin/env python3
"""
测试整合后的Pocketcorn v4系统
验证MasterSystem核心功能是否成功整合
"""

import sys
import os
sys.path.append('00_system')

from pocketcorn_v4.test_system import test_integration

if __name__ == "__main__":
    print("🧪 开始测试整合后的Pocketcorn v4系统...")
    test_integration()