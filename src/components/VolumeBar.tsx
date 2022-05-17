import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Slider, { SliderProps } from '@mui/material/Slider';
import { Theme, styled, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { MaterialUIColor, SliderThickness, IconButtonProps } from '../types';
import { getSliderSizes } from '../lib/utils';
import { VolumeOff, VolumeUp } from '../icons';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: theme.spacing(40),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            flexGrow: 1,
        },
    })
);

interface ProgressSliderProps {
    color?: MaterialUIColor;
    thickness?: SliderThickness;
    thumb?: boolean;
}

const VolumeSlider = styled((props: ProgressSliderProps & SliderProps) => <Slider {...props}/>)(({ theme, thickness, color, thumb }) => ({
    ...getSliderSizes(thickness, ({
        thumb: {
            color: theme.palette[color || 'primary'].main,
            display: thumb === false ? 'none' : 'block',
        },
        rail: {
            color: theme.palette[color || 'primary'].main,
        },
        track: {
            color: theme.palette[color || 'primary'].main,
        },
    }))
}));

export interface VolumeBarProps {
    mute?: boolean;
    player: HTMLMediaElement;
    MuteProps?: IconButtonProps;
}

export const VolumeBar = (props: VolumeBarProps & ProgressSliderProps) => {
    const { mute, player, MuteProps, ...styles } = props;
    const [volumeBar, setVolumeBar] = useState(100);
    const [muted, setMuted] = useState(false);
    const classes = useStyles();
    const theme = useTheme();

    const onVolumeChange = (_: any, newValue: number | number[]) => {
        const volume: number = (newValue as number);
        setVolumeBar(volume);
        player.volume = volume / 100;
    };

    const onMuteClick = () => {
        const newState = !muted;
        setMuted(newState);
        player.muted = newState;
    };

    return (
        <div className={classes.root}>
            {mute &&
                <IconButton
                    color={styles.color || 'primary'}
                    aria-label="Mute"
                    onClick={onMuteClick}
                    {...MuteProps?.attributes}
                    size="large">
                    {muted ?
                        MuteProps?.icons?.[0] || <VolumeOff /> :
                        MuteProps?.icons?.[1] || <VolumeUp />
                    }
                </IconButton>
            }
            <VolumeSlider
                value={volumeBar}
                onChange={onVolumeChange}
                {...styles}
                sx={{
                    marginTop: theme.spacing(1),
                }}
            />
        </div>
    );
};
