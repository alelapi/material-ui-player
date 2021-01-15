import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getMimeType } from '../lib/utils';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        audio: {
            display: 'none',
        },
        listenButton: {
            color: theme.palette.primary.main,
        },
    })
);

export interface SoundButtonProps {
    src: string | Promise<string>;
}

const SoundButton = (props: SoundButtonProps) => {
    const [url, setUrl] = useState('');
    const [audioKey, setAudioKey] = useState(Math.random());
    const player: React.MutableRefObject<HTMLAudioElement | null> = useRef(null);
    const classes = useStyles();

    useEffect(() => {
        setAudioKey(Math.random());
    }, [props.src]);

    const onPlay = useCallback(async () => {
        if (!player?.current) return;

        if (!player.current.src) {
            const audioUrl = typeof props.src === 'string' ? props.src : await props.src;
            setUrl(audioUrl);
            player.current.src = audioUrl;
            player.current.load();
        }

        player.current.play();
    }, [props.src, player]);

    return (
        <IconButton
            onClick={onPlay}
        >
            <audio
                key={audioKey}
                ref={player}
                className={classes.audio}
            >
                {url && <source
                    type={getMimeType(url)}
                    src={url}
                />}
            </audio>
            <VolumeUpIcon
                fontSize="large"
                className={classes.listenButton}
            />
        </IconButton>
    );
};

export default SoundButton;
