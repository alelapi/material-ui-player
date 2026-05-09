import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MediaTime from '../components/MediaTime';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const meta: Meta<typeof MediaTime> = {
    title: 'Components/MediaTime',
    component: MediaTime,
    decorators: [
        Story => (
          <ThemeProvider theme={createTheme()}>
            <Story />
          </ThemeProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof MediaTime>;

export const Default: Story = {
    args: {
        time: {
            currentTime: 12,
            duration: 87,
        },
    },
};
