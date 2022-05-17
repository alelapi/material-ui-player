import React, { useRef, useEffect, useCallback } from 'react';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { getMimeType, getUrl, thumbThick } from '../lib/utils';
import { FadeSettings } from '../types';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { State } from '../state/types';
import { MaterialUIMediaProps } from '../types';
import { useMedia } from '../hooks';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        controls: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            [theme.breakpoints.down('md')]: {
                justifyContent: 'space-between',
                flexGrow: 1,
            },
            [theme.breakpoints.up('md')]: {
                justifyContent: 'start',
            },
        },
        bars: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            [theme.breakpoints.down('md')]: {
                justifyContent: 'space-between',
                flexGrow: 1,
            },
            [theme.breakpoints.up('md')]: {
                justifyContent: 'start',
            },
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
    const { color = 'primary', thickness = 'medium' } = props;
    const player: React.MutableRefObject<HTMLVideoElement> = useRef(null!);
    const { state, pause, setSize, load, play, stop, setCurrentTime, setProgress } = useMedia(getInitialState(props), props.fadeSettings);
    const theme = useTheme();

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
            <CardActions className={classes.actions} sx={{
                paddingTop: theme.spacing(1),
                paddingRight: theme.spacing(2),
                paddingLeft: `calc(${thumbThick[thickness]/2}px + ${theme.spacing(2)})`,
                paddingBottom: theme.spacing(1),
            }}>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid
                        item
                        xs={12}
                    >
                        <Progress
                            time={state.time}
                            color={color}
                            thickness={thickness}
                            onProgressClick={async v => await setProgress(player.current, v)}
                        />
                    </Grid>
                    <Grid
                        item
                        md={6}
                        xs={12}
                        className={classes.controls}
                    >
                        <MediaTime
                            time={state.time}
                            TimeProps={props.TimeProps}
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
                            color={color}
                            BackwardProps={props.BackwardProps}
                            StopProps={props.StopProps}
                            PauseProps={props.PauseProps}
                            PlayProps={props.PlayProps}
                            ForwardProps={props.ForwardProps}
                        />
                    </Grid>
                    <Grid
                        item
                        md={6}
                        sm={12}
                        className={classes.bars}
                    >
                        {props.speed &&
                            <SpeedBar
                                player={player.current}
                                color={color}
                                thickness={thickness}
                            />
                        }
                        <VolumeBar
                            player={player.current}
                            color={color}
                            thickness={thickness}
                            MuteProps={props.MuteProps}
                        />
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}