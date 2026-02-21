# Material UI Player

## Dev environment tips
- Run `pnpm install` to set up dependencies. The project uses pnpm (CI uses `pnpm install --frozen-lockfile`).
- Node 22 is used in CI. There is no `.nvmrc`, so just match that version.
- Source lives entirely in `src/`. The entry point is `src/index.ts`, which re-exports `AudioCard`, `VideoCard`, and `SoundButton` from `src/components/`.
- TypeScript strict mode is on (`tsconfig.json`). Fix all type errors before committing.
- There is no linter or formatter configured. Follow the existing code style — no semicolons are used inconsistently, so just match what's already in the file you're editing.
- Peer dependencies (`react`, `@mui/material`, `@emotion/react`, `@emotion/styled`) are externalized in the Webpack build. Never bundle them — they must stay in `peerDependencies`.

## Building
- `pnpm run build` — runs Webpack, outputs `dist/index.js` (CommonJS). Run this to verify your changes compile.
- `pnpm run prepublish` — runs `tsc` only (generates `.d.ts` type declarations into `dist/`).
- If the build fails, check TypeScript errors first. The Webpack config uses `ts-loader`, so TS errors will block the build.

## Storybook
- `pnpm run storybook` — starts Storybook dev server on port 6006. This is the primary way to visually test components.
- Stories are in `src/stories/`. Public-facing stories live in `src/stories/public/`.
- `pnpm run build-storybook` — builds static Storybook into `public/`. This is what CI deploys to GitHub Pages.
- When adding or changing a component's props, update or add the relevant story in `src/stories/` so the change is visible.

## Testing
- There is no test suite. No Jest, Vitest, or Testing Library.
- Validate changes by running `pnpm run build` (must succeed) and checking behavior in Storybook (`pnpm run storybook`).

## Project structure
- `src/components/` — all React components. `AudioCard`, `VideoCard`, `SoundButton` are exported; the rest (`ControlKeys`, `Progress`, `VolumeBar`, `SpeedBar`, `MediaTime`) are internal.
- `src/hooks/useMedia.ts` — core hook that manages playback state via `useReducer`. All player logic flows through here.
- `src/state/` — reducer and action types for the player state machine.
- `src/types/index.ts` — all public TypeScript interfaces (`MaterialUIMediaProps`, `BaseProps`, `IconButtonProps`, etc.). Update this file when changing component APIs.
- `src/icons/` — custom SVG icon components. These are used instead of `@mui/icons-material`.
- `src/lib/utils.ts` — utility functions (time formatting, MIME detection, slider sizing, fade math).

## CI
- GitHub Actions workflow in `.github/workflows/main.yml`. Triggers on push to `master`.
- CI only builds Storybook and deploys to gh-pages. There are no test or lint steps in CI.
- Make sure `pnpm run build-storybook` succeeds before pushing to master.

## Common patterns
- Components are default-exported from their files, then named-exported from `src/index.ts`.
- The `src` prop on all components accepts `string | Promise<string> | (() => string) | (() => Promise<string>)`. URL resolution is deferred until the user clicks play — keep this pattern for any new source handling.
- State changes go through the reducer in `src/state/reducer.ts`. Don't mutate state directly in components.
- Styling uses MUI's `sx` prop and `Grid` layout. No CSS files, no styled-components beyond what MUI provides.
- All components must be rendered inside a MUI `<ThemeProvider>`. Don't add standalone styling that bypasses the theme.
