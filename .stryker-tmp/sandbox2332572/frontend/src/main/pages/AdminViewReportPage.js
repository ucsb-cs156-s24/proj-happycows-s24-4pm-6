import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ReportTable from "main/components/Reports/ReportTable";
import ReportHeaderTable from "main/components/Reports/ReportHeaderTable";
import ReportLineTable from "main/components/Reports/ReportLineTable";
import { useBackend } from 'main/utils/useBackend';
import { Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AdminViewReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  // Stryker disable  all 
  const { data: reportHeader } =
    useBackend(
      ["/api/reports/byReportId"],
      {
        method: "GET", url: "/api/reports/byReportId",
        params: { reportId: reportId },
      },
      []
    );

  const { data: reportLines } =
    useBackend(
      ["/api/reports/lines"],
      {
        method: "GET", url: "/api/reports/lines",
        params: { reportId: reportId },
      },
      []
    );
  // Stryker restore  all 

  return (
    <BasicLayout>
      <div className="pt-2">
        <Row>
          <Col>
            <h1>Instructor Report</h1>
          </Col>
          <Col>
            <Button variant="primary" onClick={() => navigate("/admin/reports")} >Back to Reports</Button>
          </Col>
        </Row>
        <ReportTable reports={[reportHeader]} buttons={false} />
        <ReportHeaderTable report={reportHeader} />
        <Row  className="pt-5">
          <Col>
            <h2>Farmers</h2>
          </Col>
          <Col>
            <Button variant="secondary" href={`/api/reports/download?reportId=${reportId}`} >Download as CSV</Button>
          </Col>
        </Row>
        <ReportLineTable reportLines={reportLines} />
      </div>
    </BasicLayout>
  )
};
