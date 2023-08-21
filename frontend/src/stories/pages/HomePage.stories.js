import React from 'react';
import HomePage from 'main/pages/HomePage.js'

export default {
    title: 'pages/HomePage',
    component: HomePage,
};

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