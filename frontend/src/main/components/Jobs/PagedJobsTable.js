import React from "react";
import OurTable, { PlaintextColumn, DateColumn } from "main/components/OurTable";
import { Button } from "react-bootstrap";
import { useBackend } from "main/utils/useBackend";

const PagedJobsTable = () => {

    const testId = "PagedJobsTable";
    const refreshJobsIntervalMilliseconds = 5000;

    const [selectedPage, setSelectedPage] = React.useState(0);

    const pageSize = 10;

    // Stryker disable all
    const {
        data: page
    } = useBackend(
        ["/api/jobs/all"],
        {
            method: "GET",
            url: "/api/jobs/all/pageable",
            params: {
                page: selectedPage,
                size: pageSize,
            }
        },
        {content: [], totalPages: 0},
        { refetchInterval: refreshJobsIntervalMilliseconds }
    );
    // Stryker restore  all

    const testid = "PagedJobsTable";

    const previousPageCallback = () => {
        return () => {
            setSelectedPage(selectedPage - 1);
        }
    }

    const nextPageCallback = () => {
        return () => {
            setSelectedPage(selectedPage + 1);
        }
    }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        DateColumn('Created', (cell) => cell.row.original.createdAt),
        DateColumn('Updated', (cell) => cell.row.original.updatedAt),
        {
            Header: 'Status',
            accessor: 'status'
        },
        PlaintextColumn('Log', (cell) => cell.row.original.log),
    ];

    const sortees = React.useMemo(
        () => [
            {
                id: "id",
                desc: true
            }
        ],
        // Stryker disable next-line all
        []
    );

    return (
        <>
            <p>Page: {selectedPage + 1}</p>
            <Button data-testid={`${testId}-previous-button`}onClick={previousPageCallback()} disabled={ selectedPage === 0}>Previous</Button>
            <Button data-testid={`${testId}-next-button`} onClick={nextPageCallback()} disabled={page.totalPages===0 || selectedPage === page.totalPages-1}>Next</Button>
            < OurTable
                data={page.content}
                columns={columns}
                testid={testid}
                initialState={{ sortBy: sortees }}
            />
        </>
    );
}; 

export default PagedJobsTable;