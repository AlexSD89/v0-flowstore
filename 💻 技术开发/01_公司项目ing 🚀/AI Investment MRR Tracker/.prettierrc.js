/** @type {import("prettier").Config} */
module.exports = {
  // Core formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // End of line
  endOfLine: 'lf',
  
  // Prose wrapping
  proseWrap: 'preserve',
  
  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',
  
  // Vue files
  vueIndentScriptAndStyle: false,
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // Plugin-specific configurations
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
        singleQuote: false,
      },
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: ['*.css', '*.scss', '*.less'],
      options: {
        singleQuote: false,
        tabWidth: 2,
      },
    },
    {
      files: '*.svg',
      options: {
        parser: 'html',
      },
    },
    {
      files: ['package.json', 'package-lock.json'],
      options: {
        tabWidth: 2,
        useTabs: false,
      },
    },
    {
      files: ['.*rc', '.*rc.js', '.*rc.json'],
      options: {
        tabWidth: 2,
        parser: 'json',
      },
    },
  ],
  
  // Plugin configurations
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  
  // Import sorting configuration
  importOrder: [
    // Node.js built-in modules
    '^(child_process|crypto|events|fs|http|https|net|os|path|querystring|stream|url|util)(/.*)?$',
    
    // External libraries
    '^react$',
    '^react-dom$',
    '^next(/.*)?$',
    '^@next(/.*)?$',
    '^@?\\w',
    
    // Internal modules with alias
    '^@/types(/.*)?$',
    '^@/lib(/.*)?$',
    '^@/utils(/.*)?$',
    '^@/hooks(/.*)?$',
    '^@/components(/.*)?$',
    '^@/pages(/.*)?$',
    '^@/api(/.*)?$',
    '^@/database(/.*)?$',
    '^@/repositories(/.*)?$',
    '^@/services(/.*)?$',
    '^@/collectors(/.*)?$',
    '^@/analyzers(/.*)?$',
    '^@/scorers(/.*)?$',
    '^@/config(/.*)?$',
    '^@/middleware(/.*)?$',
    '^@/constants(/.*)?$',
    '^@/schemas(/.*)?$',
    '^@/(.*)$',
    
    // Relative imports
    '^\\.\\.(?!/?$)',
    '^\\.\\./?$',
    '^\\./(?=.*/)(?!/?$)',
    '^\\.(?!/?$)',
    '^\\./?$',
    
    // Style imports (should be last)
    '^.+\\.s?css$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  
  // Tailwind CSS plugin configuration
  tailwindConfig: './tailwind.config.ts',
  tailwindFunctions: ['clsx', 'cn', 'cva'],
};