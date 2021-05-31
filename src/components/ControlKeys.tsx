import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FastForward from '@material-ui/icons/FastForward';
import FastRewind from '@material-ui/icons/FastRewind';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';

export interface ControlKeysProps {
    onPauseClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onPlayClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    backward?: boolean;
    forward?: boolean;
    playing: boolean;
    onForwardClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onBackwardClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onStopClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    color?: 'primary' | 'secondary',
}

export const ControlKeys = (props: ControlKeysProps) => (
    <div>
        {props.backward !== undefined &&
            <IconButton
                color={props.color}
                disabled={props.backward === false}
                aria-label="Backward"
                onClick={props.onBackwardClick}
            >
                <FastRewind />
            </IconButton>
        }
        <IconButton
            color={props.color}
            aria-label="Stop"
            onClick={props.onStopClick}
        >
            <StopIcon />
        </IconButton>
        <IconButton
            color={props.color}
            disabled={!props.playing}
            aria-label="Pause"
            onClick={props.onPauseClick}
        >
            <Pause />
        </IconButton>
        <IconButton
            color={props.color}
            disabled={props.playing}
            aria-label="Play"
            onClick={props.onPlayClick}
        >
            <PlayArrow />
        </IconButton>
        {props.forward !== undefined &&
            <IconButton
                color={props.color}
                disabled={props.forward === false}
                aria-label="Forward"
                onClick={props.onForwardClick}
            >
                <FastForward />
            </IconButton>
        }
    </div>
)

