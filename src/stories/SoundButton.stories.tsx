import React from 'react';
import { Story, Meta } from '@storybook/react';
import { SoundButton } from '../components';
import { BaseProps } from '../types';

export default {
    title: 'Components/SoundButton',
    component: SoundButton,
    argTypes: {
        color: {
            defaultValue: 'primary',
            control: {
                type: 'radio',
                options: ['primary', 'secondary']
            }
        },
        onEnded: {
            action: 'end'
        },
    }
} as Meta;

const Template: Story<BaseProps> = (args) => <SoundButton {...args} />;

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
    color: 'secondary'
};
