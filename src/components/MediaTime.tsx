import React from 'react';
import { Time } from '../types';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { getTime } from '../lib/utils';

const useStyles = makeStyles(() =>
    createStyles({
        time: {
            fontSize: 12,
        },
    })
);

interface MediaTimeProps {
    time: Time;
}

const MediaTime = (props: MediaTimeProps) => {
    const classes = useStyles();
    return (<div className={classes.time}>{getTime(props.time.currentTime)}/{getTime(props.time.duration)}</div>);
};

export default MediaTime;
