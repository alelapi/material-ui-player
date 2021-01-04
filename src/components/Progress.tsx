import React from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

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
    progress: number;
}

const Progress = (props: ProgressProps) => {
    const onProgressClick = (_: any, value: number | number[]) => {
        const progressValue: number = !Number.isFinite(value) ? 0 : value as number;
        props.onProgressClick(progressValue);
    };

    return (
        <ProgressSlider
            value={props.progress}
            onChange={onProgressClick}
        />
    );
};

export default Progress;
