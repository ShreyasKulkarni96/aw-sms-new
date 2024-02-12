 import React, { useEffect, useState, useMemo } from 'react';

import { toast } from 'react-toastify';
import { useTable, useSortBy, usePagination } from 'react-table';

import { GET_BATCH_DATA, GET_INVOICES } from '../constants/api';

import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import APIService from "../services/APIService";
import TopHeader from '../components/TopHeader';
import generatePDF from '../constants/generatePDF';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';

const AccountManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [batchData, setBatchData] = useState([]);
    const [student, setStudent] = useState([]);
    const [studentName, setStudentName] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [balanceAmount, setBalanceAmount] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [formData, setFormData] = useState({
        invoice_date: '',
        batch_code: '',
        student_id: '',
        paymentPlan: '',
        amount: '',
        balanceAmount: ''
    })

    useEffect(() => {
        const isFormValid =
            formData.invoice_date &&
            formData.batch_code &&
            formData.student_id &&
            formData.paymentPlan &&
            formData.amount;

        setIsFormValid(isFormValid);
    }, [formData]);

    useEffect(() => {
        handleGetInvoice();
        fetchBatchData();
        clearFormData();
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
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            handleRequestError('Error fetching invoices');
        }
    };

    // Get batchData
    const fetchBatchData = async () => {
        try {
            const response = await APIService.get(GET_BATCH_DATA);
            setBatchData(response.data.data.batch);
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            }
        }
    }

    //Render table
    const tableHeader = [
        { Header: 'Invoice Date', accessor: 'invoice_date' },
        { Header: 'Student Name', accessor: 'student_detail.user.name' },
        { Header: 'Batch Number', accessor: 'batch_code' },
        { Header: 'Invoice Number', accessor: 'invoice_number' },
        { Header: 'Invoice Amount', accessor: 'amount' },
        { Header: 'Balance Amount', accessor: 'student_detail.balanceAmount' },
        {
            Header: 'Action', accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <button><PrintRoundedIcon className='icon-style' /></button>
                </>
            )
        }
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
        setPageSize,
        state: { pageIndex, pageSize } } = useTable({ columns: tableColumn, data: invoices, initialState: { pageSize: 10 } }, useSortBy, usePagination);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setSelectedDate(value);
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleBatchChange = async (e) => {
        const [batchName] = e.target.value.split(',');
        const checkBatch = batchData.find((batch) => batch.name === batchName);

        setFormData((prevFormData) => ({ ...prevFormData, batch_code: batchName }));
        try {
            if (checkBatch) {
                const batchId = (checkBatch.id);
                const response = await APIService.get(`/batches/${batchId}/students`);
                setStudent(response.data.data);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            }
        }
    }

    function parseData(data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    }

    const handleStudentChange = (e) => {
        const studentName = e.target.value;
        setStudentName(studentName);
        const selectedStudent = student.find((item) => item.studentDetails.user.name === studentName);
        if (selectedStudent) {
            const studentId = selectedStudent.studentDetails.id;
            setFormData((prevFormData) => ({ ...prevFormData, student_id: studentId }));
            const studentData = selectedStudent.studentDetails.accountDetails;
            const parsedStudentData = parseData(studentData);
            const balanceAmount = parsedStudentData.balanceAmount;
            const paymentType = parsedStudentData.paymentPlan.toString().toLowerCase();
            setPaymentType(paymentType);
            setBalanceAmount(balanceAmount);
        }
    }

    const handlePaymentChange = (e) => {
        const selectedPaymentType = e.target.value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            paymentPlan: paymentType ? paymentType : selectedPaymentType,
        }));
    }

    const handleAmountChange = (e) => {
        const amount = e.target.value;
        const newBalanceAmount = balanceAmount - amount;
        if (amount > balanceAmount) {
            setFormData((prevFormData) => ({ ...prevFormData, amount: '', balanceAmount: '' }));
            toast.error('Amount cannot be greater than balance amount');
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, amount, balanceAmount: newBalanceAmount }));
        }
    }

    const handleCreateInvoices = async (e) => {
        e.preventDefault();
        try {
            if (!isFormValid) {
                toast.error('Invoice creation failed');
                return;
            }
            const { data } = await APIService.post('/invoices', formData);
            if (data.code === 201) {
                handleGetInvoice();
                toast.success('Invoice created Successfully');
                clearFormData();
                setIsFormValid(false);
            }
        } catch (error) {
            handleRequestError('Error creating Invoices');
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            toast.error('Invoice creation failed');
        }
    }
    console.log(formData)
    const clearFormData = () => {
        setSelectedDate('');
        setStudentName('');
        setBalanceAmount('');
        setFormData({
            invoice_date: '',
            batch_code: '',
            student_id: '',
            paymentPlan: '',
            amount: '',
            balanceAmount: ''
        })
    }

    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className='main-page-content'>
                    <TopHeader />
                    <main className='main'>
                        <div className='main-grid'>
                            <div className='page-content'>
                                {/* --------------TOP CARD--------------- */}                                
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Create Invoice</div>
                                    </div>
                                    <div className='card-content'>
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
                                                    className="form-diabled"
                                                    placeholder="IN-XXXXXXXXXXXX"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="invoice_date">
                                                    Invoice Date<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    value={selectedDate}
                                                    onChange={handleDateChange}
                                                    type="date"
                                                    name="invoice_date"
                                                    id="invoice_date"
                                                    className="form-date-select"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="batch_code">
                                                    Batch Code<sup className="text-red-600">*</sup>
                                                </label>
                                                <select
                                                    value={formData.batch_code}
                                                    className='form-select'
                                                    name="batch_code"
                                                    id="batch_code"
                                                    onChange={handleBatchChange}
                                                >
                                                    <option value=''>
                                                        Select Batch
                                                    </option>
                                                    {batchData.map((batchItem) => (
                                                        <option key={batchItem.id} value={batchItem.name}>
                                                            {batchItem.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div>
                                                <label className="form-input" htmlFor="selectStudent" id="studentId">
                                                    Select Student<sup className="text-red-600">*</sup>
                                                </label>
                                                <select
                                                    value={studentName}
                                                    className='form-select'
                                                    name="student_id"
                                                    id="student_id"
                                                    onChange={handleStudentChange}
                                                >
                                                    <option value=''>Select Student</option>
                                                    {student.map((student) => (
                                                        <option key={student.studentDetails.id} value={student.studentDetails.user.name} >
                                                            {student.studentDetails.user.name}
                                                        </option>
                                                    ))}
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
                                                    value={formData.paymentPlan}
                                                    className='form-select'
                                                    id="paymentPlan"
                                                    name="paymentPlan"
                                                    onChange={handlePaymentChange}
                                                >
                                                    {paymentType ? <option value={paymentType}>{paymentType}</option> : <option>Select payment plan</option>}
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
                                                    className="form-diabled"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mb-2 mr-4">
                                                <label className="form-input" htmlFor="amount">
                                                    Amount<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    value={formData.amount}
                                                    type="text"
                                                    id="amount"
                                                    name="amount"
                                                    className="form-select"
                                                    onChange={handleAmountChange}
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
                                                    className="form-diabled"
                                                    value={formData.balanceAmount || balanceAmount}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2 mb-2'>
                                        <div></div>
                                        <div>
                                            <Button style="small" onClick={handleCreateInvoices}>Create Invoices</Button>
                                            <Button style='cancle' onClick={clearFormData}>Cancel</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* ----------------BOTTOM CARD------------------- */}
                                <div className='bottom-card h-[450px] '>
                                    <div className='card-header '>List of Invoices</div>
                                    <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                        <table id="studentList" className="table">
                                            <thead className='table-head'>
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
                                            <tbody  {...getTableBodyProps()}>
                                                {page.map((row) => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()} key={row.id}>
                                                            {row.cells.map((cell) => (
                                                                <td {...cell.getCellProps()} className="td">
                                                                    {cell.render('Cell')}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* ------Pagination------ */}
                                <div className='flex mt-4'>
                                    <button onClick={() => previousPage()} className='mr-2 px-4 py-2 bg-orange-600 hover:bg-orange-300 rounded-xl shadow-lg'>
                                        Previous
                                    </button>
                                    <span className='m-3 font-bold'>Page {pageIndex + 1} of {page.length}</span>
                                    <button onClick={() => nextPage()} className='mr-2 px-4 py-2 bg-orange-600 hover:bg-orange-300 rounded-xl shadow-lg'>
                                        Next
                                    </button>
                                </div>

                            </div>
                        </div>
                    </main>
                </div>
            </div>

        </>
    )
}

export default AccountManagement