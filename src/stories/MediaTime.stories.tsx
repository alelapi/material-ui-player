import React from 'react';
import { Story, Meta } from '@storybook/react';
import MediaTime, { MediaTimeProps } from '../components/MediaTime';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default {
    title: 'Components/MediaTime',
    component: MediaTime,
    decorators: [
        Story => (
          <ThemeProvider theme={createTheme()}>
            <Story />
          </ThemeProvider>
        ),
      ],
} as Meta;

const Template: Story<MediaTimeProps> = (args) => <MediaTime {...args} />;

export const Default = Template.bind({});
Default.args = {
    time: {
        currentTime: 12,
        duration: 87
    },
};