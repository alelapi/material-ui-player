import React, { useRef, useEffect, useCallback } from 'react';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { getMimeType, getUrl } from '../lib/utils';
import VolumeBar from './VolumeBar';
import ControlKeys from './ControlKeys';
import MediaTime from './MediaTime';
import Progress from './Progress';
import SpeedBar from './SpeedBar';
import { styled } from '@mui/material/styles';
import { State } from '../state/types';
import { MaterialUIMediaProps } from '../types';
import { useMedia } from '../hooks';

const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'background',
})<{ background?: string }>(({ background }) => ({
    width: '100%',
    backgroundColor: background || 'inherit',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:last-child': {
        paddingBottom: theme.spacing(1),
    },
}));

const ControlsGrid = styled(Grid)(({ theme }) => ({
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
}));

const BarsGrid = styled(Grid)(({ theme }) => ({
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
}));

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

const AudioCard = (props: AudioCardProps) => {
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
        <StyledCard background={props.background}>
            <StyledCardContent>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: '100%' }}
                >
                    <audio
                        ref={player}
                        key={state.key}
                        style={{ display: 'none' }}
                    >
                        {state.url && <source
                            type={getMimeType(state.url)}
                            src={state.url}
                        />}
                    </audio>
                    <Grid
                        size={12}
                    >
                        <Progress
                            time={state.time}
                            color={color}
                            thickness={thickness}
                            onProgressClick={async v => await setProgress(player.current, v)}
                        />
                    </Grid>
                    <ControlsGrid
                        size={{ xs: 12, md: 6 }}
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
                    </ControlsGrid>
                    <BarsGrid
                        size={{ xs: 12, md: 6 }}
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
                    </BarsGrid>
                </Grid>
            </StyledCardContent>
        </StyledCard>
    );
};

export default AudioCard;
