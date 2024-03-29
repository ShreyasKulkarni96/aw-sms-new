import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useTable, useSortBy, usePagination } from 'react-table';
import { GET_BATCH_DATA, GET_INVOICES } from '../constants/api';
import jsPDF from "jspdf";
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import APIService from "../services/APIService";
import TopHeader from '../components/TopHeader';
import Logo from "../assets/images/logo.png";
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import { useLocation } from 'react-router-dom';

const AccountManagement = () => {
    // const location = useLocation();
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

    // console.log(location.state.batchId)
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
        { Header: 'Serial No', accessor: 'serialNo' },
        { Header: 'Invoice Date', accessor: 'invoice_date' },
        { Header: 'Student Name', accessor: 'student_detail.user.name' },
        { Header: 'Batch Number', accessor: 'batch_code' },
        { Header: 'Invoice Number', accessor: 'invoice_number' },
        { Header: 'Invoice Amount', accessor: 'amount' },
        { Header: 'Balance Amount', accessor: '.balanceAmount' },
        {
            Header: 'Action', accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <button onClick={() => generatePDF(row.original)}><PrintRoundedIcon className='icon-style' /></button>
                </>
            )
        }
    ];

    console.log(invoices)
    const invoiceSerialNo = useMemo(() => {
        return invoices.map((invoice, index) => {
            const formattedInvoiceDate = new Date(invoice.invoice_date).toISOString().replace('T', ' ').split('.')[0]; // Format enrollment date
            return {
                ...invoice,
                serialNo: index + 1,
                invoice_date: formattedInvoiceDate
            };
        });
    }, [invoices]);

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
        state: { pageIndex, pageSize } } = useTable({ columns: tableColumn, data: invoiceSerialNo, initialState: { pageSize: 10 } }, useSortBy, usePagination);

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

    const generatePDF = (data) => {
        console.log(data)
        const doc = new jsPDF();

        const logoWidth = 50;
        const centerX = (doc.internal.pageSize.width - logoWidth) / 2;

        const backgroundHeight = 20;
        doc.setFillColor(0, 0, 0);
        doc.rect(centerX, 10, logoWidth, backgroundHeight, 'F');


        const logoImage = Logo;
        doc.addImage(logoImage, 'PNG', centerX, 10, logoWidth, 20);


        doc.setFontSize(18);
        doc.text('Invoice Details', 80, 40);


        doc.setFontSize(12);
        doc.text(`Invoice Date: ${data.invoice_date}`, 20, 70);
        doc.text(`Invoice Number: ${data.invoice_number}`, 20, 80);


        doc.text('Student Details', 20, 100);
        doc.text('-----------------------', 20, 110);
        doc.text(`Name: ${data.student_detail.user.name}`, 20, 120);
        doc.text(`Batch Code: ${data.batch_code.toString()}`, 20, 130);


        doc.text('Invoice Amount', 20, 150);
        doc.text('-----------------------', 20, 160);
        doc.text(`Amount: ${data.amount}`, 20, 170);


        const paidMarkX = 100;
        const paidMarkY = 170;
        doc.text('Paid', paidMarkX, paidMarkY);


        const balanceX = 20;
        const balanceY = 190;
        doc.text('Balance Remaining', balanceX, balanceY);
        doc.text('-----------------------', balanceX, balanceY + 10);
        doc.text(`Amount: ${data.student_detail.accountDetails.balanceAmount}`, balanceX, balanceY + 20);
        doc.setDrawColor(255, 0, 0);
        doc.rect(balanceX, balanceY + 20, 40, 10, 'S');

        doc.save('myPDF.pdf');
    };

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
                                                    className="form-disabled"
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
                                                    className="form-disabled"
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
                                                    className="form-disabled"
                                                    value={formData.balanceAmount || balanceAmount}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2 mb-2'>
                                        <div></div>
                                        <div>
                                            <Button style="small" onClick={handleCreateInvoices}>Create Invoices</Button>
                                            <Button style='cancel' onClick={clearFormData}>Cancel</Button>
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