import React, { useState } from 'react';
import { Button, Slider } from '@material-ui/core';
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import { MaterialUIColor, SliderThickness } from '../types';
import { getSliderSizes } from '../lib/utils';

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

const SpeedSlider = (props: SpeedBarProps) => withStyles((theme: Theme) => ({
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

export interface SpeedBarProps {
    player: HTMLMediaElement;
    color?: MaterialUIColor;
    thickness?: SliderThickness;
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

