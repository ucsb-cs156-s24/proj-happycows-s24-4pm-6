import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import CommonsTable from 'main/components/Commons/CommonsTable';
// import { useBackend } from 'main/utils/useBackend';
// import { useCurrentUser } from "main/utils/currentUser";

export default function AdminReportsPage()
{
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
        <h1>Instructor Reports</h1>
        {/* <CommonsTable commons={commons} currentUser={currentUser} /> */}
      </div>
    </BasicLayout>
  )
};
