import { useEffect, useCallback, useReducer } from 'react';
import { Time, FadeSettings } from '../types';
import { State, ActionType } from '../state/types';
import reducer from '../state/reducer';
import { getFade, getUrl } from '../lib/utils';

const useMedia = (initialState: State, fadeSettings?: FadeSettings) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const pause = useCallback((el: HTMLMediaElement) => {
        el.pause();
        state.playerTimeout && clearInterval(state.playerTimeout);
        dispatch({ type: ActionType.PAUSE });
    }, [state.playerTimeout]);

    const setCurrentTime = useCallback((el: HTMLMediaElement, value?: number) => {
        const currentFade = fadeSettings ? getFade(fadeSettings, el.duration, el.currentTime) : undefined;
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
        dispatch({ 
            type: ActionType.PLAY,
            payload: setInterval(() => {
                setCurrentTime(el)
            }, 50),
        });
        await el.play();
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

    useEffect(() => {
        dispatch({ 
            type: ActionType.UPDATE_KEY,
            payload: Math.random(),
        });
    }, []);

    useEffect(() => {
        return () => {
            state.playerTimeout && clearInterval(state.playerTimeout);
        }
    }, [state.playerTimeout]);

    return { state, pause, stop, setCurrentTime, load, play, setProgress, setSize };
}

export default useMedia;