import OurTable from "main/components/OurTable";

export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

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
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{formatter.format(props.value)}</div>)
                  },
        },
        {
            Header: 'Num Cows',
            accessor: 'numOfCows', 
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  },
        },
        {
            Header: 'Avg Cow Health',
            accessor: 'avgCowHealth',
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
        {
            Header: 'Create Date',
            accessor: 'createDate',
            Cell: (props) => {
                return (
                  <div style={{textAlign: "right"}}>{props.value}</div>)
                  },
        },
    ];

    const testid = "ReportLineTable";

    return <OurTable
        data={reportLines}
        columns={columns}
        testid={testid}
    />;

};