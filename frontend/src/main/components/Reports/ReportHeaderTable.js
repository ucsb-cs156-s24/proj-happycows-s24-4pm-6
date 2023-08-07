import OurTable from "main/components/OurTable";

// should take in a players list from a commons
export default function ReportHeaderTable({ report  }) {
    const columns = [
        {
            Header: 'Cow Price',
            accessor: 'cowPrice', 
        },
        {
            Header: 'Milk Price',
            accessor: 'milkPrice',
        },
        {
            Header: 'Start Bal',
            accessor: 'startingBalance',
        },
        {
            Header: 'Start Date',
            id: 'startingDate',
            accessor: (row, _rowIndex) => String(row.startingDate).substring(0, 10)

        },
        {
            Header: 'Leaderboard',
            id: 'showLeaderboard',
            accessor: (row, _rowIndex) => String(row.showLeaderboard) // hack needed for boolean values to show up
        },
        {
            Header: 'Capacity',
            accessor: 'carryingCapacity',
        },
        {
            Header: 'Degrad. Rate',
            accessor: 'degradationRate',
        },
        {
            Header: 'BelowCap',
            accessor: 'belowCapacityHealthUpdateStrategy',
        },
        {
            Header: 'AboveCap',
            accessor: 'aboveCapacityHealthUpdateStrategy',
        },
    ];

    const testid = "ReportHeaderTable";

    return <OurTable
        data={[report]}
        columns={columns}
        testid={testid}
    />;

};