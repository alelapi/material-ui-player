<h1>
  Material UI Player
</h1>

<p align='center'>
  A simple React component for playing audio and video, using <a href="https://material-ui.com/">Material UI</a>
</p>

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

// Absolute URL - play a media from external source
<AudioCard src={'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3'} />
<VideoCard src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} />

// Promise retrieve URL
<AudioCard src={fetch('<my url>')} />
<VideoCard src={fetch('<my url>')} />

```

### Props

Prop | Description | Default | Component
---- | ----------- | ------- | ---------
`src` | `string` or `Promise<string>` <br /> - The url of a media to play&nbsp; ◦ &nbsp;Can be a relative or absolute url <br /> A Promise resolved into a string (the url) after Play button clicked. This case can be useful when you are using Firebase Storage, where you need to call an API to retrieve the download Url. | (mandatory) | Audio, Video
`forward` | Set to `true` or falsy to show forward button  | `undefined` | Audio, Video
`backward` | Set to `true` or falsy to show backward button | `undefined` | Audio, Video
`autoplay` | Set to `true` or falsy to set autoplay on audio | `undefined` | Audio, Video
`loop` | Set to `true` or falsy to set loop on audio | `undefined` | Audio, Video
`width` | Set the width of the player | Audio: `undefined` (fit parent container) <br /> Video: `undefined` (video maintain original size, card fit parent container) | Audio, Video
`speed` | Set to `true` or falsy to show speed control | `undefined` | Audio, Video
`mute` | Set to `true` or falsy to show mute button | `undefined` | Audio, Video
`fadeSettings` | Object with `fadeInTime` and `fadeOutTime` (number, seconds) to fadein and fadeout video | `undefined` | Video

#### Callback props

Callback props take a function that gets fired on various player events:

Prop | Description
---- | -----------
`onForwardClick` | Called when forward button is clicked
`onBackwardClick` | Called when backward button is clicked
`onEnded` | Called when media ended


#### Please note:
This module has following peerDependencies:
 React (>=17.0.0)
 Material UI (@material-ui/core: >=4.0.0, @material-ui/icons: >=4.0.0). 


