import React from 'react';
import { Story, Meta } from '@storybook/react';

import { SpeedBar, SpeedBarProps } from '../components';

export default {
    title: 'Components/SpeedBar',
    component: SpeedBar,
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
const Template: Story<SpeedBarProps> = (args) => <SpeedBar {...args} />;

export const Default = Template.bind({});
Default.args = {
    player: mediaPlayer,
};
