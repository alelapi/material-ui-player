import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Progress, ProgressProps } from '../components';
import { Time } from '../types';

export default {
    title: 'Components/Progress',
    component: Progress,
    argTypes: {
        onChange: {
            action: 'changed'
        },
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

const Template: Story<ProgressProps> = (args) => <Progress {...args} />;

const time: Time = {
    currentTime: 12,
    duration: 87
};
export const Default = Template.bind({});
Default.args = {
    time,
};