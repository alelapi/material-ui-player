import { StateAction, State, ActionType } from './types';

const reducer = (state: State, action: StateAction): State => {
    switch (action.type) {
        case ActionType.PAUSE:
            return {
                ...state,
                playing: false
            };
        case ActionType.UPDATE_TIME:
            return {
                ...state,
                time: action.payload.time,
                fade: action.payload.fade || 0,
            };
        case ActionType.UPDATE_URL:
            return {
                ...state,
                url: action.payload
            };
        case ActionType.PLAY:
            return {
                ...state,
                playing: true,
                playerTimeout: action.payload,
            };
        case ActionType.UPDATE_KEY:
            return {
                ...state,
                key: action.payload.key,
                src: action.payload.src,
            };
        case ActionType.UPDATE_SIZE:
            return {
                ...state,
                width: action.payload.width,
                height: action.payload.height,
            };
        case ActionType.RELOAD:
            return {
                ...action.payload,
            };
        default:
            return state;
    }
}

export default reducer;