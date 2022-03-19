import React from 'react';
import { Time } from '../types';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { timeToString } from '../lib/utils';

const useStyles = makeStyles(() =>
    createStyles({
        time: {
            fontSize: 16,
        },
    })
);

export interface MediaTimeProps {
    time: Time;
}

export const MediaTime = (props: MediaTimeProps) => {
    const classes = useStyles();
    return (<div className={classes.time}>{timeToString(props.time)}</div>);
};

