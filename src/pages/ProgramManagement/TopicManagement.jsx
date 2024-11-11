import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import APIService from '../../services/APIService';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { TOPICS } from '../../constants/api';
import { toast } from 'react-toastify';
import DeleteModal from '../../shared/DeleteModal';
import TableComponent from '../../components/TableComponent';

const topicDetails = {
    courseId: 0,
    coreTopicCode: 'CRS/****/****/V1.0',
    electiveTopicCode: 'CRS/****/****/V1.0',
    topicName: '',
    type: '',
    description: '',
    topicCode: '',
    sessionIds: []
};

const TopicManagement = () => {
    const params = useParams();
    const [topics, setTopics] = useState([]);
    const [openSection, setOpenSection] = useState(null);
    const [topicId, setTopicId] = useState();
    const [formData, setFormData] = useState(topicDetails);
    const [courses, setCourses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCourseType, setSelectedCourseType] = React.useState('');
    const [selectedCourse, setSelectedCourse] = React.useState(0);
    const [selectedVersion, setSelectedVersion] = React.useState('');
    const [selectedSession, setSelectedSession] = React.useState('');

    const topicNameRegex = /^[A-Za-z0-9\s\-.]+$/;

    useEffect(() => {
        fetchCourses();
        fetchTopics();
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

    const generateTopicCode = (type = 'CR') => {
        const randomCode = generateRandomCode();
        return `CRS/${randomCode}/${type}/SES/***/V1.0`;
    };

    const fetchTopics = async () => {
        try {
            const sessionId = params.sessionId;
            let url = sessionId ? `/topic?sessionId=${sessionId}` : '/topic';
            const { data } = await APIService.get(url);
            setTopics(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching topics');
        }
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

    const fetchSession = async courseId => {
        try {
            let url = courseId ? `/session?courseId=${courseId}` : '/session';
            const { data } = await APIService.get(url);
            setSessions(data.data);
            // setIsLoading(false);
        } catch (error) {
            console.log(error);
            // setIsLoading(false);
            toast.error('Some Error occurred while fetching session');
        }
    };


    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    }

    const handleDelete = async () => {
        try {
            if (topicId) {
                await APIService.delete(`${TOPICS}/${topicId}`);
                await fetchTopics();
                toast.success('Topic deleted Successfully.')
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Topic';
            if (error.response && error.response.data) {
                return toast.error(errorMessage || error.response.data.message);
            }
            toast.error(errorMessage)
        }
        setDeleteModalOpen(false);
    }

    const columns = React.useMemo(
        () => [
            { Header: 'Serial No.', accessor: 'id' },
            { Header: 'Topic', accessor: 'topicName' },
            {
                Header: 'Version',
                accessor: 'version',
                Cell: () => "V2.0"
            },
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
            }
        ], []
    );

    const clearFormData = () => {
        setFormData(topicDetails);
        setOpenSection(null);
    }

    const handleEdit = async (id) => {
        try {
            const { data } = await APIService.get(`${TOPICS}/${id}`);
            setFormData({
                ...data.data,
            });

            setOpenSection('editTopic');
            setTopicId(id);
        } catch (error) {
            toast.error('Unable to fetch Topic details');
        }
    };

    const onMutate = async e => {
        if (e.target.id === 'courseId') {
            await fetchSession(e.target.value * 1);
            setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value * 1 }));
            return false;
        }

        var selectedValues = [];
        if (e.target.id === 'sessionIds') {
            var options = e.target.options;
            for (var i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    selectedValues.push(options[i].value * 1);
                }
            }
            setFormData(prevState => ({ ...prevState, [e.target.id]: selectedValues }));
            return false;
        }

        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async type => {

        formData.type = type;

        const topicCode = generateTopicCode(type === 'core' ? 'CR' : 'EL');

        if (!formData.courseId) {
            // Display a validation warning message if it's empty
            toast.warn('Please select a Course');
            return;
        }
        // Validate that the sessionName is not empty and matches the pattern
        if (!formData.topicName) {
            // Display a validation warning message if it's empty
            toast.warn('Topic Name cannot be empty');
            return;
        }

        // check if the topicName is valid
        if (!topicNameRegex.test(formData.topicName)) {
            toast.warn('Topic Name is invalid');
            return;
        }

        // Validate that the sessionName is not empty and matches the pattern
        if (!formData.description) {
            // Display a validation warning message if it's empty
            toast.warn('Description cannot be empty');
            return;
        }

        // check if the topicName is valid
        if (!topicNameRegex.test(formData.description)) {
            toast.warn('Description is invalid');
            return;
        }

        if (formData.sessionIds.length === 0) {
            // Display a validation warning message if no sessions are selected
            toast.warn('Please select at least one Session');
            return;
        }

        formData.topicCode = topicCode;

        // 2.) Hit the API;
        const newTopic = await addTopic(formData);

        //3.) Add to Course List
        if (newTopic) {
            newTopic.program = topics.find(el => el.id === newTopic.topicId);
            setTopics([...topics, newTopic]);
        }
        clearFormData();
    };

    const addTopic = async formData => {
        try {
            const payload = { ...formData };
            delete payload.coreTopicCode;
            delete payload.electiveTopicCode;

            const { data } = await APIService.post(`/topic`, payload);
            if (data.code === 201) toast.success('Topic Added Successfully');
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

    const handleTopicUpdate = async () => {
        if (!formData.topicName || !topicNameRegex.test(formData.topicName)) {
            toast.warn('Session Name is invalid or empty');
            return;
        }

        if (!formData.description || !topicNameRegex.test(formData.description)) {
            toast.warn('Description is invalid or empty');
            return;
        }

        try {
            const payload = { ...formData };

            const { data } = await APIService.patch(`${TOPICS}/${topicId}`, payload);

            if (data.code === 200) {
                toast.success('Topics Updated Successfully');
                await fetchTopics();
            }
            clearFormData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update topic');
        }
    };

    const filterTopics = (selectedCourseType, selectedCourse, selectedVersion, selectedSession) => {
        return topics.filter(topic => {
            const matchesCourseType = !selectedCourseType || topic.courseType === selectedCourseType;
            const matchesCourse = !selectedCourse || topic.courseId === selectedCourse;
            const matchesVersion = !selectedVersion || topic.versionId === selectedVersion;
            const matchesSession = !selectedSession || topic.sessionId === selectedSession;

            return matchesCourseType && matchesCourse && matchesVersion && matchesSession;
        });
    };

    const filteredTopics = filterTopics(selectedCourseType, selectedCourse, selectedVersion, selectedSession);


    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className='main-page-content'>
                    <TopHeader />
                    <main >
                        <div className="main-grid">
                            <div className="page-content">
                                {/*--------------------------------------------TOP CARD-----------------------------------------------*/}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Topic</div>
                                        <div>
                                            <Button style='small' onClick={() => handleSectionToggle('core')}>Core Topic</Button>
                                            <Button style='small' onClick={() => handleSectionToggle('elective')} >Elective Topic</Button>
                                        </div>
                                    </div>
                                    {/* <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select className='form-select' name="courseType" id="courseType" value={selectedCourseType}
                                                    onChange={(e) => setSelectedCourseType(e.target.value)}>
                                                    <option value={''}> Select Course Type</option>
                                                    <option value={'core'}>Core</option>
                                                    <option value={'elective'}>Elective</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select className="form-select" name="filterByCourse" value={selectedCourse}
                                                    onChange={(e) => setSelectedCourse(e.target.value)}>
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
                                        </div>

                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select className="form-select" name="filterBySession" value={selectedSession}
                                                    onChange={(e) => setSelectedSession(e.target.value)}>
                                                    <option value={''}>Select Session</option>
                                                    {sessions.map(course => {
                                                        return (
                                                            <option key={course.id} value={course.id}>
                                                                {course.courseName}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <TableComponent columns={columns} data={filteredTopics} tableName="Topics List" isButton={false} height="700px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {/* ----------------------------------ADD CORE TOPIC MODAL----------------------------------- */}
            {openSection === 'core' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Core Topics</h3>
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
                                        <label className="form-input" htmlFor="courseId">
                                            Select Course<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" id="courseId" onChange={onMutate}>
                                            <option value={0}>---Select Course---</option>
                                            {courses
                                                .filter(item => item.type === 'core')
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
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="coreTopicCode">
                                            Topic Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="coreTopicCode"
                                            name="coreTopicCode"
                                            className="form-disabled"
                                            placeholder='Topic Code'
                                            value={formData.coreTopicCode}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="topicName">
                                            Topic Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="topicName"
                                            name="topicName"
                                            className="form-select"
                                            placeholder='Topic Name'
                                            value={formData.topicName}
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
                                            placeholder='Description'
                                            value={formData.description}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="sessionIds">
                                            Session<sup className="important">*</sup>
                                        </label>
                                        <select
                                            className="form-select"
                                            multiple
                                            data-live-search="true"
                                            onChange={onMutate}
                                            id="sessionIds"
                                        >
                                            {sessions.map(session => {
                                                return (
                                                    <option key={session.id} value={session.id}>
                                                        {session.sessionName}
                                                    </option>
                                                );
                                            })}
                                        </select>
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
            {/* ----------------------------------ADD CORE TOPIC MODAL----------------------------------- */}
            {openSection === 'elective' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Elective Topics</h3>
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
                                        <label className="form-input" htmlFor="courseId">
                                            Select Course<sup className="important">*</sup>
                                        </label>
                                        <select className="form-select" id="courseId">
                                            <option value={0}>---Select Course---</option>
                                            {courses
                                                .filter(item => item.type === 'elective')
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
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="electiveTopicCode">
                                            Topic Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="electiveTopicCode"
                                            name="electiveTopicCode"
                                            className="form-disabled"
                                            placeholder='Topic Code'
                                            value={formData.electiveTopicCode}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="topicName">
                                            Topic Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="topicName"
                                            name="topicName"
                                            className="form-select"
                                            placeholder='Topic Name'
                                            value={formData.topicName}
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
                                            placeholder='Description'
                                            value={formData.description}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="sessionIds">
                                            Session<sup className="important">*</sup>
                                        </label>
                                        <select
                                            className="form-select"
                                            multiple
                                            data-live-search="true"
                                            onChange={onMutate}
                                            id="sessionIds"
                                        >
                                            {sessions.map(session => {
                                                return (
                                                    <option key={session.id} value={session.id}>
                                                        {session.sessionName}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={() => onSubmit('elective')} >Save</Button>
                                <Button style="cancel" onClick={clearFormData} >Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* ----------------------------------EDIT TOPIC MODAL------------------------------- */}
            {openSection === "editTopic" &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Edit Topics</h3>
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
                                        <label className="form-input" htmlFor="topicName">
                                            Topic Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="topicName"
                                            name="topicName"
                                            className="form-select"
                                            placeholder='Topic Name'
                                            value={formData.topicName}
                                            onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={handleTopicUpdate}>Save</Button>
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

export default TopicManagement;