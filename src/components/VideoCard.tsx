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
            flexDirection: 'row',
            alignItems: 'center',
        },
        videoContainer: {
            backgroundColor: theme.palette.common.black,
            display: 'inline-block',
        },
        video: {
            width: (props: StylesProps) => props.width,
            height: (props: StylesProps) => props.height,
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
            backgroundColor: (props: StylesProps) => props.background || 'inherit'
        },
        cardContent: {
            display: 'flex',
            justifyContent: 'center',
        }
    })
);

interface StylesProps {
    width?: number;
    height: number;
    background?: string;
}

export interface VideoCardProps extends MaterialUIMediaProps {
    fadeSettings?: FadeSettings;
}

const getInitialState = (props: VideoCardProps): State => ({
    url: '',
    key: Math.random(),
    playing: false,
    time: {
        currentTime: 0,
        duration: 0,
    },
    fade: 1,
    width: props.width,
    height: (props.width || 0) * 9 / 16,
    playerTimeout: null,
    src: props.src,
});

export const VideoCard = (props: VideoCardProps) => {
    const player: React.MutableRefObject<HTMLVideoElement> = useRef(null!);
    const { state, pause, setSize, load, play, stop, setCurrentTime, setProgress } = useMedia(getInitialState(props), props.fadeSettings);

    const {
        onEnded = () => setCurrentTime(player.current, 0),
        onBackwardClick = () => { },
        onForwardClick = () => { },
        loop = !!props.loop,
        autoplay = !!props.autoplay,
    } = props;
    const classes = useStyles({ width: state.width, height: state.height!, background: props.background });

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
                            color={props.color}
                            thickness={props.thickness}
                            onProgressClick={async v => await setProgress(player.current, v)}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={1}
                        xs={2}
                        className={classes.controls}
                    >
                        <MediaTime
                            time={state.time}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={5}
                        xs={10}
                    >
                        <ControlKeys
                            onPauseClick={() => pause(player.current)}
                            onPlayClick={onPlay}
                            backward={props.backward}
                            forward={props.forward}
                            playing={state.playing}
                            onForwardClick={onForwardClick}
                            onBackwardClick={onBackwardClick}
                            onStopClick={() => stop(player.current)}
                            color={props.color}
                            BackwardProps={props.BackwardProps}
                            StopProps={props.StopProps}
                            PauseProps={props.PauseProps}
                            PlayProps={props.PlayProps}
                            ForwardProps={props.ForwardProps}
                        />
                    </Grid>
                    {props.speed &&
                        <Grid
                            item
                            xs={6}
                            sm={3}
                        >
                            <SpeedBar
                                player={player.current}
                                color={props.color}
                                thickness={props.thickness}
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
                            color={props.color}
                            thickness={props.thickness}
                            MuteProps={props.MuteProps}
                        />
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}