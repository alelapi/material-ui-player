import React, { useRef, useEffect, useCallback } from 'react';
import { CardActions, CardContent, Grid, Card } from '@material-ui/core';
import { getMimeType, getUrl } from '../lib/utils';
import { FadeSettings } from '../types';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { State } from '../state/types';
import { MaterialUIMediaProps } from '../types';
import { useMedia } from '../hooks';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        controls: {
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.down('sm')]: {
                justifyContent: 'space-around',
            },
        },
        videoContainer: {
            backgroundColor: theme.palette.common.black,
            display: 'inline-block',
        },
        video: {
            width: (props: { width: number | undefined, height: number }) => props.width,
            height: (props: { width: number | undefined, height: number }) => props.height,
        },
        actions: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: theme.spacing(1),
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
            paddingBottom: theme.spacing(1),
            '&:last-child': {
                paddingBottom: theme.spacing(1),
            },
        },
        card: {
            display: 'flex',
            flexDirection: 'column',
        },
        cardContent: {
            display: 'flex',
            justifyContent: 'center',
        }
    })
);

export interface MaterialUIVideoProps extends MaterialUIMediaProps {
    fadeSettings?: FadeSettings;
}

const getInitialState = (props: MaterialUIVideoProps): State => ({
    url: '',
    key: Math.random(),
    playing: false,
    time: {
        currentTime: 0,
        duration: 0,
    },
    fade: 1,
    width: props.width,
    height: (props.width || 0) * 9/16,
    playerTimeout: null,
    src: props.src,
});

const MaterialUIVideo = (props: MaterialUIVideoProps) => {
    const player: React.MutableRefObject<HTMLVideoElement> = useRef(null!);
    const { state, pause, setSize, load, play, stop, setCurrentTime, setProgress, updateSrc } = useMedia(getInitialState(props), props.fadeSettings);

    const {
        onEnded = () => setCurrentTime(player.current, 0),
        onBackwardClick = () => {},
        onForwardClick = () => {},
        loop = !!props.loop,
        autoplay = !!props.autoplay,
    } = props;
    const classes = useStyles({ width: state.width, height: state.height! });

    useEffect(() => {
        updateSrc(props.src);
    }, [props.src, updateSrc]);

    const onPlay = useCallback(async () => {
        if (!player.current.src) {
            const videoUrl = await getUrl(props.src);
            load(player.current, videoUrl);
            player.current.onloadedmetadata = () => setSize(player.current);
        }

        await play(player.current);
    }, [props.src, load, play, setSize]);

    useEffect(() => {
        player.current.autoplay = autoplay;
        player.current.loop = loop;
        player.current.onended = () => {
            pause(player.current);
            onEnded();
        };
    }, [pause, onEnded, autoplay, loop]);

    useEffect(() => {
        autoplay && onPlay();
    }, [autoplay, onPlay]);

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <div className={classes.videoContainer}>
                    <video
                        style={{ opacity: state.fade }}
                        ref={player}
                        key={state.key}
                        className={classes.video}
                    >
                        {state.url && <source type={getMimeType(state.url)} src={state.url} />}
                    </video>
                </div>
            </CardContent>
            <CardActions className={classes.actions}>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                    <Grid
                        item
                        xs={12}
                    >
                        <Progress
                            time={state.time}
                            onProgressClick={async v => await setProgress(player.current, v)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <div className={classes.controls}>
                            <MediaTime
                                time={state.time}
                            />
                            <ControlKeys
                                onPauseClick={() => pause(player.current)}
                                onPlayClick={onPlay}
                                backward={props.backward}
                                forward={props.forward}
                                playing={state.playing}
                                onForwardClick={onForwardClick}
                                onBackwardClick={onBackwardClick}
                                onStopClick={() => stop(player.current)}
                            />
                        </div>
                    </Grid>
                    {props.speed &&
                        <Grid
                            item
                            xs={6}
                            sm={3}
                        >
                            <SpeedBar
                                player={player.current}
                            />
                        </Grid>
                    }
                    <Grid
                        item
                        xs={props.speed ? 6 : 12}
                        sm={props.speed ? 3 : 6}
                    >
                        <VolumeBar
                            player={player.current}
                        />
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}

export default MaterialUIVideo;