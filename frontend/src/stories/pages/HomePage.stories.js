import React from 'react';
import HomePage from "main/pages/HomePage";
import { rest } from 'msw';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
    title: 'pages/HomePage',
    component: HomePage,
};

export const normal = () => {
    return (<HomePage />)
}
normal.parameters = {
  msw: [
    rest.get('/api/currentUser', (_req, res, ctx) => {
        return res(ctx.json(apiCurrentUserFixtures.userOnly));    
    }),
    rest.get('/api/systemInfo', (_req, res, ctx) => {
      return res(ctx.json(systemInfoFixtures.showingNeither));
    }),
  ]
}

export const noUser = () => {
    return (<HomePage />)
}
noUser.parameters = {
  msw: [
    rest.get('/api/systemInfo', (_req, res, ctx) => {
      return res(ctx.json(systemInfoFixtures.showingNeither));
    }),
  ]
}


export const userWithNoName = () => {
  return (<HomePage />)
}
userWithNoName.parameters = {
  msw: [
    rest.get('/api/currentUser', (_req, res, ctx) => {
        return res(ctx.json(apiCurrentUserFixtures.userNoName));
    }),
    rest.get('/api/systemInfo', (_req, res, ctx) => {
      return res(ctx.json(systemInfoFixtures.showingNeither));
    }),
  ]
}