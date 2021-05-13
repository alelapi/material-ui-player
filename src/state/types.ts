import { Time } from '../types';

export enum ActionType {
    PAUSE = "PAUSE",
    UPDATE_TIME = "UPDATE_TIME",
    UPDATE_URL = "UPDATE_URL",
    PLAY = "PLAY",
    UPDATE_KEY = "UPDATE_KEY",
    UPDATE_SIZE = "UPDATE_SIZE",
    RELOAD = "RELOAD",
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