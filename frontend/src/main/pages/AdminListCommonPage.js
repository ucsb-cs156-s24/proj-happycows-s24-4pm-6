import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsTable from 'main/components/Commons/CommonsTable';
import { useBackend } from 'main/utils/useBackend';
import { useCurrentUser } from "main/utils/currentUser";
import { Button, Row, Col } from "react-bootstrap";

export default function AdminListCommonsPage()
{
  const { data: currentUser } = useCurrentUser();

  // Stryker disable  all 
  const { data: commons, error: _error, status: _status } =
    useBackend(
      ["/api/commons/allplus"],
      { method: "GET", url: "/api/commons/allplus" },
      []
    );
  // Stryker restore  all 

  return (
    <BasicLayout>
      <div className="pt-2">
        <Row  className="pt-5">
          <Col>
            <h2>Commons</h2>
          </Col>
          <Col>
            <Button href='/api/commonstats/downloadAll'>
              Download All Stats
            </Button>
          </Col>
        </Row>
        <CommonsTable commons={commons} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
};
