import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import { toast } from 'react-toastify';
import { format, subDays, subYears, isDate } from 'date-fns';
import APIService from "../../services/APIService";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { STUDENT_DETAILS } from '../../constants/api';

const UpdateStudent = () => {
    const params = useParams();
    const navigate = useNavigate();
    const paymentPlans = ['CASH', 'CHEQUE', 'ONLINE PAYMENT'];
    const [sameAddress, setSameAddress] = useState(false);
    const [fieldsChanged, setFieldsChanged] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const initialData = {
        name: '',
        DOB: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
        gender: '',
        email: '',
        phone1: '',
        phone2: '',
        localAddress: '',
        permanentAddress: '',
        U_S_ID: '',
        guardianName: '',
        relation: '',
        guardianGender: '',
        guardianAddress: '',
        guardianEmail: '',
        guardianPhone: '',
        batchId: '',
        batchCode: '',
        dateOfAdmission: format(new Date(), 'yyyy-MM-dd'),
        paymentPlan: '',
        totalFees: '',
        paidFees: '',
        discount: '',
        pdcDetails: '',
        totalPayable: ''
    };

    const [formData, setFormData] = useState(initialData);

    let {
        name,
        DOB,
        gender,
        email,
        phone1,
        phone2,
        localAddress,
        permanentAddress,
        U_S_ID,
        guardianName,
        relation,
        guardianGender,
        guardianAddress,
        guardianEmail,
        guardianPhone,
        dateOfAdmission,
        batchCode,
        paymentPlan,
        totalFees,
        paidFees,
        discount,
        pdcDetails,
        totalPayable
    } = formData;

    useEffect(() => {
        fetchStudentDetails();
    }, [params.studentId]);

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

    const fetchStudentDetails = async () => {
        try {
            const { data } = await APIService.get(`${STUDENT_DETAILS}/${params.studentId}`);
            console.log(data)
            setFormData(prevState => ({
                ...prevState,
                name: data.data.name,
                DOB: data.data.DOB,
                gender: data.data.gender,
                email: data.data.email,
                phone1: data.data.phone1,
                phone2: data.data.phone2,
                localAddress: data.data.localAddress,
                permanentAddress: data.data.permanentAddress,
                U_S_ID: data.data.U_S_ID,
                guardianName: data.data.student_detail.guardianDetails.name,
                relation: data.data.student_detail.guardianDetails.relation,
                guardianGender: data.data.student_detail.guardianDetails.gender,
                guardianAddress: data.data.student_detail.guardianDetails.address || '',
                guardianEmail: data.data.student_detail.guardianDetails.email,
                guardianPhone: data.data.student_detail.guardianDetails.phone,
                batchId: data.data.student_detail.academicDetails.batchId,
                batchCode: data.data.student_detail.academicDetails.batchCode,
                dateOfAdmission: data.data.student_detail.academicDetails.dateOfAdmission,
                paymentPlan: data.data.student_detail.accountDetails.paymentPlan,
                totalFees: data.data.student_detail.accountDetails.totalFees,
                paidFees: data.data.student_detail.accountDetails.paidFees,
                discount: data.data.student_detail.accountDetails.discount,
                pdcDetails: data.data.student_detail.accountDetails.pdcDetails,
                totalPayable: data.data.student_detail.accountDetails.totalPayable,
                balanceAmount: data.data.student_detail.accountDetails.balanceAmount
            }));
            // setIsLoading(false);
        } catch (error) {
            console.log(error);
            // setIsLoading(false);
            toast.error('Temporarily unable to fetch Student details');
        }
    };

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
            toast.warn('student Gender is required.');
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
            toast.warn('Phone 1 is required.');
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

        // 2.8) Check if paid fees and total fees are available, then paid fees should not be more than total fees
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
            batchCode: formData.batchCode,
            dateOfAdmission
        };
        payload.accountDetails = {
            paymentPlan,
            totalFees: parseInt(totalFees),
            paidFees: parseInt(paidFees),
            discount: discount ? parseInt(discount) : 0,
            pdcDetails
        };

        // Hit the APIs
        await updateStudent(payload);

        clearFormData();
    };

    const updateStudent = async (studentDetails) => {
        try {
            const { data } = await APIService.patch(`/student-details/${params.studentId}`, studentDetails);
            if (data.code === 200) toast.success('Details Updated Successfully');
            //  setIsLoading(false);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            //   setIsLoading(false);
            toast.error('Temporarily Unable to Update Details');
        }
    };

    const onMutate = e => {
        setFieldsChanged(true);
        const { id, value } = e.target;

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
            setFormData(prevState => ({
                ...prevState,
                [id]: value,
                paidFees: resetPaidFees ? '' : prevState.paidFees,
                discount: resetPaidFees ? '' : prevState.discount
            }));
        }

        // Update the state for other cases
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

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
                                {/* -------------TOP CARD---------------- */}
                                <div className='top-card h-[800px] relative'>
                                    <div className='card-content'>
                                        <div className='card-header'>Edit Students</div>
                                        <Link to="/student-management">
                                            <Button style='small'>
                                                <KeyboardBackspaceRoundedIcon className='icons mr-1' />
                                                Back
                                            </Button>
                                        </Link>
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
                                                                    checked={gender === 'M'}
                                                                    className="mr-1"
                                                                    readOnly
                                                                />
                                                                <label htmlFor="gender" className="mr-4">Male</label>
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="radio"
                                                                    id="gender"
                                                                    name="gender"
                                                                    checked={gender === 'F'}
                                                                    readOnly
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
                                                                onChange={onMutate}
                                                                disabled={localAddress === ''}
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
                                                            value={phone2 || ''}
                                                            onChange={onMutate}
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
                                                            value={U_S_ID}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {/* -------------------------PARENT/GAURDIAN DETAILS----------------------*/}
                                    <div>
                                        <div onClick={() => handleSectionToggle('parent')} className={openSection === 'parent' ? "accordion-card-open mt-2" : "accordion-card-close mt-2"}>
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
                                                        <div className='gender-select'>
                                                            <div>
                                                                <input
                                                                    type="radio"
                                                                    id="guardianGender"
                                                                    name="guardianGender"
                                                                    checked={guardianGender === 'M'}
                                                                    readOnly
                                                                    className="mr-1"
                                                                />
                                                                <label htmlFor="guardianGender" className="mr-4">Male</label>
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="radio"
                                                                    id="guardianGender"
                                                                    name="guardianGender"
                                                                    checked={guardianGender === 'F'}
                                                                    readOnly
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

                                    {/* -------------------------ACADEMIC DETAILS----------------------*/}
                                    <div>
                                        <div onClick={() => handleSectionToggle('academic')} className={openSection === 'academic' ? "accordion-card-open mt-2" : "accordion-card-close mt-2"}>
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
                                                        <input
                                                            type="text"
                                                            id="batchCode"
                                                            className='form-select'
                                                            value={batchCode}
                                                            onChange={onMutate}
                                                            readOnly
                                                        />
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

                                    {/* -------------------------ACCOUNT DETAILS----------------------*/}
                                    <div>
                                        <div onClick={() => handleSectionToggle('account')} className={openSection === 'account' ? "accordion-card-open mt-2" : "accordion-card-close mt-2"}>
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
                                                            value={discount}
                                                            onChange={onMutate}
                                                            min={0}
                                                            max={1000000}
                                                            disabled={!totalFees || totalFees <= 0}
                                                        />
                                                    </div>
                                                    <div className="w-full">
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
                                                </div>
                                                <div className='card-content mb-2'>
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
                                                            min={0}
                                                            max={1000000}
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
                                                    <div className="mr-4 w-full">
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
                                                    <div className="w-full"></div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {/* -------------------------ATTENDANCE DETAILS----------------------*/}
                                    <div>
                                        <div onClick={() => handleSectionToggle('attendance')} className={openSection === 'attendance' ? "accordion-card-open mt-2" : "accordion-card-close mt-2"}>
                                            <div className='w-full flex justify-between cursor-pointer'>
                                                <span className="text-lg ml-4 text-gray-main font-semibold">Attendance Details</span>
                                                <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />
                                            </div>
                                        </div>
                                        {
                                            openSection === 'attendance' &&
                                            <div>
                                                This is open div
                                            </div>

                                        }
                                    </div>

                                    {/* -------------------------PERFORMANCE DETAILS----------------------*/}
                                    <div>
                                        <div onClick={() => handleSectionToggle('performance')} className={openSection === 'performance' ? "accordion-card-open mt-2" : "accordion-card-close mt-2"}>
                                            <div className='w-full flex justify-between cursor-pointer'>
                                                <span className="text-lg ml-4 text-gray-main font-semibold">Performance Details</span>
                                                <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />
                                            </div>
                                        </div>
                                        {
                                            openSection === 'performance' &&
                                            <div>
                                                This is open div
                                            </div>

                                        }
                                    </div>

                                    {/* -------------------------Faculty DETAILS----------------------*/}
                                    <div>
                                        <div onClick={() => handleSectionToggle('faculty')} className={openSection === 'faculty' ? "accordion-card-open mt-2" : "accordion-card-close mt-2"}>
                                            <div className='w-full flex justify-between cursor-pointer'>
                                                <span className="text-lg ml-4 text-gray-main font-semibold">Faculty Observations</span>
                                                <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />
                                            </div>
                                        </div>
                                        {
                                            openSection === 'faculty' &&
                                            <div>
                                                This is open div
                                            </div>

                                        }
                                    </div>

                                    {/* ----------------------SAVE AND CANCLE BUTTONS----------------------- */}
                                    <div className='absolute bottom-2 right-4 mb-5 mr-4'>
                                        <Button style='small' onClick={onSubmit}>Save</Button>
                                        <Link>
                                            <Button style='cancel' onClick={clearFormData} disabled={!fieldsChanged}>Cancel</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default UpdateStudent