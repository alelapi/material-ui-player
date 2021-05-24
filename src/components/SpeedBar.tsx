import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            marginRight: theme.spacing(4),
            alignItems: 'center',
        },
        speedButton: {
            fontSize: 10,
            padding: 2,
            minWidth: theme.spacing(3),
            marginRight: theme.spacing(1),
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

const SpeedSlider = (props: SpeedBarProps) => withStyles((theme: Theme) => ({
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

export interface SpeedBarProps {
    player: HTMLMediaElement;
    color?: 'primary' | 'secondary';
    thickness?: 'thin' | 'medium' | 'large';
    thumb?: boolean;
}

export const SpeedBar = (props: SpeedBarProps) => {
    const defaultSpeed: number = 50;
    const [speedBar, setSpeedBar] = useState(defaultSpeed);
    const classes = useStyles();
    const PlayerSpeedBar = SpeedSlider(props);

    const toSpeedValue = (speed: number) => speed * 0.018 + 0.1;

    const onSpeedChange = (_: any, newValue: number | number[]) => {
        const speed: number = (newValue as number);
        setSpeedBar(speed);
        props.player.playbackRate = toSpeedValue(speed);
    };

    const onNormalSpeedClick = () => {
        setSpeedBar(defaultSpeed);
        props.player.playbackRate = toSpeedValue(defaultSpeed);
    };

    return (
        <div className={classes.root}>
            <Button
                color={props.color || 'primary'}
                variant="contained"
                aria-label="Normal speed"
                size="small"
                className={classes.speedButton}
                onClick={onNormalSpeedClick}
            >
                1x
            </Button>
            <PlayerSpeedBar
                defaultValue={defaultSpeed}
                value={speedBar}
                onChange={onSpeedChange}
            />
        </div>
    );
};

