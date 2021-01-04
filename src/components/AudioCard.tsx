import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CardContent, Grid, Card } from '@material-ui/core';
import { getMimeType } from '../lib/utils';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { Time, Player } from '../types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
            width: (props: { width: number | undefined }) => props.width || '100%',
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
    src: string | Promise<string>;
    forward?: boolean;
    backward?: boolean;
    // eslint-disable-next-line no-unused-vars
    onForwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    // eslint-disable-next-line no-unused-vars
    onBackwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onEnded?: () => void;
    autoplay?: boolean;
    loop?: boolean;
    width?: number;
    speed?: boolean;
}

const MaterialUIAudio = (props: MaterialUIAudioProps) => {
    const [url, setUrl] = useState('');
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState({} as Time);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playerTimeout, setPlayerTimeout] = useState(null as ReturnType<typeof setInterval> | null);
    const refPlayer: React.MutableRefObject<HTMLAudioElement | null> = useRef(null);
    const player = new Player(refPlayer);

    const pausePlaying = useCallback(() => {
        player.pause();
        playerTimeout && clearInterval(playerTimeout);
        setPlaying(false);
    }, [playerTimeout]);

    const setTimeProgress = useCallback((value: number) => {
        const currentTime: number = (value / 100) * player.duration;
        player.currentTime = currentTime;
        const progressTime: Time = {
            currentTime: player.currentTime,
            duration: player.duration,
        };
        setTime(progressTime);
        setProgress((progressTime.currentTime / progressTime.duration) * 100);
    }, []);

    const stop = useCallback(() => {
        pausePlaying();
        setTimeProgress(0);
    }, [pausePlaying, setTimeProgress]);

    const {
        src,
        onEnded = stop,
        onBackwardClick = () => {},
        onForwardClick = () => {},
        width,
    } = props;
    const classes = useStyles({ width });

    const intervalCheck = useCallback(() => {
        if (player.ended) {
            onEnded();
            playerTimeout && clearInterval(playerTimeout);
            return;
        }
        const progressTime: Time = {
            currentTime: player.currentTime,
            duration: player.duration,
        };
        setTime(progressTime);
        setProgress((progressTime.currentTime / progressTime.duration) * 100);
    }, [onEnded]);

    const onPlay = useCallback(async () => {
        if (!url) {
            const audioUrl = typeof src === 'string' ? src : await src;
            setUrl(audioUrl);
            player.src = audioUrl;
            player.load();
        }

        setPlaying(true);
        setPlayerTimeout(setInterval(intervalCheck, 50));
        player.play();
    }, [intervalCheck, url, src]);

    useEffect(() => {
        player.autoplay = !!props.autoplay;
        player.loop = !!props.loop;
        stop();
    }, [src, props.autoplay, props.loop]);

    const onVolumeClick = useCallback((volume: number) => {
        player.volume = volume;
    }, []);

    const onMuteClick = useCallback(() => {
        player.muted = !muted;
        setMuted(!muted);
    }, [muted]);

    const onProgressClick = useCallback(async (value: number) => {
        if (!player.src) {
            const audioUrl = typeof src === 'string' ? src : await src;
            setUrl(audioUrl);
            player.src = audioUrl;
            player.load();
            player.onMetadata = () => setTimeProgress(value);
            return;
        }

        setTimeProgress(value);
    }, [src, setTimeProgress]);

    const onSpeedChange = useCallback((speed: number) => {
        player.speed = speed;
    }, []);

    return (
        <Card className={classes.card}>
            <CardContent className={classes.container}>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                    <audio
                        ref={refPlayer}
                        className={classes.audio}
                    >
                        {url && <source
                            type={getMimeType(url)}
                            src={url}
                        />}
                    </audio>
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
            </CardContent>
        </Card>
    );
};

export default MaterialUIAudio;
