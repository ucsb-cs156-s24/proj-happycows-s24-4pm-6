import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";


import { useParams } from "react-router-dom";
import AnnouncementForm from "main/components/Announcement/AnnouncementForm";
import { Navigate } from 'react-router-dom'
import { toast } from "react-toastify"

import { useBackendMutation } from "main/utils/useBackend";

const AdminCreateAnnouncementsPage = () => {

    let { commonsId } = useParams();

    const objectToAxiosParams = (announcement) => ({        
        url: "/api/announcements/post",
        method: "POST",
        params: {
            commonsId: announcement.commonsId,
            startDate: announcement.startDate,
            endDate: announcement.endDate,
            announcementText: announcement.announcementText
        }
    });

    const onSuccess = (announcement) => {
        toast(`Announcement successfully created - id: ${announcement.id}`);
    }
   
    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/announcements/all"]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate({ ...data, commonsId });
    }

    if (isSuccess) {
        return <Navigate to={`/admin/announcements/${commonsId}`} />
    }

    return (
        <BasicLayout>
            <h2>Create Announcement</h2>
            <AnnouncementForm submitAction={onSubmit}/>
        </BasicLayout>
    );
};


export default AdminCreateAnnouncementsPage;
