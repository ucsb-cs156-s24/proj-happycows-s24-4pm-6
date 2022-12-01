import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import JobsTable from "main/components/Jobs/JobsTable";
import { useBackend } from "main/utils/useBackend";
import Accordion from 'react-bootstrap/Accordion';
import TestJobForm from "main/components/Jobs/TestJobForm";
import UpdateCowHealthForm from "main/components/Jobs/UpdateCowHealthForm";
import MilkCowsJobForm from "main/components/Jobs/MilkCowsJobForm";
import InstructorReportForm from "main/components/Jobs/InstructorReportForm";

import { useBackendMutation } from "main/utils/useBackend";

const AdminJobsPage = () => {

    const refreshJobsIntervalMilliseconds = 5000;

    const objectToAxiosParamsTestJob = (data) => ({
        url: `/api/jobs/launch/testjob?fail=${data.fail}&sleepMs=${data.sleepMs}`,
        method: "POST"
    });

    // Stryker disable all
    const testJobMutation = useBackendMutation(
        objectToAxiosParamsTestJob,
        {  },
        ["/api/jobs/all"]
    );
    // Stryker enable all

    const submitTestJob = async (data) => {
        console.log("submitTestJob, data=", data);
        testJobMutation.mutate(data);
    }

    // Stryker disable all
    const { data: jobs, error: _error, status: _status } =
        useBackend(
            ["/api/jobs/all"],
            {
                method: "GET",
                url: "/api/jobs/all",
            },
            [],
            { refetchInterval: refreshJobsIntervalMilliseconds }
        );
    // Stryker enable  all

    const objectToAxiosParamsUpdateCowHealthJob = () => ({
        url: `/api/jobs/launch/updatecowhealth`,
        method: "POST"
    });

    // Stryker disable all
    const UpdateCowHealthMutation = useBackendMutation(
        objectToAxiosParamsUpdateCowHealthJob,
        {  },
        ["/api/jobs/all"]
    );
    // Stryker enable all

    const submitUpdateCowHealthJob = async () => {
        console.log("submitUpdateCowHealthJob")
        UpdateCowHealthMutation.mutate();
    }

    const jobLaunchers = [
        {
            name: "Update Cow Health",
            form: <UpdateCowHealthForm submitAction={submitUpdateCowHealthJob}/>
        },
        {
            name: "Milk The Cows",
            form: <MilkCowsJobForm />
        },
        {
            name: "Instructor Report",
            form: <InstructorReportForm />
        },
    ]

    return (
        <BasicLayout>
            <h2 className="p-3">Launch Jobs</h2>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Test Job</Accordion.Header>
                    <Accordion.Body>
                        <TestJobForm submitAction={submitTestJob} />
                    </Accordion.Body>
                </Accordion.Item>
                {
                    jobLaunchers.map((jobLauncher, index) => (
                        <Accordion.Item eventKey={index + 1}>
                            <Accordion.Header>{jobLauncher.name}</Accordion.Header>
                            <Accordion.Body>
                                {jobLauncher.form}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))
                }
            </Accordion>

            <h2 className="p-3">Job Status</h2>

            <JobsTable jobs={jobs} />
        </BasicLayout>
    );
};

export default AdminJobsPage;
