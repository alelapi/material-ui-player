import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CardContent, Grid, Card } from '@material-ui/core';
import { getMimeType } from '../lib/utils';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { Time } from '../types';
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
    onForwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onBackwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onEnded?: () => void;
    autoplay?: boolean;
    loop?: boolean;
    width?: number;
    speed?: boolean;
    mute?: boolean;
}

const MaterialUIAudio = (props: MaterialUIAudioProps) => {
    const [url, setUrl] = useState('');
    const [audioKey, setAudioKey] = useState(Math.random());
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState({} as Time);
    const [playerTimeout, setPlayerTimeout] = useState(null as ReturnType<typeof setInterval> | null);
    const player: React.MutableRefObject<HTMLAudioElement | null> = useRef(null);

    useEffect(() => {
        setAudioKey(Math.random());
    }, [props.src]);

    const pausePlaying = useCallback(() => {
        player?.current?.pause();
        playerTimeout && clearInterval(playerTimeout);
        setPlaying(false);
    }, [playerTimeout, player]);

    const setCurrentTime = useCallback((value: number) => {
        if (!player?.current) return;

        const currentTime: number = (value / 100) * (player.current.duration || 0);
        player.current.currentTime = currentTime;
        const progressTime: Time = {
            currentTime: player.current.currentTime,
            duration: player.current.duration,
        };
        setTime(progressTime);
    }, [player]);

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
        width,
    } = props;
    const classes = useStyles({ width });

    const intervalCheck = useCallback(() => {
        if (!player?.current) return;

        const progressTime: Time = {
            currentTime: player.current.currentTime,
            duration: player.current.duration,
        };
        setTime(progressTime);
    }, [player]);

    const onPlay = useCallback(async () => {
        if (!player?.current) return;

        if (!player.current.src) {
            const audioUrl = typeof src === 'string' ? src : await src;
            setUrl(audioUrl);
            player.current.src = audioUrl;
            player.current.load();
        }

        setPlaying(true);
        setPlayerTimeout(setInterval(intervalCheck, 50));
        player.current.play();
    }, [intervalCheck, src, player]);

    useEffect(() => {
        if (!player?.current) return;

        player.current.autoplay = autoplay;
        player.current.loop = loop;
        player.current.onended = () => {
            pausePlaying();
            onEnded();
        };
        
        stop();
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
            const audioUrl = typeof src === 'string' ? src : await src;
            setUrl(audioUrl);
            player.current.src = audioUrl;
            player.current.load();
            player.current.onloadedmetadata = () => setCurrentTime(value);
            return;
        }

        setCurrentTime(value);
    }, [src, setCurrentTime, player]);

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
                        key={audioKey}
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
                            mute={props.mute}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default MaterialUIAudio;
