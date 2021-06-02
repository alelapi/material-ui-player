import React from 'react';
import { Story, Meta } from '@storybook/react';

import { VolumeBar, VolumeBarProps } from '../components';

export default {
    title: 'Components/VolumeBar',
    component: VolumeBar,
    argTypes: {
        color: {
            defaultValue: 'primary',
            control: {
                type: 'radio',
            },
            options: ['primary', 'secondary']
        },
        mute: {
            defaultValue: true,
            control: {
                type: 'radio',
            },
            options: [true, false]
        },
        thickness: {
            defaultValue: 'medium',
            control: {
                type: 'radio',
            },
            options: ['thin', 'medium', 'large']
        }
    }
} as Meta;

const mediaPlayer = new Audio();
const Template: Story<VolumeBarProps> = (args) => <VolumeBar {...args} />;

export const Default = Template.bind({});
Default.args = {
    player: mediaPlayer,
};

export const HideMute = Template.bind({});
HideMute.args = {
    player: mediaPlayer,
    mute: false,
};