import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import AnnouncementTable from "main/components/Announcement/AnnouncementTable";
import { useBackend } from "main/utils/useBackend";
import { useParams } from "react-router-dom";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from 'react-bootstrap';

export default function AnnouncementsPage() {

    const currentUser = useCurrentUser();

    let { commonsId } = useParams();

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/announcements/create"
                    style={{ float: "right" }}
                >
                    Create Announcement 
                </Button>
            )
        } 
      }

    const { data: announcements, error: _error, status: _status } =
     useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/announcements/all?commonsId=${commonsId}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/announcements/all`,
        params: {
            commonsId
        }
      },
      // Stryker disable next-line all : don't test default value of empty list
      []
    );

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h2>Announcements for {commonsId}</h2>
                <AnnouncementTable announcements={announcements} currentUser={currentUser}/>
            </div>
        </BasicLayout>
    );
};