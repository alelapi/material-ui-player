import React from 'react';
import { Time, TimeProps } from '../types';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { timeToString } from '../lib/utils';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        time: {
            fontSize: (props?: TimeProps) => props?.fontSize || 16,
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
        },
    })
);

export interface MediaTimeProps {
    time: Time;
    TimeProps?: TimeProps
}

const MediaTime = (props: MediaTimeProps) => {
    const classes = useStyles(props.TimeProps);
    return (<div className={classes.time}>{timeToString(props.time)}</div>);
};

export default MediaTime;

