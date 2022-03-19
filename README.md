# Material UI Player

[![NPM version][npm-image]][npm-url]
![Types included][types-image]
[![install size](https://packagephobia.com/badge?p=material-ui-player@0.1.12)](https://packagephobia.com/result?p=material-ui-player@0.1.12)
[![minisize][min-image]][min-url]

[npm-image]: https://img.shields.io/npm/v/material-ui-player.svg
[npm-url]: https://npmjs.org/package/material-ui-player
[types-image]: https://badgen.net/npm/types/tslib
[min-image]:https://badgen.net/bundlephobia/min/material-ui-player
[min-url]:https://bundlephobia.com/result?p=material-ui-player

Simple React components for playing audio and video, using [material-ui](https://material-ui.com/)
- AudioCard: Audio element with controls
- VideoCard: Video element with controls
- SoundButton: IconButton to only play audio files (ideal for short audios)

## Contents

- [Why use this package](#why-use-this-package)
- [Usage](#usage)
- [Props](#props)
- [Callback props](#callback-props)
- [Note](#note)
- [License](#license)

### Why use this package

- Allow customization on traditional ```<audio>``` and ```<video>``` HTML elements
- Easy play media files stored in Firebase Storage or anywhere need to retrieve the download URL
- Material-UI components like : theming, customizations and low level components
- Use modern React hook and coding conventions
- Documentation made with Storybook

### Usage

```bash
npm install material-ui-player # or yarn add material-ui-player
```

```jsx
import React from 'react'
import { AudioCard, VideoCard } from 'material-ui-player'

// Relative URL - play a media from same origin
<AudioCard src={'/audio.mp3'} />
<VideoCard src={'/video.mp4'} />
<SoundButton src={'/audio.mp3'} />

// Absolute URL - play a media from external source
<AudioCard src={'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3'} />
<VideoCard src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} />
<SoundButton src={'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3'} />

// Promise retrieve URL
<AudioCard src={fetch('<my url>')} />
<VideoCard src={fetch('<my url>')} />
<SoundButton src={fetch('<my url>')} />

```
### Props

Prop | Description | Default | Component
---- | ----------- | ------- | ---------
`src` | `string` or `Promise<string>` or `() => string` or `() => Promise<string>` <br /> - The url of a media to play&nbsp; ◦ &nbsp;Can be a relative or absolute url <br /> A Promise resolved into a string (the url) after Play button clicked. This case can be useful when you are using Firebase Storage, where you need to call an API to retrieve the download Url. | (mandatory) | all
`forward` | Set to `true` or falsy to show forward button  | `undefined` | AudioCard, VideoCard
`backward` | Set to `true` or falsy to show backward button | `undefined` | AudioCard, VideoCard
`autoplay` | Set to `true` or falsy to set autoplay on audio | `undefined` | AudioCard, VideoCard
`loop` | Set to `true` or falsy to set loop on audio | `undefined` | AudioCard, VideoCard
`width` | Set the width of the player | Audio: `undefined` (fit parent container) <br /> Video: `undefined` (video maintain original size, card fit parent container) | AudioCard, VideoCard
`speed` | Set to `true` or falsy to show speed control | `undefined` | AudioCard, VideoCard
`mute` | Set to `true` or falsy to show mute button | `undefined` | AudioCard, VideoCard
`fadeSettings` | Object with `fadeInTime` and `fadeOutTime` (number, seconds) to fadein and fadeout video | `undefined` | VideoCard
`thickness` | Set sliders line thickness (`thin`, `medium` or `large`) | `medium` | AudioCard, VideoCard
`background` | Set container card background | `inherit` | all
`PlayProps` | enable customization using Material UI IconButton props | `undefined` | all
`BackwardProps`, `StopProps`, `PauseProps`, `ForwardProps`, `MuteProps` | enable customization using Material UI IconButton props | `undefined` | AudioCard, VideoCard


### Callback props

Callback props take a function that gets fired on various player events:

Prop | Description | Component
---- | ----------- | ---------
`onForwardClick` | Called when forward button is clicked | AudioCard, VideoCard
`onBackwardClick` | Called when backward button is clicked | AudioCard, VideoCard
`onEnded` | Called when media ended | AudioCard, VideoCard

### Demo

Try it using the [storyboard](https://alelapi.github.io/material-ui-player/)

### Note
Please Note: this module has following peerDependencies:
```
    "@mui/material": ">=5.0.0",
    "@mui/styles": ">=5.0.0",
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
```

NB: Still need to use Material UI 4? Use version 0.2.6
  
### License

Released under MIT License


