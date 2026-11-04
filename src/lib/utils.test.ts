import { describe, it, expect } from 'vitest';
import {
    timeToPercentage,
    timeToString,
    getMimeType,
    getFade,
    getUrl,
    getSliderSizes,
    thumbThick,
} from './utils';

describe('timeToString', () => {
    it('formats minutes and seconds under an hour', () => {
        expect(timeToString({ currentTime: 61, duration: 125 })).toBe('01:01/02:05');
    });

    it('formats hours when duration passes 3600s', () => {
        expect(timeToString({ currentTime: 3661, duration: 7322 })).toBe('01:01:01/02:02:02');
    });

    it('falls back to zero for non-finite values', () => {
        expect(timeToString({ currentTime: NaN, duration: Infinity })).toBe('00:00/00:00');
    });
});

describe('timeToPercentage', () => {
    it('returns the elapsed percentage', () => {
        expect(timeToPercentage({ currentTime: 25, duration: 100 })).toBe(25);
    });

    it('returns 0 for missing time, zero or non-finite duration', () => {
        expect(timeToPercentage(undefined)).toBe(0);
        expect(timeToPercentage({ currentTime: 10, duration: 0 })).toBe(0);
        expect(timeToPercentage({ currentTime: 10, duration: Infinity })).toBe(0);
    });
});

describe('getMimeType', () => {
    it('maps common audio and video extensions', () => {
        expect(getMimeType('song.mp3')).toBe('audio/mpeg');
        expect(getMimeType('sound.wav')).toBe('audio/wav');
        expect(getMimeType('clip.webm')).toBe('video/webm');
        expect(getMimeType('movie.m4v')).toBe('video/mp4');
    });

    it('is case-insensitive', () => {
        expect(getMimeType('SONG.MP3')).toBe('audio/mpeg');
    });

    it('ignores query strings and fragments', () => {
        expect(getMimeType('https://cdn.example.com/a.mp4?sig=abc#t=10')).toBe('video/mp4');
    });

    it('returns undefined for unknown or missing extensions', () => {
        expect(getMimeType('file.xyz')).toBeUndefined();
        expect(getMimeType('no-extension')).toBeUndefined();
        expect(getMimeType('')).toBeUndefined();
    });
});

describe('getFade', () => {
    const settings = { fadeInTime: 5, fadeOutTime: 5 };

    it('returns 1 without settings', () => {
        expect(getFade(undefined, 100, 50)).toBe(1);
    });

    it('fades in at the start', () => {
        expect(getFade(settings, 100, 0)).toBe(0);
        expect(getFade(settings, 100, 2.5)).toBe(0.5);
    });

    it('is 1 in the middle', () => {
        expect(getFade(settings, 100, 50)).toBe(1);
    });

    it('fades out at the end', () => {
        expect(getFade(settings, 100, 97.5)).toBe(0.5);
        expect(getFade(settings, 100, 100)).toBe(0);
    });
});

describe('getUrl', () => {
    it('resolves plain strings', async () => {
        await expect(getUrl('a.mp3')).resolves.toBe('a.mp3');
    });

    it('resolves promises', async () => {
        await expect(getUrl(Promise.resolve('a.mp3'))).resolves.toBe('a.mp3');
    });

    it('resolves sync and async functions', async () => {
        await expect(getUrl(() => 'a.mp3')).resolves.toBe('a.mp3');
        await expect(getUrl(async () => 'a.mp3')).resolves.toBe('a.mp3');
    });
});

describe('getSliderSizes', () => {
    it('defaults to thin and tolerates a missing overrides argument', () => {
        const sizes = getSliderSizes();
        expect(sizes['& .MuiSlider-thumb'].width).toBe(thumbThick.thin);
    });

    it('applies thickness and merges overrides', () => {
        const sizes = getSliderSizes('large', { thumb: { backgroundColor: 'red' } });
        expect(sizes['& .MuiSlider-thumb'].width).toBe(thumbThick.large);
        expect(sizes['& .MuiSlider-thumb'].backgroundColor).toBe('red');
    });
});
