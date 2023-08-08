import React from 'react';

import ReportTable from "main/components/Reports/ReportTable";
import reportFixtures from 'fixtures/reportFixtures';

export default {
    title: 'components/Reports/ReportTable',
    component: ReportTable
};

const Template = (args) => {
    return (
        <ReportTable storybook={true} {...args} />
    )
};

export const ThreeReports = Template.bind({});

ThreeReports.args = {
    reports: reportFixtures.threeReports
};
