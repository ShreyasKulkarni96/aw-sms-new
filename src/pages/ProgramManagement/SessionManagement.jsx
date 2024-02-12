import React, { useEffect, useState, useMemo } from 'react';

import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';

import APIService from '../../services/APIService';

import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteModal from '../../components/shared/DeleteModal';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

const SessionManagement = () => {
    const params = useParams();
    const [filterOn, setFilterOn] = useState(true);
    const [courses, setCourses] = useState([]);
    const [session, setSession] = useState([]);
    const [sessionId, setSessionId] = useState();
    const [openSection, setOpenSection] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        courseId: 0,
        coreSessionCode: 'CRS/****/CR/SES/***/V1.0',
        electiveSessionCode: 'CRS/****/EL/SES/***/V1.0',
        sessionName: '',
        description: '',
        sequence: '',
        timeDuration: '',
        sessionType: ''
    });

    const sessionNameRegex = /^[A-Za-z0-9\s\-.]+$/;
    const { sessionName, description, sequence, timeDuration } = formData;
    const sessionType = ['classroom', 'studio', 'lab', 'field visit'];

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    useEffect(() => {
        // do an API call
        fetchCourses();
        fetchSession();
    }, []);

    const fetchCourses = async () => {
        try {
            const url = `/course?fields=courseName,id,type`;
            const { data } = await APIService.get(url);
            setCourses(data.data);

        } catch (error) {
            console.log(error);
            toast.error('Error fetching courses');
        }
    };

    const fetchSession = async () => {
        try {
            const courseId = params.courseId;
            let url = courseId ? `/session?courseId=${courseId}` : '/session';
            const { data } = await APIService.get('/session');
            setSession(data.data);
            console.log(session)
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching session');
        }
    };

    const tableHeader = [
        { Header: 'Serial.No', accessor: 'id' },
        { Header: 'Session Code', accessor: 'sessionCode' },
        { Header: 'Name', accessor: 'sessionName' },
        { Header: 'Duration', accessor: 'timeDuration' },
        { Header: 'Type', accessor: 'type' },
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
            Header: 'View Topics',
            accessor: 'showTopics',
            Cell: ({ row }) => (
                <Link to={{ pathname: `/topic-management/${row.original.id}` }}>
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
    } = useTable({ columns: tableColumn, data: session }, useSortBy, usePagination);

    const handleDeleteConfirmation = (id) => {
        setSessionId(id);
        setDeleteModalOpen(true);
    }

    const handleDelete = async () => {
        try {
            if (sessionId) {
                await APIService.delete(`/session/${sessionId}`);
                await fetchSession();
                toast.success('Session deleted successfully');
            }
        } catch (err) {
            console.log(err);
            const errMsg = 'Temporarily Unable to delete Session';
            if (err.response && err.response.data) {
                return toast.error(err.response.data.message || errMsg);
            }
            toast.error(errMsg);
        }
        setDeleteModalOpen(false);
    }

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    }

    const filterSessions = async e => {
        if (e.target.value !== 'ALL' && e.target.name !== 'filterByCourse') setFilterOn(false);
        if (e.target.value === 'ALL') {
            setFilterOn(true);
            await fetchSession();
            return;
        }
        if (e.target.name === 'filterByType') {
            let filterVal = e.target.value;
            if (!filterVal) {
                await fetchCourses();
                await fetchSession();
                return;
            }
            // filterVal = parseInt(e.target.value);
            const filteredCourses = courses.filter(item => item.type === filterVal);
            setCourses(filteredCourses);
            const filteredSessions = session.filter(item => item.course.type === filterVal);
            setSession(filteredSessions);
            return;
        }
        if (e.target.name === 'filterByCourse') {
            let filterVal = e.target.value;
            if (!filterVal) {
                await fetchSession();
                return;
            }
            filterVal = parseInt(e.target.value);
            const filteredSessions = session.filter(item => item.courseId === filterVal);
            setSession(filteredSessions);
            return;
        }
        const filteredSessions = session.filter(item => item.type === e.target.value);
        setSession(filteredSessions);
    };

    const onMutate = e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async sessionType => {
        // 1.) Add validation
        formData.type = sessionType;

        // Check  that the Course is not empty
        if (!formData.courseId) {
            // Display a validation warning message if it's empty
            toast.warn('Please select a Course');
            return;
        }

        // Validate that the sessionName is not empty and matches the pattern
        if (!formData.sessionName) {
            // Display a validation warning message if it's empty
            toast.warn('Session Name cannot be empty');
            return;
        }

        // check if the sessionName is valid
        if (!sessionNameRegex.test(formData.sessionName)) {
            // Display a validation warning message if it doesn't match the pattern
            toast.warn('Session Name is invalid');
            return;
        }

        // Validate that the sessionType is not empty and matches the pattern
        if (!formData.sessionType) {
            // Display a validation warning message if it's empty
            toast.warn('Please select a Session Type');
            return;
        }

        // Validate that the Sequence is not empty and matches the pattern
        if (!formData.sequence) {
            // Display a validation warning message if it's empty
            toast.warn('Sequence Name cannot be empty');
            return;
        }

        // check if the Sequence is valid
        if (!sessionNameRegex.test(formData.sequence)) {
            // Display a validation warning message if it doesn't match the pattern
            toast.warn('Sequence is invalid');
            return;
        }

        // Validate that the description is not empty and matches the pattern
        if (!formData.description) {
            // Display a validation warning message if it's empty
            toast.warn('Description cannot be empty');
            return;
        }

        // check if the description is valid
        if (!sessionNameRegex.test(formData.description)) {
            // Display a validation warning message if it doesn't match the pattern
            toast.warn('Description is invalid');
            return;
        }

        // Validate that the timeDuration is not empty and matches the pattern
        if (!formData.timeDuration) {
            // Display a validation warning message if it's empty
            toast.warn('Time Duration Name cannot be empty');
            return;
        }

        // check if the timDuration is valid
        if (!sessionNameRegex.test(formData.timeDuration)) {
            // Display a validation warning message if it doesn't match the pattern
            toast.warn('Time Duration is invalid');
            return;
        }
        // 2.) Hit the API;
        const newSession = await addSession(formData);

        //3.) Add to Course List
        if (newSession) {
            newSession.session = session.find(el => el.id === newSession.sessionId);
            setSession([...session, newSession]);
            clearFormData();
        }
    };

    const addSession = async formData => {
        try {
            const payload = { ...formData };
            delete payload.coreSessionCode;
            delete payload.electiveSessionCode;
            payload.sessionCode = formData.type === 'core' ? formData.coreSessionCode : formData.electiveSessionCode;
            payload.courseId = formData.courseId * 1;

            const { data } = await APIService.post(`/session`, payload);
            if (data.code === 201) toast.success('Session Added Successfully');
            clearFormData()
            return data.data;
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
                return false;
            }
            clearFormData()
            toast.error('Temporarily Unable to Add Session');
            return false;
        }
    };

    const clearFormData = () => {
        const selectFields = ['courseId', 'sessionType'];
        const clearedForm = {};
        for (const key in formData) {
            if (key.toLowerCase().includes('code') || selectFields.includes(key)) {
                clearedForm[key] = formData[key];
                continue;
            }
            clearedForm[key] = '';
        }
        setFormData(clearedForm);
        setOpenSection(null)
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
                                        <div className='w-full mr-4'>
                                            <select className="form-select" name="filterByType" onChange={filterSessions}>
                                                <option value={''}> Select Course Type</option>
                                                <option value={'core'}>Core</option>
                                                <option value={'elective'}>Elective</option>
                                            </select>
                                        </div>
                                        <div className='w-full mr-4'>
                                            <select className="form-select" name="filterByCourse" onChange={filterSessions}>
                                                <option value={''}>Select Course</option>
                                                {courses.map(course => {
                                                    return (
                                                        <option key={course.id} value={course.id}>
                                                            {course.courseName}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div className='w-full text-right'>
                                            <Button style='small' onClick={() => handleSectionToggle('core')}>Core Session</Button>
                                            <Button style='small' onClick={() => handleSectionToggle('elective')}>Elective Session</Button>
                                        </div>
                                    </div>
                                    <div className='card-content mt-4'>
                                        <div>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    onChange={filterSessions}
                                                    value={'Classroom'}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Classroom</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    onChange={filterSessions}
                                                    value={'Lab'}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Lab</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    onChange={filterSessions}
                                                    value={'Studio'}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Studio</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    onChange={filterSessions}
                                                    value={'field_visit'}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Field Visit</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    checked={filterOn}
                                                    value={'ALL'}
                                                    onChange={filterSessions}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">All</label>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <div className='bottom-card h-[580px]'>
                                    <div className='card-header'>Program Lists</div>
                                    <div className='overflow-auto' style={{ maxHeight: '600px' }}>
                                        <table id='sessionList' className='table '>
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
                </div >
            </div >
            {/* --------------------------------------ADD CORE SESSION---------------------------------------- */}
            {openSection === 'core' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Core Session</h3>
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
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="courseId">
                                            Select Course<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" onChange={onMutate} id="courseId">
                                            <option value={0}>---Select Course---</option>
                                            {courses
                                                .filter(el => el.type === 'core')
                                                .map(course => {
                                                    return (
                                                        <option key={course.id} value={course.id}>
                                                            {course.courseName}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="coreSessionCode">
                                            Session Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="coreSessionCode"
                                            name="coreSessionCode"
                                            className="form-disabled"
                                            placeholder='Session Code'
                                            value={formData.coreSessionCode}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="sessionName">
                                            Session Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="sessionName"
                                            name="sessionName"
                                            className="form-select"
                                            placeholder='Session Name'
                                            value={sessionName}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="sessionType">
                                            Session Type<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" onChange={onMutate} id="sessionType">
                                            <option>---Select Session Type---</option>
                                            {sessionType.map(item => {
                                                return (
                                                    <option key={item.toLowerCase()} value={item}>
                                                        {item}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="sequence">
                                            Seq#<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="sequence"
                                            name="sequence"
                                            className="form-select"
                                            placeholder='sequence'
                                            value={sequence}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="description">
                                            Description<sup className="important">*</sup>
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
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="timeDuration">
                                            Duration<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="timeDuration"
                                            name="timeDuration"
                                            className="form-select"
                                            placeholder='Duration'
                                            value={timeDuration}
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

            {/* --------------------------------------ADD ELECTIVE SESSION---------------------------------------- */}
            {openSection === 'elective' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Elective Session</h3>
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
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="courseId">
                                            Select Course<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" onChange={onMutate} id="courseId">
                                            <option value={0}>---Select Course---</option>
                                            {courses
                                                .filter(el => el.type === 'core')
                                                .map(course => {
                                                    return (
                                                        <option key={course.id} value={course.id}>
                                                            {course.courseName}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="electiveSessionCode">
                                            Session Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="electiveSessionCode"
                                            name="electiveSessionCode"
                                            className="form-disabled"
                                            placeholder='Session Code'
                                            value={formData.electiveSessionCode}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="sessionName">
                                            Session Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="sessionName"
                                            name="sessionName"
                                            className="form-select"
                                            placeholder='Session Name'
                                            value={sessionName}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="sessionType">
                                            Session Type<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" onChange={onMutate} id="sessionType">
                                            <option>---Select Session Type---</option>
                                            {sessionType.map(item => {
                                                return (
                                                    <option key={item.toLowerCase()} value={item}>
                                                        {item}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="sequence">
                                            Seq#<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="sequence"
                                            name="sequence"
                                            className="form-select"
                                            placeholder='sequence'
                                            value={sequence}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="description">
                                            Description<sup className="important">*</sup>
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
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="timeDuration">
                                            Duration<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="timeDuration"
                                            name="timeDuration"
                                            className="form-select"
                                            placeholder='Duration'
                                            value={timeDuration}
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

export default SessionManagement