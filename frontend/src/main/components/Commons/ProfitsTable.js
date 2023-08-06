import React from "react";
import OurTable from "main/components/OurTable";

export default function ProfitsTable({ profits }) {
    
    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
    const memoizedColumns = React.useMemo(() => 
        [
            {
                Header: "Profit",
                accessor: (row) => `$${row.amount.toFixed(2)}`,
            },
            {
                Header: "Date",
                accessor: "date",
            },
            {
                Header: "Health",
                accessor: (row) => `${row.avgCowHealth + '%'}`
            },
            {
                Header: "Cows",
                accessor: "numCows",
            },
        ], 
    []);
    const memoizedDates = React.useMemo(() => profits, [profits]);
    // Stryker restore ArrayDeclaration

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"ProfitsTable"}
    />;
};