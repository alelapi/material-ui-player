import React from 'react';
import IconButton from '@mui/material/IconButton';
import { IconButtonProps, MaterialUIColor } from '../types';
import { styled } from '@mui/material/styles';
import { Play, Pause, Stop, Rewind, Forward } from '../icons';

const ControlsRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
        '& .MuiButtonBase-root': {
            padding: theme.spacing(1),
        }
    }
}));

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

const ControlKeys = (props: ControlKeysProps) => {
    const { color = 'primary' } = props;
    return (
        <ControlsRoot>
            {props.backward !== undefined &&
                <IconButton
                    color={color}
                    disabled={props.backward === false}
                    aria-label="Backward"
                    onClick={props.onBackwardClick}
                    {...props.BackwardProps?.attributes}
                    size="large">
                    {props.BackwardProps?.icons?.[0] || <Rewind />}
                </IconButton>
            }
            <IconButton
                color={color}
                aria-label="Stop"
                onClick={props.onStopClick}
                {...props.StopProps?.attributes}
                size="large">
                {props.StopProps?.icons?.[0] || <Stop />}
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
                {props.PlayProps?.icons?.[0] || <Play />}
            </IconButton>
            {props.forward !== undefined &&
                <IconButton
                    color={color}
                    disabled={props.forward === false}
                    aria-label="Forward"
                    onClick={props.onForwardClick}
                    {...props.ForwardProps?.attributes}
                    size="large">
                    {props.ForwardProps?.icons?.[0] || <Forward />}
                </IconButton>
            }
        </ControlsRoot>
    );
}

export default ControlKeys;