import React from 'react';

import ReportHeaderTable from "main/components/Reports/ReportHeaderTable";
import reportFixtures from 'fixtures/reportFixtures';

export default {
    title: 'components/Reports/ReportHeaderTable',
    component: ReportHeaderTable
};

const Template = (args) => {
    return (
        <ReportHeaderTable {...args} />
    )
};

export const OneReport = Template.bind({});

OneReport.args = {
    report: reportFixtures.threeReports[0]
};

