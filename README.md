<h1>
  Material UI Player
</h1>

[![NPM version][npm-image]][npm-url]

[npm-url]: https://npmjs.org/package/material-ui-player

<p align='center'>
  Simple React components for playing audio and video, using <a href="https://material-ui.com/">Material UI</a>
</p>
<ul>
<li>AudioCard: Audio element with controls</li>
<li>VideoCard: Video element with controls</li>
<li>SoundButton: IconButton to only play audio files (ideal for short audios)</li>
</ul>

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
`src` | `string` or `Promise<string>` or `() => string` or `() => Promise<string>` <br /> - The url of a media to play&nbsp; ◦ &nbsp;Can be a relative or absolute url <br /> A Promise resolved into a string (the url) after Play button clicked. This case can be useful when you are using Firebase Storage, where you need to call an API to retrieve the download Url. | (mandatory) | AudioCard, VideoCard, SoundButton
`forward` | Set to `true` or falsy to show forward button  | `undefined` | AudioCard, VideoCard
`backward` | Set to `true` or falsy to show backward button | `undefined` | AudioCard, VideoCard
`autoplay` | Set to `true` or falsy to set autoplay on audio | `undefined` | AudioCard, VideoCard
`loop` | Set to `true` or falsy to set loop on audio | `undefined` | AudioCard, VideoCard
`width` | Set the width of the player | Audio: `undefined` (fit parent container) <br /> Video: `undefined` (video maintain original size, card fit parent container) | AudioCard, VideoCard
`speed` | Set to `true` or falsy to show speed control | `undefined` | AudioCard, VideoCard
`mute` | Set to `true` or falsy to show mute button | `undefined` | AudioCard, VideoCard
`fadeSettings` | Object with `fadeInTime` and `fadeOutTime` (number, seconds) to fadein and fadeout video | `undefined` | VideoCard

#### Callback props

Callback props take a function that gets fired on various player events:

Prop | Description | Component
---- | ----------- | ---------
`onForwardClick` | Called when forward button is clicked | AudioCard, VideoCard
`onBackwardClick` | Called when backward button is clicked | AudioCard, VideoCard
`onEnded` | Called when media ended | AudioCard, VideoCard


#### Please note:
This module has following peerDependencies:
 React (>=17.0.0)
 Material UI (@material-ui/core: >=4.0.0, @material-ui/icons: >=4.0.0). 


