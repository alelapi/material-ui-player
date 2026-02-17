import React from 'react';
import { Time, TimeProps } from '../types';
import { styled } from '@mui/material/styles';
import { timeToString } from '../lib/utils';

const TimeRoot = styled('div', {
    shouldForwardProp: (prop) => prop !== 'timeFontSize',
})<{ timeFontSize?: number }>(({ theme, timeFontSize }) => ({
    fontSize: timeFontSize || 16,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
}));

export interface MediaTimeProps {
    time: Time;
    TimeProps?: TimeProps
}

const MediaTime = (props: MediaTimeProps) => {
    return (<TimeRoot timeFontSize={props.TimeProps?.fontSize}>{timeToString(props.time)}</TimeRoot>);
};

export default MediaTime;

