import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import { toast } from 'react-toastify';
import APIService from "../../services/APIService";
import { format, subDays, subYears, isDate } from 'date-fns';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const AddStudent = () => {
    const [sameAddress, setSameAddress] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const [batches, setBatches] = useState([]);
    const [invoiceWindow, setInvoiceWindow] = useState(false);
    const [createdStudentName, setCreatedStudentName] = useState('');
    const [invoiceFormData, setInvoiceFormData] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        invoice_date: '',
        batch_code: '',
        student_id: '',
        paymentPlan: '',
        amount: '',
        balanceAmount: '',
        totalPayable: '',
    });
    const initialData = {
        name: '',
        DOB: '',
        gender: '',
        localAddress: '',
        permanentAddress: '',
        email: '',
        phone1: '',
        phone2: '',
        guardianName: '',
        relation: '',
        guardianGender: '',
        guardianAddress: '',
        guardianEmail: '',
        guardianPhone: '',
        batchId: '',
        dateOfAdmission: format(new Date(), 'yyyy-MM-dd'),
        paymentPlan: '',
        totalFees: '',
        discount: '',
        totalPayable: '',
        paidFees: '',
        balanceAmount: '',
        pdcDetails: '',
    }
    const [formData, setFormData] = useState(initialData);

    let {
        name,
        DOB,
        gender,
        localAddress,
        permanentAddress,
        email,
        phone1,
        phone2,
        guardianName,
        relation,
        guardianGender,
        guardianAddress,
        guardianEmail,
        guardianPhone,
        batchId,
        dateOfAdmission,
        paymentPlan,
        totalFees,
        discount,
        totalPayable,
        paidFees,
        balanceAmount,
        pdcDetails,
    } = formData;

    const Relation = [
        'Father',
        'Mother',
        'Spouse',
        'Brother',
        'Sister',
        'Grandfather',
        'Grandmother',
        'Uncle',
        'Aunt',
        'Cousins',
        'Other'
    ];
    const paymentPlans = ['CASH', 'CHEQUE', 'ONLINE PAYMENT'];

    useEffect(() => {
        fetchBatches();

    }, []);

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const fetchBatches = async () => {
        try {
            const url = `/batch`;
            const { data } = await APIService.get(url);
            setBatches(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching batches');
        }
    };

    const onMutate = (e) => {
        const { id, value } = e.target;
        console.log(id, value);

        // Use a regular expression to check for integer values
        if ((id === 'phone1' || id === 'phone2' || id === 'guardianPhone') && !/^\d*$/.test(value)) {
            return; // Don't update the state if it's not a valid integer
        }

        if (id === 'sameAddressCheckbox') {
            const newSameAddress = !sameAddress;
            setSameAddress(newSameAddress);

            // If checkbox is checked, update permanentAddress with localAddress
            if (newSameAddress) {
                setFormData(prevState => ({
                    ...prevState,
                    permanentAddress: localAddress
                }));
            }
        } else if (id === 'localAddress' && sameAddress) {
            // If sameAddress is checked and localAddress changes, update permanentAddress
            setFormData(prevState => ({
                ...prevState,
                permanentAddress: value
            }));
        }

        // Update the state for other cases
        setFormData(prevState => ({
            ...prevState,
            [id]: value,
        }));
    }

    const onSubmit = async () => {

        // Check if "name" is provided
        if (!name) {
            toast.warn('Student Name is required');
            return; // Don't proceed if it is not provided
        }

        // Check if "name" follows a valid format
        const namePattern = /^[a-zA-Z .]{2,50}$/;
        if (!namePattern.test(name)) {
            toast.warn('Please enter a valid Student Name');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "DOB" is provided and follows a valid date format
        if (!DOB || !isDate(new Date(DOB))) {
            toast.warn('Please enter a valid Date of Birth.');
            return; // Don't proceed if it's not a valid date
        }

        // Do not allow student under age 5 years from now
        if (subYears(new Date(), 5) < new Date(DOB)) {
            return toast.warn('Student less than 5 years are not allowed');
        }

        // Do not allow future students
        if (new Date(DOB) > new Date()) {
            return toast.warn('Future date of birth are not allowed');
        }

        // Calculate the current date
        const currentDate = new Date();

        // Calculate the maximum allowed date (100 years and 1 day ago from today)
        const maxAllowedDOB = new Date();
        maxAllowedDOB.setFullYear(currentDate.getFullYear() - 100);
        maxAllowedDOB.setDate(currentDate.getDate() - 1);

        if (new Date(DOB) > currentDate || new Date(DOB) < maxAllowedDOB) {
            return toast.warn('Student cannot be older than 100 years');
        }

        // Check if "gender" is provided and not empty
        if (!gender) {
            toast.warn('Student Gender is required.');
            return; // Don't proceed if it's empty
        }

        // Check if "local address" is provided and not empty
        if (!localAddress) {
            toast.warn('Student Current Address is required.');
            return; // Don't proceed if it's empty
        }

        // Check if "permanent address" is provided and not empty
        if (!permanentAddress) {
            toast.warn('Student Permanent Address is required.');
            return; // Don't proceed if it's empty
        }

        // Check if "email" is provided
        if (!email) {
            toast.warn('Student Email is required');
            return; // Don't proceed if it is not provided
        }

        // Check if "email" follows a valid format
        const validEmailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!validEmailRegEx.test(email)) {
            toast.warn('Student Email is invalid');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "phone1" is provided and not empty
        if (!phone1) {
            toast.warn('Student Phone 1 is required.');
            return; // Don't proceed if it's empty
        }

        //  Check if phone1 is valid
        const validMobileRegex = /^[6-9]\d{9}$/;
        if (!validMobileRegex.test(phone1)) return toast.warn("Student's Phone 1 is invalid");

        //  Check if phone2 exists and is valid
        if (phone2 && !validMobileRegex.test(phone2)) return toast.warn(" Student's Phone 2 is invalid");

        // Check if "guardianName" is provided
        if (!guardianName) {
            toast.warn('Parent/Guardian Name is required');
            return; // Don't proceed if it is not provided
        }

        // Check if "guardianName" follows a valid format
        if (!namePattern.test(guardianName)) {
            toast.warn('Please enter a valid Parent/Guardian Name');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "Relation" is provided
        if (!relation) {
            toast.warn('Parent/Guardian Relation is required');
            return; // Don't proceed if it is not provided
        }

        // Check if "Parent/Guardian Gender" is provided and not empty
        if (!guardianGender) {
            toast.warn('Parent/Guardian Gender is required.');
            return; // Don't proceed if it's empty
        }

        // Check if "Parent/Guardian Current" is provided and not empty
        if (!guardianAddress) {
            toast.warn('Parent/Guardian Current Address is required.');
            return; // Don't proceed if it's empty
        }

        // Check if "Parent/Guardian Email" is provided
        if (!guardianEmail) {
            toast.warn('Parent/Guardian Email is required');
            return; // Don't proceed if it is not provided
        }

        // Check if "Parent/Guardian Email" follows a valid format
        if (!validEmailRegEx.test(guardianEmail)) {
            toast.warn('Parent/Guardian Email is invalid');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "Parent/Guardian Phone No." is provided and not empty
        if (!guardianPhone) {
            toast.warn('Parent/Guardian Phone No. is required.');
            return; // Don't proceed if it's empty
        }

        //  Check if Parent/Guardian Phone No. is valid
        if (!validMobileRegex.test(guardianPhone)) return toast.warn('Parent/Guardian Phone No. is invalid');

        // Check if "batchId" is provided and not empty
        if (!formData.batchId) {
            toast.warn('Select a Batch.');
            return; // Don't proceed if it's empty
        }

        // Check if "DOB" is provided and follows a valid date format
        if (!dateOfAdmission || !isDate(new Date(dateOfAdmission))) {
            toast.warn('Please enter a valid Date of Birth.');
            return; // Don't proceed if it's not a valid date
        }

        //  Check if Future date of admissions
        if (new Date(dateOfAdmission) > new Date()) {
            return toast.warn('Future date of admission are not allowed');
        }

        // Check if "Parent/Guardian Phone No." is provided and not empty
        if (!paymentPlan) {
            toast.warn('Please select a Payment Plan.');
            return; // Don't proceed if it's empty
        }

        // if total fees is 0 show confirmation alert
        if (!totalFees) {
            const confirmZeroFees = window.confirm('Are you sure Total fees would be zero?');
            if (!confirmZeroFees) {
                return; // User clicked "No," prevent further submission
            }
        }


        if (isNaN(totalFees)) {
            return toast.warn('Total Fees must be a number');
        }

        if (discount < 0 || discount > 100) {
            return toast.warn('Discount should be between 0 and 100');
        }

        totalFees = totalFees * 1;
        paidFees = paidFees * 1;
        if (totalFees || paidFees) {
            if (totalFees < paidFees) return toast.warn('Paid fees cannot be more than total fees');
            if (discount * 1) {
                const totalDiscount = (parseInt(totalFees) * parseInt(discount)) / 100;
                if (totalDiscount + paidFees > totalFees)
                    return toast.warn('Sum of paid fees and discounted fees cannot be more than total fees');
            }
        }

        const paidFeesValue = parseFloat(paidFees);
        const discountValue = parseFloat(discount);
        const totalPayableValue = parseFloat(totalPayable);
        const discountedFees = totalPayableValue - (totalPayableValue * discountValue) / 100;
        const balanceAmountValue = discountedFees - paidFeesValue;

        setFormData(prevState => ({
            ...prevState,
            balanceAmount: balanceAmountValue.toFixed(2)
        }));

        const payload = {};
        payload.userDetails = {
            name,
            DOB,
            gender: formData.gender,
            email,
            phone1,
            phone2,
            localAddress,
            permanentAddress
        };
        payload.guardianDetails = {
            name: guardianName,
            relation,
            gender: formData.guardianGender,
            address: guardianAddress,
            email: guardianEmail,
            phone: guardianPhone
        };
        payload.academicDetails = {
            batchId: formData.batchId * 1,
            batchCode: batches.find(item => item.id === parseInt(formData.batchId)).batchCode,
            dateOfAdmission
        };
        payload.accountDetails = {
            paymentPlan,
            totalFees: totalFees * 1,
            paidFees: paidFees * 1,
            discount: discount ? discount : 0,
            totalPayable: totalPayable * 1,
            pdcDetails,
            balanceAmount: balanceAmountValue
        };

        await addNewFStudent(payload);
    }

    const addNewFStudent = async studentDetails => {

        try {
            const { data } = await APIService.post('/student-details', studentDetails);


            if (data.code === 201) {
                setDataAndState(data);
                createInvoice();
                toast.success('Student Enrolled Successfully');
            }

            clearFormData();
        } catch (error) {
            clearFormData();
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            toast.error('Temporarily Unable to add Student');
        }
    };

    const setDataAndState = (data) => {
        console.log("Iam here to save data", data)
        setCreatedStudentName(data?.data?.userDetails?.name);
        console.log(data.data.studentDetails.academicDetails.batchId)
        setInvoiceFormData(prevState => ({
            ...prevState,
            invoice_date: format(new Date(), 'yyyy-MM-dd'),
            batch_code: data.data.studentDetails.academicDetails.batchCode,
            student_id: data.data.studentDetails.id,
            paymentPlan: data.data.studentDetails.accountDetails.paymentPlan,
            amount: data.data.studentDetails.accountDetails.paidFees,
            balanceAmount: data.data.studentDetails.accountDetails.balanceAmount,
            totalPayable: data.data.studentDetails.accountDetails.totalPayable
        }));
    };


    const calculateDiscount = () => {
        const discountValue = parseFloat(discount.trim());
        if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
            return toast.warn('Discount must be a number between 0 and 100');
        }

        if (!isNaN(totalFees) && !isNaN(discountValue)) {
            const discountAmount = (totalFees * discountValue) / 100;
            const discountedTotalFees = totalFees - discountAmount;
            setFormData(prevState => ({
                ...prevState,
                totalPayable: discountedTotalFees.toFixed(2)
            }));
        }
    }

    const onReset = () => {
        setFormData(prevState => ({
            ...prevState,
            discount: '',
            totalFees: '',
            paidFees: '',
            balanceAmount: '',
            totalPayable: ''
        }));
    }

    useEffect(() => {
        const totalFeesValue = parseFloat(totalFees);
        const paidFeesValue = parseFloat(paidFees);
        const balanceAmountValue = totalPayable - paidFeesValue;

        setFormData(prevState => ({
            ...prevState,
            balanceAmount: isNaN(balanceAmountValue) ? '' : balanceAmountValue.toFixed(2)
        }));
    }, [totalFees, paidFees]);

    const handleDateFocus = () => {
        const currentDate = new Date();
        const minDate = subYears(currentDate, 100);
        const maxDate = subYears(currentDate, 5);

        const selectedDate = new Date(DOB);

        if (selectedDate < minDate || selectedDate > maxDate) {
            toast.warn('Student cannot be older than 100 years or younger than 5 years.');
        }
    };

    const clearFormData = () => {
        const clearedForm = {};
        for (const key in formData) {
            if (key === 'DOB') {
                clearFormData[key] = format(subYears(new Date(), 5), 'yyyy-MM-dd');
                continue;
            }
            if (key === 'dateOfAdmission') {
                clearFormData[key] = format(new Date(), 'yyyy-MM-dd');
                continue;
            }
            clearedForm[key] = '';
        }
        setFormData(clearedForm);
        setFormData(initialData);
    };

    const createInvoice = () => {
        setInvoiceWindow(true);

    }

    const handleCancelEdit = () => {
        setInvoiceWindow(false);
    }

    const handleCreateInvoice = async () => {
        try {
            const { data } = await APIService.post('/invoices', invoiceFormData);
            if (data.code === 201) {
                toast.success('Invoice created Successfully');
                setCreatedStudentName('');
                setInvoiceFormData({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    invoice_date: '',
                    batch_code: '',
                    student_id: '',
                    paymentPlan: '',
                    amount: '',
                    balanceAmount: '',
                    totalPayable: '',
                })
            }
        } catch (error) {
            handleRequestError('Error creating Invoices');
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            toast.error('Invoice creation failed');
        }
    }

    return (
        <>
            <div className='flex h-screen'>
                <div>
                    <Sidebar />
                </div>
                <div className='flex-1 flex-col h-screen overflow-hidden'>
                    <TopHeader />
                    <main className='main'>
                        <div className='main-grid'>
                            <div className='page-content'>
                                <div className='top-card h-[800px] relative'>
                                    <div className='card-content'>
                                        <div className='card-header'>Add Student</div>
                                        <div>
                                            <Link to="/student-management">
                                                <Button onClick={clearFormData} style='small'>
                                                    <KeyboardBackspaceRoundedIcon className='icons mr-1' />
                                                    Back
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* -------------------------PERSONAL DETAILS----------------------*/}
                                    <div>
                                        <div onClick={() => handleSectionToggle('personal')} className={openSection === 'personal' ? "accordion-card-open mt-4" : "accordion-card-close mt-4"}>
                                            <div className='accordion-details'>
                                                <span className="accordion-title">Personal Details</span>
                                                {openSection === 'personal' ? <KeyboardArrowUpRoundedIcon style={{ fontSize: '30px' }} /> : <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />}
                                            </div>
                                        </div>
                                        {openSection === 'personal' &&
                                            <div className="accordion-content">
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="name">
                                                            Name<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            className="form-select"
                                                            placeholder='Name'
                                                            value={name}
                                                            onChange={onMutate}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="DOB">
                                                            Date of Birth<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="DOB"
                                                            name="DOB"
                                                            className="form-select"
                                                            value={DOB}
                                                            onChange={onMutate}
                                                            onBlur={handleDateFocus}
                                                            min={format(subYears(new Date(), 100), 'yyyy-MM-dd')}
                                                            max={format(subYears(new Date(), 5), 'yyyy-MM-dd')}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <div onChange={onMutate} className='gender-select'>
                                                            <div>
                                                                <input
                                                                    type="radio"
                                                                    id="gender"
                                                                    name="gender"
                                                                    value="M"
                                                                    className="mr-1"
                                                                />
                                                                <label htmlFor="gender" className="mr-4">Male</label>
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="radio"
                                                                    id="gender"
                                                                    name="gender"
                                                                    value="F"
                                                                    className="mr-1"
                                                                />
                                                                <label htmlFor="gender">Female</label>
                                                            </div>
                                                            <div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="localAddress">
                                                            Current Address<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="localAddress"
                                                            name="localAddress"
                                                            className="form-select"
                                                            placeholder='Current Address'
                                                            value={localAddress}
                                                            onChange={onMutate}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <div className='flex'>
                                                            <label className="form-input mr-2" htmlFor="permanentAddress">
                                                                Permanent Address<sup className="important">*</sup>
                                                            </label>
                                                            <input
                                                                className='mr-1'
                                                                type="checkbox"
                                                                id="sameAddressCheckbox"
                                                                checked={sameAddress}
                                                                onChange={onMutate}
                                                            />
                                                            <label className='same-address'>Same as current address</label>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            id="permanentAddress"
                                                            name="permanentAddress"
                                                            className={`form-select ${sameAddress ? 'disabled' : ''}`}
                                                            placeholder='Permanent Address'
                                                            onChange={onMutate}
                                                            value={permanentAddress}
                                                            disabled={sameAddress}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="email">
                                                            Email<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="email"
                                                            name="email"
                                                            className="form-select"
                                                            placeholder='Email'
                                                            value={email}
                                                            onChange={onMutate}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='card-content '>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="phone1">
                                                            Phone No 1<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="phone1"
                                                            name="phone1"
                                                            className="form-select"
                                                            placeholder='Phone No 1'
                                                            onChange={onMutate}
                                                            value={phone1}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="phone2">
                                                            Phone No 2<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="phone2"
                                                            name="phone2"
                                                            className="form-select"
                                                            placeholder='Phone No 2'
                                                            onChange={onMutate}
                                                            value={phone2}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="U_S_ID">
                                                            Student ID<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="U_S_ID"
                                                            name="U_S_ID"
                                                            className="form-disabled"
                                                            placeholder='ST-XXXXXXXXXXX'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {/* ----------------------PARENT/GAURDIAN DETAILS------------------ */}
                                    <div>
                                        <div onClick={() => handleSectionToggle('parent')} className={openSection === 'parent' ? "accordion-card-open mt-3" : "accordion-card-close mt-3"}>
                                            <div className='accordion-details'>
                                                <span className="accordion-title">Parent / Gaurdian Details</span>
                                                {openSection === 'parent' ? <KeyboardArrowUpRoundedIcon style={{ fontSize: '30px' }} /> : <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />}
                                            </div>
                                        </div>
                                        {openSection === 'parent' &&
                                            <div className="accordion-content">
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="guardianName">
                                                            Parent Name<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="guardianName"
                                                            name="guardianName"
                                                            className="form-select"
                                                            placeholder='Parent Name'
                                                            value={guardianName}
                                                            onChange={onMutate}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="relation">
                                                            Relation<sup className="important">*</sup>
                                                        </label>
                                                        <select
                                                            className='form-select'
                                                            id="relation"
                                                            name="relation"
                                                            onChange={onMutate}
                                                            value={relation}
                                                        >
                                                            <option value=" ">Select Relation</option>
                                                            {Relation.map(item => {
                                                                return (
                                                                    <option key={item.toLowerCase()} value={item}>
                                                                        {item}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="w-full">
                                                        <div onChange={onMutate} className='mt-10 flex justify-around'>
                                                            <div>
                                                                <input
                                                                    type="radio"
                                                                    id="guardianGender"
                                                                    name="guardianGender"
                                                                    value="M"
                                                                    className="mr-1"
                                                                />
                                                                <label htmlFor="guardianGender" className="mr-4">Male</label>
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="radio"
                                                                    id="guardianGender"
                                                                    name="guardianGender"
                                                                    value="F"
                                                                    className="mr-1"
                                                                />
                                                                <label htmlFor="guardianGender">Female</label>
                                                            </div>
                                                            <div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="guardianAddress">
                                                            Address<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="guardianAddress"
                                                            name="guardianAddress"
                                                            className="form-select"
                                                            placeholder='Address'
                                                            value={guardianAddress}
                                                            onChange={onMutate}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="guardianEmail">
                                                            Email<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="guardianEmail"
                                                            name="guardianEmail"
                                                            className="form-select"
                                                            placeholder='Email'
                                                            value={guardianEmail}
                                                            onChange={onMutate}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="guardianPhone">
                                                            Phone No<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="guardianPhone"
                                                            name="guardianPhone"
                                                            className="form-select"
                                                            placeholder='Phone No'
                                                            onChange={onMutate}
                                                            value={guardianPhone}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                    </div>

                                    {/* ----------------------ACADEMIC DETAILS------------------------- */}
                                    <div>
                                        <div onClick={() => handleSectionToggle('academic')} className={openSection === 'academic' ? "accordion-card-open mt-3" : "accordion-card-close mt-3"}>
                                            <div className='accordion-details'>
                                                <span className="accordion-title">Academic Details</span>
                                                {openSection === 'academic' ? <KeyboardArrowUpRoundedIcon style={{ fontSize: '30px' }} /> : <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />}
                                            </div>
                                        </div>
                                        {
                                            openSection === 'academic' &&
                                            <div className="accordion-content">
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="batchId">
                                                            Batch<sup className="important">*</sup>
                                                        </label>
                                                        <select
                                                            className='form-select'
                                                            id="batchId"
                                                            name="batchId"
                                                            value={batchId}
                                                            onChange={onMutate}
                                                        >
                                                            <option value="">Select Batch</option>
                                                            {batches.map(item => {
                                                                return (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.batchCode}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="dateOfAdmission">
                                                            Date of Admission<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="dateOfAdmission"
                                                            name="dateOfAdmission"
                                                            className="form-select"
                                                            onChange={onMutate}
                                                            value={dateOfAdmission}
                                                            min={format(subDays(new Date(), 5), 'yyyy-MM-dd')}
                                                            max={format(new Date(), 'yyyy-MM-dd')}
                                                        />
                                                    </div>
                                                    <div className="w-full">

                                                    </div>
                                                </div>
                                            </div>
                                        }

                                    </div>

                                    {/* ---------------------ACCOUNT DETAILS----------------------------- */}
                                    <div>
                                        <div onClick={() => handleSectionToggle('account')} className={openSection === 'account' ? "accordion-card-open mt-3" : "accordion-card-close mt-3"}>
                                            <div className='accordion-details'>
                                                <span className="accordion-title">Account Details</span>
                                                {openSection === 'account' ? <KeyboardArrowUpRoundedIcon style={{ fontSize: '30px' }} /> : <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />}
                                            </div>
                                        </div>
                                        {
                                            openSection === 'account' &&
                                            <div className="accordion-content">
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="paymentPlan">
                                                            Payment Plan<sup className="important">*</sup>
                                                        </label>
                                                        <select
                                                            className='form-select'
                                                            id="paymentPlan"
                                                            name="paymentPlan"
                                                            value={paymentPlan}
                                                            onChange={onMutate}
                                                        >
                                                            <option value=" ">Select Payment Plan</option>
                                                            {paymentPlans.map(item => {
                                                                return (
                                                                    <option key={item.toLowerCase()} value={item}>
                                                                        {item}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="totalFees">
                                                            Total Fees<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="totalFees"
                                                            name="totalFees"
                                                            className="form-select"
                                                            placeholder='Total Fees'
                                                            value={totalFees}
                                                            onChange={onMutate}
                                                        />
                                                    </div>
                                                    <div className="w-full mr-4">
                                                        <label className="form-input" htmlFor="discount">
                                                            Discount (if any)<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="discount"
                                                            name="discount"
                                                            className="form-select"
                                                            placeholder='Discount'
                                                            value={discount}
                                                            onChange={onMutate}
                                                            min={0}
                                                            max={100}
                                                            disabled={!totalFees || totalFees <= 0}
                                                        />
                                                    </div>
                                                    <div className="w-full mt-6 text-center">
                                                        <Button style='small' onClick={calculateDiscount}>Calculate Discount</Button>
                                                        <Button style='small' onClick={onReset}>Reset</Button>
                                                    </div>
                                                </div>
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="totalPayable">
                                                            Total Payable<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            readOnly
                                                            type="text"
                                                            id="totalPayable"
                                                            name="totalPayable"
                                                            className="form-disabled"
                                                            placeholder='Total Payable'
                                                            value={totalPayable}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="paidFees">
                                                            Paid Fees<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="paidFees"
                                                            name="paidFees"
                                                            className="form-select"
                                                            placeholder='Paid Fees'
                                                            value={paidFees}
                                                            onChange={onMutate}
                                                            disabled={!totalFees || totalFees <= 0}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="balanceAmount">
                                                            Balance Amount<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            readOnly
                                                            type="text"
                                                            id="balanceAmount"
                                                            name="balanceAmount"
                                                            className="form-disabled"
                                                            placeholder='Balance Amount'
                                                            value={balanceAmount}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="pdcDetails">
                                                            PDC Details<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="pdcDetails"
                                                            name="pdcDetails"
                                                            className="form-select"
                                                            placeholder='PDC Details'
                                                            value={pdcDetails}
                                                            onChange={onMutate}
                                                            disabled={paymentPlan !== 'CHEQUE'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {/* ----------------------SAVE AND CANCLE BUTTONS----------------------- */}
                                    <div className='save-and-cancle'>
                                        <Button style='small' onClick={onSubmit}>Save and Create Invoice</Button>
                                        <Link to={"/student-management"}>
                                            <Button style='cancel' onClick={clearFormData} >Cancel</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* ---------------------------------------------------CREATE INVOICE POP UP------------------------------------- */}
            {invoiceWindow &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="edit-modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Create Invoice</h3>
                                    <button onClick={handleCancelEdit} className="cancel-button">
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="modal-section">
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <div className="mr-4">
                                            <label className="form-input" htmlFor="invoiceNo">
                                                Invoice No<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="invoiceNo"
                                                name="invoiceNo"
                                                className="form-disabled"
                                                placeholder="IN-XXXXXXXXXXXX"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div >
                                            <label className="form-input" htmlFor="invoice_date">
                                                Invoice Date<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="date"
                                                id="invoice_date"
                                                name="invoice_date"
                                                className="form-date-select"
                                                placeholder='Invoice Date'
                                                value={invoiceFormData.invoice_date}
                                                onChange={() => setInvoiceFormData({ invoice_date: value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <div className="mr-4">
                                            <label className="form-input" htmlFor="batch_code">
                                                Batch Code<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="batch_code"
                                                name="batch_code"
                                                className="form-disabled"
                                                readOnly
                                                value={invoiceFormData.batch_code}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div >
                                            <label className="form-input" htmlFor="studentId">
                                                Student Name<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="studentId"
                                                name="studentId"
                                                className="form-disabled"
                                                value={createdStudentName}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <div className="mr-4">
                                            <label className="form-input" htmlFor="paymentPlan">
                                                Payment Type<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="paymentPlan"
                                                name="paymentPlan"
                                                className="form-disabled"
                                                value={invoiceFormData.paymentPlan}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div>
                                            <label className="form-input" htmlFor="payableAmount">
                                                Payable amount<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="payableAmount"
                                                name="payableAmount"
                                                className="form-disabled"
                                                value={invoiceFormData.totalPayable}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <div className="mr-4">
                                            <label className="form-input" htmlFor="amount">
                                                Amount<sup className="text-red-600">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="amount"
                                                name="amount"
                                                className="form-disabled"
                                                value={invoiceFormData.amount}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div>
                                            <label className="form-input" htmlFor="balanceAmount">
                                                Balance Amount
                                            </label>
                                            <input
                                                readOnly
                                                type="text"
                                                id="balanceAmount"
                                                name="balanceAmount"
                                                className="form-disabled"
                                                value={invoiceFormData.balanceAmount}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={handleCreateInvoice}>Create Invoice</Button>
                                <Button style="cancel" onClick={handleCancelEdit}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default AddStudent