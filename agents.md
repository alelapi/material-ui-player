# Material UI Player - Agent Guide

## Project Overview

React component library for audio and video playback styled with Material UI. Exports three components: `AudioCard`, `VideoCard`, and `SoundButton`.

- **Package**: `material-ui-player` (v2.0.0)
- **Language**: TypeScript
- **Framework**: React 18+ with Material UI 7+
- **Build**: Webpack 5 (output: CommonJS)
- **Docs**: Storybook 7

## Repository Structure

```
src/
├── components/         # Exported components + internal sub-components
│   ├── AudioCard.tsx   # Full audio player with controls
│   ├── VideoCard.tsx   # Full video player with controls
│   ├── SoundButton.tsx # Simple play-audio icon button
│   ├── ControlKeys.tsx # Play/Pause/Stop/Forward/Backward buttons
│   ├── Progress.tsx    # Seek slider
│   ├── VolumeBar.tsx   # Volume slider + mute
│   ├── SpeedBar.tsx    # Playback speed control
│   └── MediaTime.tsx   # Time display (current / duration)
├── hooks/
│   └── useMedia.ts     # Core hook: manages playback state via useReducer
├── state/
│   ├── types.ts        # Action type constants
│   └── reducer.ts      # Reducer handling PLAY, PAUSE, UPDATE_TIME, etc.
├── icons/              # Custom SVG icon components (Play, Pause, Stop, etc.)
├── lib/
│   └── utils.ts        # Time formatting, MIME detection, slider sizing, fade math
├── types/
│   └── index.ts        # Public TypeScript interfaces and types
├── stories/            # Storybook stories (public/ = exported API demos)
└── index.ts            # Package entry point (re-exports the 3 components)
```

## Key Commands

```bash
# Build the library (TypeScript → dist/)
npm run build

# Start Storybook dev server on port 6006
npm run storybook

# Build static Storybook site to public/
npm run build-storybook
```

There is no test suite configured.

## Architecture

### State Management

Each player instance uses `useReducer` with a local reducer (`src/state/reducer.ts`). The `useMedia` hook (`src/hooks/useMedia.ts`) wraps the reducer and exposes actions: `play`, `pause`, `stop`, `setCurrentTime`, `setProgress`, `load`, `setSize`.

Playback time updates are driven by `setInterval` during play, dispatching `UPDATE_TIME` on each tick.

### Source Resolution

The `src` prop accepts four forms:
- `string` — direct URL
- `Promise<string>` — resolved when play is clicked
- `() => string` — called on play
- `() => Promise<string>` — called on play, then awaited

This deferred resolution enables dynamic URLs (e.g., Firebase Storage signed URLs).

### Component Hierarchy

```
AudioCard / VideoCard
├── <audio> / <video>     (hidden/visible HTML element)
├── Progress              (seek slider)
├── ControlKeys           (play/pause/stop/fwd/bwd buttons)
├── VolumeBar             (volume slider + mute)
├── SpeedBar              (playback rate)
└── MediaTime             (time display)

SoundButton
└── IconButton + hidden <audio>
```

### Styling

Components use Material UI's `sx` prop and `Grid` layout. Slider appearance is customized via the `thickness` prop (`thin` | `medium` | `large`), which maps to pixel values in `utils.ts`. The `color` prop (`primary` | `secondary`) passes through to MUI components. All components must be rendered inside a MUI `<ThemeProvider>`.

### Video Fade Effect

`VideoCard` supports optional `fadeSettings` (`{ fadeInTime, fadeOutTime }`) that adjust the video element's opacity at the beginning and end of playback, calculated in `utils.ts:getFade()`.

## Peer Dependencies

```
@emotion/react   >= 11.0.0
@emotion/styled   >= 11.0.0
@mui/material     >= 7.0.0
react             >= 18.0.0
react-dom         >= 18.0.0
```

These are externalized in the Webpack build and must be provided by the consuming application.

## Public API

Exports from `material-ui-player`:

| Export | Description |
|---|---|
| `AudioCard` | Audio player card with full controls |
| `VideoCard` | Video player card with full controls and optional fade |
| `SoundButton` | Minimal icon button for short audio playback |

All prop interfaces are defined in `src/types/index.ts`. Key interfaces: `MaterialUIMediaProps` (shared AudioCard/VideoCard props), `BaseProps` (shared by all), `IconButtonProps` (button customization), `FadeSettings` (video fade config).

## Conventions

- Components are default-exported from their files, then re-exported as named exports from `src/index.ts`.
- Internal sub-components (`ControlKeys`, `Progress`, etc.) are not exported from the package.
- Icons are custom SVG components in `src/icons/`, not imported from `@mui/icons-material`.
- No external state libraries — all state is local via `useReducer`.
- No test framework is set up; interactive testing is done through Storybook.
