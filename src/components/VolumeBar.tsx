import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Slider, { SliderProps } from '@mui/material/Slider';
import { styled, useTheme } from '@mui/material/styles';
import { MaterialUIColor, SliderThickness, IconButtonProps } from '../types';
import { getSliderSizes } from '../lib/utils';
import { VolumeOff, VolumeUp } from '../icons';

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: theme.spacing(40),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    flexGrow: 1,
}));

interface ProgressSliderProps {
    color?: MaterialUIColor;
    thickness?: SliderThickness;
    thumb?: boolean;
}

const VolumeSlider = styled((props: ProgressSliderProps & SliderProps) => <Slider {...props}/>)(({ theme, thickness, color, thumb }) => ({
    ...getSliderSizes(thickness, ({
        thumb: {
            backgroundColor: theme.palette[color || 'primary'].main,
            display: thumb === false ? 'none' : 'block',
        },
        rail: {
            backgroundColor: theme.palette[color || 'primary'].main,
        },
        track: {
            backgroundColor: theme.palette[color || 'primary'].main,
            borderColor: theme.palette[color || 'primary'].main,
        },
    }))
}));

export interface VolumeBarProps {
    mute?: boolean;
    player: HTMLMediaElement;
    MuteProps?: IconButtonProps;
}

const VolumeBar = (props: VolumeBarProps & ProgressSliderProps) => {
    const { mute, player, MuteProps, ...styles } = props;
    const [volumeBar, setVolumeBar] = useState(100);
    const [muted, setMuted] = useState(false);
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
        <Root>
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
        </Root>
    );
};

export default VolumeBar;