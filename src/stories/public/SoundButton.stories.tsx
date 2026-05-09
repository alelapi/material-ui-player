import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SoundButton from '../../components/SoundButton';

const meta: Meta<typeof SoundButton> = {
    title: 'Components/SoundButton',
    component: SoundButton,
    args: {
        color: 'primary',
    },
    argTypes: {
        color: {
            control: { type: 'radio' },
            options: ['primary', 'secondary'],
        },
        onEnded: { action: 'end' },
    },
};

export default meta;
type Story = StoryObj<typeof SoundButton>;

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
        color: 'secondary',
    },
};
