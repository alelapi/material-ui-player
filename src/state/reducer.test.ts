import { describe, it, expect } from 'vitest';
import reducer from './reducer';
import { ActionType, State } from './types';

const baseState: State = {
    url: '',
    key: 1,
    playing: false,
    time: { currentTime: 0, duration: 0 },
    src: 'track.mp3',
};

describe('reducer', () => {
    it('PLAY sets playing', () => {
        expect(reducer(baseState, { type: ActionType.PLAY }).playing).toBe(true);
    });

    it('PAUSE clears playing', () => {
        const playing = { ...baseState, playing: true };
        expect(reducer(playing, { type: ActionType.PAUSE }).playing).toBe(false);
    });

    it('UPDATE_TIME sets time and fade, defaulting fade to 0', () => {
        const time = { currentTime: 10, duration: 100 };
        const next = reducer(baseState, { type: ActionType.UPDATE_TIME, payload: { time, fade: 0.5 } });
        expect(next.time).toEqual(time);
        expect(next.fade).toBe(0.5);
        expect(reducer(baseState, { type: ActionType.UPDATE_TIME, payload: { time } }).fade).toBe(0);
    });

    it('UPDATE_URL sets url', () => {
        expect(reducer(baseState, { type: ActionType.UPDATE_URL, payload: 'a.mp3' }).url).toBe('a.mp3');
    });

    it('UPDATE_KEY sets key and src', () => {
        const next = reducer(baseState, { type: ActionType.UPDATE_KEY, payload: { key: 42, src: 'b.mp3' } });
        expect(next.key).toBe(42);
        expect(next.src).toBe('b.mp3');
    });

    it('UPDATE_SIZE sets width and height', () => {
        const next = reducer(baseState, { type: ActionType.UPDATE_SIZE, payload: { width: 320, height: 180 } });
        expect(next.width).toBe(320);
        expect(next.height).toBe(180);
    });

    it('RELOAD replaces the whole state', () => {
        const fresh = { ...baseState, src: 'c.mp3', key: 7 };
        expect(reducer({ ...baseState, playing: true }, { type: ActionType.RELOAD, payload: fresh })).toEqual(fresh);
    });

    it('returns current state for unknown actions', () => {
        expect(reducer(baseState, { type: 'NOPE' as ActionType })).toBe(baseState);
    });
});
