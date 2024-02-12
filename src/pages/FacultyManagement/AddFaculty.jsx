import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import APIService from '../../services/APIService';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Link, useNavigate } from 'react-router-dom';
import { format, subYears, isDate } from 'date-fns';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

const AddFaculty = () => {
    const navigate = useNavigate();
    const [openSection, setOpenSection] = useState(null);
    const facultyTypes = ['EMPLOYEE', 'PROFESSIONAL', 'AMATEUR'];
    const FacultyAvailability = ['Regular Sessions', 'Rare Sessions', 'General'];
    const paymentPlans = ['MONTHLY', 'SESSION-WISE'];
    const [sameAddress, setSameAddress] = useState(false);
    const initialData = {
        name: '',
        DOB: '',
        gender: '',
        email: '',
        phone1: '',
        phone2: '',
        localAddress: '',
        permanentAddress: '',
        facultyType: '',
        facultyAvailability: '',
        degree: '',
        startDate: '',
        facultyCharges: '',
        facultyPAN: '',
        registeredAddress: '',
        paymentPlan: '',
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        bankIFSCode: '',
        bankBranch: '',
        facultyGST: '',
        institution: '',
        fieldOfStudy: '',
        endDate: '',
        confirmAccountNumber: ''
    };

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const [formData, setFormData] = useState(initialData);

    const {
        name,
        DOB,
        email,
        phone1,
        phone2,
        localAddress,
        permanentAddress,
        facultyType,
        facultyAvailability,
        degree,
        startDate,
        facultyCharges,
        facultyPAN,
        registeredAddress,
        paymentPlan,
        bankName,
        accountHolderName,
        accountNumber,
        bankIFSCode,
        bankBranch,
        facultyGST,
        institution,
        fieldOfStudy,
        endDate,
        gender,
        confirmAccountNumber
    } = formData;

    const onSubmit = async () => {
        // 1.) Validations on Required Field
        // Check if "name" is provided
        if (!name) {
            toast.warn('Faculty Name is required');
            return; // Don't proceed if it is not provided
        }

        // Check if "name" follows a valid format
        const namePattern = /^[a-zA-Z .]{2,50}$/;
        if (!namePattern.test(name)) {
            toast.warn('Please enter a valid Faculty Name');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "DOB" is provided and follows a valid date format
        if (!DOB || !isDate(new Date(DOB))) {
            toast.warn('Please enter a valid Date of Birth.');
            return; // Don't proceed if it's not a valid date
        }

        //  Do not allow future Faculty
        if (new Date(DOB) > new Date()) {
            return toast.warn('Future Date of Birth are not allowed');
        }
        // Calculate the current date
        const currentDate = new Date();

        // Calculate the maximum allowed date (100 years and 1 day ago from today)
        const maxAllowedDOB = new Date();
        maxAllowedDOB.setFullYear(currentDate.getFullYear() - 100);
        maxAllowedDOB.setDate(currentDate.getDate() - 1);

        if (new Date(DOB) > currentDate || new Date(DOB) < maxAllowedDOB) {
            return toast.warn('Faculty cannot be older than 100 years');
        }

        // Do not allow faculty under age 18 years from now
        if (subYears(new Date(), 18) < new Date(DOB)) {
            return toast.warn('Faculty cannot be younger than 18');
        }

        // Check if "gender" is provided and not empty
        if (!gender) {
            toast.warn('Gender is required.');
            return; // Don't proceed if it's empty
        }

        // Check if "local address" is provided and not empty
        if (!localAddress) {
            toast.warn('Local Address is required.');
            return; // Don't proceed if it's empty
        }

        // Check if "permanent address" is provided and not empty
        if (!permanentAddress) {
            toast.warn('Permanent Address is required.');
            return; // Don't proceed if it's empty
        }

        // Check if "email" is provided
        if (!email) {
            toast.warn('Email is required');
            return; // Don't proceed if it is not provided
        }

        // Check if "email" follows a valid format
        const validEmailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!validEmailRegEx.test(email)) {
            toast.warn('Email is invalid');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "phone1" is provided and not empty
        if (!phone1) {
            toast.warn('Faculty Phone 1 is required.');
            return; // Don't proceed if it's empty
        }

        //  Check if phone1 is valid
        const validMobileRegex = /^[6-9]\d{9}$/;
        if (!validMobileRegex.test(phone1)) return toast.warn('Faculty Phone 1 is invalid');

        //  Check if phone2 exists and is valid
        if (phone2 && !validMobileRegex.test(phone2)) return toast.warn(' Faculty Phone 2 is invalid');

        // Check if "institution" is provided
        if (!institution) {
            toast.warn('Please enter an Institution.');
            return; // Don't proceed if it's not provided
        }

        // Validate against the specified pattern
        const institutionPattern = /^[A-Za-z\s\-.,]+$/;
        if (!institutionPattern.test(institution)) {
            toast.warn('Please enter a valid Institution.');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "degree" is provided
        if (!degree) {
            toast.warn('Please enter a Degree.');
            return; // Don't proceed if it's not provided
        }

        // Validate against the specified pattern
        const degreePattern = /^[A-Za-z\s\-.,]+$/;
        if (!degreePattern.test(degree)) {
            toast.warn('Please enter a valid Degree.');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "fieldOfStudy" is provided
        if (!fieldOfStudy) {
            toast.warn('Please enter a Field Of Study.');
            return; // Don't proceed if it's not provided
        }

        // Validate against the specified pattern
        const fieldOfStudyPattern = /^[A-Za-z\s\-.,]+$/;
        if (!fieldOfStudyPattern.test(fieldOfStudy)) {
            toast.warn('Please enter a valid Field Of Study.');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "StartDate" is provided and follows a valid date format
        if (!startDate || !isDate(new Date(startDate))) {
            toast.warn('Please enter Start Date.');
            return; // Don't proceed if it's not a valid date
        }
        // Check if "endDate" is provided and follows a valid date format
        if (!endDate || !isDate(new Date(endDate))) {
            toast.warn('Please enter End Date.');
            return; // Don't proceed if it's not a valid date
        }

        //start date cannot be less than DOB and cannot be greater than current date
        if (new Date(startDate) < new Date(DOB)) {
            return toast.warn('Start date cannot be less than DOB or be in the future');
        }
        //
        if (endDate < startDate) {
            return toast.warn('Start Date cannot be less than End Date or be in future.');
        }
        if (new Date(endDate) > new Date()) {
            return toast.warn('A valid end date should not precede the start date or be in the future.');
        }

        if (endDate === startDate) {
            return toast.warn('Start Date cannot be same as End Date.');
        }

        // Check if "facultyCharges" is provided
        if (!facultyCharges) {
            toast.warn('Faculty Charges are required.');
            return; // Don't proceed if it's not provided
        }

        // Check if "facultyCharges" is a valid integer
        const facultyChargesRegex = /^[0-9]+$/;
        if (!facultyChargesRegex.test(facultyCharges)) {
            toast.warn('Invalid Faculty Charges.');
            return; // Don't proceed if it's not an integer
        }

        // Check if "facultyPAN" is provided
        if (!facultyPAN) {
            toast.warn('PAN number is required.');
            return; // Don't proceed if it's not provided
        }

        // Check PAN validity
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(facultyPAN)) {
            toast.warn('Please enter a valid PAN number.');
            return; // Don't proceed if PAN is invalid
        }

        // Check GST validity only if it's provided
        if (facultyGST) {
            const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            if (!gstRegex.test(facultyGST)) {
                toast.warn('Please enter a valid GST number');
                return; // Don't proceed if GST is invalid
            }
        }

        // Check if "paymentPlan" is provided
        if (!paymentPlan) {
            toast.warn('Please select a Payment Plan.');
            return; // Don't proceed if it's not provided
        }

        // Check if "bankName" is provided
        if (!bankName) {
            toast.warn('Bank Name is required.');
            return; // Don't proceed if it's not provided
        }

        // Validate against the specified pattern
        const bankNamePattern = /^[A-Za-z\s\-.]+$/;
        if (!bankNamePattern.test(bankName)) {
            toast.warn('Please enter a valid Bank Name.');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "bankName" is provided
        if (!accountHolderName) {
            toast.warn('Account Holder Name is required.');
            return; // Don't proceed if it's not provided
        }

        // Validate against the specified pattern
        const accountHolderPattern = /^[A-Za-z\s\-.]+$/;
        if (!accountHolderPattern.test(accountHolderName)) {
            toast.warn('Please enter a valid Account Holder Name.');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Define the regular expression pattern for the account number format
        const accountNumberFormat = /^[0-9]{9,18}$/; // Change this regex based on your valid format

        // Check if "accountNumber" is provided
        if (!accountNumber) {
            toast.warn('Account Number is required.');
            return; // Don't proceed if it's not provided
        }

        // Validate against the specified format
        if (!accountNumberFormat.test(accountNumber)) {
            toast.warn('Please enter a valid Account Number.');
            return; // Don't proceed if it doesn't match the format
        }
        // Check if the Account No and Confirm Account No fields match
        if (accountNumber !== confirmAccountNumber) {
            return toast.warn('Account Number not matched');
        }

        // Check if "bankIFSCode" is provided
        if (!bankIFSCode) {
            toast.warn('IFSC Code is required.');
            return; // Don't proceed if it's not provided
        }

        // Validate against the specified pattern
        const ifscCodeRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscCodeRegex.test(bankIFSCode)) {
            toast.warn('Please enter a valid IFSC code.');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "bankBranch" is provided
        if (!bankBranch) {
            toast.warn('Bank Branch is required.');
            return; // Don't proceed if it's not provided
        }

        // Validate against the specified pattern
        const bankBranchRegex = /^[A-Za-z\s\-.]+$/;
        if (!bankBranchRegex.test(bankBranch)) {
            toast.warn('Please enter a valid Bank Branch.');
            return; // Don't proceed if it doesn't match the pattern
        }

        // Check if "facultyType" is provided
        if (!facultyType) {
            toast.warn('Please select a Faculty Type.');
            return; // Don't proceed if it's not provided
        }

        // Check if "facultyAvailability" is provided
        if (!facultyAvailability) {
            toast.warn('Please select a Faculty Availability.');
            return; // Don't proceed if it's not provided
        }

        // Hit the APIs
        await addNewFaculty();

        // clearFormData();
    };

    const addNewFaculty = async () => {
        try {
            const payload = { ...formData };
            payload.academicDetails = {
                institution,
                degree,
                startDate,
                fieldOfStudy,
                endDate
            };
            payload.accountDetails = {
                facultyCharges,
                facultyGST,
                facultyPAN,
                registeredAddress,
                paymentPlan,
                bankName,
                accountHolderName,
                accountNumber,
                bankIFSCode,
                bankBranch,
                facultyType,
                facultyAvailability
            };
            payload.careerDetails = [];
            delete payload.institution;
            delete payload.degree;
            delete payload.startDate;
            delete payload.endDate;
            delete payload.facultyCharges;
            delete payload.facultyPAN;
            delete payload.registeredAddress;
            delete payload.paymentPlan;
            delete payload.bankName;
            delete payload.accountHolderName;
            delete payload.accountNumber;
            delete payload.bankIFSCode;
            delete payload.bankBranch;
            delete payload.facultyGST;
            delete payload.facultyAvailability;
            delete payload.facultyType;
            delete payload.fieldOfStudy;

            const { data } = await APIService.post('/faculty', payload);

            if (data.code === 201) toast.success('Faculty Added Successfully');
            clearFormData();
            navigate('/faculty-management');
            // setIsLoading(false);
        } catch (error) {
            console.log(error);

            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            // setIsLoading(false);
            toast.error('Temporarily Unable to add Faculty');
        }
    };

    const clearFormData = () => {
        setFormData(initialData)
    };

    const onMutate = e => {
        const { id, value } = e.target;

        // Check if the input is for phone numbers and if it's not a valid integer
        if ((id === 'phone1' || id === 'phone2') && !/^\d*$/.test(value)) {
            return; // Don't update the state if it's not a valid integer
        }
        // Check if the input is for account numbers and if it's not a valid integer
        if ((id === 'accountNumber' || id === 'confirmAccountNumber') && !/^\d*$/.test(value)) {
            return; // Don't update the state if it's not a valid integer
        }
        // Check if the input is for Faculty Charges and if it's not a valid integer
        if (id === 'facultyCharges' && !/^\d*$/.test(value)) {
            return; // Don't update the state if it's not a valid integer
        }

        // Convert PAN input to uppercase if it's the facultyPAN field
        if (id === 'facultyPAN') {
            const upperCaseValue = value.toUpperCase();
            setFormData(prevState => ({ ...prevState, [id]: upperCaseValue }));
            return;
        }
        // Convert IFSC input to uppercase if it's the bankIFSCode field
        if (id === 'bankIFSCode') {
            const upperCaseValue = value.toUpperCase();
            setFormData(prevState => ({ ...prevState, [id]: upperCaseValue }));
            return;
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
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    const handleConfirmAccountNumberBlur = () => {
        if (accountNumber !== confirmAccountNumber) {
            toast.warn("Account numbers don't match");
        }
    };

    const handleDateFocus = () => {
        const currentDate = new Date();
        const minDate = subYears(currentDate, 100);
        const maxDate = subYears(currentDate, 18);

        const selectedDate = new Date(DOB);

        if (selectedDate < minDate || selectedDate > maxDate) {
            toast.warn('Faculty cannot be older than 100 years or younger than 18 years.');
        }
    };

    return (
        <div className='main-page'>
            <div>
                <Sidebar />
            </div>
            <div className='main-page-content'>
                <TopHeader />
                <main className='main'>
                    <div className='main-grid'>
                        <div className='page-content'>
                            {/* ---------------------ADD FACULTY CARD---------------- */}
                            <div className='top-card h-[800px] relative'>
                                <div className='card-content'>
                                    <div className='card-header'>Add Faculty</div>
                                    <Link to='/faculty-management'>
                                        <Button style='small'>
                                            <KeyboardBackspaceRoundedIcon className='icons mr-1' />  Back
                                        </Button>
                                    </Link>
                                </div>
                                {/* ----------------------PERSONAL DETAILS------------------ */}
                                <div>
                                    <div onClick={() => handleSectionToggle('personal')} className={openSection === 'personal' ? "accordion-card-open mt-6" : "accordion-card-close mt-6"}>
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
                                                        Name<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-select"
                                                        placeholder='Name'
                                                        onChange={onMutate}
                                                        value={name}
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="DOB">
                                                        Date Of Birth<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="DOB"
                                                        name="DOB"
                                                        className="form-select"
                                                        onChange={onMutate}
                                                        value={DOB}
                                                        onBlur={handleDateFocus}
                                                        min={format(subYears(new Date(), 100), 'yyyy-MM-dd')}
                                                        max={format(subYears(new Date(), 18), 'yyyy-MM-dd')}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <div className='mt-10 flex justify-around'>
                                                        <div>
                                                            <input
                                                                type="radio"
                                                                id="gender"
                                                                name="gender"
                                                                value="M"
                                                                className="mr-1"
                                                                onChange={onMutate}
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
                                                                onChange={onMutate}
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
                                                        Local Address<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="localAddress"
                                                        name="localAddress"
                                                        className="form-select"
                                                        placeholder='Local Address'
                                                        onChange={onMutate}
                                                        value={localAddress}
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="permanentAddress">
                                                        Permanent Address<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="permanentAddress"
                                                        name="permanentAddress"
                                                        className="form-select"
                                                        placeholder='Permanent Address'
                                                        checked={sameAddress}
                                                        onChange={onMutate}
                                                    />
                                                </div>
                                                <div className=" w-full">
                                                    <label className="form-input" htmlFor="email">
                                                        Email<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="form-select"
                                                        placeholder='Email'
                                                        onChange={onMutate}
                                                        value={email}
                                                    />
                                                </div>
                                            </div>
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="phone1">
                                                        Phone No 1<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phone1"
                                                        name="phone1"
                                                        className="form-select"
                                                        placeholder='Phone No'
                                                        onChange={onMutate}
                                                        value={phone1}
                                                        maxLength={10}
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="phone2">
                                                        Phone No 2<sup className="text-red-600">*</sup>
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
                                                    <label className="form-input" htmlFor="employeeId">
                                                        Employee ID<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        readOnly
                                                        type="text"
                                                        id="employeeId"
                                                        name="employeeId"
                                                        className="form-disabled"
                                                        placeholder='SYSTEM DEFAULT'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>

                                {/* ----------------------ACADEMIC DETAILS------------------ */}
                                <div>
                                    <div onClick={() => handleSectionToggle('academic')} className={openSection === 'academic' ? "accordion-card-open mt-4" : "accordion-card-close mt-4"}>
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
                                                    <label className="form-input" htmlFor="institution">
                                                        Institution<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="institution"
                                                        name="institution"
                                                        className="form-select"
                                                        placeholder='Institution'
                                                        onChange={onMutate}
                                                        value={institution}
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="degree">
                                                        Degree<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="degree"
                                                        name="degree"
                                                        className="form-select"
                                                        placeholder='Degree'
                                                        onChange={onMutate}
                                                        value={degree}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label className="form-input" htmlFor="fieldOfStudy">
                                                        Field Of Study<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="fieldOfStudy"
                                                        name="fieldOfStudy"
                                                        className="form-select"
                                                        placeholder='Field Of Study'
                                                        onChange={onMutate}
                                                        value={fieldOfStudy}
                                                    />
                                                </div>
                                            </div>
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="startDate">
                                                        Start Date<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="startDate"
                                                        name="startDate"
                                                        className="form-select"
                                                        onChange={onMutate}
                                                        value={startDate}
                                                        min={DOB}
                                                        max={format(new Date(), 'yyyy-MM-dd')}
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="endDate">
                                                        End Date (or expected)<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="endDate"
                                                        name="endDate"
                                                        className="form-select"
                                                        placeholder='End Date'
                                                        onChange={onMutate}
                                                        value={endDate}
                                                        max={format(new Date(), 'yyyy-MM-dd')}
                                                    />
                                                </div>
                                                <div className="w-full">

                                                </div>
                                            </div>
                                        </div>}

                                </div>

                                {/* ----------------------ACCOUNT DETAILS------------------ */}
                                <div>
                                    <div onClick={() => handleSectionToggle('account')} className={openSection === 'account' ? "accordion-card-open mt-4" : "accordion-card-close mt-4"}>
                                        <div className='accordion-details'>
                                            <span className="accordion-title">Account Details</span>
                                            {openSection === 'account' ? <KeyboardArrowUpRoundedIcon style={{ fontSize: '30px' }} /> : <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />}
                                        </div>
                                    </div>
                                    {openSection === 'account' &&
                                        <div className="accordion-content">
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="facultyCharges">
                                                        Faculty Charges<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="facultyCharges"
                                                        name="facultyCharges"
                                                        className="form-select"
                                                        placeholder='Faculty Charges'
                                                        onChange={onMutate}
                                                        value={facultyCharges}
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="facultyPAN">
                                                        Faculty PAN No<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="facultyPAN"
                                                        name="facultyPAN"
                                                        className="form-select"
                                                        onChange={onMutate}
                                                        value={facultyPAN}
                                                        placeholder="Faculty PAN"
                                                        maxLength={10}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label className="form-input" htmlFor="facultyGST">
                                                        Faculty GST<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="facultyGST"
                                                        name="facultyGST"
                                                        className="form-select"
                                                        onChange={onMutate}
                                                        value={facultyGST}
                                                        placeholder="Faculty GST"
                                                        maxLength={15}
                                                    />
                                                </div>
                                            </div>
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="registeredAddress">
                                                        Registered Address<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="registeredAddress"
                                                        name="registeredAddress"
                                                        className="form-select"
                                                        onChange={onMutate}
                                                        value={registeredAddress}
                                                        placeholder="Registered Address"
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="paymentPlan">
                                                        Payment Plan<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        id="paymentPlan"
                                                        onChange={onMutate}
                                                        value={paymentPlan}
                                                    >
                                                        <option value={''}>---Select Option---</option>
                                                        {paymentPlans.map(item => {
                                                            return (
                                                                <option key={item.toLowerCase()} value={item}>
                                                                    {item}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="w-full">
                                                    <label className="form-input" htmlFor="bankName">
                                                        Bank Name<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="bankName"
                                                        name="bankName"
                                                        className="form-select"
                                                        placeholder='Bank Name'
                                                        onChange={onMutate}
                                                        value={bankName}
                                                    />
                                                </div>
                                            </div>
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="accountHolderName">
                                                        Account Holder Name<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="accountHolderName"
                                                        name="accountHolderName"
                                                        className="form-select"
                                                        placeholder='Account Holder Name'
                                                        onChange={onMutate}
                                                        value={accountHolderName}
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="accountNo">
                                                        Account Number<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="accountNo"
                                                        name="accountNo"
                                                        className="form-select"
                                                        onChange={onMutate}
                                                        value={accountNumber}
                                                        placeholder="Account No."
                                                        maxLength={18}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label className="form-input" htmlFor="confirmAccountNumber">
                                                        Confirm Account No<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="confirmAccountNumber"
                                                        name="confirmAccountNumber"
                                                        className="form-select"
                                                        onChange={onMutate}
                                                        value={confirmAccountNumber}
                                                        placeholder="Confirm Account No."
                                                        maxLength={18}
                                                        onBlur={handleConfirmAccountNumberBlur}
                                                    />
                                                </div>
                                            </div>
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="bankIFSCode">
                                                        Bank IFSC<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="bankIFSCode"
                                                        name="bankIFSCode"
                                                        className="form-select"
                                                        onChange={onMutate}
                                                        value={bankIFSCode}
                                                        placeholder="Bank IFSC Code"
                                                        maxLength={11}
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="bankBranch">
                                                        Bank Branch<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="bankBranch"
                                                        name="bankBranch"
                                                        className="form-select"
                                                        onChange={onMutate}
                                                        value={bankBranch}
                                                        placeholder="Bank Branch"
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label className="form-input" htmlFor="facultyType">
                                                        Faculty Type<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        id="facultyType"
                                                        onChange={onMutate}
                                                        value={facultyType}
                                                    >
                                                        <option value={''}>---Select Option---</option>
                                                        {facultyTypes.map(item => {
                                                            return (
                                                                <option key={item.toLowerCase()} value={item}>
                                                                    {item}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="facultyAvailability">
                                                        Faculty Availability<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        id="facultyAvailability"
                                                        onChange={onMutate}
                                                        value={facultyAvailability}
                                                    >
                                                        <option value={''}>---Select Option---</option>
                                                        {FacultyAvailability.map(item => {
                                                            return (
                                                                <option key={item.toLowerCase()} value={item}>
                                                                    {item}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="mr-4 w-full">

                                                </div>
                                                <div className="w-full">

                                                </div>
                                            </div>
                                        </div>}
                                </div>

                                {/* ----------------------SAVE AND CANCLE BUTTONS----------------------- */}
                                <div className='absolute bottom-2 right-4 mb-4 mr-4'>
                                    <Button onClick={onSubmit} style='small'>Save</Button>
                                    <Link to='/faculty-management'>
                                        <Button onClick={clearFormData} style='cancel'>Cancel</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div >
        </div >
    )
}

export default AddFaculty;