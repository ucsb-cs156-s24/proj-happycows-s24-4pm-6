import OurTable from "main/components/OurTable";

// should take in a players list from a commons
export default function ReportLineTable({ reportLines }) {
    const columns = [
        {
            Header: 'userId',
            accessor: 'userId', 
        },
        {
            Header: 'Username',
            accessor: 'username',
        },
        {
            Header: 'Total Wealth',
            accessor: 'totalWealth',
        },
        {
            Header: 'Num Cows',
            accessor: 'numOfCows', 
        },
        {
            Header: 'Avg Cow Health',
            accessor: 'avgCowHealth',
        },
        {
            Header: 'Cows Bought',
            accessor: 'cowsBought',
        },
        {
            Header: 'Cows Sold',
            accessor: 'cowsSold',
        },
        {
            Header: 'Cow Deaths',
            accessor: 'cowDeaths',
        },
        {
            Header: 'Create Date',
            accessor: 'createDate',
        },
    ];

    const testid = "ReportLineTable";

    return <OurTable
        data={reportLines}
        columns={columns}
        testid={testid}
    />;

};