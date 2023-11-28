import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PagedJobsTable from "main/components/Jobs/PagedJobsTable";
import Accordion from "react-bootstrap/Accordion";
import TestJobForm from "main/components/Jobs/TestJobForm";
import UpdateCowHealthForm from "main/components/Jobs/UpdateCowHealthForm";
import MilkCowsJobForm from "main/components/Jobs/MilkCowsJobForm";
import InstructorReportForm from "main/components/Jobs/InstructorReportForm";
import InstructorReportSpecificCommonsForm from "main/components/Jobs/InstructorReportSpecificCommonsForm";
import { toast } from "react-toastify";

import { useBackendMutation } from "main/utils/useBackend";
import SetCowHealthForm from "main/components/Jobs/SetCowHealthForm";

const AdminJobsPage = () => {

  // *** Test job ***

  const objectToAxiosParamsTestJob = (data) => ({
    url: `/api/jobs/launch/testjob?fail=${data.fail}&sleepMs=${data.sleepMs}`,
    method: "POST",
  });

  // Stryker disable all
  const testJobMutation = useBackendMutation(objectToAxiosParamsTestJob, {}, [
    "/api/jobs/all",
  ]);
  // Stryker restore all

  const submitTestJob = async (data) => {
    toast("Submitted job: Test Job");
    testJobMutation.mutate(data);
  };

  
  // *** SetCowHealth job ***

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
  // Stryker restore all

  const submitSetCowHealthJob = async (data) => {
    toast(`Submitted Job: Set Cow Health (Commons: ${data.selectedCommonsName}, Health: ${data.healthValue})`);
    SetCowHealthMutation.mutate(data);
  };

  // *** UpdateCowHealth job ***

  const objectToAxiosParamsUpdateCowHealthJob = () => ({
    url: `/api/jobs/launch/updatecowhealth`,
    method: "POST",
  });

  const objectToAxiosParamsUpdateCowHealthJobSingle = (data) => ({
    url: `/api/jobs/launch/updatecowhealthsinglecommons?commonsId=${data.selectedCommons}`,
    method: "POST",
  });

  // Stryker disable all
  const UpdateCowHealthMutation = useBackendMutation(
    objectToAxiosParamsUpdateCowHealthJob,
    {},
    ["/api/jobs/all"]
  );

  const UpdateCowHealthSingleMutation = useBackendMutation(
    objectToAxiosParamsUpdateCowHealthJobSingle,
    {},
    ["/api/jobs/all"]
  );
  // Stryker restore all

  const submitUpdateCowHealthJob = async (data) => {
    if (data.selectedCommonsName === "All Commons") {
      toast("Submitted Job: Update Cow Health");
    UpdateCowHealthMutation.mutate();
    } else {
    toast(`Submitted Job: Update Cow Health (Commons: ${data.selectedCommonsName})`);
    UpdateCowHealthSingleMutation.mutate(data);
    }
  };


  // *** MilkTheCows job ***

  const objectToAxiosParamsMilkTheCowsJob = () => ({
    url: `/api/jobs/launch/milkthecowjob`,
    method: "POST",
  });

  const objectToAxiosParamsMilkTheCowsJobSingle = (data) => ({
    url: `/api/jobs/launch/milkthecowjobsinglecommons?commonsId=${data.selectedCommons}`,
    method: "POST",
  });


  // Stryker disable all
  const MilkTheCowsMutation = useBackendMutation(
    objectToAxiosParamsMilkTheCowsJob,
    {},
    ["/api/jobs/all"]
  );

  const MilkTheCowsSingleMutation = useBackendMutation(
    objectToAxiosParamsMilkTheCowsJobSingle,
    {},
    ["/api/jobs/all"]
  );
  // Stryker restore all

  const submitMilkTheCowsJob = async (data) => {
    if (data.selectedCommonsName === "All Commons") {
      toast("Submitted Job: Milk The Cows!");
      MilkTheCowsMutation.mutate();
    } else {
    toast(`Submitted Job: Milk The Cows! (Commons: ${data.selectedCommonsName})`);
    MilkTheCowsSingleMutation.mutate(data);
    }
  };
  // *** Instructor Report job ***

  const objectToAxiosParamsInstructorReportJob = () => ({
    url: `/api/jobs/launch/instructorreport`,
    method: "POST",
  });

  // Stryker disable all
  const InstructorReportMutation = useBackendMutation(
    objectToAxiosParamsInstructorReportJob,
    {},
    ["/api/jobs/all"]
  );
  // Stryker restore all

  const submitInstructorReportJob = async () => {
    toast("Submitted Job: Instructor Report");
    InstructorReportMutation.mutate();
  }

  // *** Instructor Report (Specific Commons) job ***

  const objectToAxiosParamsInstructorReportSpecificCommonsJob = (data) => {
    return ({
      url: `/api/jobs/launch/instructorreportsinglecommons?commonsId=${data.selectedCommons}`,
      method: "POST",
    });

  };
  
// Stryker disable all
const InstructorReportSpecificCommonsMutation = useBackendMutation(
  objectToAxiosParamsInstructorReportSpecificCommonsJob,
  {},
  ["/api/jobs/all"]
);
// Stryker restore all

const submitInstructorReportSpecificCommonsJob = async (data) => {
  toast("Submitted Job: Instructor Report (Specific Commons)");
  InstructorReportSpecificCommonsMutation.mutate(data);
}

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
    form: <InstructorReportForm submitAction={submitInstructorReportJob} />
  },
  {
    name: "Instructor Report (for specific commons)",
    form: <InstructorReportSpecificCommonsForm submitAction={submitInstructorReportSpecificCommonsJob} />
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
    <PagedJobsTable />
  </BasicLayout>
);
};

export default AdminJobsPage;
