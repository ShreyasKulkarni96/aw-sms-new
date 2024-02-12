import React, { useState, useMemo, useEffect } from 'react';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import APIService from '../services/APIService';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteModal from '../components/shared/DeleteModal';

const BatchManagement = () => {
    const [academicYears, setAcademicYears] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [batchId, setBatchId] = useState();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [addCoreOpen, setAddCoreOpen] = useState(false);
    const [addElectiveOpen, setAddElectiveOpen] = useState(false);
    const [formData, setFormData] = useState({
        academicYearId: '',
        coreBatchCode: 'DSE/A/0108/MUM/23-24',
        electiveBatchCode: 'DSE/B/0108/MUM/23-24',
        type: '',
        startDate: '',
        endDate: '',
        capacity: ''
    });
    const [editBatchData, setEditBatchData] = useState({
        batchCode: '',
        capacity: '',
        startDate: '',
        endDate: '',
        programId: '',
        academicYearId: '',
        description: ''
    });

    const { capacity, startDate, endDate } = formData;

    useEffect(() => {
        fetchAY();
        fetchPrograms();
        fetchBatches();
    }, []);

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
            const url = `/batch`;
            const { data } = await APIService.get(url);
            setBatches(data.data);
        } catch (error) {
            toast.error('Some Error occurred while fetching batches');
        }
    };

    const onMutate = async e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const tableHeader = [
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
                    <Button onClick={() => handleEditModal(row.original)}><BorderColorRoundedIcon className='icon-style' /></Button>
                    <Button onClick={() => handleDeleteConfirmation(row.original.id)}><DeleteRoundedIcon className='icon-style' /></Button>
                </>
            )
        }
    ];

    const tableColumn = useMemo(() => tableHeader, []);

    const {
        headerGroups,
        getTableProps,
        getTableBodyProps,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        previousPage,
        nextPage,
        state: { pageIndex }
    } = useTable({ columns: tableColumn, data: batches }, useSortBy, usePagination);

    const handleDeleteConfirmation = (id) => {
        setBatchId(id);
        setDeleteModalOpen(true);
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

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    }

    const handleEditModal = (rowData) => {
        setEditModalOpen(true); // Open the modal
        setEditBatchData({ ...rowData }); // Assign the data to editBatchData
    }

    const handleCancelEdit = () => {
        setEditModalOpen(!isEditModalOpen)
    }

    const handleEditInputChange = (field, value) => {
        setEditBatchData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const updateBatch = async () => {
        try {
            // Check if "bankBranch" is provided
            if (!editBatchData.capacity) {
                toast.warn('Capacity is required.');
                return; // Don't proceed if it's not provided
            }
            // Check if "StartDate" is provided and follows a valid date format
            if (!editBatchData.startDate || !isDate(new Date(editBatchData.startDate))) {
                toast.warn('Please enter Start Date.');
                return; // Don't proceed if it's not a valid date
            }
            // Check if "endDate" is provided and follows a valid date format
            if (!editBatchData.endDate || !isDate(new Date(editBatchData.endDate))) {
                toast.warn('Please enter End Date.');
                return; // Don't proceed if it's not a valid date
            }

            if (editBatchData.startDate > editBatchData.endDate) {
                return toast.warn('Start Date cannot be greater than End Date.');
            }

            // Check if "programId" is provided
            if (!editBatchData.programId) {
                toast.warn('Program is required.');
                return; // Don't proceed if it's not provided
            }
            // Check if "academicId" is provided
            if (!editBatchData.academicYearId) {
                toast.warn('Academic Year is required.');
                return; // Don't proceed if it's not provided
            }
            // Delete the properties you want to remove from editBatchData
            delete editBatchData.academicYear;
            delete editBatchData.enrolled;
            delete editBatchData.isActive;
            delete editBatchData.updatedAt;
            delete editBatchData.createdAt;
            editBatchData.description = editBatchData.description || '';
            const { data } = await APIService.patch(`/batch/${editBatchData.id}`, editBatchData);
            if (data.code === 200) {
                toast.success('Batch Details Updated Successfully');
                await fetchBatches();
            }
            // You can uncomment setIsLoading(false) if needed
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            } else {
                toast.error('Temporarily Unable to Update Batch Details');
            }
        }
    };

    const handleAddCoreBatch = () => {
        setAddCoreOpen(true)
    }

    const handleAddElectiveBatch = () => {
        setAddElectiveOpen(true)
    }

    const clearFormData = () => {
        if (setAddCoreOpen) setAddCoreOpen(false);
        if (setAddElectiveOpen) setAddElectiveOpen(false);
        const clearedForm = {};
        for (const key in formData) {
            if (key.toLowerCase().includes('code')) {
                clearedForm[key] = formData[key];
                continue;
            }
            clearedForm[key] = '';
        }
        setFormData({
            academicYearId: '',
            coreBatchCode: 'DSE/A/0108/MUM/23-24',
            electiveBatchCode: 'DSE/B/0108/MUM/23-24',
            type: '',
            startDate: '',
            endDate: '',
            capacity: ''
        })
    };

    const onSubmit = async batchType => {
        // Validate that the academicYearId is not empty
        if (!formData.academicYearId) {
            // Display a validation warning message if it's empty
            toast.warn('Please select a Academic Year');
            return;
        }
        // Validate that the program is not empty
        if (!formData.programId) {
            // Display a validation warning message if it's empty
            toast.warn('Please select a Program');
            return;
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

        if (startDate > endDate) {
            return toast.warn('Start Date cannot be greater than End Date.');
        }

        // Check if capacity is empty
        if (!formData.capacity) {
            // Display a validation warning message if it's empty
            toast.warn('Capacity cannot be empty');
            return;
        }

        const capacityValue = parseInt(formData.capacity);
        // eslint-disable-next-line
        if (isNaN(capacityValue) || capacityValue != formData.capacity) {
            // Display a validation warning message if it's not a valid integer
            toast.warn('Please enter a valid integer value for capacity');
            return;
        }

        formData.type = batchType;

        // 2.) Hit the API;
        const newBatch = await addBatch(formData);

        //3.) Add to Sessions List
        if (newBatch) {
            toast.success('Batch Added Successfully');
            setBatches([...batches, newBatch]);
            clearFormData();
        }
    };

    const addBatch = async formData => {
        try {
            const payload = { ...formData };
            delete payload.coreBatchCode;
            delete payload.electiveBatchCode;
            payload.batchCode = formData.type === 'core' ? formData.coreBatchCode : formData.electiveBatchCode;
            payload.capacity = parseInt(formData.capacity);
            payload.startDate = formData.startDate;
            payload.endDate = formData.endDate;
            payload.programId = formData.programId * 1;
            payload.academicYearId = formData.academicYearId * 1;
            const { data } = await APIService.post(`/batch`, payload);
            // setIsLoading(false);
            return data.data;
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
                return false;
            }
            // setIsLoading(false);
            toast.error('Temporarily Unable to Add Session');
            return false;
        }
    };

    const filterBatches = async e => {
        if (e.target.name === 'filterByAY') {
            const academicYearId = parseInt(e.target.value);
            if (academicYearId === 0) {
                await fetchBatches();
                return;
            }
            const filteredBatches = batches.filter(item => item.academicYearId === academicYearId);
            setBatches(filteredBatches);
        }
        if (e.target.name === 'filterByType') {
            const filterVal = e.target.value;
            if (!filterVal) {
                await fetchBatches();
                await fetchPrograms();
                return;
            }
            const filteredBatches = batches.filter(item => item.type === filterVal);
            const filteredPrograms = programs.filter(item => item.type === filterVal);
            setBatches(filteredBatches);
            setPrograms(filteredPrograms);
        }
        if (e.target.name === 'filterByProgram') {
            let filterVal = e.target.value;
            if (!filterVal) {
                await fetchPrograms();
                await fetchBatches();
                return;
            }
            filterVal = parseInt(e.target.value);
            const filteredBatches = batches.filter(item => item.programId === filterVal);
            setBatches(filteredBatches);
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
                                {/* --------------TOP CARD--------------- */}
                                <div className='top-card '>
                                    <div className='card-content'>
                                        <div className='card-header'>Create Batch</div>
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
                                                >
                                                    <option value=''>
                                                        Select Academic Year
                                                    </option>
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
                                                >
                                                    <option value=''>
                                                        Select Program Type
                                                    </option>
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
                                                >
                                                    <option value=''>
                                                        Select Program
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full mt-6 text-center">
                                            <Button style="small" onClick={handleAddCoreBatch}>Add Core batch</Button>
                                            <Button style="small" onClick={handleAddElectiveBatch}>Add Elective batch</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* ------------------BOTTOM CARD------------- */}
                                <div className='bottom-card h-[600px]'>
                                    <div className='card-header'>List of Batches</div>
                                    <div className=' overflow-y-auto' style={{ maxHeight: '350px' }}>
                                        <table id='studentList' className='table'>
                                            <thead className='table-head'>
                                                {headerGroups.map(headerGroup => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map(column => (
                                                            <th className='th'{...column.getHeaderProps(column.getSortByToggleProps())}>
                                                                {column.render('Header')}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody {...getTableBodyProps()}>
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
                                    <button onClick={() => previousPage()} className='pagination-button'>
                                        Previous
                                    </button>
                                    <span className='span-pagination'>Page {pageIndex + 1} of {page.length}</span>
                                    <button onClick={() => nextPage()} className='pagination-button'>
                                        back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div >

            {/* ---------------- MODAL POP UP CORE BATCH------------------- */}
            {addCoreOpen ? <div className='modal-open'>
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
                                        value={startDate}
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
                                        value={endDate}
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
                                        value={capacity}
                                        onChange={onMutate}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="light-divider"></div>
                        <div className='modal-button'>
                            <Button style="small" onClick={() => onSubmit('core')}>Save</Button>
                            <Button style="cancel" onClick={clearFormData}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </div> : ''}

            {/* ---------------- MODAL POP UP CORE BATCH------------------- */}
            {addElectiveOpen ? <div className='modal-open'>
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
                                        value={capacity}
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
            </div> : ''}

            {/* --------------EDIT MODAL POP UP--------------- */}
            {isEditModalOpen ? <div className='modal-open'>
                <div className="modal-wrapper">
                    <div className="modal-opacity">
                        <div className="modal-op"></div>
                    </div>
                    <div className="edit-modal-content">
                        <div className="modal-title-content">
                            <div className="modal-title-wrapper">
                                <h3 className="modal-title">Edit Details</h3>
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
                                        <label className="form-input" htmlFor="batchCode">
                                            Batch Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="batchCode"
                                            name="batchCode"
                                            className="form-disabled"
                                            placeholder='Batch Code'
                                            value={editBatchData.batchCode}
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
                                            value={editBatchData.capacity}
                                            onChange={e => handleEditInputChange('capacity', e.target.value)}
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
                                            value={editBatchData.startDate}
                                            onChange={e => handleEditInputChange('startDate', e.target.value)}
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
                                            value={editBatchData.endDate}
                                            onChange={e => handleEditInputChange('endDate', e.target.value)}
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
                                            value={editBatchData.programId}
                                            onChange={e => handleEditInputChange('programId', e.target.value)}
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
                                            value={editBatchData.academicYearId}
                                            onChange={e => handleEditInputChange('academicYearId', e.target.value)}
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
                                            onChange={e => handleEditInputChange('description', e.target.value)}
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
                            <Button style="cancel" onClick={handleCancelEdit}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </div>
                : ''}
            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default BatchManagement;

