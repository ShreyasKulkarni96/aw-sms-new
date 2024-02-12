import React, { useEffect, useState, useMemo } from 'react';

import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';

import APIService from '../../services/APIService';
import DeleteModal from '../../components/shared/DeleteModal';
// import { Link } from 'react-router-dom';

import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { COURSE } from '../../constants/api';
import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

const CourseManagement = () => {
    const params = useParams();
    const [filterOn, setFilterOn] = useState(true);
    const [openSection, setOpenSection] = useState(null);
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        programId: 0,
        coreCourseCode: 'CRS/****/CR/V1.0',
        electiveCourseCode: 'CRS/****/EL/V1.0',
        courseName: '',
        type: '',
        description: ''
    });

    const courseNameRegex = /^[A-Za-z0-9\s\-.]+$/;

    const { courseName, description } = formData;

    useEffect(() => {
        fetchCourses();
        fetchPrograms();
    }, []);

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const fetchPrograms = async () => {
        try {
            const url = `/program?fields=programName,id,type`;
            const { data } = await APIService.get(url);
            setPrograms(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Error fetching programs');
        }
    };

    const fetchCourses = async () => {
        try {
            const programId = params.programId;
            let url = programId ? `/course?programId=${programId}` : '/course';
            const { data } = await APIService.get(url);
            setCourses(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching courses');
        }
    };

    const tableHeader = [
        { Header: 'Serial No.', accessor: 'id' },
        {
            Header: 'Program',
            accessor: 'program',
            Cell: ({ row }) => row.original.program.programName
        },
        { Header: 'Course Code', accessor: 'courseCode' },
        { Header: 'Course Name', accessor: 'courseName' },
        { Header: 'Type', accessor: 'type' },
        { Header: 'Course Description', accessor: 'description' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <button>
                        <BorderColorRoundedIcon className='icon-style mr-2' />
                    </button>
                    <button onClick={() => handleDeleteConfirmation(row.original.id)}>
                        <DeleteRoundedIcon className='icon-style' />
                    </button>
                </>
            )
        },
        {
            Header: 'Sessions',
            accessor: 'session',
            Cell: ({ row }) => (
                <Link to={{ pathname: `/course-management/${row.id}` }}>
                    <button>
                        <AudioFileRoundedIcon className='text-blue' />
                    </button>
                </Link>
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
    } = useTable({ columns: tableColumn, data: courses }, useSortBy, usePagination);

    const handleDeleteConfirmation = (id) => {
        setCourseId(id);
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        try {
            if (courseId) {
                await APIService.delete(`${COURSE}/${courseId}`);
                await fetchCourses();
                setDeleteModalOpen(false);
                toast.success('Course deleted successfully');
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Course';
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

    const filterCourses = async e => {
        if (e.target.value !== 'ALL' && e.target.name !== 'filterByProgram') setFilterOn(false);
        if (e.target.value === 'ALL') {
            setFilterOn(true);
            await fetchCourses();
            return;
        }
        if (e.target.name === 'filterByProgram') {
            let filterVal = e.target.value;
            if (!filterVal) {
                await fetchCourses();
                return;
            }
            filterVal = parseInt(e.target.value);
            const filteredCourses = courses.filter(item => item.programId === filterVal);
            setCourses(filteredCourses);
            return;
        }
        const filteredCourses = courses.filter(item => item.type === e.target.value);
        setCourses(filteredCourses);
    };

    const onMutate = e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async courseType => {
        // 1.) Add validations on data @Nikhil

        // Validate that the programName is not empty
        if (!formData.programId) {
            // Display a validation warning message if it's empty
            toast.warn('Please select a Program');
            return;
        }
        // Validate that the courseName is not empty and matches the pattern
        if (!formData.courseName) {
            // Display a validation warning message if it's empty
            toast.warn('Course Name cannot be empty');
            return;
        }

        //Check if the courseName is valid
        if (!courseNameRegex.test(formData.courseName)) {
            // Display a validation warning message if it doesn't match the pattern
            toast.warn('Course Name is invalid');
            return;
        }

        // Validate that the description is not empty and matches the pattern
        if (!formData.description) {
            // Display a validation warning message if it's empty
            toast.warn('Description cannot be empty');
            return;
        }

        //Check if the description is valid
        if (!courseNameRegex.test(formData.description)) {
            // Display a validation warning message if it doesn't match the pattern
            toast.warn('Description is invalid');
            return;
        }
        formData.type = courseType;
        // for (const key in formData) {
        //   if (!formData[key]) return toast.warn(`Please add ${key.split(/(?=[A-Z])/).join(' ')}`);
        // }

        // 2.) Hit the API;
        const newCourse = await addCourse(formData);

        //3.) Add to Course List
        if (newCourse) {
            newCourse.program = programs.find(el => el.id === newCourse.programId);
            setCourses([...courses, newCourse]);
            clearFormData();
        }
    };

    const addCourse = async formData => {
        try {
            const payload = { ...formData };
            delete payload.coreCourseCode;
            delete payload.electiveCourseCode;
            payload.courseCode = formData.type === 'core' ? formData.coreCourseCode : formData.electiveCourseCode;
            payload.programId = formData.programId * 1;

            const { data } = await APIService.post(`/course`, payload);
            if (data.code === 201) toast.success('Course Added Successfully');
            clearFormData();
            return data.data;
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
                return false;
            }
            // setIsLoading(false);
            toast.error('Temporarily Unable to Add Course');
            return false;
        }
    };

    const clearFormData = () => {
        setOpenSection(null)
        const selectFields = ['programId'];
        const clearedForm = {};
        for (const key in formData) {
            if (key.toLowerCase().includes('code') || selectFields.includes(key)) {
                clearedForm[key] = formData[key];
                continue;
            }
            clearedForm[key] = '';
        }
        setFormData(clearedForm);
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
                                {/* ------------------------------TOP CARD----------------------------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Courses</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className=' w-full'>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value={'core'}
                                                    onChange={filterCourses}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Core</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value={'elective'}
                                                    onChange={filterCourses}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Elective</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value={'ALL'}
                                                    onChange={filterCourses}
                                                    checked={filterOn}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">All</label>
                                            </label>
                                        </div>
                                        <div className='w-full mb-2'>
                                            <select className="form-select" name="filterByProgram">
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
                                        <div className='w-full text-right'>
                                            <Button style='small' onClick={() => handleSectionToggle('core')}>Add Core Course</Button>
                                            <Button style='small' onClick={() => handleSectionToggle('elective')}>Add Elective Course</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <div className='bottom-card h-[620px]'>
                                    <div className='card-header'>Program Lists</div>
                                    <div className='overflow-auto' style={{ maxHeight: '600px' }}>
                                        <table id='programList' className='table '>
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
                                            <tbody {...getTableBodyProps()}>
                                                {page.map((row) => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map((cell) => {
                                                                return (
                                                                    <td className='td' {...cell.getCellProps()}>
                                                                        {cell.render('Cell')}
                                                                    </td>
                                                                )
                                                            })}
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* ------------------------------PAGINATION BUTTONS----------------------------------- */}
                                <div className='pagination-wrapper'>
                                    <button className='pagination-button'>
                                        Previous
                                    </button>
                                    <span className='span-pagination'>Page </span>
                                    <button className='pagination-button'>
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* --------------------------------------ADD CORE PROGRAM---------------------------------------- */}
            {openSection === 'core' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Core Course</h3>
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
                                        <label className="form-input" htmlFor="courseName">
                                            Select Program<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" onChange={onMutate} id="programId">
                                            <option value={0}>---Select Program---</option>
                                            {programs
                                                .filter(el => el.type === 'core')
                                                .map(program => {
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
                                        <label className="form-input" htmlFor="coreCourseCode">
                                            Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="coreCourseCode"
                                            name="coreCourseCode"
                                            className="form-disabled"
                                            placeholder='Course Code'
                                            value={formData.coreCourseCode}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="courseName">
                                            Course Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="courseName"
                                            name="courseName"
                                            className="form-select"
                                            placeholder='Course Name'
                                            value={courseName}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="description">
                                            Course Description<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="description"
                                            name="description"
                                            className="form-select"
                                            placeholder='Description'
                                            value={description}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={() => onSubmit('core')}>Save</Button>
                                <Button style="cancel" onClick={clearFormData} >Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* --------------------------------------ADD ELECTIVE PROGRAM---------------------------------------- */}
            {openSection === 'elective' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Elective Course</h3>
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
                                        <label className="form-input" htmlFor="courseName">
                                            Select Program<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" onChange={onMutate} id="programId">
                                            <option value={0}>---Select Program---</option>
                                            {programs
                                                .filter(el => el.type === 'elective')
                                                .map(program => {
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
                                        <label className="form-input" htmlFor="electiveCourseCode">
                                            Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="electiveCourseCode"
                                            name="electiveCourseCode"
                                            className="form-disabled"
                                            placeholder='Course Code'
                                            value={formData.electiveCourseCode}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="courseName">
                                            Course Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="courseName"
                                            name="courseName"
                                            className="form-select"
                                            placeholder='Course Name'
                                            value={courseName}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="description">
                                            Description<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="description"
                                            name="description"
                                            className="form-select"
                                            placeholder='Course Name'
                                            value={description}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={() => onSubmit('elective')}>Save</Button>
                                <Button style="cancel" onClick={clearFormData} >Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default CourseManagement;