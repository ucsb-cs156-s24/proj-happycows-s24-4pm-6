import React from 'react';
import { rest } from "msw";

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
    nextPageCallback: () => { },
    previousPageCallback: () => { }
};

export const SixJobs = Template.bind({});

SixJobs.args = {
    nextPageCallback: () => { },
    previousPageCallback: () => { }
};

SixJobs.parameters = {
    msw: [
        /* eslint-disable-next-line no-unused-vars */
        rest.get('/api/jobs/all/pageable', (req, res, ctx) => {
            return res(ctx.status(200),ctx.json({
                content: jobsFixtures.sixJobs,
                totalPages: 1,
            }));
        }),
    ]
};