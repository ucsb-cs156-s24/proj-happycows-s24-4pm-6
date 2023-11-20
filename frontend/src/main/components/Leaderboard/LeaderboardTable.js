import OurTable from "main/components/OurTable";
import { hasRole } from "main/utils/currentUser";

// should take in a players list from a commons
export default function LeaderboardTable({ leaderboardUsers , currentUser }) {

    const USD = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    const columns = [
        // {
        //     Header: 'User Id',
        //     accessor: 'userId', 
        // },
        {
            Header: 'Farmer',
            accessor: 'username'
        },
        {
            Header: 'Total Wealth',
            id: 'totalWealth',
            accessor: (row, _rowIndex) => {
                return USD.format(row.totalWealth);
            },
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  },
        },
        {
            Header: 'Cows Owned',
            accessor: 'numOfCows', 
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  },
        },
        {
            Header: 'Cow Health',
            accessor: 'cowHealth', 
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  },
        },
        {
            Header: 'Cows Bought',
            accessor: 'cowsBought',
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  },
        },
        {
            Header: 'Cows Sold',
            accessor: 'cowsSold', 
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  },
        },
        {
            Header: 'Cow Deaths',
            accessor: 'cowDeaths',
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  }, 
        },
    ];

    const testid = "LeaderboardTable";

    /* Temp filler for admin leaderboard table */

    // const columnsIfAdmin = [
    //     // {
    //     //     Header: '(Admin) userCommons Id',
    //     //     accessor: 'id'
    //     // },
    //     ...columns

    // ];

    // const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={leaderboardUsers}
        columns={columns}
        testid={testid}
    />;

};