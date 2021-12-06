import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Slider, { SliderProps } from '@mui/material/Slider';
import { Theme, styled } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
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

const SpeedSlider = styled((props: ProgressSliderProps & SliderProps) => <Slider {...props}/>)(({ theme, thickness, color, thumb }) => ({
    ...getSliderSizes(thickness, ({
        thumb: {
            color: theme.palette[color || 'primary'].main,
            display: thumb === false ? 'none' : 'block',
        },
        rail: {
            color: theme.palette[color || 'primary'].main,
        },
        track: {
            color: theme.palette[color || 'primary'].main,
        },
    }))
}));

interface ProgressSliderProps {
    color?: MaterialUIColor;
    thickness?: SliderThickness;
    thumb?: boolean;
}

export interface SpeedBarProps {
    player: HTMLMediaElement;
}

export const SpeedBar = (props: SpeedBarProps & ProgressSliderProps) => {
    const defaultSpeed: number = 50;
    const [speedBar, setSpeedBar] = useState(defaultSpeed);
    const classes = useStyles();

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
            <SpeedSlider
                defaultValue={defaultSpeed}
                value={speedBar}
                onChange={onSpeedChange}
            />
        </div>
    );
};

