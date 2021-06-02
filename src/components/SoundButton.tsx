import React, { useRef, useEffect, useCallback } from 'react';
import { getMimeType, getUrl } from '../lib/utils';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import IconButton from '@material-ui/core/IconButton';
import { useMedia } from '../hooks';
import { State } from '../state/types';
import { BaseProps } from '../types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        audio: {
            display: 'none',
        },
    })
);

const getInitialState = (props: BaseProps): State => ({
    url: '',
    key: Math.random(),
    playing: false,
    time: {
        currentTime: 0,
        duration: 0,
    },
    playerTimeout: null,
    src: props.src,
});

export const SoundButton = (props: BaseProps) => {
    const player: React.MutableRefObject<HTMLAudioElement> = useRef(null!);
    const { state, pause, load } = useMedia(getInitialState(props));
    const classes = useStyles();

    const {
        onEnded = () => { },
    } = props;

    useEffect(() => {
        player.current.onended = () => {
            pause(player.current);
            onEnded();
        };
    }, [pause, onEnded]);

    const onPlay = useCallback(async () => {
        if (!player.current.src) {
            const audioUrl = await getUrl(props.src);
            load(player.current, audioUrl);
        }

        player.current.pause();
        player.current.currentTime = 0;
        player.current.play();
    }, [props.src, load]);

    return (
        <IconButton
            onClick={onPlay}
            color={props.color}
        >
            <audio
                key={state.key}
                ref={player}
                className={classes.audio}
            >
                {state.url && <source
                    type={getMimeType(state.url)}
                    src={state.url}
                />}
            </audio>
            <VolumeUpIcon
                fontSize="large"
            />
        </IconButton>
    );
};

