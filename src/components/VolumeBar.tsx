import React, { useState } from 'react';
import { VolumeOff, VolumeUp } from '@material-ui/icons';
import { IconButton, Slider } from '@material-ui/core';
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import { MaterialUIColor, SliderThickness, IconButtonProps } from '../types';
import { getSliderSizes } from '../lib/utils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: theme.spacing(40),
            marginRight: theme.spacing(2)
        },
    })
);

const VolumeSlider = (props: VolumeBarProps) => withStyles((theme: Theme) => ({
    ...getSliderSizes(props.thickness, ({
        thumb: {
            color: theme.palette[props.color || 'primary'].main,
            display: props.thumb === false ? 'none' : 'block',
        },
        rail: {
            color: theme.palette[props.color || 'primary'].main,
        },
        track: {
            color: theme.palette[props.color || 'primary'].main,
        },
    })),
}))(Slider);

export interface VolumeBarProps {
    mute?: boolean;
    player: HTMLMediaElement;
    color?: MaterialUIColor;
    thickness?: SliderThickness;
    thumb?: boolean;
    MuteProps?: IconButtonProps;
}

export const VolumeBar = (props: VolumeBarProps) => {
    const [volumeBar, setVolumeBar] = useState(100);
    const [muted, setMuted] = useState(false);
    const classes = useStyles();
    const PlayerSlider = VolumeSlider(props);

    const onVolumeChange = (_: any, newValue: number | number[]) => {
        const volume: number = (newValue as number);
        setVolumeBar(volume);
        props.player.volume = volume / 100;
    };

    const onMuteClick = () => {
        const newState = !muted;
        setMuted(newState);
        props.player.muted = newState;
    };

    return (
        <div className={classes.root}>
            {props.mute &&
                <IconButton
                    color={props.color || 'primary'}
                    aria-label="Mute"
                    onClick={onMuteClick}
                    {...props.MuteProps?.attributes}
                >
                    {muted ?
                        props.MuteProps?.icons?.[0] || <VolumeOff /> :
                        props.MuteProps?.icons?.[1] || <VolumeUp />}
                </IconButton>
            }
            <PlayerSlider
                value={volumeBar}
                onChange={onVolumeChange}
            />
        </div>
    );
};
