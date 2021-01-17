import { Time } from '../types';

export enum ActionType {
    PAUSE,
    UPDATE_TIME,
    UPDATE_URL,
    PLAY,
    UPDATE_KEY,
    UPDATE_SIZE,
}

export interface StateAction {
    payload?: any,
    type: ActionType
}

export interface State {
    url: string;
    key: number;
    playing: boolean;
    fade?: number;
    height?: number;
    width?: number;
    time: Time;
    playerTimeout: ReturnType<typeof setInterval> | null;
    src: string | Promise<string> | (() => Promise<string>) | (() => string);
}