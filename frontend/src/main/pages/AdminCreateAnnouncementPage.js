import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsForm from "main/components/Commons/CommonsForm";
import { Navigate } from 'react-router-dom'
import { toast } from "react-toastify"

import { useBackendMutation } from "main/utils/useBackend";

const AdminCreateAnnouncementPage = () => {

    const objectToAxiosParams = (newAnnouncement) => ({
        url: "/api/announcements/new",
        method: "POST",
        data: newAnnouncement
    });

    const onSuccess = (announcement) => {
        toast(<div>Announcement successfully created!
            <br />{`id: ${announcement.id}`}
            <br />{`startDate: ${announcement.startDate}`}
            <br />{`endDate: ${announcement.endDate}`}
            <br />{`announcementText: ${announcement.announcementText}`}
        </div>);
    }
   
    // Stryker disable all
    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/announcements/all"]
    );
    // Stryker restore all

    const submitAction = async (data) => {
        mutation.mutate(data);
    }


    if (mutation.isSuccess) {
        return <Navigate to="/" />
    }

    return (
        <BasicLayout>
            <h2>Create Announcement</h2>
            <CommonsForm
                submitAction={submitAction}
            />
        </BasicLayout>
    );
};

export default AdminCreateAnnouncementPage;