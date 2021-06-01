export interface Time {
    currentTime: number;
    duration: number;
}

export interface FadeSettings {
    fadeInTime: number;
    fadeOutTime: number;
}

export interface BaseProps {
    src: string | Promise<string> | (() => Promise<string>) | (() => string);
    onEnded?: () => void;
    color?: 'primary' | 'secondary';
}

export interface MaterialUIMediaProps extends BaseProps {
    forward?: boolean;
    backward?: boolean;
    onForwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onBackwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    autoplay?: boolean;
    loop?: boolean;
    width?: number;
    speed?: boolean;
    thickness?: 'thin' | 'medium' | 'large';
}

