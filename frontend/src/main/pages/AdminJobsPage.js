import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import JobsTable from "main/components/Jobs/JobsTable";
import { useBackend } from "main/utils/useBackend";
import Accordion from "react-bootstrap/Accordion";
import TestJobForm from "main/components/Jobs/TestJobForm";
import UpdateCowHealthForm from "main/components/Jobs/UpdateCowHealthForm";
import MilkCowsJobForm from "main/components/Jobs/MilkCowsJobForm";
import InstructorReportForm from "main/components/Jobs/InstructorReportForm";
import { toast } from "react-toastify";

import { useBackendMutation } from "main/utils/useBackend";
import SetCowHealthForm from "main/components/Jobs/SetCowHealthForm";

const AdminJobsPage = () => {
  const refreshJobsIntervalMilliseconds = 5000;

  const objectToAxiosParamsTestJob = (data) => ({
    url: `/api/jobs/launch/testjob?fail=${data.fail}&sleepMs=${data.sleepMs}`,
    method: "POST",
  });

  // Stryker disable all
  const testJobMutation = useBackendMutation(objectToAxiosParamsTestJob, {}, [
    "/api/jobs/all",
  ]);
  // Stryker enable all

  const submitTestJob = async (data) => {
    console.log("submitTestJob, data=", data);
    toast("Submitted job: Test Job");
    testJobMutation.mutate(data);
  };

  // Stryker disable all
  const {
    data: jobs,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/jobs/all"],
    {
      method: "GET",
      url: "/api/jobs/all",
    },
    [],
    { refetchInterval: refreshJobsIntervalMilliseconds }
  );
  // Stryker enable  all

  // SetCowHealth job

  const objectToAxiosParamsSetCowHealthJob = (data) => ({
    url: `/api/jobs/launch/setcowhealth?commonsID=${data.selectedCommons}&health=${data.healthValue}`,
    method: "POST",
  });

  // Stryker disable all
  const SetCowHealthMutation = useBackendMutation(
    objectToAxiosParamsSetCowHealthJob,
    {},
    ["/api/jobs/all"]
  );
  // Stryker enable all

  const submitSetCowHealthJob = async (data) => {
    console.log("submitSetCowHealthJob", data);
    toast(`Submitted Job: Set Cow Health (Commons: ${data.selectedCommonsName}, Health: ${data.healthValue})`);
    SetCowHealthMutation.mutate(data);
  };

  // UpdateCowHealth job

  const objectToAxiosParamsUpdateCowHealthJob = () => ({
    url: `/api/jobs/launch/updatecowhealth`,
    method: "POST",
  });

  // Stryker disable all
  const UpdateCowHealthMutation = useBackendMutation(
    objectToAxiosParamsUpdateCowHealthJob,
    {},
    ["/api/jobs/all"]
  );
  // Stryker enable all

  const submitUpdateCowHealthJob = async () => {
    console.log("submitUpdateCowHealthJob");
    toast("Submitted Job: Update Cow Health");
    UpdateCowHealthMutation.mutate();
  };

  // MilkTheCows job

  const objectToAxiosParamsMilkTheCowsJob = () => ({
    url: `/api/jobs/launch/milkthecowjob`,
    method: "POST",
  });
  
  const submitInstuctorReportJob = async () => {
    console.log("submitInstructorReportJob (wip)");
    toast('Instructor report not yet implemented; coming soon');
  }

  // Stryker disable all
  const MilkTheCowsMutation = useBackendMutation(
    objectToAxiosParamsMilkTheCowsJob,
    {},
    ["/api/jobs/all"]
  );
  // Stryker enable all

  const submitMilkTheCowsJob = async () => {
    console.log("submitMilkTheCowsJob");
    toast("Submitted Job: Milk The Cows");
    MilkTheCowsMutation.mutate();
  };

  const jobLaunchers = [
    {
      name: "Test Job",
      form: <TestJobForm submitAction={submitTestJob} />,
    },
    {
      name: "Set Cow Health for a Specific Commons",
      form: <SetCowHealthForm submitAction={submitSetCowHealthJob} />,
    },
    {
      name: "Update Cow Health",
      form: <UpdateCowHealthForm submitAction={submitUpdateCowHealthJob} />,
    },
    {
      name: "Milk The Cows",
      form: <MilkCowsJobForm submitAction={submitMilkTheCowsJob} />,
    },
    {
      name: "Instructor Report",
      form: <InstructorReportForm submitAction={submitInstuctorReportJob} />
    },
  ];

  return (
    <BasicLayout>
      <h2 className="p-3">Launch Jobs</h2>
      <Accordion>
        {jobLaunchers.map((jobLauncher, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>{jobLauncher.name}</Accordion.Header>
            <Accordion.Body>{jobLauncher.form}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <h2 className="p-3">Job Status</h2>
      <JobsTable jobs={jobs} />
    </BasicLayout>
  );
};

export default AdminJobsPage;
