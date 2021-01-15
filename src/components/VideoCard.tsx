import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CardActions, CardContent, Grid, Card } from '@material-ui/core';
import { getFade, getMimeType } from '../lib/utils';
import { FadeSettings } from '../types';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { Time } from '../types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
    src: string | Promise<string>;
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

const MaterialUIVideo = (props: MaterialUIVideoProps) => {
    const [url, setUrl] = useState('');
    const [videoKey, setVideoKey] = useState(Math.random());
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState({} as Time);
    const [fade, setFade] = useState(1);
    const [height, setHeight] = useState((props.width || 0) * 9/16);
    const [width, setWidth] = useState(props.width);
    const [playerTimeout, setPlayerTimeout] = useState(null as ReturnType<typeof setInterval> | null)
    const player: React.MutableRefObject<HTMLVideoElement | null> = useRef(null);

    useEffect(() => {
        setVideoKey(Math.random());
    }, [props.src]);

    const pausePlaying = useCallback(() => {
        player?.current?.pause();
        playerTimeout && clearInterval(playerTimeout);
        setPlaying(false);
    }, [playerTimeout]);

    const setCurrentTime = useCallback((value: number) => {
        if (!player?.current) return;

        const currentTime: number = (value / 100) * (player.current.duration || 0);
        player.current.currentTime = currentTime;
        const progressTime: Time = {
            currentTime: player.current.currentTime,
            duration: player.current.duration,
        };
        setTime(progressTime);
    }, []);

    const setSize = useCallback(() => {
        if (!player?.current) return;
        if (width) {
            setHeight(player.current.videoHeight * width / player.current.videoWidth);
            return;
        }
        setWidth(player.current.videoWidth);
        setHeight(player.current.videoHeight);
    }, [width]);

    const stop = useCallback(() => {
        pausePlaying();
        setCurrentTime(0);
    }, [pausePlaying, setCurrentTime]);

    const {
        src,
        onEnded = () => setCurrentTime(0),
        onBackwardClick = () => {},
        onForwardClick = () => {},
        loop = !!props.loop,
        autoplay = !!props.autoplay,
        fadeSettings,
    } = props;
    const classes = useStyles({ width, height });

    const intervalCheck = useCallback(() => {
        if (!player?.current) return;

        const currentFade = getFade(fadeSettings, player.current.duration, player.current.currentTime);
        setFade(currentFade);
        const progressTime: Time = {
            currentTime: player.current.currentTime,
            duration: player.current.duration,
        };
        setTime(progressTime);
    }, [fadeSettings]);

    const onPlay = useCallback(async () => {
        if (!player?.current) return;

        if (!player.current.src) {
            const videoUrl = typeof src === 'string' ? src : await src;
            setUrl(videoUrl);
            player.current.src = videoUrl;
            player.current.load();
            player.current.onloadedmetadata = setSize;
        }

        setPlaying(true);
        setPlayerTimeout(setInterval(intervalCheck, 50));
        player.current.play();
    }, [player, intervalCheck, src, setSize]);

    useEffect(() => {
        if (!player?.current) return;

        player.current.autoplay = autoplay;
        player.current.loop = loop;
        player.current.onended = () => {
            pausePlaying();
            onEnded();
        };
        
        stop();
        if (typeof src === 'string') {
            setUrl(src);
            player.current.src = src;
            player.current.load();
            player.current.onloadedmetadata = setSize;
        }

        return () => {
            playerTimeout && clearInterval(playerTimeout);
        }
    }, [src]);

    const onVolumeChange = useCallback((volume: number) => {
        if (!player?.current) return;
        player.current.volume = volume;
    }, []);

    const onMuteClick = useCallback((muted: boolean) => {
        if (!player?.current) return;
        player.current.muted = muted;
    }, []);

    const onSpeedChange = useCallback((speed: number) => {
        if (!player?.current) return;
        player.current.playbackRate = speed;
    }, []);

    const onProgressClick = useCallback(async (value: number) => {
        if (!player?.current) return;
        if (!player.current.src) {
            const videoUrl = typeof src === 'string' ? src : await src;
            setUrl(videoUrl);
            player.current.src = videoUrl;
            player.current.load();
            player.current.onloadedmetadata = () => setCurrentTime(value);
            return;
        }

        setCurrentTime(value);
    }, [src, setCurrentTime]);

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <div className={classes.videoContainer}>
                    <video
                        style={{ opacity: fade }}
                        ref={player}
                        key={videoKey}
                        className={classes.video}
                    >
                        {url && <source type={getMimeType(url)} src={url} />}
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
                            time={time}
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
                                time={time}
                            />
                            <ControlKeys
                                onPauseClick={pausePlaying}
                                onPlayClick={onPlay}
                                backward={props.backward}
                                forward={props.forward}
                                playing={playing}
                                onForwardClick={onForwardClick}
                                onBackwardClick={onBackwardClick}
                                onStopClick={stop}
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
                                onSpeedChange={onSpeedChange}
                            />
                        </Grid>
                    }
                    <Grid
                        item
                        xs={props.speed ? 6 : 12}
                        sm={props.speed ? 3 : 6}
                    >
                        <VolumeBar
                            onMuteClick={onMuteClick}
                            onVolumeChange={onVolumeChange}
                        />
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}

export default MaterialUIVideo;