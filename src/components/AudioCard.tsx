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
    onForwardClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
    const [playerTimeout, setPlayerTimeout] = useState(null as ReturnType<typeof setInterval> | null);
    const refPlayer: React.MutableRefObject<HTMLAudioElement | null> = useRef(null);
    const [player, setPlayer] = useState(undefined as Player | undefined);

    const pausePlaying = useCallback(() => {
        player?.pause();
        playerTimeout && clearInterval(playerTimeout);
        setPlaying(false);
    }, [playerTimeout, player]);

    const setCurrentTime = useCallback((value: number) => {
        if (!player) return;

        const currentTime: number = (value / 100) * player.duration;
        player.currentTime = currentTime;
        const progressTime: Time = {
            currentTime: player.currentTime,
            duration: player.duration,
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
        if (!player) return;

        const progressTime: Time = {
            currentTime: player.currentTime,
            duration: player.duration,
        };
        setTime(progressTime);
    }, [player]);

    const onPlay = useCallback(async () => {
        if (!player) return;

        if (!player.src) {
            const audioUrl = typeof src === 'string' ? src : await src;
            setUrl(audioUrl);
            player.src = audioUrl;
            player.load();
        }

        setPlaying(true);
        setPlayerTimeout(setInterval(intervalCheck, 50));
        player.play();
    }, [intervalCheck, src, player]);

    useEffect(() => {
        const audioPlayer = new Player(refPlayer, {
            autoplay,
            loop,
            onended: () => {
                pausePlaying();
                onEnded();
            }
        });
        
        setPlayer(audioPlayer);
        stop();
        return () => {
            playerTimeout && clearInterval(playerTimeout);
        }
    }, [src]);

    const onVolumeChange = useCallback((volume: number) => {
        if (!player) return;
        player.volume = volume;
    }, [player]);

    const onMuteClick = useCallback((muted: boolean) => {
        if (!player) return;
        player.muted = muted;
    }, [player]);

    const onSpeedChange = useCallback((speed: number) => {
        if (!player) return;
        player.speed = speed;
    }, [player]);

    const onProgressClick = useCallback(async (value: number) => {
        if (!player) return;
        if (!player.src) {
            const audioUrl = typeof src === 'string' ? src : await src;
            setUrl(audioUrl);
            player.src = audioUrl;
            player.load();
            player.onMetadata = () => setCurrentTime(value);
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
            </CardContent>
        </Card>
    );
};

export default MaterialUIAudio;
