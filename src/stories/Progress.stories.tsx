import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Progress, ProgressProps } from '../components';

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

export const Default = Template.bind({});
Default.args = {
    time: {
        currentTime: 12,
        duration: 87
    },
};
export const Reset = Template.bind({});
Reset.args = {
    time: {
        currentTime: 0,
        duration: 87
    },
};