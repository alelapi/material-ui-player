import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ControlKeys, ControlKeysProps } from '../components';

export default {
    title: 'Components/ControlKeys',
    component: ControlKeys,
    argTypes: {
        onPauseClick: {
            action: 'pause'
        },
        onPlayClick: {
            action: 'play'
        },
        onForwardClick: {
            action: 'forward'
        },
        onBackwardClick: {
            action: 'backward'
        },
        onStopClick: {
            action: 'stop'
        },
        color: {
            defaultValue: 'primary',
            control: {
                type: 'radio',
            },
            options: ['primary', 'secondary']
        },
    }
} as Meta;

const Template: Story<ControlKeysProps> = (args) => <ControlKeys {...args} />;

export const Default = Template.bind({});
Default.args = {
    backward: true,
    forward: true,
    playing: false
};

export const Playing = Template.bind({});
Playing.args = {
    backward: true,
    forward: true,
    playing: true
};

export const NoBackwardAndForward = Template.bind({});
NoBackwardAndForward.args = {
    playing: false
};