import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import { Time } from '../types';
import { timeToPercentage } from '../lib/utils';

const ProgressSlider = withStyles({
    thumb: {
        width: 20,
        height: 20,
    },
    rail: {
        height: 10,
        borderRadius: 5,
    },
    track: {
        height: 10,
        borderRadius: 5,
    },
})(Slider);

interface ProgressProps {
    // eslint-disable-next-line no-unused-vars
    onProgressClick: (value: number) => void;
    time: Time;
}

const Progress = (props: ProgressProps) => {
    const [progress, setProgress] = useState(timeToPercentage(props.time));

    useEffect(() => {
        setProgress(timeToPercentage(props.time));
    }, [props.time]);

    const onProgressClick = (_: any, value: number | number[]) => {
        const progressValue: number = !Number.isFinite(value) ? 0 : value as number;
        setProgress(progressValue);
        props.onProgressClick(progressValue);
    };

    return (
        <ProgressSlider
            value={progress}
            onChange={onProgressClick}
        />
    );
};

export default Progress;
