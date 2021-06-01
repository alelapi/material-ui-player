import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MaterialUIAudio, MaterialUIAudioProps } from '../components';

export default {
    title: 'Components/MaterialUIAudio',
    component: MaterialUIAudio,
    argTypes: {
        color: {
            defaultValue: 'primary',
            control: {
                type: 'radio',
                options: ['primary', 'secondary']
            }
        },
        thickness: {
            defaultValue: 'medium',
            control: {
                type: 'radio',
                options: ['thin', 'medium', 'large']
            }
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
                options: [true, false]
            }
        },
        backward: {
            defaultValue: true,
            control: {
                type: 'radio',
                options: [true, false]
            }
        },
        mute: {
            defaultValue: true,
            control: {
                type: 'radio',
                options: [true, false]
            }
        },
        speed: {
            defaultValue: true,
            control: {
                type: 'radio',
                options: [true, false]
            }
        },
        loop: {
            defaultValue: false,
            control: {
                type: 'radio',
                options: [true, false]
            }
        },
    }
} as Meta;

const Template: Story<MaterialUIAudioProps> = (args) => <MaterialUIAudio {...args} />;

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
