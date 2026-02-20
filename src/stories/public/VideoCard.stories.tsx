import React from 'react';
import { Story, Meta } from '@storybook/react';
import VideoCard, { VideoCardProps } from '../../components/VideoCard';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default {
    title: 'Components/VideoCard',
    component: VideoCard,
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
        },
        onForwardClick: {
            action: 'forward'
        },
        onBackwardClick: {
            action: 'backward'
        },
        onEnded: {
            action: 'end'
        },
        forward: {
            defaultValue: true,
            control: {
                type: 'radio',
            },
            options: [true, false, undefined]
        },
        backward: {
            defaultValue: true,
            control: {
                type: 'radio',
            },
            options: [true, false, undefined]
        },
        mute: {
            defaultValue: true,
            control: {
                type: 'radio',
            },
            options: [true, false, undefined]
        },
        speed: {
            defaultValue: true,
            control: {
                type: 'radio',
            },
            options: [true, false, undefined]
        },
        loop: {
            defaultValue: false,
            control: {
                type: 'radio',
            },
            options: [true, false, undefined]
        },
    }
} as Meta;

const Template: Story<VideoCardProps> = (args) => <VideoCard {...args} />;

export const Default = Template.bind({});
Default.args = {
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    width: 500,
};

export const FirebaseStorage = Template.bind({});
FirebaseStorage.args = {
    src: new Promise((resolve) => {
        //simulate get downloadURL
        setTimeout(() => {
            resolve('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
        }, 500);
    }),
    width: 500,
};
