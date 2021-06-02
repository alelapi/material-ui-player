import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles, Theme } from '@material-ui/core/styles';
import { Time, MaterialUIColor, SliderThickness } from '../types';
import { timeToPercentage, getSliderSizes } from '../lib/utils';

const ProgressSlider = (props: ProgressProps) => withStyles((theme: Theme) => ({
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

export interface ProgressProps {
    // eslint-disable-next-line no-unused-vars
    onProgressClick: (value: number) => void;
    time: Time;
    color?: MaterialUIColor;
    thickness?: SliderThickness;
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

