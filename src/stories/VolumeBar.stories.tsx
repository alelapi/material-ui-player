import React from 'react';
import { Story, Meta } from '@storybook/react';

import { VolumeBar, VolumeBarProps } from '../components';

export default {
    title: 'Components/VolumeBar',
    component: VolumeBar,
    argTypes: {
        color: {
            control: {
                type: 'radio',
                options: ['primary', 'secondary']
            }
        },
        thickness: {
            control: {
                type: 'radio',
                options: ['thin', 'medium', 'large']
            }
        }
    }
} as Meta;

const mediaPlayer = new Audio();
const Template: Story<VolumeBarProps> = (args) => <VolumeBar {...args} />;

export const Default = Template.bind({});
Default.args = {
    player: mediaPlayer,
};

export const ShowMute = Template.bind({});
ShowMute.args = {
    player: mediaPlayer,
    mute: true,
};