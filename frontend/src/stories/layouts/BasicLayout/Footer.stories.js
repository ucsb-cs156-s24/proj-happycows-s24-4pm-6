
import React from 'react';

import Footer from "main/components/Nav/Footer";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
    title: 'layouts/BasicLayout/Footer',
    component: Footer
};


const Template = () => {
    return (
        <Footer systemInfo={systemInfoFixtures.showingBoth}/>
    )
};

export const Default = Template.bind({});