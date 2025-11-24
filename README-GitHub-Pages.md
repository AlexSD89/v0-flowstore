# V0 FlowStore - GitHub Pages Deployment

This repository contains the V0 FlowStore project configured for static deployment to GitHub Pages.

## 🚀 GitHub Pages Deployment Setup

### Prerequisites
- Node.js 18+ and pnpm installed
- GitHub repository with GitHub Pages enabled

### Local Development

1. Install dependencies:
```bash
pnpm install
```

2. Run development server:
```bash
pnpm dev
```

### Building for Production

1. Build static site:
```bash
pnpm build:static
```

The static files will be generated in the `out/` directory.

### GitHub Pages Automatic Deployment

The repository is configured with GitHub Actions for automatic deployment:

1. **Push to `main` branch** → Triggers build and deployment
2. **Pull Request** → Triggers build preview

#### Manual Deployment Setup

1. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Select "GitHub Actions" as the source

2. Configure repository settings:
   - Settings → Actions → General
   - Enable "Read and write permissions" for workflows
   - Allow "GITHUB_TOKEN" write permissions

3. Update `basePath` in `next.config.js` if your repository name differs from `v0-flowstore`

### Configuration Details

#### Next.js Configuration (`next.config.js`)
- Static export enabled (`output: "export"`)
- GitHub Pages base path configuration
- Image optimization disabled for static build
- Custom image loader for static compatibility

#### GitHub Actions Workflow (`.github/workflows/deploy-pages.yml`)
- Automated build and deployment on push
- pnpm package manager with caching
- Static site generation and GitHub Pages deployment

#### Image Processing
The project includes a custom image loader (`image-loader.ts`) for static export compatibility.

## 🔧 Customization

### Changing Repository Name
If your repository name differs from `v0-flowstore`, update the `basePath` in `next.config.js`:

```javascript
basePath: process.env.NODE_ENV === "production" ? "/your-repo-name" : ""
assetPrefix: process.env.NODE_ENV === "production" ? "/your-repo-name" : ""
```

### Adding Custom Domains
1. Configure custom domain in GitHub Pages settings
2. Update `basePath` to `"/"` in `next.config.js`
3. Set `assetPrefix` to `"https://your-domain.com"`

## 📁 Project Structure

```
├── .github/workflows/
│   └── deploy-pages.yml      # GitHub Actions workflow
├── out/                      # Built static site (generated)
├── next.config.js           # Next.js configuration for static export
├── image-loader.ts          # Custom image loader for static build
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🚨 Important Notes

- Static export means no server-side features
- Image optimization is handled client-side
- All routes must be statically generated
- Dynamic routes require `generateStaticParams()` implementation

## 🌐 Accessing Your Site

Once deployed, your site will be available at:
```
https://[username].github.io/[repository-name]/
```

## 📊 Comparison: Vercel vs GitHub Pages

| Feature | Vercel | GitHub Pages |
|---------|--------|--------------|
| **Build Speed** | Fast | Moderate |
| **Global CDN** | ✅ Built-in | ✅ GitHub Infrastructure |
| **Custom Domain** | ✅ Free | ✅ Free |
| **Analytics** | ✅ Built-in | ❌ Limited |
| **Serverless** | ✅ Rich Functions | ❌ Static Only |
| **VPN Access** | ❌ May Require VPN | ✅ Generally Accessible |
| **Cost** | ✅ Generous Free Tier | ✅ Completely Free |
| **Git Integration** | ✅ Seamless | ✅ Native |

## 🛠️ Troubleshooting

### Common Issues

1. **404 Errors on Sub-pages**
   - Ensure `trailingSlash: true` in `next.config.js`
   - Check `basePath` configuration

2. **Asset Loading Issues**
   - Verify `assetPrefix` matches your repository name
   - Ensure all assets are in the `public/` folder

3. **Build Failures**
   - Check that all pages can be statically generated
   - Remove dynamic API routes and server-side features

### Debugging

1. Check GitHub Actions logs for build errors
2. Test locally with `pnpm build:static`
3. Verify generated files in `out/` directory

## 📝 License

This project maintains the same license as the original V0 FlowStore.