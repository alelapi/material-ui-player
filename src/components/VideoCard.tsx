import React, { useState, useRef, useEffect } from 'react';
import { CardActions, CardContent, Grid, Card } from '@material-ui/core';
import { getFade, getMimeType } from '../lib/utils';
import { FadeSettings } from '../types';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { Time, PlayerVideo } from '../types';
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
    src: string;
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
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState({} as Time);
    const [fade, setFade] = useState(1);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(props.width);
    const [playerTimeout, setPlayerTimeout] = useState(null as ReturnType<typeof setInterval> | null)
    const refPlayer: React.MutableRefObject<HTMLVideoElement | null> = useRef(null);
    const player = new PlayerVideo(refPlayer);

    const pausePlaying = () => {
        player.pause();
        playerTimeout && clearInterval(playerTimeout);
        setPlaying(false);
    };

    const setTimeProgress = (value: number) => {
        const currentTime: number = (value / 100) * player.duration;
        player.currentTime = currentTime;
        const progressTime: Time = {
            currentTime: player.currentTime,
            duration: player.duration,
        };
        setTime(progressTime);
        setProgress((progressTime.currentTime / progressTime.duration) * 100);
    };

    const setSize = () => {
        if (width) {
            setHeight(player.height * width / player.width);
            return;
        }
        setWidth(player.width);
        setHeight(player.height);
    }

    const stop = () => {
        pausePlaying();
        setTimeProgress(0);
    };

    const {
        src,
        onEnded = stop,
        onBackwardClick = () => {},
        onForwardClick = () => {},
        fadeSettings,
    } = props;
    const classes = useStyles({ width, height });

    const intervalCheck = () => {
        if (player.ended) {
            onEnded();
            playerTimeout && clearInterval(playerTimeout);
            return;
        }
        const currentFade = getFade(fadeSettings, player.duration, player.currentTime);
        setFade(currentFade);
        const progressTime: Time = {
            currentTime: player.currentTime,
            duration: player.duration,
        };
        setTime(progressTime);
        setProgress((progressTime.currentTime / progressTime.duration) * 100);
    };

    const onPlay = async () => {
        if (!url) {
            const videoUrl = typeof src === 'string' ? src : await src;
            setUrl(videoUrl);
            player.src = videoUrl;
            player.load();
        }

        setPlaying(true);
        setPlayerTimeout(setInterval(intervalCheck, 50));
        player.play();
    };

    useEffect(() => {
        player.autoplay = !!props.autoplay;
        player.loop = !!props.loop;
        stop();
        if (typeof src === 'string') {
            setUrl(src);
            player.src = src;
            player.load();
            player.onMetadata = () => {
                setSize();
            }
            return;
        }
    }, [src]);

    const onVolumeClick = (volume: number) => {
        player.volume = volume;
    };

    const onMuteClick = () => {
        player.muted = !muted;
        setMuted(!muted);
    };

    const onProgressClick = async (value: number) => {
        if (!player.src) {
            const videoUrl = typeof src === 'string' ? src : await src;
            setUrl(videoUrl);
            player.src = videoUrl;
            player.load();
            player.onMetadata = () => {
                setTimeProgress(value);
                setSize();
            }
            return;
        }

        setTimeProgress(value);
    };

    const onSpeedChange = (speed: number) => {
        player.speed = speed;
    };

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <div className={classes.videoContainer}>
                    <video style={{ opacity: fade }} ref={refPlayer} className={classes.video}>
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
                            progress={progress}
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
                            onVolumeClick={onVolumeClick}
                        />
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}

export default MaterialUIVideo;