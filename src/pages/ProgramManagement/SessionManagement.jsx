import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import TableComponent from '../../components/TableComponent';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import APIService from '../../services/APIService';
import DeleteModal from '../../shared/DeleteModal';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { SESSION } from '../../constants/api';


const sessionDetails = {
    courseId: 0,
    coreSessionCode: 'CRS/****/CR/SES/***/V1.0',
    electiveSessionCode: 'CRS/****/EL/SES/***/V1.0',
    sessionName: '',
    description: '',
    sequence: '',
    timeDuration: '',
    type: ''
};

const SessionManagement = () => {
    const params = useParams();
    const [sessions, setSession] = useState([]);
    const [sessionTypeFilter, setSessionTypeFilter] = useState('ALL');
    const [selectedCourseType, setSelectedCourseType] = useState('')
    const [courses, setCourses] = useState([]);
    const [openSection, setOpenSection] = useState(null);
    const [sessionId, setSessionId] = useState();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState(sessionDetails);
    const [selectedCourseId, setSelectedCourseId] = useState('');


    const sessionNameRegex = /^[A-Za-z0-9\s\-.]+$/;
    const type = ['classroom', 'studio', 'lab', 'field visit'];

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const filteredCourses = selectedCourseType
        ? courses.filter(course => course.type === selectedCourseType)
        : courses;

    const filteredSessions = sessions.filter(session => {
        const matchesCourse = selectedCourseId ? session.courseId === parseInt(selectedCourseId) : true;
        const matchesType = sessionTypeFilter !== 'ALL' ? session.type === sessionTypeFilter : true;
        return matchesCourse && matchesType;
    });

    const handleCourseTypeChange = (e) => {
        setSelectedCourseType(e.target.value);
    };

    const handleCourseChange = (e) => {
        setSelectedCourseId(e.target.value);
    };

    const handleSessionTypeChange = (e) => {
        setSessionTypeFilter(e.target.value);
    };

    useEffect(() => {
        // do an API call
        fetchCourses();
        fetchSession();
    }, []);

    const generateRandomCode = (length = 3) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const generateSessionCode = (type = 'CR') => {
        const randomCode = generateRandomCode();
        return `CRS/${randomCode}/${type}/SES/***/V1.0`;
    };

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
            const { data } = await APIService.get(url);
            setSession(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching session');
        }
    };

    const columns = React.useMemo(
        () => [
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
                        <button onClick={() => handleEdit(row.original.id)}>
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
        ], []
    );

    const handleDeleteConfirmation = (id) => {
        setSessionId(id);
        setDeleteModalOpen(true);
    }

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
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

    const clearFormData = () => {
        setFormData(sessionDetails)
        setOpenSection(null)
    };

    const handleEdit = async (id) => {
        try {
            const { data } = await APIService.get(`${SESSION}/${id}`);
            setFormData({
                ...data.data,
            });

            setOpenSection('editSession');
            setSessionId(id);
        } catch (error) {
            toast.error('Unable to fetch session details');
        }
    };

    const handleSessionUpdate = async () => {
        if (!formData.sessionName || !sessionNameRegex.test(formData.sessionName)) {
            toast.warn('Session Name is invalid or empty');
            return;
        }

        if (!formData.description || !sessionNameRegex.test(formData.description)) {
            toast.warn('Description is invalid or empty');
            return;
        }

        try {
            const payload = { ...formData };

            const { data } = await APIService.patch(`${SESSION}/${sessionId}`, payload);

            if (data.code === 200) {
                toast.success('Session Updated Successfully');
                await fetchSession();
            }
            clearFormData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update session');
        }
    };

    const onMutate = e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async type => {
        // 1.) Add validation

        const sessionCode = generateSessionCode(type === 'core' ? 'CR' : 'EL');

        // Check  that the Course is not empty
        if (!formData.courseId) {
            toast.warn('Please select a Course');
            return;
        }

        // Validate that the sessionName is not empty and matches the pattern
        if (!formData.sessionName) {
            toast.warn('Session Name cannot be empty');
            return;
        }

        // check if the sessionName is valid
        if (!sessionNameRegex.test(formData.sessionName)) {
            toast.warn('Session Name is invalid');
            return;
        }

        // Validate that the sessionType is not empty and matches the pattern
        if (!formData.type) {
            toast.warn('Please select a Session Type');
            return;
        }

        // Validate that the Sequence is not empty and matches the pattern
        if (!formData.sequence) {
            toast.warn('Sequence Name cannot be empty');
            return;
        }

        // check if the Sequence is valid
        if (!sessionNameRegex.test(formData.sequence)) {
            toast.warn('Sequence is invalid');
            return;
        }

        // Validate that the description is not empty and matches the pattern
        if (!formData.description) {
            toast.warn('Description cannot be empty');
            return;
        }

        // check if the description is valid
        if (!sessionNameRegex.test(formData.description)) {
            toast.warn('Description is invalid');
            return;
        }

        // Validate that the timeDuration is not empty and matches the pattern
        if (!formData.timeDuration) {
            toast.warn('Time Duration Name cannot be empty');
            return;
        }

        // check if the timDuration is valid
        if (!sessionNameRegex.test(formData.timeDuration)) {
            toast.warn('Time Duration is invalid');
            return;
        }

        formData.sessionCode = sessionCode;
        // 2.) Hit the API;
        const newSession = await addSession(formData);

        //3.) Add to Course List
        if (newSession) {
            newSession.session = sessions.find(el => el.id === newSession.sessionId);
            setSession([...sessions, newSession]);
            clearFormData();
        }
    };

    const addSession = async formData => {
        try {
            const payload = { ...formData };
            delete payload.coreSessionCode;
            delete payload.electiveSessionCode;

            const { data } = await APIService.post(SESSION, payload);

            if (data.code === 201) toast.success('Session Added Successfully');
            fetchSession();
            clearFormData();
            return data.data;

        } catch (error) {
            clearFormData();
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
                return false;
            }
            toast.error('Temporarily Unable to Add Session');
            return false;
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
                    <main>
                        <div className='main-grid'>
                            <div className='page-content'>
                                {/* ------------------------------TOP CARD----------------------------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Session</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className='w-full mr-4'>
                                            <select className="form-select" name="filterByType" onChange={handleCourseTypeChange}>
                                                <option value={''}> Select Course Type</option>
                                                <option value={'core'}>Core</option>
                                                <option value={'elective'}>Elective</option>
                                            </select>
                                        </div>
                                        <div className='w-full mr-4'>
                                            <select className="form-select" name="filterByCourse" onChange={handleCourseChange}>
                                                <option value={''}>Select Course</option>
                                                {filteredCourses.map(course => {
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
                                                    onChange={handleSessionTypeChange}
                                                    checked={sessionTypeFilter === 'classroom'}
                                                    value="classroom"
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Classroom</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    onChange={handleSessionTypeChange}
                                                    value="lab"
                                                    checked={sessionTypeFilter === 'lab'}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Lab</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    onChange={handleSessionTypeChange}
                                                    value="studio"
                                                    checked={sessionTypeFilter === "studio"}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Studio</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    onChange={handleSessionTypeChange}
                                                    value="field visit"
                                                    checked={sessionTypeFilter === "Field Visit"}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Field Visit</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    onChange={handleSessionTypeChange}
                                                    value="ALL"
                                                    checked={sessionTypeFilter === "ALL"}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">All</label>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <TableComponent columns={columns} data={filteredSessions} tableName="Sessions List" isButton={false} height="620px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
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
                                        <select className="form-select" id="courseId" onChange={onMutate}>
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
                                            value={formData.sessionName}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="type">
                                            Session Type<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" id="type" onChange={onMutate}>
                                            <option>---Select Session Type---</option>
                                            {type.map(item => {
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
                                            value={formData.sequence}
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
                                            value={formData.description}
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
                                            value={formData.timeDuration}
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
                                        <select className="form-select" id="courseId" onChange={onMutate}>
                                            <option value={0}>---Select Course---</option>
                                            {courses
                                                .filter(el => el.type === 'elective')
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
                                            value={formData.sessionName}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="type">
                                            Session Type<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" id="type" onChange={onMutate}>
                                            <option>---Select Session Type---</option>
                                            {type.map(item => {
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
                                            value={formData.sequence}
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
                                            value={formData.description}
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
                                            value={formData.timeDuration}
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
            {/* --------------------------------EDIT SESSION----------------------------- */}
            {
                openSection === 'editSession' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Update Session</h3>
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
                                        <select className="form-select" id="courseId" value={formData.courseId || 0} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}>
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
                                        <label className="form-input" htmlFor="sessionCode">
                                            Session Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="sessionCode"
                                            name="sessionCode"
                                            className="form-disabled"
                                            placeholder='Session Code'
                                            value={formData.sessionCode}
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
                                            value={formData.sessionName}
                                            onChange={(e) => setFormData({ ...formData, sessionName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="type">
                                            Session Type<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" id="type" value={formData.type || ''} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                            <option>---Select Session Type---</option>
                                            {type.map(item => {
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
                                            value={formData.sequence}
                                            onChange={(e) => setFormData({ ...formData, sequence: e.target.value })}
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
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                            value={formData.timeDuration}
                                            onChange={(e) => setFormData({ ...formData, timeDuration: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={handleSessionUpdate} >Save</Button>
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

export default SessionManagement;