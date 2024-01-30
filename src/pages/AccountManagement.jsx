import React, { useEffect, useState, useMemo } from 'react';

import { toast } from 'react-toastify';
import { useTable, useSortBy, usePagination } from 'react-table';

import { GET_INVOICES } from '../constants/api';

import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import APIService from "../services/APIService";
import TopHeader from '../components/TopHeader';
import generatePDF from '../constants/generatePDF';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';

const AccountManagement = () => {
    const [invoices, setInvoices] = useState([]);
    console.log(invoices)

    useEffect(() => {
        handleGetInvoice();
    }, []);

    // Handle all the errors
    const handleRequestError = (error) => {
        toast.error(error.response?.data?.message || 'An error occurred during the request.');
    };

    // Get all the invoices
    const handleGetInvoice = async () => {
        try {
            const response = await APIService.get(GET_INVOICES);
            setInvoices(response.data.data.invoices);
        } catch (error) {
            handleRequestError('Error fetching invoices');
        }
    };

    //Render tables

    const tableHeader = [
        { Header: 'Invoice Date', accessor: 'invoice_date' },
        { Header: 'Student Name', accessor: 'student_detail.user.name' },
        { Header: 'Batch Number', accessor: 'batch_code' },
        { Header: 'Invoice Number', accessor: 'invoice_number' },
        { Header: 'Invoice Amount', accessor: 'amount' },
        { Header: 'Balance Amount', accessor: 'student_detail.balanceAmount' },
        { Header: 'Action', accessor: 'action' }
    ];

    const tableColumn = useMemo(() => tableHeader, []);

    const {
        headerGroups,
        getTableBodyProps,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        previousPage,
        nextPage,
        state: { pageIndex } } = useTable({ columns: tableColumn, data: invoices }, useSortBy, usePagination);

    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className='main-page-content'>
                    <TopHeader />
                    <main className='main-div'>
                        <div className='grid'>
                            <div className='card-container'>
                                {/* -----------TOP CARD---------- */}
                                <div className='card'>
                                    {/* --------------HEADER FOR TOP DIV---------------- */}
                                    <div className='card-content'>
                                        <div className='card-header'>Create Invoice</div>
                                    </div>
                                    {/* ---------------------CREATE INVOICES----------------- */}
                                    <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="invoiceNo">
                                                    Invoice No
                                                </label>
                                                <input
                                                    readOnly
                                                    type="text"
                                                    name="invoiceNo"
                                                    id="invoiceNo"
                                                    className="form-select bg-gray-200"
                                                    placeholder="IN-XXXXXXXXXXXX"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="invoiceDate">
                                                    Invoice Date<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="invoiceDate"
                                                    id="invoiceDate"
                                                    className="form-date-select"
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="batchCode">
                                                    Batch Code<sup className="text-red-600">*</sup>
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="batchCode"
                                                    id="batchCode"
                                                >
                                                    <option>
                                                        Select Batch
                                                    </option>
                                                    {/* {batch.map((batchItem) => (
                                                        <option key={batchItem.id} value={`${batchItem.id}, ${batchItem.name}`}>
                                                            {batchItem.name}
                                                        </option>
                                                    ))} */}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div>
                                                <label className="form-input" htmlFor="selectStudent" id="studentId">
                                                    Select Student<sup className="text-red-600">*</sup>
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="studentId"
                                                    id="studentId"
                                                >
                                                    <option>Select Student</option>
                                                    {/* {student.map((student) => (
                                                        <option key={student.studentDetails.id} value={student.studentDetails.id}>
                                                            {student.studentDetails.user.name}
                                                        </option>
                                                    ))} */}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mb-2 mr-4">
                                                <label className="form-input" htmlFor="paymentType">
                                                    Payment Type<sup className="text-red-600">*</sup>
                                                </label>
                                                <select
                                                    className='form-select'
                                                    id="paymentType"
                                                    name="paymentType"
                                                >
                                                    {/* {paymentType ? <option value={paymentType}>{paymentType}</option> : <option>Select payment plan</option>} */}
                                                    <option value="cash">Cash</option>
                                                    <option value="online">Online</option>
                                                    <option value="cheque">Cheque</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mb-2 mr-4">
                                                <label className="form-input" htmlFor="payableAmount">
                                                    Payable amount
                                                </label>
                                                <input
                                                    readOnly
                                                    type="text"
                                                    id="payableAmount"
                                                    name="payableAmount"
                                                    className="form-select bg-gray-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mb-2 mr-4">
                                                <label className="form-input" htmlFor="amount">
                                                    Amount<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="amount"
                                                    name="amount"
                                                    className="form-select"

                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mb-2">
                                                <label className="form-input" htmlFor="balanceAmount">
                                                    Balance Amount
                                                </label>
                                                <input
                                                    readOnly
                                                    type="text"
                                                    id="balanceAmount"
                                                    name="balanceAmount"
                                                    className="form-select bg-gray-200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2 mb-2'>
                                        <div></div>
                                        <div>
                                            <Button style="small">Create Invoices</Button>
                                            <Button style='cancle'>Cancle</Button>
                                        </div>
                                    </div>
                                </div>
                                {/* ----------------BOTTOM CARD------------------- */}
                                <div className='bottom-card'>
                                    <div className='mb-2'>
                                        <div className='card-header '>List of Invoices</div>
                                        <table id="studentList" className='table'>
                                            <thead>
                                                {headerGroups.map(headerGroup => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map(column => (
                                                            <th className='th' {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                                {column.render('Header')}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody className='table-body' {...getTableBodyProps()}>
                                                {page.map(row => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map(cell => {
                                                                return (
                                                                    <td
                                                                        {...cell.getCellProps()}
                                                                        className="td"
                                                                    >
                                                                        {cell.render('Cell')}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* ------Pagination------ */}
                                <div className='pagination-wrapper'>
                                    <button className='previous-button '>
                                        Previous
                                    </button>
                                    <span className='span-pagination'>1</span>
                                    <button className='back-button'>
                                        back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div >
            </div >
        </>
    )
}

export default AccountManagement