import React from 'react';
import LeaderboardPage from "main/pages/LeaderboardPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from 'msw';
import userCommonsFixtures from 'fixtures/userCommonsFixtures';
import commonsFixtures from 'fixtures/commonsFixtures';

export default {
    title: 'pages/LeaderboardPage',
    component: LeaderboardPage,
};

export const OrdinaryUserShowLeaderboardTrue = () => {
    return (<LeaderboardPage />)
}

OrdinaryUserShowLeaderboardTrue.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/commons', (_req, res, ctx) => {
            return res(ctx.json(commonsFixtures.threeCommons[0]));
        }),
        rest.get('/api/usercommons/commons/all', (_req, res, ctx) => {
            return res(ctx.json(userCommonsFixtures.tenUserCommons));
        }),
    ]
}

export const OrdinaryUserShowLeaderboardFalse = () => {
    return (<LeaderboardPage />)
}

OrdinaryUserShowLeaderboardFalse.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/commons', (_req, res, ctx) => {
            return res(ctx.json({...commonsFixtures.threeCommons[0], showLeaderboard: false}));
        }),
        rest.get('/api/usercommons/commons/all', (_req, res, ctx) => {
            return res(ctx.json(userCommonsFixtures.tenUserCommons));
        }),
    ]
}

export const AdminUser = () => {
    return (
       <LeaderboardPage />
    )
}

AdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/usercommons/commons/all', (_req, res, ctx) => {
            return res(ctx.json(userCommonsFixtures.tenUserCommons));
        }),
        rest.get('/api/commons', (_req, res, ctx) => {
            return res(ctx.json(commonsFixtures.threeCommons[0]));
        }),
    ]
}