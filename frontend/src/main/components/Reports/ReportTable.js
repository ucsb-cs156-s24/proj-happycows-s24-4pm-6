import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";

// should take in a players list from a commons
export default function ReportTable({ reports, storybook = false }) {

    const testid = "ReportTable";

    const navigate = useNavigate();

    const reportCallback = (cell) => {
        const route = `/admin/report/${cell.row.values["id"]}`
        if (storybook) {
            window.alert(`would navigate to ${route}`);
        } else {
            navigate(route)
        }
    }

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
            Header: 'Create Date',
            accessor: 'createDate',
        },
        {
            Header: 'Num Users',
            accessor: 'numUsers',
        },
        {
            Header: 'Num Cows',
            accessor: 'numCows',
        },
        ButtonColumn("View Report", "secondary", reportCallback, testid)
    ];

    return <OurTable
        data={reports}
        columns={columns}
        testid={testid}
    />;

};