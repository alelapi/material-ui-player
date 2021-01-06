import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import { Player } from '../types';

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

const SpeedSlider = withStyles({
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

interface SpeedBarProps {
    onSpeedChange: (speed: number) => void;
}

const SpeedBar = (props: SpeedBarProps) => {
    const defaultSpeed: number = 50;
    const [speedBar, setSpeedBar] = useState(defaultSpeed);
    const classes = useStyles();

    const toSpeedValue = (speed: number) => speed * 0.018 + 0.1;

    const onSpeedChange = (_: any, newValue: number | number[]) => {
        const speed: number = (newValue as number);
        setSpeedBar(speed);
        props.onSpeedChange(toSpeedValue(speed));
    };

    const onNormalSpeedClick = () => {
        setSpeedBar(defaultSpeed);
        props.onSpeedChange(toSpeedValue(defaultSpeed));
    };

    return (
        <div className={classes.root}>
            <Button
                color="primary"
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

export default SpeedBar;
