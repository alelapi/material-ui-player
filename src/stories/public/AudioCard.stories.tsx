import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AudioCard from '../../components/AudioCard';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const meta: Meta<typeof AudioCard> = {
    title: 'Components/AudioCard',
    component: AudioCard,
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
        forward: true,
        backward: true,
        mute: true,
        speed: true,
        loop: false,
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
        onForwardClick: { action: 'forward' },
        onBackwardClick: { action: 'backward' },
        onEnded: { action: 'end' },
        forward: {
            control: { type: 'radio' },
            options: [true, false, undefined],
        },
        backward: {
            control: { type: 'radio' },
            options: [true, false, undefined],
        },
        mute: {
            control: { type: 'radio' },
            options: [true, false, undefined],
        },
        speed: {
            control: { type: 'radio' },
            options: [true, false, undefined],
        },
        loop: {
            control: { type: 'radio' },
            options: [true, false, undefined],
        },
    },
};

export default meta;
type Story = StoryObj<typeof AudioCard>;

export const Default: Story = {
    args: {
        src: '/file_example.mp3',
    },
};

export const FirebaseStorage: Story = {
    args: {
        src: new Promise((resolve) => {
            setTimeout(() => {
                resolve('/file_example.mp3');
            }, 500);
        }),
    },
};
