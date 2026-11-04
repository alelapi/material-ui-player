import { useEffect, useCallback, useReducer } from 'react';
import { Time, FadeSettings } from '../types';
import { State, ActionType } from '../state/types';
import reducer from '../state/reducer';
import { getFade, getUrl } from '../lib/utils';

const useMedia = (initialState: State, fadeSettings?: FadeSettings) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const pause = useCallback((el: HTMLMediaElement) => {
        el.pause();
        dispatch({ type: ActionType.PAUSE });
    }, []);

    const setCurrentTime = useCallback((el: HTMLMediaElement, value?: number) => {
        const currentFade = fadeSettings ? getFade(fadeSettings, el.duration, el.currentTime) : 1;
        const currentTime: number = value === undefined ?
            el.currentTime :
            (value / 100) * (el.duration || 0);

        if (value !== undefined) {
            el.currentTime = currentTime;
        }

        const progressTime: Time = {
            currentTime,
            duration: el.duration,
        };
        dispatch({
            type: ActionType.UPDATE_TIME,
            payload: {
                time: progressTime,
                fade: currentFade,
            }
        });
    }, [fadeSettings]);

    const load = useCallback((el: HTMLMediaElement, url: string) => {
        dispatch({
            type: ActionType.UPDATE_URL,
            payload: url,
        });
        el.src = url;
        el.load();
    }, []);

    const play = useCallback(async (el: HTMLMediaElement) => {
        // timeupdate also fires on seeks, so the UI stays in sync without polling
        el.ontimeupdate = () => setCurrentTime(el);
        dispatch({ type: ActionType.PLAY });
        try {
            await el.play();
        } catch (e) {
            dispatch({ type: ActionType.PAUSE });
            // AbortError: play() interrupted by a new load; NotAllowedError: autoplay blocked by the browser
            if (e instanceof DOMException && (e.name === 'AbortError' || e.name === 'NotAllowedError')) {
                return;
            }
            throw e;
        }
    }, [setCurrentTime]);

    const stop = useCallback((el: HTMLMediaElement) => {
        pause(el);
        setCurrentTime(el, 0);
    }, [pause, setCurrentTime]);

    const setProgress = useCallback(async (el: HTMLMediaElement, value: number) => {
        if (!el.src) {
            const audioUrl = await getUrl(state.src);
            load(el, audioUrl);
            el.onloadedmetadata = () => setCurrentTime(el, value);
            return;
        }

        setCurrentTime(el, value);
    }, [setCurrentTime, load, state.src]);

    const setSize = useCallback((el: HTMLVideoElement) => {
        const width = state.width || el.videoWidth;
        const height = state.width ? (el.videoHeight * width / el.videoWidth) : el.videoHeight;

        dispatch({
            type: ActionType.UPDATE_SIZE,
            payload: {
                width,
                height
            },
        });
    }, [state.width, dispatch]);

    const updateSrc = useCallback((src: string | Promise<string> | (() => Promise<string>) | (() => string)) => {
        dispatch({
            type: ActionType.UPDATE_KEY,
            payload: {
                key: Math.random(),
                src,
            },
        });
    }, []);

    useEffect(() => {
        if (Object.is(state.src, initialState.src)) return;
        dispatch({
            type: ActionType.RELOAD,
            payload: initialState,
        });
        // `initialState` is rebuilt by callers on every render and `state.src` must
        // stay the pre-reload value — only the src identity is a valid trigger here.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState.src]);

    useEffect(() => {
        updateSrc(state.src);
    }, [state.src, updateSrc]);

    return { state, pause, stop, setCurrentTime, load, play, setProgress, setSize };
}

export default useMedia;