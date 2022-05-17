import { FadeSettings, Time, SliderThickness } from '../types';

const getTime = (n: number): string => {
    const seconds: number = !Number.isFinite(n) ? 0 : Math.trunc(n);
    const dateString: string = new Date(seconds * 1000).toISOString();
    return seconds >= 3600 ? dateString.substr(11, 8) : dateString.substr(14, 5);
};

export const timeToPercentage = (time?: Time): number => time ? (time.currentTime / time.duration) * 100 : 0;
export const timeToString = (time: Time): string => `${getTime(time.currentTime)}/${getTime(time.duration)}`;

export const getMimeType = (url: string): string => {
    const mimeMap: Record<string, string> = {
        mid: 'audio/midi',
        midi: 'audio/midi',
        kar: 'audio/midi',
        mp3: 'audio/mpeg',
        ogg: 'audio/ogg',
        ra: 'audio/x-realaudio',
        '3gpp': 'video/3gpp',
        '3gp': 'video/3gpp',
        mpeg: 'video/mpeg',
        mpg: 'video/mpeg',
        mov: 'video/quicktime',
        flv: 'video/x-flv',
        mng: 'video/x-mng',
        asx: 'video/x-ms-asf',
        asf: 'video/x-ms-asf',
        wmv: 'video/x-ms-wmv',
        avi: 'video/x-msvideo',
        m4v: 'video/mp4',
        mp4: 'video/mp4',
    };
    return mimeMap[url.split(/[#?]/)[0].split('.').pop()!.trim()];
};

export const getFade = (settings: FadeSettings | undefined, duration: number, currentTime: number): number => {
    if (!settings) return 1;

    const fadeOut: number = duration - currentTime;
    if (fadeOut <= settings.fadeOutTime) {
        return fadeOut / settings.fadeOutTime;
    }

    if (currentTime <= settings.fadeInTime) {
        return currentTime / settings.fadeInTime;
    }

    return 1;
};

export const getUrl = async (src: string | Promise<string> | (() => Promise<string>) | (() => string)): Promise<string> => {
    if (typeof src === 'function') return await src();
    return await src;
};

const lineThick = {
    'thin': 5,
    'medium': 10,
    'large': 15
};

const lineMargin = {
    'thin': -1,
    'medium': -4,
    'large': -6
};

export const thumbThick = {
    'thin': 15,
    'medium': 20,
    'large': 25
};

export const getSliderSizes = (thickness?: SliderThickness, others?: any) =>
({
    '& .MuiSlider-thumb': {
        width: thumbThick[thickness || 'thin'],
        height: thumbThick[thickness || 'thin'],
        marginTop: lineMargin[thickness || 'thin'],
        ...others.thumb
    },
    '& .MuiSlider-rail': {
        height: lineThick[thickness || 'thin'],
        marginTop: lineMargin[thickness || 'thin'],
        borderRadius: lineThick[thickness || 'thin'],
        ...others.rail
    },
    '& .MuiSlider-track': {
        height: lineThick[thickness || 'thin'],
        marginTop: lineMargin[thickness || 'thin'],
        borderRadius: lineThick[thickness || 'thin'],
        ...others.track
    }
})
