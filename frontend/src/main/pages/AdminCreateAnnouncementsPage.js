import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import AnnouncementForm from "main/components/Announcement/AnnouncementForm";

const AdminCreateAnnouncementsPage = () => {

    return (
        <BasicLayout>
            <h2>Create Announcement</h2>
            <AnnouncementForm />
        </BasicLayout>
    );
};

export default AdminCreateAnnouncementsPage;