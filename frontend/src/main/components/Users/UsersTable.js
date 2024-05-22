import React, { useState } from "react";
import OurTable from "main/components/OurTable";
import { formatTime } from "main/utils/dateUtils";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const UsersTable = ({ users }) => {
    const [show, setShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [commons, setCommons] = useState([]);
    const [selectedCommons, setSelectedCommons] = useState([]);

    const handleClose = () => setShow(false);

    const handleShow = (user) => {
        setSelectedUser(user);
        // Fetch commons for the user
        axios.get(`/api/admin/users/${user.id}/commons`)
            .then(response => {
                setCommons(response.data);
                setShow(true);
            })
            .catch(error => {
                console.error("There was an error fetching the commons!", error);
            });
    };

    const handleRemove = () => {
        selectedCommons.forEach(commonsId => {
            axios.delete(`/api/commons/${commonsId}/users/${selectedUser.id}`)
                .then(response => {
                    console.log("User removed from commons", response.data);
                })
                .catch(error => {
                    console.error("There was an error removing the user from the commons!", error);
                });
        });
        handleClose();
    };

    const handleCheckboxChange = (commonsId) => {
        if (selectedCommons.includes(commonsId)) {
            setSelectedCommons(selectedCommons.filter(id => id !== commonsId));
        } else {
            setSelectedCommons([...selectedCommons, commonsId]);
        }
    };

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'First Name',
            accessor: 'givenName',
        },
        {
            Header: 'Last Name',
            accessor: 'familyName',
        },
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Last Online',
            id: 'lastOnline',
            accessor: (row) => formatTime(row.lastOnline),
        },
        {
            Header: 'Admin',
            id: 'admin',
            accessor: (row, _rowIndex) => String(row.admin) // hack needed for boolean values to show up
        },
        {
            Header: 'Edit Commons',
            id: 'editCommons',
            Cell: ({ row }) => (
                <Button
                    variant="danger"
                    onClick={() => handleShow(row.original)}
                    data-testid={`edit-commons-${row.original.id}`}
                >
                    Edit
                </Button>
            )
        }
    ];

    return (
        <>
            <OurTable
                data={users}
                columns={columns}
                testid={"UsersTable"}
            />
            <div data-testid="commons-state">{JSON.stringify(commons)}</div>
            <div data-testid="selected-commons-state">{JSON.stringify(selectedCommons)}</div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove User from Commons</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {commons.map((c) => (
                            <Form.Check
                                key={c.id}
                                type="checkbox"
                                id={`commons-checkbox-${c.id}`}
                                label={c.name}
                                checked={selectedCommons.includes(c.id)}
                                onChange={() => handleCheckboxChange(c.id)}
                            />
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleRemove} data-testid="remove-from-commons">
                        Remove from Selected Commons
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UsersTable;
