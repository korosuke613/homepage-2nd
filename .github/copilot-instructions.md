# korosuke613 homepage-2nd Development Guide

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Language Requirements

**日本語での回答必須 (Japanese Response Required)**

このリポジトリで作業する際は、**必ず日本語で回答してください**。技術的な説明、エラーメッセージの解釈、提案などすべてのコミュニケーションを日本語で行ってください。

When working in this repository, **always respond in Japanese**. All technical explanations, error message interpretations, suggestions, and communications must be in Japanese.

## Working Effectively

### Required Environment
- Node.js 20+ (validated: v20.19.4)
- npm 10+ (validated: v10.8.2)

### Bootstrap, Build, and Test
Execute these commands in sequence for a fresh setup:

```bash
# Install main dependencies (takes ~60 seconds)
npm install

# Install tools dependencies (takes ~3 seconds)
cd tools && npm install && cd ..

# Type checking (NOTE: This will show existing TypeScript errors - this is normal)
npm run build-types

# Lint and format code (takes ~0.3 seconds)
npm run lint:fix

# Build the application (takes ~60 seconds, NEVER CANCEL - set timeout to 90+ minutes)
npm run build

# Run all tests (takes ~15 seconds total, NEVER CANCEL - set timeout to 30+ minutes)
npm test
```

**CRITICAL TIMEOUT WARNINGS:**
- **Build process**: Takes 60+ seconds normally. NEVER CANCEL. Set timeout to 90+ minutes.
- **Test suite**: Takes 15+ seconds. NEVER CANCEL. Set timeout to 30+ minutes.
- **Individual unit tests**: Takes ~5 seconds. Set timeout to 15+ minutes.
- **Development server startup**: Takes ~2 seconds. Set timeout to 10+ minutes.

### Development Workflow

#### Start Development Server
```bash
npm run dev
# Starts at http://localhost:4321/
# Takes ~2 seconds to start, NEVER CANCEL
```

#### Start Storybook Development
```bash
npm run storybook
# Starts at http://localhost:6006/
# Takes ~15 seconds to start, NEVER CANCEL
```

#### Testing Commands
```bash
# Run individual test suites
npm run test:unit           # Unit tests with coverage (~5 seconds)
npm run test:playwright-ct  # Component tests (requires Playwright install)
npm run test:playwright-e2e # E2E tests (requires Playwright install)
npm run test:storybook      # Storybook tests (~3 seconds)

# Visual regression testing
npm run vrt:init            # Initialize VRT snapshots
npm run vrt:regression      # Run regression tests
```

**Playwright Setup** (if needed for component/E2E tests):
```bash
npx playwright install chromium --with-deps
# May take 2-5 minutes, NEVER CANCEL
```

#### External Content Updates
```bash
# Update external blog data (in tools directory)
cd tools

# Update Zenn articles (requires internet access)
npm run update:zenn

# Update HatenaBlog articles (requires HATENA_NAME and HATENA_PASS env vars)
npm run update:hatena

# Update Zenn Scraps
npm run update:zenn-scrap

cd ..
```

#### Database Operations
```bash
# Update GA4 analytics data (requires remote database access)
npm run db:update
```

## Validation

### ALWAYS Run These Commands Before Finishing
1. **Code Quality**: `npm run lint:fix` (fixes formatting and linting issues)
2. **Type Check**: `npm run build-types` (checks TypeScript - existing errors are normal)
3. **Build Test**: `npm run build` (ensures the site builds successfully)
4. **Basic Tests**: `npm run test:unit` (runs fast unit tests)

### Manual Validation Scenarios
After making changes, ALWAYS test these user scenarios:

1. **Homepage Navigation**:
   - Start dev server: `npm run dev`
   - Navigate to http://localhost:4321/
   - Click "Posts" navigation link
   - Click "Blogs" navigation link
   - Verify content loads correctly

2. **Content Rendering**:
   - Visit a post page (e.g., /posts/history)
   - Verify images load correctly
   - Verify tags and metadata display properly

3. **Component Development**:
   - Start Storybook: `npm run storybook`
   - Navigate to http://localhost:6006/
   - Verify components render correctly

## Architecture Overview

### Data Integration
This is an Astro-based personal homepage that integrates content from 3 sources:

1. **Local Markdown Posts** (`src/content/posts/`)
   - Schema defined in `src/content/config.ts`
   - Processed by `src/utils/Posts.ts`

2. **External Blogs** (`public/assets/*.json`)
   - HatenaBlog: XML API → JSON
   - Zenn: OGP scraping → JSON
   - Processed by `src/utils/Blog.ts`

3. **Analytics Data** (Astro DB)
   - GA4 page views and click tracking
   - Database schema in `db/config.ts`

### Build-Time Data Generation
The `src/utils/Integration.mjs` → `setupKorosuke` integration runs during `astro:config:setup` and:
1. Analyzes all Markdown files and external blog JSON
2. Generates tag system with automatic Tailwind colors
3. Creates yearly data aggregations
4. Outputs `generated/tags.json` and `generated/years.json`

### Component Architecture
All components follow the Storybook pattern:
```
src/components/ComponentName/
├── index.tsx                    # Main component
└── ComponentName.stories.tsx    # Storybook stories
```

**Component Hierarchy:**
- `src/components/` - Reusable UI components
- `src/partials/` - Page-level sections
- `src/templates/` - Layout templates
- `src/pages/` - Astro page files

### Test Structure
```
src/tests/
├── unit/          # Vitest unit tests
├── component/     # Playwright component tests
├── e2e/          # Playwright E2E tests
└── vrt/          # Visual regression tests
```

## Key Development Files

### Configuration Files
- `astro.config.mjs` - Astro configuration and integrations
- `biome.json` - Linting and formatting rules
- `tailwind.config.mjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

### Important Directories
- `src/utils/` - Core utility functions (Posts, Blogs, Random, etc.)
- `src/content/` - Markdown content and schemas
- `db/` - Database schema and utilities
- `tools/` - External content fetching scripts
- `generated/` - Build-time generated files (tags, years)

### Common File Patterns
- **Schema**: `src/content/config.ts` defines post frontmatter
- **Types**: `src/types/` contains TypeScript type definitions
- **Styles**: Global styles in `src/styles/`
- **Assets**: Static assets in `public/`

## Common Tasks

### Adding a New Component
1. Create `src/components/NewComponent/index.tsx`
2. Create `src/components/NewComponent/NewComponent.stories.tsx`
3. Test in Storybook: `npm run storybook`
4. Add component tests if needed

### Adding a New Post
1. Create Markdown file in `src/content/posts/`
2. Include required frontmatter (title, pubDate, tags)
3. Run `npm run build` to regenerate tag/year data
4. Test locally: `npm run dev`

### Modifying External Data Sources
1. Update tools in `tools/` directory
2. Test with: `cd tools && npx ts-node [script].ts`
3. Update type definitions in `src/types/` if needed
4. Update processing logic in `src/utils/Blog.ts`

### Database Schema Changes
1. Modify `db/config.ts`
2. Run `npm run db:update` to sync remote database
3. Update related utility functions in `db/utils/`

## Troubleshooting

### Build Issues
- **Type errors**: Run `npm run build-types` to see specific issues
- **Astro build fails**: Check `astro.config.mjs` and integration setup
- **Missing dependencies**: Run `npm install` in both root and `tools/`

### Test Issues
- **Playwright failures**: Install browsers with `npx playwright install chromium --with-deps`
- **Unit test failures**: Run individual tests with `npm run test:unit`
- **VRT failures**: Regenerate snapshots with `npm run vrt:init`

### External Content Issues
- **Zenn/HatenaBlog update fails**: Check network connectivity and credentials
- **JSON parsing errors**: Validate JSON files in `public/assets/`

### Performance Issues
- **Slow builds**: Normal for image optimization (20+ seconds for images)
- **Large bundle size**: Check `dist/` after build for bundle analysis

## CI/CD Integration

The `.github/workflows/ci.yaml` runs:
1. Linting check
2. Build verification (with artifact hash comparison)
3. Unit tests
4. Component tests
5. E2E tests
6. Visual regression tests
7. Chromatic visual testing

**Always ensure your changes pass**: `npm run lint:fix && npm run build && npm run test:unit`

## Environment Variables

### Optional Environment Variables
```bash
# For HatenaBlog API access (external content updates)
HATENA_NAME=your_username
HATENA_PASS=your_api_key

# For Chromatic visual testing
CHROMATIC_PROJECT_TOKEN=your_token
```

## Known Limitations

- **Type errors**: The codebase has some existing TypeScript errors that are being gradually fixed
- **Network dependencies**: External content updates require internet access
- **Playwright installation**: May fail due to network restrictions - skip if not testing components
- **Build time**: Image optimization adds 20+ seconds to build time

## Quick Reference

| Command | Purpose | Time | Timeout Needed |
|---------|---------|------|----------------|
| `npm install` | Install dependencies | ~60s | 5 minutes |
| `npm run build` | Build site | ~60s | 90 minutes |
| `npm run dev` | Start dev server | ~2s | 10 minutes |
| `npm run test:unit` | Unit tests | ~5s | 15 minutes |
| `npm run lint:fix` | Fix formatting | ~0.3s | 2 minutes |
| `npm run storybook` | Start Storybook | ~15s | 10 minutes |

**Remember**: NEVER CANCEL long-running builds or tests. Wait for completion and use appropriate timeouts.