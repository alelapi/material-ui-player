import React, { useRef, useEffect, useCallback } from 'react';
import { CardContent, Grid, Card } from '@material-ui/core';
import { getMimeType, getUrl } from '../lib/utils';
import { VolumeBar, ControlKeys, MediaTime, Progress, SpeedBar } from './index';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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

export interface MaterialUIAudioProps extends MaterialUIMediaProps {
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
    width: props.width,
    src: props.src,
})

const MaterialUIAudio = (props: MaterialUIAudioProps) => {
    const player: React.MutableRefObject<HTMLAudioElement> = useRef(null!);
    const { state, pause, setCurrentTime, load, play, stop, setProgress } = useMedia(getInitialState(props));

    const {
        onEnded = () => setCurrentTime(player.current, 0),
        onBackwardClick = () => {},
        onForwardClick = () => {},
        loop = !!props.loop,
        autoplay = !!props.autoplay,
    } = props;
    const classes = useStyles({ width: state.width || 0 });

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
                            onProgressClick={async v => await setProgress(player.current, v)}
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
                                onPauseClick={() => pause(player.current)}
                                onPlayClick={onPlay}
                                backward={props.backward}
                                forward={props.forward}
                                playing={state.playing}
                                onForwardClick={onForwardClick}
                                onBackwardClick={onBackwardClick}
                                onStopClick={() => stop(player.current)}
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
