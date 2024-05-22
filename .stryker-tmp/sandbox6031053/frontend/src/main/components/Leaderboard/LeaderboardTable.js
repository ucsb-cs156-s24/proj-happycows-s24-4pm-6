import OurTable from "main/components/OurTable";
import { Link } from "react-router-dom";

// should take in a players list from a commons
export default function LeaderboardTable({ leaderboardUsers }) {
    const USD = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    const columns = [
        {
            Header: "Farmer",
            accessor: (row, _rowIndex) => {
                const url = `/admin/play/${row.commonsId}/user/${row.userId}`;
                return <Link to={url}>{row.username}</Link>;
            },
        },
        {
            Header: "Total Wealth",
            id: "totalWealth",
            accessor: (row, _rowIndex) => {
                return USD.format(row.totalWealth);
            },
            Cell: (props) => {
                return <div style={{ textAlign: "right" }}>{props.value}</div>;
            },
        },
        {
            Header: "Cows Owned",
            accessor: "numOfCows",
            Cell: (props) => {
                return <div style={{ textAlign: "right" }}>{props.value}</div>;
            },
        },
        {
            Header: "Cow Health",
            accessor: "cowHealth",
            Cell: (props) => {
                return <div style={{ textAlign: "right" }}>{props.value}</div>;
            },
        },
        {
            Header: "Cows Bought",
            accessor: "cowsBought",
            Cell: (props) => {
                return <div style={{ textAlign: "right" }}>{props.value}</div>;
            },
        },
        {
            Header: "Cows Sold",
            accessor: "cowsSold",
            Cell: (props) => {
                return <div style={{ textAlign: "right" }}>{props.value}</div>;
            },
        },
        {
            Header: "Cow Deaths",
            accessor: "cowDeaths",
            Cell: (props) => {
                return <div style={{ textAlign: "right" }}>{props.value}</div>;
            },
        },
    ];

    const testid = "LeaderboardTable";

    return (
        <OurTable data={leaderboardUsers} columns={columns} testid={testid} />
    );
}
