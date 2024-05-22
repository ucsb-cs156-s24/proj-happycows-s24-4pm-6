import React from 'react';
import AnnouncementTable from "main/components/Announcement/AnnouncementTable";
import { announcementFixtures } from 'fixtures/announcementFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/Announcement/AnnouncementTable',
    component: AnnouncementTable
};

const Template = (args) => {
    return (
        <AnnouncementTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    announcements: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    announcements: announcementFixtures.threeAnnouncements,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    announcements: announcementFixtures.threeAnnouncements,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/announcements', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

