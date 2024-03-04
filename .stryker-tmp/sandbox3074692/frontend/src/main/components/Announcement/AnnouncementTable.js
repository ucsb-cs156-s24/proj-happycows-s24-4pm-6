import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/announcementUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function AnnouncementTable({ announcements, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/announcements/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/announcements/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Start Date ISO Format',
            accessor: 'start',
        },
        {
            Header: 'End Date ISO Format',
            accessor: 'end',
        },
        {
            Header: 'Announcement',
            accessor: 'announcement',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "AnnouncementTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "AnnouncementTable"));
    } 

    return <OurTable
        data={announcements}
        columns={columns}
        testid={"AnnouncementTable"}
    />;
};