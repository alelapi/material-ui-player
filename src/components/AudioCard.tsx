import React, { useRef, useEffect, useCallback, useReducer } from 'react';
import { CardContent, Grid, Card } from '@material-ui/core';
import { getMimeType, getUrl } from '../lib/utils';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { Time } from '../types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { State, ActionType } from '../state/types';
import reducer from '../state/reducer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            '&:last-child': {
                paddingBottom: theme.spacing(1),
            },
        },
        card: {
            width: (props: { width: number }) => props.width || '100%',
        },
        audio: {
            display: 'none',
        },
        controls: {
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.down('sm')]: {
                justifyContent: 'space-around',
            },
        },
    })
);

export interface MaterialUIAudioProps {
    src: string | Promise<string> | (() => Promise<string>) | (() => string);
    forward?: boolean;
    backward?: boolean;
    onForwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onBackwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onEnded?: () => void;
    autoplay?: boolean;
    loop?: boolean;
    width?: number;
    speed?: boolean;
    mute?: boolean;
}

const getInitialState = (props: MaterialUIAudioProps): State => ({
    url: '',
    key: Math.random(),
    playing: false,
    time: {
        currentTime: 0,
        duration: 0,
    },
    playerTimeout: null,
    width: props.width
})

const MaterialUIAudio = (props: MaterialUIAudioProps) => {
    const [state, dispatch] = useReducer(reducer, getInitialState(props));
    const player: React.MutableRefObject<HTMLAudioElement> = useRef(null!);

    const pausePlaying = useCallback(() => {
        player.current.pause();
        state.playerTimeout && clearInterval(state.playerTimeout);
        dispatch({ type: ActionType.PAUSE });
    }, [state.playerTimeout]);

    const setCurrentTime = useCallback((value?: number) => {
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
            payload: { time: progressTime },
        });
    }, []);

    const {
        src,
        onEnded = () => setCurrentTime(0),
        onBackwardClick = () => {},
        onForwardClick = () => {},
        loop = !!props.loop,
        autoplay = !!props.autoplay,
    } = props;
    const classes = useStyles({ width: state.width || 0 });

    const onPlay = useCallback(async () => {
        if (!player.current.src) {
            const audioUrl = await getUrl(props.src);
            dispatch({ 
                type: ActionType.UPDATE_URL,
                payload: audioUrl,
            });
            player.current.src = audioUrl;
            player.current.load();
        }

        dispatch({ 
            type: ActionType.PLAY,
            payload: setInterval(() => {
                setCurrentTime()
            }, 50),
        });
        await player.current.play();
    }, [setCurrentTime, src, player]);

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
            const audioUrl = await getUrl(props.src);
            dispatch({ 
                type: ActionType.UPDATE_URL,
                payload: audioUrl,
            });
            player.current.src = audioUrl;
            player.current.load();
            player.current.onloadedmetadata = () => setCurrentTime(value);
            return;
        }

        setCurrentTime(value);
    }, [src, setCurrentTime, player]);

    const onStopClick = useCallback(() => {
        pausePlaying();
        setCurrentTime(0);
    }, [pausePlaying, setCurrentTime]);

    return (
        <Card className={classes.card}>
            <CardContent className={classes.container}>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                    <audio
                        ref={player}
                        key={state.key}
                        className={classes.audio}
                    >
                        {state.url && <source
                            type={getMimeType(state.url)}
                            src={state.url}
                        />}
                    </audio>
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
                            mute={props.mute}
                            player={player.current}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default MaterialUIAudio;
