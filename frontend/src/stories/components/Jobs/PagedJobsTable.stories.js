import React from 'react';

import PagedJobsTable from "main/components/Jobs/PagedJobsTable";
import jobsFixtures from "fixtures/jobsFixtures";

export default {
    title: 'components/Jobs/PagedJobsTable',
    component: PagedJobsTable
};

const Template = (args) => {
    return (
        <PagedJobsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    jobs: [],
    nextPageCallback: () => { },
    previousPageCallback: () => { }
};

export const SixJobs = Template.bind({});

SixJobs.args = {
    jobs: jobsFixtures.sixJobs,
    nextPageCallback: () => { },
    previousPageCallback: () => { }
};