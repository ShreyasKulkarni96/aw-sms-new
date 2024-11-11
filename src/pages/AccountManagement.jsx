import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { GET_BATCH_DATA, GET_INVOICES } from '../constants/api';
import jsPDF from "jspdf";
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import APIService from "../services/APIService";
import Logo from "../assets/logo.png";
import TableComponent from '../components/TableComponent';
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

    const handleRequestError = (error) => {
        toast.error(error.response?.data?.message || 'An error occurred during the request.');
    };

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

    const columns = React.useMemo(
        () => [
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
        ], []
    );

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



    const data = [
        {
            serialNo: 1,
            invoice_date: '2024-11-01',
            student_detail: {
                user: {
                    name: 'John Doe'
                }
            },
            batch_code: 'B001',
            invoice_number: 'INV001',
            amount: 1000,
            balanceAmount: 500
        },
        {
            serialNo: 2,
            invoice_date: '2024-11-02',
            student_detail: {
                user: {
                    name: 'Jane Smith'
                }
            },
            batch_code: 'B002',
            invoice_number: 'INV002',
            amount: 1200,
            balanceAmount: 600
        },
        {
            serialNo: 3,
            invoice_date: '2024-11-03',
            student_detail: {
                user: {
                    name: 'Emily Johnson'
                }
            },
            batch_code: 'B003',
            invoice_number: 'INV003',
            amount: 1500,
            balanceAmount: 700
        },
        {
            serialNo: 4,
            invoice_date: '2024-11-04',
            student_detail: {
                user: {
                    name: 'Michael Brown'
                }
            },
            batch_code: 'B004',
            invoice_number: 'INV004',
            amount: 1300,
            balanceAmount: 300
        },
        {
            serialNo: 5,
            invoice_date: '2024-11-05',
            student_detail: {
                user: {
                    name: 'Sarah Wilson'
                }
            },
            batch_code: 'B005',
            invoice_number: 'INV005',
            amount: 1100,
            balanceAmount: 200
        }
    ];



    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className='main-page-content'>
                    <TopHeader />
                    <main>
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
                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <TableComponent columns={columns} data={invoiceSerialNo} tableName="List of Invoices" isButton={false} height="500px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default AccountManagement;
