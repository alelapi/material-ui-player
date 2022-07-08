import React from 'react';
import { Story, Meta } from '@storybook/react';
import ControlKeys, { ControlKeysProps } from '../components/ControlKeys';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default {
    title: 'Components/ControlKeys',
    component: ControlKeys,
    decorators: [
        Story => (
          <ThemeProvider theme={createTheme()}>
            <Story />
          </ThemeProvider>
        ),
      ],
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