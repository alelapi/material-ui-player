export { default as Player } from './player';
export { default as PlayerVideo } from './playerVideo';

export interface Time {
    currentTime: number;
    duration: number;
}

export interface FadeSettings {
    fadeInTime: number;
    fadeOutTime: number;
}

export interface PlayerSettings {
    onended: () => void;
    loop: boolean;
    autoplay: boolean;
}

