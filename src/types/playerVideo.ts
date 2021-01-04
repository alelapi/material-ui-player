import Player from './player';

export default class PlayerVideo extends Player {
    get width(): number {
        return (this.ref?.current as HTMLVideoElement)?.videoWidth || 0;
    }

    get height(): number {
        return (this.ref?.current as HTMLVideoElement)?.videoHeight || 0;
    }
}