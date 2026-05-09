import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ControlKeys from '../components/ControlKeys';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const meta: Meta<typeof ControlKeys> = {
    title: 'Components/ControlKeys',
    component: ControlKeys,
    decorators: [
        Story => (
          <ThemeProvider theme={createTheme()}>
            <Story />
          </ThemeProvider>
        ),
    ],
    args: {
        color: 'primary',
    },
    argTypes: {
        onPauseClick: { action: 'pause' },
        onPlayClick: { action: 'play' },
        onForwardClick: { action: 'forward' },
        onBackwardClick: { action: 'backward' },
        onStopClick: { action: 'stop' },
        color: {
            control: { type: 'radio' },
            options: ['primary', 'secondary'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof ControlKeys>;

export const Default: Story = {
    args: {
        backward: true,
        forward: true,
        playing: false,
    },
};

export const Playing: Story = {
    args: {
        backward: true,
        forward: true,
        playing: true,
    },
};

export const NoBackwardAndForward: Story = {
    args: {
        playing: false,
    },
};
