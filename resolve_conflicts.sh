#!/bin/bash

echo "正在处理合并冲突，保留本地版本..."

# 找到所有有冲突的文件并处理
git diff --name-only --diff-filter=U | while read file; do
    echo "处理文件: $file"
    # 检出我们自己的版本（保留本地变更）
    git checkout --ours "$file"
    # 添加到暂存区
    git add "$file"
done

echo "所有冲突已处理完成"
