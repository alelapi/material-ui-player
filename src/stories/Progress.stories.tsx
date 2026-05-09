import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Progress from '../components/Progress';

const meta: Meta<typeof Progress> = {
    title: 'Components/Progress',
    component: Progress,
    args: {
        color: 'primary',
        thickness: 'medium',
    },
    argTypes: {
        onProgressClick: { action: 'changed' },
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
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
    args: {
        time: {
            currentTime: 12,
            duration: 87,
        },
    },
};

export const Reset: Story = {
    args: {
        time: {
            currentTime: 0,
            duration: 87,
        },
    },
};
