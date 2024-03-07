import OurTable from "main/components/OurTable";
import { formatter } from "./ReportLineTable";

// should take in a players list from a commons
export default function ReportHeaderTable({ report  }) {
    const columns = [
        {
            Header: 'Cow Price',
            accessor: 'cowPrice', 
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
            },
        },
        {
            Header: 'Milk Price',
            accessor: 'milkPrice',
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
            },
        },
        {
            Header: 'Start Bal',
            accessor: 'startingBalance',
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{formatter.format(props.value)}</div>)
            },
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
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  },
        },
        {
            Header: 'Degrad Rate',
            accessor: 'degradationRate',
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  },
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