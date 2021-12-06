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
    color?: MaterialUIColor;
    PlayProps?: IconButtonProps;
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
    thickness?: SliderThickness;
    BackwardProps?: IconButtonProps;
    StopProps?: IconButtonProps;
    PauseProps?: IconButtonProps;
    ForwardProps?: IconButtonProps;
    MuteProps?: IconButtonProps;
    background?: string;
}

export interface IconButtonProps {
    attributes?: Record<string, any>;
    icons?: Array<JSX.Element>;
}

export type MaterialUIColor = 'inherit' | 'primary' | 'secondary';

export type SliderThickness = 'thin' | 'medium' | 'large';
