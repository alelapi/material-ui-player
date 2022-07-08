import React, { useRef, useEffect, useCallback } from 'react';
import { getMimeType, getUrl } from '../lib/utils';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import { useMedia } from '../hooks';
import { State } from '../state/types';
import { BaseProps, IconButtonProps } from '../types';

const useStyles = makeStyles(() =>
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

export interface SoundButtonProps extends BaseProps {
    PlayProps?: IconButtonProps;
}

const SoundButton = (props: SoundButtonProps) => {
    const { color = 'primary' } = props;
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
            color={color}
            aria-label="Play"
            {...props.PlayProps?.attributes}
            size="large">
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
            { props.PlayProps?.icons?.[0] || (
                <SvgIcon>
                    <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><g data-name="volume-up"><rect width="24" height="24" opacity="0"/><path d="M18.28 8.37a1 1 0 1 0-1.56 1.26 4 4 0 0 1 0 4.74A1 1 0 0 0 17.5 16a1 1 0 0 0 .78-.37 6 6 0 0 0 0-7.26z"/><path d="M19.64 5.23a1 1 0 1 0-1.28 1.54A6.8 6.8 0 0 1 21 12a6.8 6.8 0 0 1-2.64 5.23 1 1 0 0 0-.13 1.41A1 1 0 0 0 19 19a1 1 0 0 0 .64-.23A8.75 8.75 0 0 0 23 12a8.75 8.75 0 0 0-3.36-6.77z"/><path d="M14.47 3.12a1 1 0 0 0-1 0L7 7.57H2a1 1 0 0 0-1 1v6.86a1 1 0 0 0 1 1h5l6.41 4.4A1.06 1.06 0 0 0 14 21a1 1 0 0 0 1-1V4a1 1 0 0 0-.53-.88z"/></g></g></svg>
                </SvgIcon>
            )}
        </IconButton>
    );
};

export default SoundButton;

