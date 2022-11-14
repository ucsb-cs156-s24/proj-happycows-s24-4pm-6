import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import JobsTable from "main/components/Jobs/JobsTable";
import { useBackend } from "main/utils/useBackend";

const AdminJobsPage = () => {

    // Stryker disable  all 
    const { data: jobs, error: _error, status: _status } =
        useBackend(
            ["/api/jobs/all"],
            { method: "GET", url: "/api/jobs/all" },
            []
        );
    // Stryker enable  all 

    return (
        <BasicLayout>
            <h2>Manage Jobs (Admins)</h2>
            <JobsTable jobs={jobs} />
        </BasicLayout>
    );
};

export default AdminJobsPage;
