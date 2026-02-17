import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Slider, { SliderProps } from '@mui/material/Slider';
import { styled, useTheme } from '@mui/material/styles';
import { MaterialUIColor, SliderThickness } from '../types';
import { getSliderSizes } from '../lib/utils';

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    alignItems: 'center',
    flexGrow: 1,
}));

const SpeedSlider = styled((props: ProgressSliderProps & SliderProps) => <Slider {...props}/>)(({ theme, thickness, color, thumb }) => ({
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

interface ProgressSliderProps {
    color?: MaterialUIColor;
    thickness?: SliderThickness;
    thumb?: boolean;
}

export interface SpeedBarProps {
    player: HTMLMediaElement;
}

const SpeedBar = (props: SpeedBarProps & ProgressSliderProps) => {
    const { player, ...styles } = props;
    const defaultSpeed: number = 50;
    const [speedBar, setSpeedBar] = useState(defaultSpeed);
    const theme = useTheme();

    const toSpeedValue = (speed: number) => speed * 0.018 + 0.1;

    const onSpeedChange = (_: any, newValue: number | number[]) => {
        const speed: number = (newValue as number);
        setSpeedBar(speed);
        player.playbackRate = toSpeedValue(speed);
    };

    const onNormalSpeedClick = () => {
        setSpeedBar(defaultSpeed);
        player.playbackRate = toSpeedValue(defaultSpeed);
    };

    return (
        <Root>
            <Button
                color={styles.color || 'primary'}
                variant="contained"
                aria-label="Normal speed"
                size="small"
                onClick={onNormalSpeedClick}
                sx={{
                    fontSize: 10,
                    padding: theme.spacing(0.5),
                    minWidth: theme.spacing(3),
                    marginRight: theme.spacing(1),
                }}
            >
                1x
            </Button>
            <SpeedSlider
                defaultValue={defaultSpeed}
                value={speedBar}
                onChange={onSpeedChange}
                {...styles}
                sx={{
                    marginTop: theme.spacing(1),
                }}
            />
        </Root>
    );
};

export default SpeedBar;