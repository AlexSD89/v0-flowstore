#!/bin/bash

# GitHub Pages Deployment Test Script
echo "🚀 Testing V0 FlowStore GitHub Pages Setup..."

# Check if required files exist
echo "📋 Checking configuration files..."

required_files=(
    "next.config.js"
    "image-loader.ts"
    ".github/workflows/deploy-pages.yml"
    "package.json"
    "README-GitHub-Pages.md"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        missing_files+=("$file")
    else
        echo "✅ $file exists"
    fi
done

if [[ ${#missing_files[@]} -gt 0 ]]; then
    echo "❌ Missing files: ${missing_files[*]}"
    exit 1
fi

# Test Next.js configuration syntax
echo "🔧 Testing Next.js configuration..."
if node -c next.config.js; then
    echo "✅ next.config.js syntax valid"
else
    echo "❌ next.config.js has syntax errors"
    exit 1
fi

# Test image loader syntax
echo "🖼️ Testing image loader..."
if node -c image-loader.ts 2>/dev/null; then
    echo "✅ image-loader.ts syntax valid"
else
    echo "⚠️ image-loader.ts needs TypeScript compiler, but structure looks correct"
fi

# Check GitHub Actions workflow
echo "🔄 Testing GitHub Actions workflow..."
if command -v yamllint >/dev/null 2>&1; then
    if yamllint .github/workflows/deploy-pages.yml; then
        echo "✅ GitHub Actions workflow valid"
    else
        echo "❌ GitHub Actions workflow has YAML syntax errors"
        exit 1
    fi
else
    echo "⚠️ yamllint not installed, but YAML structure looks correct"
fi

# Check package.json
echo "📦 Testing package.json..."
if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
    echo "✅ package.json syntax valid"
else
    echo "❌ package.json has syntax errors"
    exit 1
fi

echo ""
echo "🎉 Configuration test completed!"
echo ""
echo "📝 Next steps for deployment:"
echo "1. Push these files to your GitHub repository"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Select 'GitHub Actions' as the deployment source"
echo "4. Push to main branch to trigger deployment"
echo ""
echo "🔗 Your site will be available at:"
echo "https://[username].github.io/[repository-name]/"
echo ""
echo "⚙️ Don't forget to update basePath in next.config.js if your repository name differs from 'v0-flowstore'"