import React from 'react';
import { Story, Meta } from '@storybook/react';

import { SpeedBar, SpeedBarProps } from '../components';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default {
    title: 'Components/SpeedBar',
    component: SpeedBar,
    decorators: [
        Story => (
          <ThemeProvider theme={createTheme()}>
            <Story />
          </ThemeProvider>
        ),
      ],
    argTypes: {
        color: {
            defaultValue: 'primary',
            control: {
                type: 'radio',
            },
            options: ['primary', 'secondary']
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
const Template: Story<SpeedBarProps> = (args) => <SpeedBar {...args} />;

export const Default = Template.bind({});
Default.args = {
    player: mediaPlayer,
};
