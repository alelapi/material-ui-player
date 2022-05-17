import React, { useRef, useEffect, useCallback } from 'react';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { getMimeType, getUrl } from '../lib/utils';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { State } from '../state/types';
import { MaterialUIMediaProps } from '../types';
import { useMedia } from '../hooks';

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
            width: '100%',
            backgroundColor: (props: AudioCardProps) => props.background || 'inherit'
        },
        audio: {
            display: 'none',
        },
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
    })
);

export interface AudioCardProps extends MaterialUIMediaProps {
    mute?: boolean;
}

const getInitialState = (props: AudioCardProps): State => ({
    url: '',
    key: Math.random(),
    playing: false,
    time: {
        currentTime: 0,
        duration: 0,
    },
    playerTimeout: null,
    src: props.src,
})

export const AudioCard = (props: AudioCardProps) => {
    const { color = 'primary', thickness = 'medium' } = props;
    const player: React.MutableRefObject<HTMLAudioElement> = useRef(null!);
    const { state, pause, setCurrentTime, load, play, stop, setProgress } = useMedia(getInitialState(props));

    const {
        onEnded = () => setCurrentTime(player.current, 0),
        onBackwardClick = () => { },
        onForwardClick = () => { },
        loop = !!props.loop,
        autoplay = !!props.autoplay,
    } = props;
    const classes = useStyles(props);

    const onPlay = useCallback(async () => {
        if (!player.current.src) {
            const audioUrl = await getUrl(props.src);
            load(player.current, audioUrl);
        }

        await play(player.current);
    }, [load, play, props.src]);

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
            <CardContent className={classes.container}>
                <Grid
                    container
                    justifyContent="center"
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
                            mute={props.mute}
                            player={player.current}
                            color={color}
                            thickness={thickness}
                            MuteProps={props.MuteProps}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
