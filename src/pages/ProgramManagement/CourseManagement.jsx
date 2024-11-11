import React, { useEffect, useState, useMemo } from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import APIService from '../../services/APIService';
import DeleteModal from '../../shared/DeleteModal';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { COURSE } from '../../constants/api';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import TableComponent from '../../components/TableComponent';

const courseDetails = {
    programId: 0,
    coreCourseCode: 'CRS/****/CR/V1.0',
    electiveCourseCode: 'CRS/****/EL/V1.0',
    courseName: '',
    type: '',
    description: '',
    courseCode: ''
};

const CourseManagement = () => {
    const params = useParams();
    const [courses, setCourses] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [courseId, setCourseId] = useState(null);
    const [openSection, setOpenSection] = useState(null);
    const [courseTypeFilter, setCourseTypeFilter] = useState('ALL');
    const [programFilter, setProgramFilter] = useState('');
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState(courseDetails);

    const courseNameRegex = /^[A-Za-z0-9\s\-.]+$/;

    useEffect(() => {
        fetchCourses();
        fetchPrograms();
    }, []);

    const { courseCode, courseName, type, description, coreCourseCode, electiveCourseCode } = formData

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const generateRandomCode = (length = 3) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const generateCourseCode = (type = 'CR') => {
        const randomCode = generateRandomCode();
        return `${randomCode}/${type}/V1.0`;
    };


    const columns = React.useMemo(
        () => [
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
        ], []
    );

    const handleCourseTypeChange = (e) => {
        setCourseTypeFilter(e.target.value);
    };

    const handleProgramChange = (e) => {
        setProgramFilter(e.target.value);
    };

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesType = courseTypeFilter === 'ALL' || course.type === courseTypeFilter;
            const matchesProgram = !programFilter || course.program.programName === programs.find(p => p.id === parseInt(programFilter))?.programName;
            return matchesType && matchesProgram;
        });
    }, [courseTypeFilter, programFilter, courses]);

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

    const handleDeleteConfirmation = (id) => {
        setCourseId(id);
        setDeleteModalOpen(true)
    }

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
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

    const handleEdit = async (id) => {
        try {
            const { data } = await APIService.get(`${COURSE}/${id}`);
            console.log(data.data)
            setFormData({
                ...data.data,
            });
            setOpenSection('editCourse');
            setCourseId(id);
        } catch (error) {
            toast.error('Unable to fetch Course details');
        }
    };

    const clearFormData = () => {
        setOpenSection(null);
        setFormData(courseDetails);
    }

    const handleCourseUpdate = async () => {
        if (!formData.courseName || !courseNameRegex.test(formData.courseName)) {
            toast.warn('Course Name is invalid or empty');
            return;
        }

        if (!formData.description || !courseNameRegex.test(formData.description)) {
            toast.warn('Description is invalid or empty');
            return;
        }

        try {
            const payload = { ...formData };
            delete payload.coreCourseCode;
            delete payload.electiveCourseCode;

            const { data } = await APIService.patch(`${COURSE}/${courseId}`, payload);

            if (data.code === 200) {
                toast.success('Program Updated Successfully');
                await fetchCourses();  // Refresh course list
            }
            clearFormData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update Courses');
        }
    }

    const onMutate = e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async courseType => {
        formData.type = courseType;

        const courseCode = generateCourseCode(courseType === 'core' ? 'CR' : 'EL');

        // Validate that the programName is not empty
        if (!formData.programId) {
            toast.warn('Please select a Program');
            return;
        }
        // Validate that the courseName is not empty and matches the pattern
        if (!formData.courseName) {
            toast.warn('Course Name cannot be empty');
            return;
        }

        //Check if the courseName is valid
        if (!courseNameRegex.test(formData.courseName)) {
            toast.warn('Course Name is invalid');
            return;
        }

        // Validate that the description is not empty and matches the pattern
        if (!formData.description) {
            toast.warn('Description cannot be empty');
            return;
        }

        //Check if the description is valid
        if (!courseNameRegex.test(formData.description)) {
            toast.warn('Description is invalid');
            return;
        }

        formData.courseCode = courseCode;

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
            payload.programId = formData.programId * 1;

            const { data } = await APIService.post(`${COURSE}`, payload);
            if (data.code === 201) toast.success('Course Added Successfully');
            clearFormData();
            return data.data;
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
                return false;
            }
            toast.error('Temporarily Unable to Add Course');
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
                                        <div className='card-header'>Courses</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className=' w-full'>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value="core"
                                                    checked={courseTypeFilter === 'core'}
                                                    onChange={handleCourseTypeChange}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Core</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value="elective"
                                                    checked={courseTypeFilter === 'elective'}
                                                    onChange={handleCourseTypeChange}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Elective</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value="ALL"
                                                    checked={courseTypeFilter === 'ALL'}
                                                    onChange={handleCourseTypeChange}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">All</label>
                                            </label>
                                        </div>
                                        <div className='w-full mb-2'>
                                            <select className="form-select" name="filterByProgram" onChange={handleProgramChange} value={programFilter}>
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
                                            <Button style='small' onClick={() => handleSectionToggle('core')} > Add Core Course</Button>
                                            <Button style='small' onClick={() => handleSectionToggle('elective')}>Add Elective Course</Button>
                                        </div>
                                    </div>
                                </div>
                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <TableComponent columns={columns} data={filteredCourses} tableName="Course Lists" isButton={false} height="650px" />
                            </div>
                        </div>
                    </main>
                </div >
            </div >
            {/* --------------------------------------ADD CORE COURSE---------------------------------------- */}
            {
                openSection === 'core' &&
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
                                            Select Course<sup className="important">*</sup>
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
                                        <label className="form-input" htmlFor="courseCode">
                                            Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="courseCode"
                                            name="courseCode"
                                            className="form-disabled"
                                            placeholder='Course Code'
                                            value={coreCourseCode}
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
            {/* --------------------------------------ADD ELECTIVE COURSE---------------------------------------- */}
            {
                openSection === 'elective' &&
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
                                            Select Course<sup className="important">*</sup>
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
                                        <label className="form-input" htmlFor="courseCode">
                                            Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="courseCode"
                                            name="courseCode"
                                            className="form-disabled"
                                            placeholder='Course Code'
                                            value={coreCourseCode}
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
                                <Button style="small" onClick={() => onSubmit('elective')}>Save</Button>
                                <Button style="cancel" onClick={clearFormData} >Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* --------------------------------EDIT COURSE----------------------------- */}
            {
                openSection === 'editCourse' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Edit Course</h3>
                                    <button onClick={clearFormData} className="edit-cancel-button"
                                    >
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
                                        <label className="form-input" htmlFor="courseCode">
                                            Course Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="courseCode"
                                            name="courseCode"
                                            className="form-disabled"
                                            placeholder='Course Code'
                                            value={courseCode}
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
                                            onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="type">
                                            Type<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="type"
                                            name="type"
                                            className="form-select"
                                            placeholder='Type'
                                            value={type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                                            value={description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={handleCourseUpdate}>Save</Button>
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

export default CourseManagement;