import React, { useState } from 'react';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: theme.spacing(40),
        },
    })
);

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

const thumbThick = {
    'thin': 15,
    'medium': 20,
    'large': 25
};

const VolumeSlider = (props: VolumeBarProps) => withStyles((theme: Theme) => ({
    thumb: {
        width: thumbThick[props.thickness || 'thin'],
        height: thumbThick[props.thickness || 'thin'],
        color: theme.palette[props.color || 'primary'].main,
        display: props.thumb === false ? 'none' : 'block',
        marginTop: lineMargin[props.thickness || 'thin'] - 5,
    },
    rail: {
        height: lineThick[props.thickness || 'thin'],
        color: theme.palette[props.color || 'primary'].main,
        marginTop: lineMargin[props.thickness || 'thin'],
    },
    track: {
        height: lineThick[props.thickness || 'thin'],
        color: theme.palette[props.color || 'primary'].main,
        marginTop: lineMargin[props.thickness || 'thin'],
    },
}))(Slider);

export interface VolumeBarProps {
    mute?: boolean;
    player: HTMLMediaElement;
    color?: 'primary' | 'secondary';
    thickness?: 'thin' | 'medium' | 'large';
    thumb?: boolean;
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
                >
                    {muted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
            }
            <PlayerSlider
                value={volumeBar}
                onChange={onVolumeChange}
            />
        </div>
    );
};
