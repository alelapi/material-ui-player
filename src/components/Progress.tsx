import React, { useState, useEffect } from 'react';
import Slider, { SliderProps } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { Time, MaterialUIColor, SliderThickness } from '../types';
import { timeToPercentage, getSliderSizes } from '../lib/utils';

const ProgressSlider = styled((props: ProgressSliderProps & SliderProps) => <Slider {...props}/>)(({ theme, thickness, color, thumb }) => ({
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

export interface ProgressProps {
    // eslint-disable-next-line no-unused-vars
    onProgressClick: (value: number) => void;
    time: Time;
}

export const Progress = (props: ProgressProps & ProgressSliderProps) => {
    const { time, onProgressClick, ...styles } = props;
    const [progress, setProgress] = useState(timeToPercentage(props.time));

    useEffect(() => {
        setProgress(timeToPercentage(time));
    }, [time]);

    const onProgressChange = (e: any, value: number | number[], a) => {
        const progressValue: number = !Number.isFinite(value) ? 0 : value as number;
        setProgress(progressValue);
        onProgressClick(progressValue);
    };

    return (
        <ProgressSlider
            value={progress}
            onChange={onProgressChange}
            {...styles}
        />
    );
};

