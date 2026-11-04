import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMedia from './useMedia';
import { State } from '../state/types';

const makeState = (overrides: Partial<State> = {}): State => ({
    url: '',
    key: 1,
    playing: false,
    time: { currentTime: 0, duration: 0 },
    src: 'track.mp3',
    ...overrides,
});

interface FakeMediaElement {
    play: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;
    load: ReturnType<typeof vi.fn>;
    currentTime: number;
    duration: number;
    src: string;
    ontimeupdate: (() => void) | null;
    onloadedmetadata: (() => void) | null;
}

const makeEl = (overrides: Partial<FakeMediaElement> = {}): FakeMediaElement => ({
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    load: vi.fn(),
    currentTime: 0,
    duration: 100,
    src: '',
    ontimeupdate: null,
    onloadedmetadata: null,
    ...overrides,
});

const asMedia = (el: FakeMediaElement) => el as unknown as HTMLMediaElement;

// The initial state must be created once per test, not inside the renderHook
// callback: a fresh `src` identity on every render is treated as a source
// change and would reload in a loop (same contract as the component props).
describe('useMedia', () => {
    it('play starts playback and subscribes to timeupdate', async () => {
        const el = makeEl();
        const initial = makeState();
        const { result } = renderHook(() => useMedia(initial));

        await act(async () => {
            await result.current.play(asMedia(el));
        });

        expect(el.play).toHaveBeenCalledOnce();
        expect(result.current.state.playing).toBe(true);
        expect(el.ontimeupdate).toBeTypeOf('function');

        el.currentTime = 30;
        act(() => {
            el.ontimeupdate!();
        });
        expect(result.current.state.time).toEqual({ currentTime: 30, duration: 100 });
    });

    it('play resets state when the browser blocks playback', async () => {
        const el = makeEl({
            play: vi.fn().mockRejectedValue(new DOMException('blocked', 'NotAllowedError')),
        });
        const initial = makeState();
        const { result } = renderHook(() => useMedia(initial));

        await act(async () => {
            await result.current.play(asMedia(el));
        });

        expect(result.current.state.playing).toBe(false);
    });

    it('play rethrows unexpected errors after resetting state', async () => {
        const el = makeEl({
            play: vi.fn().mockRejectedValue(new Error('boom')),
        });
        const initial = makeState();
        const { result } = renderHook(() => useMedia(initial));

        await expect(
            act(async () => {
                await result.current.play(asMedia(el));
            }),
        ).rejects.toThrow('boom');
        expect(result.current.state.playing).toBe(false);
    });

    it('pause stops the element and clears playing', async () => {
        const el = makeEl();
        const initial = makeState();
        const { result } = renderHook(() => useMedia(initial));

        await act(async () => {
            await result.current.play(asMedia(el));
        });
        act(() => {
            result.current.pause(asMedia(el));
        });

        expect(el.pause).toHaveBeenCalledOnce();
        expect(result.current.state.playing).toBe(false);
    });

    it('stop pauses and rewinds to the start', async () => {
        const el = makeEl({ currentTime: 42 });
        const initial = makeState();
        const { result } = renderHook(() => useMedia(initial));

        act(() => {
            result.current.stop(asMedia(el));
        });

        expect(el.pause).toHaveBeenCalledOnce();
        expect(el.currentTime).toBe(0);
        expect(result.current.state.time.currentTime).toBe(0);
    });

    it('setCurrentTime seeks by percentage', () => {
        const el = makeEl();
        const initial = makeState();
        const { result } = renderHook(() => useMedia(initial));

        act(() => {
            result.current.setCurrentTime(asMedia(el), 50);
        });

        expect(el.currentTime).toBe(50);
        expect(result.current.state.time).toEqual({ currentTime: 50, duration: 100 });
    });

    it('setProgress loads the source first when nothing is loaded yet', async () => {
        const el = makeEl();
        const initial = makeState({ src: async () => 'resolved.mp3' });
        const { result } = renderHook(() => useMedia(initial));

        await act(async () => {
            await result.current.setProgress(asMedia(el), 25);
        });

        expect(el.src).toBe('resolved.mp3');
        expect(el.load).toHaveBeenCalledOnce();
        expect(result.current.state.url).toBe('resolved.mp3');

        act(() => {
            el.onloadedmetadata!();
        });
        expect(el.currentTime).toBe(25);
        expect(result.current.state.time.currentTime).toBe(25);
    });

    it('computes fade from fade settings on time updates', () => {
        const el = makeEl({ currentTime: 98 });
        const initial = makeState();
        const { result } = renderHook(() =>
            useMedia(initial, { fadeInTime: 4, fadeOutTime: 4 }),
        );

        act(() => {
            result.current.setCurrentTime(asMedia(el));
        });

        expect(result.current.state.fade).toBe(0.5);
    });
});
