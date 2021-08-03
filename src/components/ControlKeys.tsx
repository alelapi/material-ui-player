import React from 'react';
import { IconButton } from '@material-ui/core';
import { FastForward, FastRewind, PlayArrow, Pause, Stop as StopIcon } from '@material-ui/icons';
import { IconButtonProps, MaterialUIColor } from '../types';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
    createStyles({
        controls: {
            display: 'flex',
            alignItems: 'center',
        },
    })
);
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

export const ControlKeys = (props: ControlKeysProps) => {
    const classes = useStyles(props);
    return (
        <div className={classes.controls}>
            {props.backward !== undefined &&
                <IconButton
                    color={props.color}
                    disabled={props.backward === false}
                    aria-label="Backward"
                    onClick={props.onBackwardClick}
                    {...props.BackwardProps?.attributes}
                >
                    {props.BackwardProps?.icons?.[0] || <FastRewind />}
                </IconButton>
            }
            <IconButton
                color={props.color}
                aria-label="Stop"
                onClick={props.onStopClick}
                {...props.StopProps?.attributes}
            >
                {props.StopProps?.icons?.[0] || <StopIcon />}
            </IconButton>
            <IconButton
                color={props.color}
                disabled={!props.playing}
                aria-label="Pause"
                onClick={props.onPauseClick}
                {...props.PauseProps?.attributes}
            >
                {props.PauseProps?.icons?.[0] || <Pause />}
            </IconButton>
            <IconButton
                color={props.color}
                disabled={props.playing}
                aria-label="Play"
                onClick={props.onPlayClick}
                {...props.PlayProps?.attributes}
            >
                {props.PlayProps?.icons?.[0] || <PlayArrow />}
            </IconButton>
            {props.forward !== undefined &&
                <IconButton
                    color={props.color}
                    disabled={props.forward === false}
                    aria-label="Forward"
                    onClick={props.onForwardClick}
                    {...props.ForwardProps?.attributes}
                >
                    {props.ForwardProps?.icons?.[0] || <FastForward />}
                </IconButton>
            }
        </div>
    )
}

