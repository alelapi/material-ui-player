import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles, Theme } from '@material-ui/core/styles';
import { Time } from '../types';
import { timeToPercentage } from '../lib/utils';

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

const ProgressSlider = (props: ProgressProps) => withStyles((theme: Theme) => ({
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
        borderRadius: lineThick[props.thickness || 'thin'],
    },
    track: {
        height: lineThick[props.thickness || 'thin'],
        color: theme.palette[props.color || 'primary'].main,
        marginTop: lineMargin[props.thickness || 'thin'],
        borderRadius: lineThick[props.thickness || 'thin'],
    },
}))(Slider);

export interface ProgressProps {
    // eslint-disable-next-line no-unused-vars
    onProgressClick: (value: number) => void;
    time: Time;
    color?: 'primary' | 'secondary';
    thickness?: 'thin' | 'medium' | 'large';
    thumb?: boolean;
}

export const Progress = (props: ProgressProps) => {
    const [progress, setProgress] = useState(timeToPercentage(props.time));
    const PlayerProgress = ProgressSlider(props);

    useEffect(() => {
        setProgress(timeToPercentage(props.time));
    }, [props.time]);

    const onProgressClick = (_: any, value: number | number[]) => {
        const progressValue: number = !Number.isFinite(value) ? 0 : value as number;
        setProgress(progressValue);
        props.onProgressClick(progressValue);
    };

    return (
        <PlayerProgress
            value={progress}
            onChange={onProgressClick}
        />
    );
};

