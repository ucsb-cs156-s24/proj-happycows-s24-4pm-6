
import React from 'react';
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import RoleBadge from "main/components/Profile/RoleBadge";

export default {
    title: 'components/Profile/RoleBadge',
    component: RoleBadge
};

const Template = (args) => {
    return (
        <RoleBadge {...args} />
    )
};

export const user = Template.bind({});
user.args = {
    role: "ROLE_USER",
    currentUser: currentUserFixtures.userOnly
};

export const admin = Template.bind({});
admin.args = {
    role: "ROLE_ADMIN",
    currentUser: currentUserFixtures.adminUser
};



