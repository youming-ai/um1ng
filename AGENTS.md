# Repository Guidelines

## Project Structure & Module Organization

This is a static personal homepage using Vite, Void, and native WebGL, with no runtime dependencies.

- `src/main.ts`: shaders, model loading, rendering, and pointer interaction.
- `index.html`: page markup, inline styles, social links, and font loading.
- `public/`: favicon, robots file, and the generated `skull.bin` model.
- `scripts/skull.mjs` and `scripts/skull.obj`: model converter and source geometry.
- `void.config.ts`: Cloudflare Worker, custom domain, and visibility settings.

## Build, Test, and Development Commands

Use Bun and Node.js 22+.

- `bun install`: install dependencies; commit `bun.lock` with dependency changes.
- `bun dev`: start the Vite development server.
- `bun run build`: generate the production site in `dist/client`.
- `bun preview`: preview the production build locally.
- `bun run deploy`: upload `dist/client` through Void; build first because deployment does not rebuild.
- `node scripts/skull.mjs scripts/skull.obj public/skull.bin`: regenerate the model after geometry or converter changes.

## Coding Style & Naming Conventions

Use strict TypeScript for browser code and ES modules throughout. Match existing four-space indentation in source files and two-space indentation in `tsconfig.json`. Use single quotes and semicolons in JavaScript and TypeScript. Name constants in `UPPER_SNAKE_CASE` and functions and variables in `camelCase`.

Keep rendering code direct and dependencies minimal. Explain coordinate systems and visual tradeoffs in comments. No formatter or linter is configured.

## Testing Guidelines

No automated test framework, coverage threshold, or test naming convention is established. Run `bun run build` and `git diff --check` before submitting. The build does not provide TypeScript type checking.

For rendering changes, inspect pointer tracking, scatter recovery, intro animation, resizing, and reduced-motion behavior in a browser. Include screenshots for visible changes.

## Commit & Pull Request Guidelines

History commonly uses concise `feat:`, `fix:`, `perf:`, `refactor:`, and `chore:` subjects. Keep commits focused. PRs should describe the resulting behavior, link relevant issues, list validation performed, and identify checks not run.

## Deployment Configuration

Preserve the custom domain and disabled public preview endpoints unless explicitly changing access. Keep secrets in ignored environment files. For direct Cloudflare CLI work, prefer `cf`; inspect `cf --help` or `cf cli search` before choosing commands. Use Wrangler only for an existing Wrangler project or an explicit request.
