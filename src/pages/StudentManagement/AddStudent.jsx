import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import APIService from "../../services/APIService";
import TopHeader from '../../components/TopHeader';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format, subDays, subYears, isDate } from 'date-fns';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { GET_BATCHES, STUDENT_DETAILS } from '../../constants/api';

const AddStudent = () => {
    const navigate = useNavigate();
    const [sameAddress, setSameAddress] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const paymentPlans = ['CASH', 'CHEQUE', 'ONLINE PAYMENT'];
    const [batches, setBatches] = useState([]);
    const initialData = {
        name: '',
        DOB: '',
        gender: '',
        email: '',
        phone1: '',
        phone2: '',
        localAddress: '',
        permanentAddress: '',
        guardianName: '',
        relation: '',
        guardianGender: '',
        guardianAddress: '',
        guardianEmail: '',
        guardianPhone: '',
        batchId: '',
        Admission: format(new Date(), 'yyyy-MM-dd'),
        paymentPlan: '',
        totalFees: '',
        paidFees: '',
        discount: '',
        totalPayable: '',
        pdcDetails: '',
        balanceAmount: ''
    }

    // Handle all the errors
    const handleRequestError = (error) => {
        toast.error(error.response?.data?.message || 'An error occurred during the request.');
    };

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

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

    const [formData, setFormData] = useState(initialData);

    let {
        name,
        DOB,
        email,
        gender,
        phone1,
        phone2,
        localAddress,
        permanentAddress,
        guardianName,
        relation,
        guardianGender,
        guardianAddress,
        guardianEmail,
        guardianPhone,
        dateOfAdmission,
        paymentPlan,
        totalFees,
        paidFees,
        discount,
        totalPayable,
        pdcDetails,
    } = formData;

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const { data } = await APIService.get(GET_BATCHES);
            setBatches(data.data);
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong!');
            }
            toast.error('Some Error occurred while fetching batches');
        }
    };

    const onMutate = e => {
        const { id, value } = e.target;
        console.log(id, value)

        if (id === 'discount') {
            const discountValue = value !== '' ? parseFloat(value) : '';
            setFormData(prevState => ({
                ...prevState,
                [id]: discountValue,
            }));
        }

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
        } else if (id === 'totalFees') {
            // Check if the totalFees input is empty or 0, and reset paidFees and discount accordingly
            const totalFeesValue = parseFloat(value);
            const resetPaidFees = isNaN(totalFeesValue) || totalFeesValue <= 0;

            const nonNegativeTotalFees = resetPaidFees ? '' : Math.max(0, totalFeesValue);

            setFormData(prevState => ({
                ...prevState,
                [id]: value,
                paidFees: resetPaidFees ? '' : prevState.paidFees,
                discount: resetPaidFees ? '' : prevState.discount,
                totalFees: nonNegativeTotalFees.toFixed(2),
            }));
        }

        // Update the state for other cases
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    useEffect(() => {
        const totalFeesValue = parseFloat(totalFees);
        const paidFeesValue = parseFloat(paidFees);
        const balanceAmountValue = totalFeesValue - paidFeesValue;

        setFormData(prevState => ({
            ...prevState,
            balanceAmount: isNaN(balanceAmountValue) ? '' : balanceAmountValue.toFixed(2)
        }));
    }, [totalFees, paidFees]);

    const onCalculateDiscount = () => {
        const discountValue = parseFloat(discount.trim());

        if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
            return toast.warn('Discount must be a number between 0 and 100');
        }
        if (!isNaN(totalFees) && !isNaN(discountValue)) {
            const discountAmount = (totalFees * discountValue) / 100;
            const discountedTotalFees = totalFees - discountAmount;

            setFormData(prevState => ({
                ...prevState,
                totalFees: discountedTotalFees.toFixed(2)
            }));
        }
    }

    const onSubmit = async () => {
        // 1.) Validations on Required Field

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

        //2.7 Check if totalFees is a number
        if (isNaN(totalFees)) {
            return toast.warn('Total Fees must be a number');
        }

        if (discount < 0 || discount > 100) {
            return toast.warn('Discount should be between 0 and 100');
        }

        // 2.8) Check if paid fees and total fees are available, then paid fees should not be more than total fees
        totalFees = totalFees * 1;
        paidFees = paidFees * 1;
        const balanceAmount = totalFees - paidFees;
        if (totalFees || paidFees) {
            console.log({ totalFees, paidFees });
            if (totalFees < paidFees) return toast.warn('Paid fees cannot be more than total fees');
            if (discount * 1) {
                const totalDiscount = (parseInt(totalFees) * parseInt(discount)) / 100;
                if (totalDiscount + paidFees > totalFees)
                    return toast.warn('Sum of paid fees and discounted fees cannot be more than total fees');
            }
        }

        const totalFeesValue = parseFloat(totalFees);
        const paidFeesValue = parseFloat(paidFees);
        const balanceAmountValue = totalFeesValue - paidFeesValue;

        setFormData(prevState => ({
            ...prevState,
            balanceAmount: balanceAmountValue.toFixed(2)
        }));


        // if total fees is 0 show confirmation alert
        if (!totalFees) {
            const confirmZeroFees = window.confirm('Are you sure Total fees would be zero?');
            if (!confirmZeroFees) {
                return; // User clicked "No," prevent further submission
            }
        }

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
            pdcDetails,
            balanceAmount: balanceAmount.toFixed(2)
        };

        console.log(payload)

        // Hit the APIs
        await addNewStudent(payload);
    };

    const addNewStudent = async studentDetails => {
        try {
            const { data } = await APIService.post(STUDENT_DETAILS, studentDetails);
            if (data.code === 201) toast.success('Student Enrolled Successfully');
            clearFormData();
            navigate('/student-management');
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            toast.error('Temporarily Unable to add Student');
        }
    };

    const clearFormData = () => {
        setFormData(initialData);
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
        navigate('/student-management');
    };

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

    const handleDateFocus = () => {
        const currentDate = new Date();
        const minDate = subYears(currentDate, 100);
        const maxDate = subYears(currentDate, 5);

        const selectedDate = new Date(DOB);

        if (selectedDate < minDate || selectedDate > maxDate) {
            toast.warn('Student cannot be older than 100 years or younger than 5 years.');
        }
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
                                <div className='top-card h-[800px] relative'>
                                    <div className='card-content'>
                                        <div className='card-header'>Add Student</div>
                                        <div>
                                            <Link to="/student-management">
                                                <Button style='small'>
                                                    <KeyboardBackspaceRoundedIcon className='icons mr-1' />
                                                    Back
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* -------------------------PERSONAL DETAILS----------------------*/}
                                    <div>
                                        <div onClick={() => handleSectionToggle('personal')} className={openSection === 'personal' ? "accordion-card-open" : "accordion-card-close"}>
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
                                                            onChange={onMutate}
                                                            value={localAddress}
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
                                                                onChange={onMutate} />
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
                                                            onChange={onMutate}
                                                            value={email}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='card-content '>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="phoneNo1">
                                                            Phone No 1<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="phoneNo1"
                                                            name="phoneNo1"
                                                            className="form-select"
                                                            placeholder='Phone No 1'
                                                            onChange={onMutate}
                                                            value={phone1}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="phoneNo2">
                                                            Phone No 2<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="phoneNo2"
                                                            name="phoneNo2"
                                                            className="form-select"
                                                            placeholder='Phone No 2'
                                                            onChange={onMutate}
                                                            value={phone2}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="studentId">
                                                            Student ID<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="studentId"
                                                            name="studentId"
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
                                        <div onClick={() => handleSectionToggle('parent')} className={openSection === 'parent' ? "accordion-card-open" : "accordion-card-close"}>
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
                                                            onChange={onMutate}
                                                            value={guardianName}
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
                                                        <label className="form-input" htmlFor="address">
                                                            Address<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="address"
                                                            name="address"
                                                            className="form-select"
                                                            placeholder='Address'
                                                            onChange={onMutate}
                                                            value={guardianAddress}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="email">
                                                            Email<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="email"
                                                            name="email"
                                                            className="form-select"
                                                            placeholder='Email'
                                                            onChange={onMutate}
                                                            value={guardianEmail}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="phoneNo">
                                                            Phone No<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="phoneNo"
                                                            name="phoneNo"
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
                                        <div onClick={() => handleSectionToggle('academic')} className={openSection === 'academic' ? "accordion-card-open" : "accordion-card-close"}>
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
                                                        <label className="form-input" htmlFor="batch">
                                                            Batch<sup className="important">*</sup>
                                                        </label>
                                                        <select
                                                            className='form-select'
                                                            id="batchId"
                                                            name="batchId"
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
                                        <div onClick={() => handleSectionToggle('account')} className={openSection === 'account' ? "accordion-card-open" : "accordion-card-close"}>
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
                                                            onChange={onMutate}
                                                            value={paymentPlan}
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
                                                            onChange={onMutate}
                                                            value={totalFees}
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
                                                            onChange={onMutate}
                                                            value={discount}
                                                            min={0}
                                                            max={100}
                                                            disabled={!totalFees || totalFees <= 0}
                                                        />
                                                    </div>
                                                    <div className="w-full mt-6 text-center">
                                                        <Button style='small' onClick={onCalculateDiscount} disabled={!totalFees || totalFees <= 0 || isNaN(discount) || discount < 0 || discount > 100}>Calculate Discount</Button>
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
                                                            onChange={onMutate}
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
                                                            onChange={onMutate}
                                                            value={paidFees}
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
                                                            onChange={onMutate}
                                                            value={formData.balanceAmount}
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
                                                            onChange={onMutate}
                                                            value={pdcDetails}
                                                            disabled={paymentPlan !== 'CHEQUE'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {/* ----------------------SAVE AND CANCLE BUTTONS----------------------- */}
                                    <div className='save-and-cancle'>
                                        <Button style='small' onClick={onSubmit}>Save</Button>
                                        <Link>
                                            <Button style='cancel' onClick={clearFormData}>Cancel</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div >
            </div >
        </>
    )
}

export default AddStudent;