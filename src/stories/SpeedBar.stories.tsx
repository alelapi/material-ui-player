import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SpeedBar from '../components/SpeedBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const meta: Meta<typeof SpeedBar> = {
    title: 'Components/SpeedBar',
    component: SpeedBar,
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
    },
    argTypes: {
        color: {
            control: { type: 'radio' },
            options: ['primary', 'secondary'],
        },
        thickness: {
            control: { type: 'radio' },
            options: ['thin', 'medium', 'large'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof SpeedBar>;

const mediaPlayer = new Audio();

export const Default: Story = {
    args: {
        player: mediaPlayer,
    },
};
