import React from 'react';
import { Story, Meta } from '@storybook/react';
import { AudioCard, AudioCardProps } from '../../components';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default {
    title: 'Components/AudioCard',
    component: AudioCard,
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

const Template: Story<AudioCardProps> = (args) => <AudioCard {...args} />;

export const Default = Template.bind({});
Default.args = {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

export const FirebaseStorage = Template.bind({});
FirebaseStorage.args = {
    src: new Promise((resolve) => {
        //simulate get downloadURL
        setTimeout(() => {
            resolve('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3')
        }, 500);
    }),
};
