import React from 'react';

import ReportLineTable from "main/components/Reports/ReportLineTable";
import reportLineFixtures from 'fixtures/reportLineFixtures';

export default {
    title: 'components/Reports/ReportLineTable',
    component: ReportLineTable
};

const Template = (args) => {
    return (
        <ReportLineTable {...args} />
    )
};

export const OneReport = Template.bind({});

OneReport.args = {
    reportLines: reportLineFixtures.twoReportLines
};

