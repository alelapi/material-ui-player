import React  from 'react';
import { PlayerSettings } from './index';
export default class Player {
    ref: React.MutableRefObject<HTMLMediaElement | null> ;

    constructor(ref: React.MutableRefObject<HTMLMediaElement | null>, settings: PlayerSettings) {
        this.ref = ref;
        this.onended = settings.onended;
        this.autoplay = settings.autoplay;
        this.loop = settings.loop;
    }

    get duration(): number {
        return this.ref?.current?.duration || 0;
    }

    get speed(): number {
        return this.ref?.current?.playbackRate || 0;
    }

    set speed(value: number) {
        if (!this.ref?.current) return;
        this.ref.current.playbackRate = value;
    }

    get currentTime(): number {
        return this.ref?.current?.currentTime || 0;
    }

    set currentTime(value: number) {
        if (!this.ref?.current) return;
        this.ref.current.currentTime = value;
    }

    get volume(): number {
        return this.ref?.current?.volume || 0;
    }

    set volume(value: number) {
        if (!this.ref?.current) return;
        this.ref.current.volume = value;
    }

    get src(): string {
        return this.ref?.current?.src || '';
    }

    set src(value: string) {
        if (!this.ref?.current) return;
        this.ref.current.src = value;
    }

    get muted(): boolean {
        return this.ref?.current?.muted || false;
    }

    get paused(): boolean {
        return this.ref?.current?.paused || true;
    }

    set muted(value: boolean) {
        if (!this.ref?.current) return;
        this.ref.current.muted = value;
    }

    get loop(): boolean {
        return this.ref?.current?.loop || false;
    }

    set loop(value: boolean) {
        if (!this.ref?.current) return;
        this.ref.current.loop = value;
    }

    get autoplay(): boolean {
        return this.ref?.current?.autoplay || false;
    }

    set autoplay(value: boolean) {
        if (!this.ref?.current) return;
        this.ref.current.autoplay = value;
    }

    set onMetadata(callback: () => void) {
        if (!this.ref?.current) return;
        this.ref.current.onloadedmetadata = callback;
    }

    set onended(callback: () => void) {
        if (!this.ref?.current) return;
        this.ref.current.onended  = callback;
    }

    play() {
        this.ref?.current?.play();
    }

    pause() {
        this.ref?.current?.pause();
    }

    load() {
        this.ref?.current?.load();
    }
}
