import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackend } from 'main/utils/useBackend';
import ReportTable  from 'main/components/Reports/ReportTable';

export default function AdminReportsPage()
{

  // Stryker disable  all 
  const { data: reports, error: _error, status: _status } =
    useBackend(
      ["/api/reports"],
      { method: "GET", url: "/api/reports" },
      []
    );
  // Stryker restore all 

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Instructor Reports</h1>
        <ReportTable reports={reports} /> 
      </div>
    </BasicLayout>
  )
};
