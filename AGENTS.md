# AGENTS.md

Welcome to the **Francisco Gonzalez IV Portfolio** repository. This document provides essential context, architecture details, conventions, commands, and guidelines for AI agents working in this codebase.

---

## 1. Project Overview & Architecture

- **Site Purpose**: Personal portfolio and project showcase for **Francisco Gonzalez IV**, a software engineer based in Richmond, VA.
- **Production URL**: Configured at build time via `SITE_URL` (defaults to `http://localhost:4321` locally).
- **Default Branch**: `main`
- **Current Framework**: **Astro v7** (Static Site Generation / SSG) with Content Layer API.
- **UI & Styling**: **Tailwind CSS v4** (`@tailwindcss/vite`, `@tailwindcss/forms`) + **Starwind UI** source-owned Astro components (`src/components/starwind/`), using a mobile-first **Stone & Pine/Teal** light/dark design system.
- **Deployment Platform**: **Cloudflare Workers** (Static Assets mode via Wrangler).
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) deploying directly to Cloudflare Workers on pushes to `main` or `master` (plus `workflow_dispatch`).

> [!IMPORTANT]
> **Migration Context**:
> This repository was originally migrated from Eleventy (`eleventy-duo`) + Bootstrap 5 + Sass to **Astro v7 + Tailwind CSS v4 + Starwind UI**.
> - Do **not** use, edit, or recreate `.njk` templates, Bootstrap classes, Sass files, Deno configs (`deno.json`), or legacy `src/content/config.ts` collections.
> - All pages, components, and layouts must be written in Astro (`.astro`), TypeScript (`.ts`), and Tailwind CSS v4 utilities / Starwind tokens.

---

## 2. Tech Stack

- **Framework**: Astro `^7.4.13` (`output: "static"`, `trailingSlash: "always"`, `site: process.env.SITE_URL || "http://localhost:4321"`)
- **RSS Feed**: `@astrojs/rss` (`^4.0.19`)
- **Styling & UI**: Tailwind CSS `^4.3.5` (`@tailwindcss/vite`, `@tailwindcss/forms`), Starwind UI (`@starwind-ui/astro`, `tw-animate-css`, `tailwind-merge`, `tailwind-variants`, `@tabler/icons`)
- **Deployment & Cloud**: Wrangler `^4.167.0` (Cloudflare Workers Static Assets)
- **Node / Runtime**: Node `>=22.23.4` (Astro 7 engine requirement; CI uses Node 24)

---

## 3. Directory Structure

```text
developer-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment to Cloudflare Workers
├── public/                         # Static assets served at the root URL
│   ├── images/                     # Unoptimized Markdown media (animated GIFs & static reduced-motion fallbacks)
│   └── favicon.ico                 # Site favicon
├── src/
│   ├── assets/
│   │   └── images/                 # Source raster images optimized by Astro <Image /> (WebP) & getImage() (OG JPEG)
│   ├── components/
│   │   ├── starwind/               # Source-owned Starwind UI Astro components
│   │   ├── ProjectCard.astro       # Reusable mobile-first project card (grid & list variants)
│   │   ├── SiteFooter.astro        # Responsive site footer
│   │   └── SiteHeader.astro        # Sticky header + mobile Starwind Sheet drawer + ThemeToggle
│   ├── content/
│   │   └── blog/                   # Markdown content for projects / case studies
│   │       ├── all-for-one-tattoo-shop.md
│   │       ├── circle-square-hair-salon.md
│   │       ├── developer-portfolio.md
│   │       ├── hollybanks-lane.md
│   │       └── mother-of-suns.md
│   ├── content.config.ts           # Astro Content Layer collection schema (glob loader + astro/zod)
│   ├── data/
│   │   └── site.json               # Site metadata, author info, navigation & social/footer links
│   ├── layouts/
│   │   ├── BaseLayout.astro        # Base HTML document, ThemeInitScript, skip link, meta/OG, GA, header & footer
│   │   ├── HomeLayout.astro        # Homepage layout (hero banner + responsive project grid)
│   │   └── PostLayout.astro        # Project detail layout (breadcrumb, role/title/tags, showcase, pagination)
│   ├── lib/
│   │   └── images.ts               # Image metadata resolver, tag label formatter, URL display helper
│   ├── pages/
│   │   ├── index.astro             # Homepage (/)
│   │   ├── about.astro             # About page (/about/)
│   │   ├── projects.astro          # Projects index page (/projects/)
│   │   ├── 404.astro               # 404 error page (/404.html)
│   │   ├── feed.xml.ts             # Dynamic RSS feed generator (/feed.xml)
│   │   ├── robots.txt.ts           # Dynamic robots.txt endpoint
│   │   ├── sitemap.xml.ts          # Dynamic XML sitemap generator (/sitemap.xml)
│   │   └── posts/
│   │       └── [...slug].astro     # Dynamic post page routing (/posts/<slug>/)
│   └── styles/
│       └── starwind.css            # Tailwind v4 entrypoint, Stone & Pine/Teal tokens, reduced-motion & prose styles
├── astro.config.mjs                # Astro + @tailwindcss/vite configuration
├── starwind.config.json            # Starwind CLI configuration
├── tsconfig.json                   # TypeScript strict config with @/* -> ./src/* alias
├── wrangler.json                   # Cloudflare Workers configuration
└── package.json                    # Project dependencies and npm scripts
```

---

## 4. Key Workflows & Commands

All standard development tasks can be run using `npm`:

| Command | Action | Notes |
| :--- | :--- | :--- |
| `npm run dev` (or `npm start`) | Starts Astro local dev server | Runs at `http://localhost:4321/` |
| `npm run build` | Builds static production site | Generates static HTML/assets into `./dist/` |
| `npm run preview` | Previews the `./dist/` build | Uses Astro's built-in preview server |
| `npm run preview:worker` | Previews via Wrangler | Runs `wrangler dev` simulating Cloudflare Workers environment |
| `npm run deploy` | Builds and deploys | Runs `astro build && wrangler deploy` (set `SITE_URL` for production origin) |
| `npx starwind@latest add <name>` | Adds a Starwind UI component | Installs native `.astro` files into `src/components/starwind/` |

---

## 5. Content Management & Data Schema

### Blog & Project Posts (`src/content/blog/`)

Posts are managed using Astro's Content Layer API defined in `src/content.config.ts` with `glob({ pattern: "**/*.md", base: "./src/content/blog" })` and `z` from `astro/zod`.

#### Frontmatter Schema:
```yaml
---
title: "Project Title"                      # Required: string
date: "2024-01-01"                          # Required: coerced Date (used in RSS feed; not displayed on post page)
role: "Freelance Web Developer"             # Optional: string (displayed as eyebrow above title on PostLayout)
tags: ["web-development", "javascript"]     # Optional: string array (defaults to [])
description: "Brief summary of project"     # Optional: string (defaults to '')
screen: "images/screenshot.png"             # Optional: string (filename matched in src/assets/images/)
url: "https://example.com"                  # Optional: URL string
order: 1                                    # Optional: number (lower numbers appear first)
---
```

> [!TIP]
> - **Sorting**: Posts on the homepage, projects page, RSS feed, and sitemap are sorted by `order` ascending (`(a.data.order ?? 99) - (b.data.order ?? 99)`).
> - **Slugs & Rendering**: Use `post.id` for route URLs (`/posts/${post.id}/`) and `render(post)` from `astro:content`.
> - **Images**: Place raster project screenshots and portraits in `src/assets/images/` only. `resolvePortfolioImage()` resolves frontmatter paths by filename for responsive WebP `<Image />` rendering, and `BaseLayout.astro` generates 1200px JPEG Open Graph images via `getImage()`. Use `public/images/` only for unoptimized Markdown media such as animated GIFs (paired with a static `<source media="(prefers-reduced-motion: reduce)">` fallback inside `<picture>`).

### Site Configuration (`src/data/site.json`)

Contains global site settings (`name`, `description`, `author`, `defaultSocialImage`, `headerLinks`, `socialLinks`, `footerLinks`, `showFooterAttribution`). Canonical site origin is **not** stored in `site.json`; it comes from `Astro.site` (`SITE_URL` in `astro.config.mjs`).

---

## 6. Styling, Accessibility & Layout Conventions

1. **Starwind UI + Tailwind CSS v4**:
   - Design tokens (`--background`, `--foreground`, `--primary`, `--primary-accent`, `--control-border`, etc.) live in `src/styles/starwind.css` using the **Stone & Pine/Teal** palette for light and `.dark` themes.
   - Prefer Starwind UI components (`@/components/starwind/*`) and Tailwind v4 utilities over custom CSS.
   - `ThemeInitScript` (from `@starwind-ui/astro/theme`) is loaded in `<head>` of `BaseLayout.astro` to prevent flash of wrong theme.
2. **Mobile-First Design**:
   - Design for `375px` mobile viewports first, scaling cleanly to `md:` and `lg:`.
   - Maintain accessible touch targets (`>= 44px`), single `<h1>` per page, and zero horizontal overflow.
3. **Accessibility & Reduced Motion**:
   - `BaseLayout.astro` includes a visually hidden skip link (`Skip to content` -> `#main-content`).
   - `src/styles/starwind.css` enforces `prefers-reduced-motion: reduce` globally; animated GIFs in Markdown must use `<picture>` with a static fallback `<source media="(prefers-reduced-motion: reduce)">`.
   - Use semantic heading levels (`CardTitle` supports `as="h2"` / `as="h3"`), explicit `aria-label` / `aria-labelledby`, `aria-hidden="true"` on decorative icons/screenshots, and `<span class="sr-only">` context on generic link text (e.g., `View project: {title}`) and external links (` (opens in a new tab)`).
4. **Portfolio UI Conventions**:
   - **Homepage project cards (`ProjectCard` `variant="grid"`)**: Wrap the entire card in a single `<a href="/posts/${post.id}/">` with `aria-labelledby` pointing to the card title and no nested links.
   - **Project detail headers (`PostLayout.astro`)**: Display `role` (when present), `title`, `description`, and `tags` — do **not** render `date`.
   - **No external client live-site links**: Although `url` remains optional in frontmatter metadata, do **not** render links to client sites in cards or detail pages (some legacy sites are no longer live).
   - **No contact button**: Do **not** surface `site.author.email` or add contact/mailto buttons in the UI.
   - **Projects header**: Keep `/projects/` clean without a project-count badge or tag filter bar.

---

## 7. Deployment & Cloudflare Workers

- Configuration file: `wrangler.json` (`nodejs_compat`, static assets from `./dist`, `not_found_handling: "404-page"`, `html_handling: "auto-trailing-slash"`).
- Canonical site origin is supplied via the `SITE_URL` environment variable in `astro.config.mjs` (used by `BaseLayout.astro`, `sitemap.xml.ts`, `robots.txt.ts`, and `feed.xml.ts`).
- CI/CD workflow: `.github/workflows/deploy.yml` runs on Node 24 and requires `SITE_URL`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID` secrets.

---

## 8. Guidelines for AI Agents

1. **Verification**: Always run `npm run build` after making modifications to verify Astro 7's strict HTML compiler, static generation, and TypeScript checks pass.
2. **Content Collections**: Use `getCollection("blog")` and `render(post)` from `astro:content`, `post.id` for slugs, and `z` from `astro/zod`.
3. **Avoid Legacy Artifacts**: Do not add Bootstrap, Sass, `.eleventy.js`, `.forestry/`, `deno.json`, or Nunjucks templates.
4. **Link Hygiene**: Respect the trailing slash convention (`/about/`, `/projects/`, `/posts/<id>/`).
