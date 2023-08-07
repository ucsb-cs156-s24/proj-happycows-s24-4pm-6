import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
// import CommonsTable from 'main/components/Commons/CommonsTable';
// import { useBackend } from 'main/utils/useBackend';
// import { useCurrentUser } from "main/utils/currentUser";

export default function AdminViewReportPage()
{
  const { reportId } = useParams();

  // const { data: currentUser } = useCurrentUser();

  // Stryker disable  all 
  // const { data: commons, error: _error, status: _status } =
  //   useBackend(
  //     ["/api/reports/all"],
  //     { method: "GET", url: "/api/reports/all" },
  //     []
  //   );
  // Stryker restore  all 

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Instructor Report </h1>
        <p>The reportId is: {reportId}</p>
        {/* <CommonsTable commons={commons} currentUser={currentUser} /> */}
      </div>
    </BasicLayout>
  )
};
