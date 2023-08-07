import OurTable from "main/components/OurTable";

// should take in a players list from a commons
export default function ReportHeaderTable({ report  }) {
    const columns = [
        {
            Header: 'id',
            accessor: 'id', 
        },
        {
            Header: 'commonsId',
            accessor: 'commonsId', 
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Cow Price',
            accessor: 'cowPrice', 
        },
        {
            Header: 'Milk Price',
            accessor: 'milkPrice',
        },
        {
            Header: 'Starting Balance',
            accessor: 'startingBalance',
        },
        {
            Header: 'Starting Date',
            accessor: 'startingDate',
        },
        {
            Header: 'Show Leaderboard',
            id: 'showLeaderboard',
            accessor: (row, _rowIndex) => String(row.showLeaderboard) // hack needed for boolean values to show up
        },
        {
            Header: 'Carrying Capacity',
            accessor: 'carryingCapacity',
        },
        {
            Header: 'Degradation Rate',
            accessor: 'degradationRate',
        },
        {
            Header: 'BelowCap Strategy',
            accessor: 'belowCapacityHealthUpdateStrategy',
        },
        {
            Header: 'AboveCap Strategy',
            accessor: 'aboveCapacityHealthUpdateStrategy',
        },
        {
            Header: 'Num Users',
            accessor: 'numUsers',
        },
        {
            Header: 'Num Cows',
            accessor: 'numCows',
        },
        {
            Header: 'Create Date',
            accessor: 'createDate',
        },
    ];

    const testid = "ReportHeaderTable";

    return <OurTable
        data={[report]}
        columns={columns}
        testid={testid}
    />;

};