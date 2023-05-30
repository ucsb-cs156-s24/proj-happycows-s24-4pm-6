
import React from 'react';
import UserProfileTable from 'main/components/UserProfileTable';
import { apiCurrentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/UserProfileTable',
    component: UserProfileTable
};

const Template = (args) => {
    return (
        <UserProfileTable {...args} />
    )
};

export const Sample = Template.bind({});

Sample.args =  {user: apiCurrentUserFixtures.adminUser.user};
