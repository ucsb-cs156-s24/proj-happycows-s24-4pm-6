import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OurTable, {ButtonColumn, HrefButtonColumn} from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/commonsUtils"
import { useNavigate, } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function CommonsTable({ commons, currentUser }) {

    const [showModal, setShowModal] = useState(false);
    const [cellToDelete, setCellToDelete] = useState(null);

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/admin/editcommons/${cell.row.values["commons.id"]}`);
    }

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/commons/allplus"]
    );

    const deleteCallback = async (cell) => {
        setCellToDelete(cell);
        setShowModal(true);
    }

    const confirmDelete = async (cell) => {
        deleteMutation.mutate(cell);
        setShowModal(false);
    };

    const leaderboardCallback = (cell) => {
        const route = `/leaderboard/${cell.row.values["commons.id"]}`
        navigate(route)
    }

    const columns = [
        {
            Header: 'id',
            accessor: 'commons.id', // accessor is the "key" in the data

        },
        {
            Header:'Name',
            accessor: 'commons.name',
        },
        {
            Header: <span>Cow< br /> Price</span>,
            accessor: row => row.commons.cowPrice,
            id: 'commons.cowPrice'
        },
        {
            Header:<span> Milk <br /> Price </span>,
            accessor: row => row.commons.milkPrice,
            id: 'commons.milkPrice' 
        },
        {
            Header:<span> Start <br /> Bal </span>,
            accessor: row => row.commons.startingBalance,
            id: 'commons.startingBalance'
        },
        {
            Header:<span> Starting <br /> Date </span>,
            accessor: row => String(row.commons.startingDate).slice(0,10),
            id: 'commons.startingDate'
        },
        {
            Header:<span> Last <br /> Date </span>,
            accessor: row => String(row.commons.lastDate).slice(0,10),
            id: 'commons.lastDate'
        },
        {
            Header: <span> Degrad <br /> Rate </span>,
            accessor: row => row.commons.degradationRate,
            id: 'commons.degradationRate'
        },
        {
            Header:<span> Show <br /> LrdrBrd? </span>,
            id: 'commons.showLeaderboard', // needed for tests
            accessor: (row, _rowIndex) => String(row.commons.showLeaderboard) // hack needed for boolean values to show up
        },
        {
            Header: <span> Tot <br /> Cows </span>,
            accessor: 'totalCows'
        },
        {
            Header: <span> Cap / <br /> User </span>,
            accessor: row => row.commons.capacityPerUser,
            id: 'commons.capacityPerUser'
        },
        {
            Header: <span> Carry <br /> Cap </span>,
            accessor: row => row.commons.carryingCapacity,
            id: 'commons.carryingCapacity'
        },
        {
            Header: <span> Eff <br /> Cap </span>,
            accessor: 'effectiveCapacity'
        }
    ];

    const testid = "CommonsTable";

    const columnsIfAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, testid),
        ButtonColumn("Delete", "danger", deleteCallback, testid),
        ButtonColumn("Leaderboard", "secondary", leaderboardCallback, testid),
        HrefButtonColumn("Stats CSV", "success", `/api/commonstats/download?commonsId=`, testid),
    ];

    const columnsToDisplay = hasRole(currentUser,"ROLE_ADMIN") ? columnsIfAdmin : columns;

    const commonsModal = (
        <Modal data-testid="CommonsTable-Modal" show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this commons?            
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" data-testid="CommonsTable-Modal-Cancel" onClick={() => setShowModal(false)}>
                    Keep this Commons
                </Button>
                <Button variant="danger" data-testid="CommonsTable-Modal-Delete" onClick={() => confirmDelete(cellToDelete)}>
                    Permanently Delete
                </Button>
            </Modal.Footer>
        </Modal> );

    return (
    <>
        <OurTable
            data={commons}
            columns={columnsToDisplay}
            testid={testid}
        />
        {hasRole(currentUser,"ROLE_ADMIN") && commonsModal}
    </>);
};
