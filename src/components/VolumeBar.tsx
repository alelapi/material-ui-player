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

const VolumeSlider = withStyles({
    thumb: {
        width: 15,
        height: 15,
    },
    rail: {
        height: 5,
    },
    track: {
        height: 5,
    },
})(Slider);

interface VolumeBarProps {
    onVolumeChange: (volume: number) => void;
    onMuteClick: (muted: boolean) => void;
    mute?: boolean;
}

const VolumeBar = (props: VolumeBarProps) => {
    const [volumeBar, setVolumeBar] = useState(100);
    const [muted, setMuted] = useState(false);
    const classes = useStyles();

    const onVolumeChange = (_: any, newValue: number | number[]) => {
        const volume: number = (newValue as number);
        setVolumeBar(volume);
        props.onVolumeChange(volume / 100);
    };

    const onMuteClick = () => {
        const newState = !muted;
        setMuted(newState);
        props.onMuteClick(newState);
    };

    return (
        <div className={classes.root}>
            {props.mute && 
                <IconButton
                    color="primary"
                    aria-label="Mute"
                    onClick={onMuteClick}
                >
                {muted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
            }
            <VolumeSlider
                value={volumeBar}
                onChange={onVolumeChange}
            />
        </div>
    );
};

export default VolumeBar;
