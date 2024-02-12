import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { FACULTY } from '../../constants/api';
import { format, subYears, isDate } from 'date-fns';
import { toast } from 'react-toastify';
import APIService from '../../services/APIService';

const UpdateFaculty = () => {
    const navigate = useNavigate();
    const facultyTypes = ['EMPLOYEE', 'PROFESSIONAL'];
    const FacultyAvailability = ['Regular Sessions', 'Rare Sessions', 'General'];
    const paymentPlans = ['MONTHLY', 'SESSION-WISE'];
    const [openSection, setOpenSection] = useState(null);
    const params = useParams();
    const [sameAddress, setSameAddress] = useState(false);
    const [fieldsChanged, setFieldsChanged] = useState(false);
    const initialData = {
        name: '',
        DOB: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
        gender: '',
        email: '',
        phone1: '',
        phone2: '',
        localAddress: '',
        permanentAddress: '',
        facultyType: '',
        facultyAvailability: '',
        degree: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
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
        endDate: ''
    }
    const [formData, setFormData] = useState(initialData);

    const {
        name,
        gender,
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
        endDate
    } = formData;

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    useEffect(() => {
        // do an API call
        fetchFacultyDetails();
        // eslint-disable-next-line
    }, [params.facultyId]);

    const fetchFacultyDetails = async () => {
        try {
            const { data } = await APIService.get(`${FACULTY}/${params.facultyId}`);
            console.log(data)
            setFormData(prevState => ({
                ...prevState,
                name: data.data.facultyName,
                DOB: data.data.DOB,
                gender: data.data.gender,
                email: data.data.email,
                phone1: data.data.phone1,
                phone2: data.data.phone2,
                localAddress: data.data.localAddress,
                permanentAddress: data.data.permanentAddress,
                institution: data.data.academicDetails.institution,
                degree: data.data.academicDetails.degree,
                fieldOfStudy: data.data.academicDetails.fieldOfStudy,
                startDate: data.data.academicDetails.startDate,
                endDate: data.data.academicDetails.endDate,
                facultyCharges: data.data.accountDetails.facultyCharges,
                facultyPAN: data.data.accountDetails.facultyPAN,
                facultyGST: data.data.accountDetails.facultyGST,
                registeredAddress: data.data.accountDetails.registeredAddress,
                paymentPlan: data.data.accountDetails.paymentPlan,
                bankName: data.data.accountDetails.bankName,
                accountHolderName: data.data.accountDetails.accountHolderName,
                accountNumber: data.data.accountDetails.accountNumber,
                bankIFSCode: data.data.accountDetails.bankIFSCode,
                bankBranch: data.data.accountDetails.bankBranch,
                facultyType: data.data.accountDetails.facultyType,
                facultyAvailability: data.data.accountDetails.facultyAvailability
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
            return toast.warn('Start Date and End Date cannot be same.');
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

        const payload = {
            name,
            DOB,
            gender: formData.gender,
            email,
            phone1,
            phone2,
            localAddress,
            permanentAddress
        };
        payload.academicDetails = {
            institution: institution,
            degree: degree,
            gender: formData.guardianGender,
            fieldOfStudy: fieldOfStudy,
            startDate,
            endDate
        };
        payload.accountDetails = {
            facultyCharges: facultyCharges,
            facultyPAN: facultyPAN,
            facultyGST: facultyGST,
            registeredAddress: registeredAddress,
            paymentPlan,
            bankName: bankName,
            accountHolderName: accountHolderName,
            accountNumber: accountNumber,
            bankIFSCode: bankIFSCode,
            bankBranch: bankBranch,
            facultyType,
            facultyAvailability
        };
        payload.careerDetails = [];

        // Hit the APIs
        await UpdateFaculty(payload);
    };

    const UpdateFaculty = async facultyDetails => {
        try {
            const { data } = await APIService.patch(`${FACULTY}/${params.facultyId}`, facultyDetails);
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

    const handleDateFocus = () => {
        const currentDate = new Date();
        const minDate = subYears(currentDate, 100);
        const maxDate = subYears(currentDate, 18);

        const selectedDate = new Date(DOB);

        if (selectedDate < minDate || selectedDate > maxDate) {
            toast.warn('Faculty cannot be older than 100 years or younger than 18 years.');
        }
    };

    const clearFormData = () => {
        navigate('/faculty-management');
        setFormData(initialData);
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
                                {/* ---------------------ADD FACULTY CARD---------------- */}
                                <div className='top-card h-[800px] relative'>
                                    <div className='card-content'>
                                        <div className='card-header'>Edit Faculty</div>
                                        <Link to='/faculty-management'>
                                            <Button style='small'>
                                                <KeyboardBackspaceRoundedIcon className='icons mr-1' />  Back
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* --------------------------PERSONAL DETAILS-------------------- */}
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
                                                            Name<sup className="important">*</sup>
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
                                                        <div className='gender-select'>
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
                                                            value={phone2}
                                                            onChange={onMutate}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="employeeId">
                                                            Employee ID<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="employeeId"
                                                            name="employeeId"
                                                            className="form-disabled"
                                                            placeholder='SYSTEM_DEFAULT'
                                                            value='SYSTEM_DEFAULT'
                                                            disabled
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {/* --------------------------ACADEMIC DETAILS-------------------- */}
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
                                                            Institution<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="institution"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={institution}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="degree">
                                                            Degree<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="degree"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={degree}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="fieldOfStudy">
                                                            Field Of Study<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="fieldOfStudy"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={fieldOfStudy}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="startDate">
                                                            Start Date<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="startDate"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={startDate}
                                                            min={format(subYears(new Date(), 100), 'yyyy-MM-dd')}
                                                            max={format(new Date(), 'yyyy-MM-dd')}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="endDate">
                                                            End Date (or expected)<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="endDate"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={endDate}
                                                            min={startDate}
                                                            max={format(new Date(), 'yyyy-MM-dd')}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                    </div>

                                    {/* --------------------------ACCOUNT DETAILS-------------------- */}
                                    <div>
                                        <div onClick={() => handleSectionToggle('account')} className={openSection === 'account' ? "accordion-card-open mt-4" : "accordion-card-close mt-4"}>
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
                                                        <label className="form-input" htmlFor="facultyCharges">
                                                            Faculty Charges<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="facultyCharges"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={facultyCharges}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="facultyPAN">
                                                            Faculty PAN No<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="facultyPAN"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={facultyPAN}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="facultyGST">
                                                            Faculty GST<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="facultyGST"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={facultyGST}
                                                            maxLength={15}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="registeredAddress">
                                                            Registered Address<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="registeredAddress"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={registeredAddress}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="paymentPlan">
                                                            Payment Plan<sup className="important">*</sup>
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
                                                            Bank Name<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="bankName"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={bankName}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="accountHolderName">
                                                            Account Holder Name<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="accountHolderName"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={accountHolderName}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="accountNumber">
                                                            Account No<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="accountNumber"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={accountNumber}
                                                            maxLength={18}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="bankIFSCode">
                                                            Bank IFSC code<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="bankIFSCode"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={bankIFSCode}
                                                            maxLength={11}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='card-content mb-2'>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="bankBranch">
                                                            Bank Branch<sup className="important">*</sup>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="bankBranch"
                                                            className='form-select'
                                                            onChange={onMutate}
                                                            value={bankBranch}
                                                        />
                                                    </div>
                                                    <div className="mr-4 w-full">
                                                        <label className="form-input" htmlFor="facultyType">
                                                            Faculty Type<sup className="important">*</sup>
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
                                                    <div className="w-full">
                                                        <label className="form-input" htmlFor="bankIFSCode">
                                                            Faculty Availability<sup className="important">*</sup>
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
                                                </div>
                                            </div>
                                        }

                                    </div>

                                    {/* ----------------------SAVE AND CANCLE BUTTONS----------------------- */}
                                    <div className='absolute bottom-2 right-4 mb-5 mr-4'>
                                        <Button style='small' onClick={onSubmit} disabled={!fieldsChanged}>Save</Button>
                                        <Link>
                                            <Button style='cancel' onClick={clearFormData}>Cancel</Button>
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

export default UpdateFaculty;