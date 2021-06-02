import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MaterialUIVideo, MaterialUIVideoProps } from '../components';

export default {
    title: 'Components/MaterialUIVideo',
    component: MaterialUIVideo,
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
            },
            options: [true, false]
        },
        backward: {
            defaultValue: true,
            control: {
                type: 'radio',
            },
            options: [true, false]
        },
        mute: {
            defaultValue: true,
            control: {
                type: 'radio',
            },
            options: [true, false]
        },
        speed: {
            defaultValue: true,
            control: {
                type: 'radio',
            },
            options: [true, false]
        },
        loop: {
            defaultValue: false,
            control: {
                type: 'radio',
            },
            options: [true, false]
        },
    }
} as Meta;

const Template: Story<MaterialUIVideoProps> = (args) => <MaterialUIVideo {...args} />;

export const Default = Template.bind({});
Default.args = {
    src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    width: 500,
};

export const FirebaseStorage = Template.bind({});
FirebaseStorage.args = {
    src: new Promise((resolve) => {
        //simulate get downloadURL
        setTimeout(() => {
            resolve('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4')
        }, 500);
    }),
    width: 500,
};
