import React from 'react';

import CommonsTable from "main/components/Commons/CommonsTable";
import commonsPlusFixtures from 'fixtures/commonsPlusFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/commons/CommonsTable',
    component: CommonsTable
};

const Template = (args) => {
    return (
        <CommonsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    commons: []
};

export const ThreeCommons = Template.bind({});

ThreeCommons.args = {
    commons: commonsPlusFixtures.threeCommonsPlus
};

export const OneCommons = Template.bind({});

OneCommons.args = {
    commons: commonsPlusFixtures.oneCommonsPlus
}

export const ThreeCommonsAdmin = Template.bind({});

ThreeCommonsAdmin.args = {
    commons: commonsPlusFixtures.threeCommonsPlus,
    currentUser: currentUserFixtures.adminUser
};

export const OneCommonsAdmin = Template.bind({});

OneCommonsAdmin.args = {
    commons: commonsPlusFixtures.oneCommonsPlus,
    currentUser: currentUserFixtures.adminUser
}


