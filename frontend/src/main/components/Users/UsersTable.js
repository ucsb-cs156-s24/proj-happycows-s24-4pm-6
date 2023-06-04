import React from "react";
import OurTable from "main/components/OurTable"
import formatTime from "main/components/Utils/formatTime";

const columns = [
    {
        Header: 'id',
        accessor: 'id', // accessor is the "key" in the data
    },
    {
        Header: 'First Name',
        accessor: 'givenName',
    },
    {
        Header: 'Last Name',
        accessor: 'familyName',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
    {
        Header: 'Last Online',
        accessor: 'lastOnline',
    },
    {
        Header: 'Admin',
        id: 'admin',
        accessor: (row, _rowIndex) => String(row.admin) // hack needed for boolean values to show up
    },
];

export default function UsersTable({ users }) {
    return <OurTable
        data={users && users.map(user => {
            return {
                ...user, 
                lastOnline: formatTime(user.lastOnline),
            };
        })}
        columns={columns}
        testid={"UsersTable"} />;
};