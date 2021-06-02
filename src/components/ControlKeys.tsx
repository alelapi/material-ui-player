import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FastForward from '@material-ui/icons/FastForward';
import FastRewind from '@material-ui/icons/FastRewind';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import { IconButtonProps, MaterialUIColor } from '../types';

export interface ControlKeysProps {
    onPauseClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onPlayClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    backward?: boolean;
    forward?: boolean;
    playing: boolean;
    onForwardClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onBackwardClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onStopClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    color?: MaterialUIColor,
    BackwardProps?: IconButtonProps;
    StopProps?: IconButtonProps;
    PauseProps?: IconButtonProps;
    PlayProps?: IconButtonProps;
    ForwardProps?: IconButtonProps;
}

export const ControlKeys = (props: ControlKeysProps) => (
    <div>
        {props.backward !== undefined &&
            <IconButton
                color={props.color}
                disabled={props.backward === false}
                aria-label="Backward"
                onClick={props.onBackwardClick}
                {...props.BackwardProps?.attributes}
            >
                {props.BackwardProps?.icon || <FastRewind />}
            </IconButton>
        }
        <IconButton
            color={props.color}
            aria-label="Stop"
            onClick={props.onStopClick}
            {...props.StopProps?.attributes}
        >
            {props.StopProps?.icon || <StopIcon />}
        </IconButton>
        <IconButton
            color={props.color}
            disabled={!props.playing}
            aria-label="Pause"
            onClick={props.onPauseClick}
            {...props.PauseProps?.attributes}
        >
            {props.PauseProps?.icon || <Pause />}
        </IconButton>
        <IconButton
            color={props.color}
            disabled={props.playing}
            aria-label="Play"
            onClick={props.onPlayClick}
            {...props.PlayProps?.attributes}
        >
            {props.PlayProps?.icon || <PlayArrow />}
        </IconButton>
        {props.forward !== undefined &&
            <IconButton
                color={props.color}
                disabled={props.forward === false}
                aria-label="Forward"
                onClick={props.onForwardClick}
                {...props.ForwardProps?.attributes}
            >
                {props.ForwardProps?.icon || <FastForward />}
            </IconButton>
        }
    </div>
)

