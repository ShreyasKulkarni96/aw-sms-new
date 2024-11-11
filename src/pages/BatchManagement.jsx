import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from "../components/Button";
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import DeleteModal from '../shared/DeleteModal';
import APIService from '../services/APIService';
import TableComponent from '../components/TableComponent';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { format, subDays, subYears, isDate } from 'date-fns';

const initialFormData = {
    academicYearId: '',
    coreBatchCode: 'DSE/A/0108/MUM/23-24',
    electiveBatchCode: 'DSE/B/0108/MUM/23-24',
    type: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    capacity: '',
    batchCode: '',
    description: ''
}

const BatchManagement = () => {
    const [batchId, setBatchId] = useState();
    const [batches, setBatches] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [openSection, setOpenSection] = useState(null);
    const [academicYears, setAcademicYears] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [selectedAcademicYear, setSelectedAcademicYear] = React.useState(0);
    const [selectedProgramType, setSelectedProgramType] = React.useState('');
    const [selectedProgram, setSelectedProgram] = React.useState('');

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const filterBatches = (selectedAcademicYear, selectedProgramType, selectedProgram) => {
        return batches.filter(batch => {

            const matchesAcademicYear = selectedAcademicYear === 0 || batch.academicYearId === selectedAcademicYear;


            const matchesProgramType = !selectedProgramType || batch.type === selectedProgramType;


            const matchesProgram = !selectedProgram || batch.programId === selectedProgram;


            return matchesAcademicYear && matchesProgramType && matchesProgram;
        });
    };

    const filteredBatches = filterBatches(selectedAcademicYear, selectedProgramType, selectedProgram);

    useEffect(() => {
        fetchAY();
        fetchPrograms();
        fetchBatches();
    }, []);
    console.log(batches);
    const generateRandomCode = (length = 3) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const generateBatchCode = (type = 'CR') => {
        const randomCode = generateRandomCode();
        return `${randomCode}/${type}/V1.0`;
    };

    const fetchAY = async () => {
        try {
            const url = `/academic-year`;
            const { data } = await APIService.get(url);
            setAcademicYears(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching batches');
        }
    };

    const fetchPrograms = async () => {
        try {
            const { data } = await APIService.get('/program');
            setPrograms(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching programs');
        }
    };

    const fetchBatches = async () => {
        try {
            const { data } = await APIService.get(`/batch`);
            setBatches(data.data);
        } catch (error) {
            toast.error('Some Error occurred while fetching batches');
        }
    };

    const columns = React.useMemo(
        () => [
            { Header: 'Serial No', accessor: 'serialNo' },
            { Header: 'ID', accessor: 'id' },
            { Header: 'Batch', accessor: 'batchCode' },
            { Header: 'Program Code', accessor: 'programId' },
            { Header: 'Start Date', accessor: 'startDate' },
            { Header: 'End Date', accessor: 'endDate' },
            { Header: 'Capacity', accessor: 'capacity' },
            { Header: 'Enrolled Count', accessor: 'enrolled' },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <>
                        <Button onClick={() => handleEdit(row.original.id)}><BorderColorRoundedIcon className='icon-style' /></Button>
                        <Button onClick={() => handleDeleteConfirmation(row.original.id)}><DeleteRoundedIcon className='icon-style' /></Button>
                    </>
                )
            }
        ], []
    );

    const batchWithSerialNo = useMemo(() => {
        return filteredBatches.map((batch, index) => {
            return {
                ...batch,
                serialNo: index + 1,
            };
        });
    }, [filteredBatches, batches]);

    const handleCancelDelete = () => {
        setFormData(initialFormData);
        setDeleteModalOpen(false);
    }

    const handleDelete = async () => {
        try {
            if (batchId) {
                await APIService.delete(`/batch/${batchId}`);
                await fetchBatches();
                toast.success('Batch deleted successfully')
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Batch';
            if (error.response && error.response.data) {
                return toast.error(errorMessage || error.response.data.message);
            }
            toast.error(errorMessage)
        }
        setDeleteModalOpen(false);
    }

    const handleDeleteConfirmation = (id) => {
        setBatchId(id);
        setDeleteModalOpen(true);
    }

    const clearFormData = () => {
        setOpenSection(null);
        setFormData(initialFormData);
    }

    const onMutate = e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async (batchType) => {

        formData.type = batchType;

        const batchCode = generateBatchCode(batchType === 'core' ? 'CR' : 'EL');

        // Validate that the academicYearId is not empty
        if (!formData.academicYearId) {
            toast.warn('Please select a Academic Year');
            return;
        }
        // Validate that the program is not empty
        if (!formData.programId) {
            toast.warn('Please select a Program');
            return;
        }
        // Check if "StartDate" is provided and follows a valid date format
        if (!startDate || !isDate(new Date(startDate))) {
            toast.warn('Please enter Start Date.');
            return;
        }
        // Check if "endDate" is provided and follows a valid date format
        if (!endDate || !isDate(new Date(endDate))) {
            toast.warn('Please enter End Date.');
            return;
        }
        if (startDate > endDate) {
            return toast.warn('Start Date cannot be greater than End Date.');
        }
        // Check if capacity is empty
        if (!formData.capacity) {

            toast.warn('Capacity cannot be empty');
            return;
        }
        const capacityValue = parseInt(formData.capacity);
        // eslint-disable-next-line
        if (isNaN(capacityValue) || capacityValue != formData.capacity) {

            toast.warn('Please enter a valid integer value for capacity');
            return;
        }

        formData.batchCode = batchCode;

        // 2.) Hit the API;
        const newBatch = await addBatch(formData);

        //3.) Add to Sessions List
        if (newBatch) {
            toast.success('Batch Added Successfully');
            setBatches([...batches, newBatch]);
            clearFormData();
        }
    }

    const addBatch = async formData => {
        try {
            const payload = { ...formData };
            delete payload.coreBatchCode;
            delete payload.electiveBatchCode;

            payload.capacity = parseInt(formData.capacity);
            payload.startDate = formData.startDate;
            payload.endDate = formData.endDate;
            payload.programId = formData.programId * 1;
            payload.academicYearId = formData.academicYearId * 1;
            const { data } = await APIService.post(`/batch`, payload);
            clearFormData();
            return data.data;
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
                return false;
            }
            toast.error('Temporarily Unable to Add Batch');
        }
    }

    const handleEdit = async (id) => {
        try {
            const { data } = await APIService.get(`/batch/${id}`);
            setFormData({
                ...data.data,
            });

            setOpenSection('editBatch');
            setBatchId(id);
        } catch (error) {
            toast.error('Unable to fetch batch details');
        }
    };

    const updateBatch = async () => {
        try {
            // Check if "bankBranch" is provided
            if (!formData.capacity) {
                toast.warn('Capacity is required.');
                return; // Don't proceed if it's not provided
            }
            // Check if "StartDate" is provided and follows a valid date format
            if (!formData.startDate || !isDate(new Date(formData.startDate))) {
                toast.warn('Please enter Start Date.');
                return; // Don't proceed if it's not a valid date
            }
            // Check if "endDate" is provided and follows a valid date format
            if (!formData.endDate || !isDate(new Date(formData.endDate))) {
                toast.warn('Please enter End Date.');
                return; // Don't proceed if it's not a valid date
            }
            if (formData.startDate > formData.endDate) {
                return toast.warn('Start Date cannot be greater than End Date.');
            }
            // Check if "programId" is provided
            if (!formData.programId) {
                toast.warn('Program is required.');
                return; // Don't proceed if it's not provided
            }
            // Check if "academicId" is provided
            if (!formData.academicYearId) {
                toast.warn('Academic Year is required.');
                return; // Don't proceed if it's not provided
            }
            delete formData.enrolled;
            delete formData.isActive;
            delete formData.updatedAt;
            delete formData.createdAt;
            formData.description = formData.description || '';

            const payload = { ...formData };

            const { data } = await APIService.patch(`/batch/${batchId}`, payload);
            if (data.code === 200) {
                toast.success('Batch Details Updated Successfully');
                await fetchBatches();
                clearFormData();
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            } else {
                toast.error('Temporarily Unable to Update Batch Details');
            }
            clearFormData();
        }
    }

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
                                {/* -----------------------------------TOP CARD--------------------------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Batch Management</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="academicYear">
                                                    Select Academic Year
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="academicYear"
                                                    id="academicYear"
                                                    value={selectedAcademicYear}
                                                    onChange={(e) => setSelectedAcademicYear(Number(e.target.value))}
                                                >
                                                    <option value={0}>Select Academic Year</option>
                                                    {academicYears.map(ay => {
                                                        return (
                                                            <option key={ay.id} value={ay.id}>
                                                                {ay.name}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="programType">
                                                    Select Program Type
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="programType"
                                                    id="programType"
                                                    value={selectedProgramType}
                                                    onChange={(e) => setSelectedProgramType(e.target.value)}
                                                >
                                                    <option value={''}>Select Program Type </option>
                                                    <option value={'core'}>Core Program</option>
                                                    <option value={'elective'}>Elective Program</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="program">
                                                    Select Program
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="program"
                                                    id="program"
                                                    value={selectedProgram}
                                                    onChange={(e) => setSelectedProgram(Number(e.target.value))}
                                                >
                                                    <option value={''}>Select Program Core / Elective </option>

                                                    {programs.map(item => {
                                                        return (
                                                            <option key={item.id} value={item.id}>
                                                                {item.programName}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full mt-6 text-center">
                                            <Button style='small' onClick={() => handleSectionToggle('core')}>Add Core Batch</Button>
                                            <Button style='small' onClick={() => handleSectionToggle('elective')}>Add Elective Batch</Button>
                                        </div>
                                    </div>
                                </div>
                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <TableComponent columns={columns} data={batchWithSerialNo} tableName="Course Lists" isButton={false} height="620px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {/* -------------------------------------------------MODAL FOR CORE BATCH-------------------------------------------------------- */}
            {openSection === 'core' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Core Batch</h3>
                                    <button onClick={clearFormData} className="edit-cancel-button">
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
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="academicYearId">
                                            Academic Year<sup className="important">*</sup>
                                        </label>
                                        <select
                                            className="form-select"
                                            id="academicYearId"
                                            onChange={onMutate}
                                        >
                                            <option value="">---Select Academic Year---</option>
                                            {academicYears.map(ay => {
                                                return (
                                                    <option key={ay.id} value={ay.id}>
                                                        {ay.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="programId">
                                            Select Program<sup className="important">*</sup>
                                        </label>
                                        <select
                                            className="form-select"
                                            id="programId"
                                            onChange={onMutate}
                                        >
                                            <option value={''}>Select Program</option>
                                            {programs.map(program => {
                                                return (
                                                    <option key={program.id} value={program.id}>
                                                        {program.programName}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="batchCode">
                                            Batch Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="batchCode"
                                            name="batchCode"
                                            className="form-disabled"
                                            value={formData.coreBatchCode}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="startDate">
                                            Start Date<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            value={formData.startDate}
                                            className="form-select"
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="endDate">
                                            End Date<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            className="form-select"
                                            value={formData.endDate}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="capacity">
                                            Capacity<sup className="important">*</sup>
                                        </label>
                                        <input
                                            min={1}
                                            type="text"
                                            id="capacity"
                                            name="capacity"
                                            className="form-select"
                                            value={formData.capacity}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className="light-divider"></div>
                                <div className='modal-button'>
                                    <Button style="small" onClick={() => onSubmit('core')}>Save</Button>
                                    <Button style="cancel" onClick={clearFormData}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* -------------------------------------------------MODAL FOR ELECTIVE BATCH--------------------------------------------------- */}
            {openSection === 'elective' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Elective Batch</h3>
                                    <button onClick={clearFormData} className="edit-cancel-button">
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
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="academicYearId">
                                            Academic Year<sup className="important">*</sup>
                                        </label>
                                        <select
                                            className="form-select"
                                            id="academicYearId"
                                            onChange={onMutate}
                                        >
                                            <option value="">---Select Academic Year---</option>
                                            {academicYears.map(ay => {
                                                return (
                                                    <option key={ay.id} value={ay.id}>
                                                        {ay.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="programId">
                                            Select Program<sup className="important">*</sup>
                                        </label>
                                        <select
                                            className="form-select"
                                            id="programId"
                                            onChange={onMutate}
                                        >
                                            <option value={''}>Select Program</option>
                                            {programs.map(program => {
                                                return (
                                                    <option key={program.id} value={program.id}>
                                                        {program.programName}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="batchCode">
                                            Batch Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="batchCode"
                                            name="batchCode"
                                            className="form-disabled"
                                            value={formData.electiveBatchCode}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="startDate">
                                            Start Date<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            className="form-select"
                                            value={formData.startDate}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="endDate">
                                            End Date<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            className="form-select"
                                            value={formData.endDate}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="capacity">
                                            Capacity<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="capacity"
                                            name="capacity"
                                            className="form-select"
                                            value={formData.capacity}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={() => onSubmit('elective')}>Save</Button>
                                <Button style="cancel" onClick={clearFormData}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* -------------------------------------------------MODAL POP UP FOR EDIT------------------------------------------------- */}
            {openSection === 'editBatch' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="edit-modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Edit Batch</h3>
                                    <button onClick={clearFormData} className="cancel-button">
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
                                            <label className="form-input" htmlFor="batchCode">
                                                Batch Code<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="batchCode"
                                                name="batchCode"
                                                className="form-disabled"
                                                placeholder='Batch Code'
                                                value={formData.batchCode}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div >
                                            <label className="form-input" htmlFor="capacity">
                                                Capacity<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="capacity"
                                                name="capacity"
                                                className="form-select"
                                                placeholder='Capacity'
                                                value={formData.capacity}
                                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <div className="mr-4">
                                            <label className="form-input" htmlFor="startDate">
                                                Start Date<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                name="startDate"
                                                className="form-select"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div >
                                            <label className="form-input" htmlFor="endDate">
                                                End Date<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="date"
                                                id="endDate"
                                                name="endDate"
                                                className="form-select"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <div className="mr-4">
                                            <label className="form-input" htmlFor="programId">
                                                Select Program<sup className="important">*</sup>
                                            </label>
                                            <select
                                                className="form-select"
                                                id="programId"
                                                value={formData.programId}
                                                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                                            >
                                                <option value={''}>Select Program</option>
                                                {programs.map(program => {
                                                    return (
                                                        <option key={program.id} value={program.id}>
                                                            {program.programName}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div>
                                            <label className="form-input" htmlFor="academicYearId">
                                                Academic Year<sup className="important">*</sup>
                                            </label>
                                            <select
                                                className="form-select"
                                                id="academicYearId"
                                                value={formData.academicYearId}
                                                onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                                            >
                                                <option value="">---Select Academic Year---</option>
                                                {academicYears.map(ay => {
                                                    return (
                                                        <option key={ay.id} value={ay.id}>
                                                            {ay.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <div className="mr-4">
                                            <label className="form-input" htmlFor="description">
                                                Description<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="description"
                                                name="description"
                                                className="form-select"
                                                placeholder='Description'
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">

                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={updateBatch}>Save</Button>
                                <Button style="cancel" onClick={clearFormData}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default BatchManagement;