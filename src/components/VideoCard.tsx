import React, { useRef, useEffect, useCallback, useReducer } from 'react';
import { CardActions, CardContent, Grid, Card } from '@material-ui/core';
import { getFade, getMimeType, getUrl } from '../lib/utils';
import { FadeSettings } from '../types';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { Time } from '../types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { State, ActionType } from '../state/types';
import reducer from '../state/reducer';

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

export interface MaterialUIVideoProps {
    src: string | Promise<string> | (() => Promise<string>) | (() => string);
    forward?: boolean;
    backward?: boolean;
    onForwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onBackwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onEnded?: () => void;
    autoplay?: boolean;
    loop?: boolean;
    width?: number;
    fadeSettings?: FadeSettings;
    speed?: boolean;
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
});

const MaterialUIVideo = (props: MaterialUIVideoProps) => {
    const [state, dispatch] = useReducer(reducer, getInitialState(props));
    const player: React.MutableRefObject<HTMLVideoElement> = useRef(null!);

    const pausePlaying = useCallback(() => {
        player.current.pause();
        state.playerTimeout && clearInterval(state.playerTimeout);
        dispatch({ type: ActionType.PAUSE });
    }, [state.playerTimeout]);

    const setCurrentTime = useCallback((value?: number) => {
        const currentFade = getFade(props.fadeSettings, player.current.duration, player.current.currentTime);
        const currentTime: number = value === undefined ? 
                                        player.current.currentTime : 
                                        (value / 100) * (player.current.duration || 0);
        
        if (value !== undefined) {
            player.current.currentTime = currentTime;
        }
        
        const progressTime: Time = {
            currentTime,
            duration: player.current.duration,
        };
        dispatch({ 
            type: ActionType.UPDATE_TIME,
            payload: { 
                time: progressTime,
                fade: currentFade,
            }
        });
    }, [props.fadeSettings]);

    const setSize = useCallback(() => {
        const width = state.width || player.current.videoWidth;
        const height = state.width ? 
            (player.current.videoHeight * width / player.current.videoWidth) : 
            player.current.videoHeight;
        
        dispatch({ 
            type: ActionType.UPDATE_SIZE,
            payload: {
                width,
                height
            },
        });
    }, [state.width]);

    const {
        src,
        onEnded = () => setCurrentTime(0),
        onBackwardClick = () => {},
        onForwardClick = () => {},
        loop = !!props.loop,
        autoplay = !!props.autoplay,
    } = props;
    const classes = useStyles({ width: state.width, height: state.height! });

    const onPlay = useCallback(async () => {
        if (!player.current.src) {
            const videoUrl = await getUrl(props.src);
            dispatch({ 
                type: ActionType.UPDATE_URL,
                payload: videoUrl,
            });
            player.current.src = videoUrl;
            player.current.load();
            player.current.onloadedmetadata = setSize;
        }

        dispatch({ 
            type: ActionType.PLAY,
            payload: setInterval(() => {
                setCurrentTime();
            }, 50),
        });
        await player.current.play();
    }, [src, setSize, setCurrentTime]);

    useEffect(() => {
        dispatch({ 
            type: ActionType.UPDATE_KEY,
            payload: Math.random(),
        });
    }, [src]);

    useEffect(() => {
        return () => {
            state.playerTimeout && clearInterval(state.playerTimeout);
        }
    }, [state.playerTimeout]);

    useEffect(() => {
        player.current.autoplay = autoplay;
        player.current.loop = loop;
        player.current.onended = () => {
            pausePlaying();
            onEnded();
        };
    }, [pausePlaying, onEnded, autoplay, loop]);

    useEffect(() => {
        autoplay && onPlay();
    }, [autoplay, onPlay]);

    const onProgressClick = useCallback(async (value: number) => {
        if (!player.current.src) {
            const videoUrl = await getUrl(props.src);
            dispatch({ 
                type: ActionType.UPDATE_URL,
                payload: videoUrl,
            });
            player.current.src = videoUrl;
            player.current.load();
            player.current.onloadedmetadata = () => setCurrentTime(value);
            return;
        }

        setCurrentTime(value);
    }, [src, setCurrentTime]);

    const onStopClick = useCallback(() => {
        pausePlaying();
        setCurrentTime(0);
    }, [pausePlaying, setCurrentTime]);

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
                            onProgressClick={async v => await onProgressClick(v)}
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
                                onPauseClick={pausePlaying}
                                onPlayClick={onPlay}
                                backward={props.backward}
                                forward={props.forward}
                                playing={state.playing}
                                onForwardClick={onForwardClick}
                                onBackwardClick={onBackwardClick}
                                onStopClick={onStopClick}
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