import React from 'react';
import IconButton from '@mui/material/IconButton';
import FastForward from '@mui/icons-material/FastForward';
import FastRewind from '@mui/icons-material/FastRewind';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import { IconButtonProps, MaterialUIColor } from '../types';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

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
    const { color = 'primary' } = props;
    const classes = useStyles(props);
    return (
        <div className={classes.controls}>
            {props.backward !== undefined &&
                <IconButton
                    color={color}
                    disabled={props.backward === false}
                    aria-label="Backward"
                    onClick={props.onBackwardClick}
                    {...props.BackwardProps?.attributes}
                    size="large">
                    {props.BackwardProps?.icons?.[0] || <FastRewind />}
                </IconButton>
            }
            <IconButton
                color={color}
                aria-label="Stop"
                onClick={props.onStopClick}
                {...props.StopProps?.attributes}
                size="large">
                {props.StopProps?.icons?.[0] || <StopIcon />}
            </IconButton>
            <IconButton
                color={color}
                disabled={!props.playing}
                aria-label="Pause"
                onClick={props.onPauseClick}
                {...props.PauseProps?.attributes}
                size="large">
                {props.PauseProps?.icons?.[0] || <Pause />}
            </IconButton>
            <IconButton
                color={color}
                disabled={props.playing}
                aria-label="Play"
                onClick={props.onPlayClick}
                {...props.PlayProps?.attributes}
                size="large">
                {props.PlayProps?.icons?.[0] || <PlayArrow />}
            </IconButton>
            {props.forward !== undefined &&
                <IconButton
                    color={color}
                    disabled={props.forward === false}
                    aria-label="Forward"
                    onClick={props.onForwardClick}
                    {...props.ForwardProps?.attributes}
                    size="large">
                    {props.ForwardProps?.icons?.[0] || <FastForward />}
                </IconButton>
            }
        </div>
    );
}

