import React from 'react';
import AdminListCommonPage from "main/pages/AdminListCommonPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from 'msw';
import commonsPlusFixtures from 'fixtures/commonsPlusFixtures';

export default {
    title: 'pages/AdminListCommonPage',
    component: AdminListCommonPage
};

export const adminListPage = () => <AdminListCommonPage />;

adminListPage.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/commons/allplus', (_req, res, ctx) => {
            return res(ctx.json(commonsPlusFixtures.threeCommonsPlus));
        }),
    ]
}