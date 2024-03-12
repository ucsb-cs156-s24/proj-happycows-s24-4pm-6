import React from "react";
import { useTable, useSortBy } from 'react-table'
import { Table, Button, Pagination } from "react-bootstrap";
import Plaintext from "main/components/Utils/Plaintext";

// Stryker disable all
var tableStyle = {
    "background": "white",
    "display": "block",
    "maxWidth": "-moz-fit-content",
    "margin": "0 auto",
    "overflowX": "auto",
    "whiteSpace": "nowrap"
};
var paginationStyle = {
    "display": "flex",
    "justifyContent": "right"
};
// Stryker restore all
export default function OurTable({ columns, data, testid = "testid", ...rest }) {
    const [pageIndex, setPageIndex] = React.useState(0);
    const pageSize = 10;

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
        ...(rest.initialState && {
            initialState: rest.initialState
        })
    }, useSortBy)

    return (<div {...getTableProps()}>
        <Table style={tableStyle} {...getTableProps()} striped bordered hover >
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                data-testid={`${testid}-header-${column.id}`}
                            >
                                {column.render('Header')}
                                <span data-testid={`${testid}-header-${column.id}-sort-carets`}>
                                    {column.isSorted
                                        ? column.isSortedDesc
                                            ? ' 🔽'
                                            : ' 🔼'
                                        : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell, _index) => {
                                return (
                                    <td
                                        {...cell.getCellProps()}
                                        data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </Table>
        {rows.length > pageSize && (<div style={paginationStyle}>
            <Pagination {...getTableProps()}>
                <Pagination.Prev
                    onClick={() => setPageIndex(pageIndex - 1)}
                    data-testid={`${testid}-prev-page-button`}
                    disabled={pageIndex === 0}
                />
                {pageIndex > 3 && (<Pagination.Item
                    onClick={() => setPageIndex(0)}
                    data-testid={`${testid}-first-page-button`}
                >
                    {1}
                </Pagination.Item>)}
                {pageIndex > 4 && (<Pagination.Ellipsis data-testid={`${testid}-left-ellipsis`} />)}
                {pageIndex === 4 && (<Pagination.Item
                    onClick={() => setPageIndex(pageIndex - 3)}
                    data-testid={`${testid}-back-three-page-button`}
                >
                    {pageIndex - 2}
                </Pagination.Item>)}
                {pageIndex > 1 && (<Pagination.Item
                    onClick={() => setPageIndex(pageIndex - 2)}
                    data-testid={`${testid}-back-two-page-button`}
                >
                    {pageIndex - 1}
                </Pagination.Item>)}
                {pageIndex > 0 && (<Pagination.Item
                    onClick={() => setPageIndex(pageIndex - 1)}
                    data-testid={`${testid}-back-one-page-button`}
                >
                    {pageIndex}
                </Pagination.Item>)}
                <Pagination.Item
                    data-testid={`${testid}-current-page-button`}
                    // Stryker disable all
                    active={true}
                    // Stryker restore all
                >
                    {pageIndex + 1}
                </Pagination.Item>
                {pageIndex + 1 <= Math.ceil(rows.length / pageSize - 1) && (<Pagination.Item
                    onClick={() => setPageIndex(pageIndex + 1)}
                    data-testid={`${testid}-forward-one-page-button`}
                >
                    {pageIndex + 2}
                </Pagination.Item>)}
                {pageIndex + 2 <= Math.ceil(rows.length / pageSize - 1) && (<Pagination.Item
                    onClick={() => setPageIndex(pageIndex + 2)}
                    data-testid={`${testid}-forward-two-page-button`}
                >
                    {pageIndex + 3}
                </Pagination.Item>)}
                {pageIndex + 4 === Math.ceil(rows.length / pageSize - 1) && (<Pagination.Item
                    onClick={() => setPageIndex(pageIndex + 3)}
                    data-testid={`${testid}-forward-three-page-button`}
                >
                    {pageIndex + 4}
                </Pagination.Item>)}
                {pageIndex + 4 < Math.ceil(rows.length / pageSize - 1) && (<Pagination.Ellipsis data-testid={`${testid}-right-ellipsis`} />)}
                {pageIndex + 4 <= Math.ceil(rows.length / pageSize - 1) && (<Pagination.Item
                    onClick={() => setPageIndex(Math.ceil(rows.length / pageSize - 1))}
                    data-testid={`${testid}-last-page-button`}
                >
                    {Math.ceil(rows.length / pageSize)}
                </Pagination.Item>)}
                <Pagination.Next {...getTableBodyProps()}
                    onClick={() => setPageIndex(pageIndex + 1)}
                    data-testid={`${testid}-next-page-button`}
                    disabled={pageIndex === Math.ceil(rows.length / pageSize - 1) || rows.length === 0}
                />
            </Pagination>
        </div>)}
    </div>)
}

// The callback function for ButtonColumn should have the form
// (cell) => { doSomethingWith(cell); }
// The fields in cell are:
//   ["column","row","value","getCellProps","render"]
// Documented here: https://react-table.tanstack.com/docs/api/useTable#cell-properties
// Typically, you want cell.row.values, which is where you can get the individual
//   fields of the object representing the row in the table.
// Example: 
//   const deleteCallback = (cell) => 
//      toast(`Delete Callback called on id: ${cell.row.values.id} name: ${cell.row.values.name}`);

// Add it to table like this:
// const columns = [
//   {
//       Header: 'id',
//       accessor: 'id', // accessor is the "key" in the data
//   },
//   {
//       Header: 'Name',
//       accessor: 'name',
//   },
//   ButtonColumn("Edit", "primary", editCallback),
//   ButtonColumn("Delete", "danger", deleteCallback)
// ];

export function ButtonColumn(label, variant, callback, testid) {
    const column = {
        Header: label,
        id: label,
        Cell: ({ cell }) => (
            <Button
                variant={variant}
                onClick={() => callback(cell)}
                data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-button`}
            >
                {label}
            </Button>
        )
    }
    return column;
}

export function HrefButtonColumn(label, variant, href, testid) {
    const column = {
        Header: label,
        id: label,
        Cell: ({ cell }) => (
            <Button
                variant={variant}
                href={`${href}${cell.row.values["commons.id"]}`}
                data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-button`}
            >
                {label}
            </Button>
        )
    }
    return column;
}

export function PlaintextColumn(label, getText) {
    const column = {
        Header: label,
        id: label,
        Cell: ({ cell }) => (
            <Plaintext text={getText(cell)} />
        )
    }
    return column;
}

export function DateColumn(label, getDate) {
    const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false,
        timeZone: 'America/Los_Angeles'
    };
    const column = {
        Header: label,
        id: label,
        Cell: ({ cell }) => {
            const date = new Date(getDate(cell));
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
            return (<>{formattedDate}</>)
        }
    }
    return column;
}