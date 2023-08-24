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

export const userWithNoGivenName = () => {
  return (<HomePage />)
}
userWithNoGivenName.parameters = {
  msw: [
    rest.get('/api/currentUser', (_req, res, ctx) => {
        return res(ctx.json(apiCurrentUserFixtures.userNoGivenName));
    }),
    rest.get('/api/systemInfo', (_req, res, ctx) => {
      return res(ctx.json(systemInfoFixtures.showingNeither));
    }),
  ]
}

const Template = (args) => <HomePage  {...args} />;

export const Morning = Template.bind({});
Morning.args = {
  hour: 8
};

export const Day = Template.bind({});
Day.args = {
  hour: 10
};

export const Evening = Template.bind({});
Evening.args = {
  hour: 19
}

export const Night = Template.bind({});
Night.args = {
  hour: 2
}