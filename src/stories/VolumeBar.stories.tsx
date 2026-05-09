import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import VolumeBar from '../components/VolumeBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const meta: Meta<typeof VolumeBar> = {
    title: 'Components/VolumeBar',
    component: VolumeBar,
    decorators: [
        Story => (
          <ThemeProvider theme={createTheme()}>
            <Story />
          </ThemeProvider>
        ),
    ],
    args: {
        color: 'primary',
        thickness: 'medium',
        mute: true,
    },
    argTypes: {
        color: {
            control: { type: 'radio' },
            options: ['primary', 'secondary'],
        },
        mute: {
            control: { type: 'radio' },
            options: [true, false],
        },
        thickness: {
            control: { type: 'radio' },
            options: ['thin', 'medium', 'large'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof VolumeBar>;

const mediaPlayer = new Audio();

export const Default: Story = {
    args: {
        player: mediaPlayer,
    },
};

export const HideMute: Story = {
    args: {
        player: mediaPlayer,
        mute: false,
    },
};
