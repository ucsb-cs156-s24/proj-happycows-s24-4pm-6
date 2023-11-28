import React from "react";
import { Table } from "react-bootstrap";

export default function UserProfileTable({ user }) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>First Name</th>
                    <td>{user.givenName}</td>
                </tr>
                <tr>
                    <th>Last Name</th>
                    <td>{user.familyName}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>{user.email}</td>
                </tr>
                <tr>
                    <th>Joined Commons</th>
                    <td>{commonsString(user.commons)}</td>
                </tr>
                <tr>
                    <th>User ID</th>
                    <td>{user.id}</td>
                </tr>
                <tr>
                    <th>Admin</th>
                    <td>{String(user.admin)}</td>
                </tr>
                <tr>
                    <th>Hosted Domain</th>
                    <td>{user.hostedDomain}</td>
                </tr>
                <tr>
                    <th>Locale</th>
                    <td>{user.locale}</td>
                </tr>
            </thead>
        </Table>
    );
}

function commonsString(commons) {
    var result = "";

    if (commons !== undefined) {
        for (var i = 0; i < commons.length; i++) {
            result += commons[i].name + ", ";
        }
        result = result.substring(0, result.length - 2);
    }

    return result;
}