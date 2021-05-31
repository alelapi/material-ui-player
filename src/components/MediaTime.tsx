import React from 'react';
import { Time } from '../types';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { timeToString } from '../lib/utils';

const useStyles = makeStyles(() =>
    createStyles({
        time: {
            fontSize: 12,
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

