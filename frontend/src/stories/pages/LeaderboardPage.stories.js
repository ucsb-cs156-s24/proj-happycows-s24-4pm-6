import React from 'react';
import LeaderboardPage from "main/pages/LeaderboardPage";
import { Route, Routes } from 'react-router-dom';

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from 'msw';
import userCommonsFixtures from 'fixtures/userCommonsFixtures';

export default {
    title: 'pages/LeaderboardPage',
    component: LeaderboardPage,
};

export const OrdinaryUser = () => {
    return (
        <Routes>
            <Route
                element={<LeaderboardPage />}
                path="/leaderboard/:commonsId"
            />
        </Routes>
    )
}

OrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/usercommons/commons/all?commonsId=17', (_req, res, ctx) => {
            return res(ctx.json(userCommonsFixtures.tenUserCommons));
        }),
    ]
}

export const AdminUser = () => {
    return (
        <Routes>
            <Route
                element={<LeaderboardPage />}
                path="/leaderboard/:commonsId"
            />
        </Routes>
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
        rest.get('/api/usercommons/commons/all?commonsId=17', (_req, res, ctx) => {
            return res(ctx.json(userCommonsFixtures.tenUserCommons));
        }),
    ]
}