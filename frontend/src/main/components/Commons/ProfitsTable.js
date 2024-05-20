import React from "react";
import OurTable from "main/components/OurTable";
import { Button } from "react-bootstrap";
import { useBackend } from "main/utils/useBackend";
import { useParams } from "react-router-dom";


const ProfitsTable = () => {

    const testId = "ProfitsTable";
    const refreshJobsIntervalMilliseconds = 2000;

    const [selectedPage, setSelectedPage] = React.useState(0);

    const PROFIT_PAGE_SIZE = 5;
    const { commonsId } = useParams();
    
    // Stryker disable all
    const {
        data: page
    } = useBackend(
        ["/api/profits/paged"],
        {
            method: "GET",
            url: "/api/profits/paged/commonsid", 
            params: {
                commonsId: commonsId,
                pageNumber: selectedPage,
                pageSize: PROFIT_PAGE_SIZE,
            }
        },
        {content: [], totalPages: 0},
        { refetchInterval: refreshJobsIntervalMilliseconds }
    );
    // Stryker restore  all

    const testid = "ProfitsTable";

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

    const columns = 
        [
            {
                Header: "Profit",
                accessor: (row) => `$${row.amount.toFixed(2)}`,
            },
            {
                Header: "Date",
                accessor: "timestamp",
                Cell: ({ value }) => new Date(value).toLocaleDateString(),
            },
            {
                Header: "Health",
                accessor: (row) => `${row.avgCowHealth.toFixed(2) + '%'}`
            },
            {
                Header: "Cows",
                accessor: "numCows",
            },
        ];
    

    const sortees = React.useMemo(
        () => [
            {
                id: "timestamp",
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

export default ProfitsTable;
