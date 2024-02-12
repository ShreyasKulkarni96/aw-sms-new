import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import APIService from '../../services/APIService';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { useTable, useSortBy, usePagination } from 'react-table';
import { TOPICS } from '../../constants/api';
import { toast } from 'react-toastify';
import DeleteModal from '../../components/shared/DeleteModal';

const TopicManagement = () => {
    const [topics, setTopics] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const [editData, setEditData] = useState({});

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    useEffect(() => {
        fetchTopics();
    }, []);


    const fetchTopics = async () => {
        try {
            const { data } = await APIService.get(TOPICS);
            setTopics(data.data);
        } catch (error) {
            toast.error('Some Error occurred while fetching topics');
        }
    };

    const tableHeader = [
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
                    <button onClick={() => handleEdit(row.original)}>
                        <BorderColorRoundedIcon className='icon-style mr-2' />
                    </button>
                    <button onClick={() => handleDeleteConfirmation(row.original.id)}>
                        <DeleteRoundedIcon className='icon-style' />
                    </button>
                </>
            )
        },
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
    } = useTable({ columns: tableColumn, data: topics }, useSortBy, usePagination);

    const handleDeleteConfirmation = () => {
        setDeleteModalOpen(true);
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

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    }

    const handleEdit = (data) => {
        handleSectionToggle('editTopic');
        setEditData(data);
    }

    const handleCancelEdit = () => {
        handleSectionToggle(null);
    }

    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className='main-page-content'>
                    <TopHeader />
                    <main className="main">
                        <div className="main-grid">
                            <div className="page-content">

                                {/*--------------------------------------------TOP CARD-----------------------------------------------*/}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Topic</div>
                                        <div>
                                            <Button style='small' onClick={() => handleSectionToggle('core')}>Core Topic</Button>
                                            <Button style='small' onClick={() => handleSectionToggle('elective')}>Elective Topic</Button>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select
                                                    className='form-select'
                                                    name="courseType"
                                                    id="courseType"
                                                >
                                                    <option value=''>
                                                        Select Core Type
                                                    </option>

                                                    <option value=''>
                                                        Core
                                                    </option>

                                                    <option value=''>
                                                        Elective
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select
                                                    className='form-select'
                                                    name="courseName"
                                                    id="courseName"
                                                >
                                                    <option value=''>
                                                        Select Program Type
                                                    </option>

                                                    <option value=''>
                                                        Diploma in Sound Engineering
                                                    </option>

                                                    <option value=''>
                                                        Live Sound Elective
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select
                                                    className='form-select'
                                                    name="version"
                                                    id="version"
                                                >
                                                    <option value=''>
                                                        Select Version
                                                    </option>

                                                    <option value=''>
                                                        Core
                                                    </option>

                                                    <option value=''>
                                                        Elective
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select
                                                    className='form-select'
                                                    name="session"
                                                    id="session"
                                                >
                                                    <option value=''>
                                                        Select Session
                                                    </option>

                                                    <option value=''>
                                                        Diploma in Sound Engineering
                                                    </option>

                                                    <option value=''>
                                                        Live Sound Elective
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* --------------------------------------BOTTOM CARD--------------------------------------------- */}
                                <div className='bottom-card h-[620px]'>
                                    <div className='card-header '>List of Students</div>
                                    <div className='overflow-auto' style={{ maxHeight: '550px' }}>
                                        <table id="topicList" className="table">
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
                                            <tbody  {...getTableBodyProps()}>
                                                {page.map((row) => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()} key={row.id}>
                                                            {row.cells.map((cell) => (
                                                                <td {...cell.getCellProps()} className="td">
                                                                    {cell.render('Cell')}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* ---------------------------------PAGINATION----------------------------- */}
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
                                    <button onClick={() => handleCancelEdit()} className="edit-cancel-button">
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
                                            value={editData.topicName}
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
                                            value={editData.description}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small">Save</Button>
                                <Button style="cancel" onClick={() => handleCancelEdit()}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>}

            {/* ----------------------------------ADD CORE / ELECTIVE TOPIC MODAL----------------------------------- */}
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
                                    <button className="edit-cancel-button">
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
                                        <select className="form-select" onChange={onMutate} id="courseId">
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
                                            className="form-select"
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
                                            value={topicName}
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
                                            value={description}
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
                                <Button style="small">Save</Button>
                                <Button style="cancel">Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>}

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
                                    <button className="edit-cancel-button">
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
                                        <label className="form-input" htmlFor="selectCourse">
                                            Select Course<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="selectCourse"
                                            name="selectCourse"
                                            className="form-select"
                                            placeholder='Select Course'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="topicCode">
                                            Topic Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="topicCode"
                                            name="topicCode"
                                            className="form-select"
                                            placeholder='Topic Code'
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
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="session">
                                            Session<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="session"
                                            name="session"
                                            className="form-select"
                                            placeholder='Session'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small">Save</Button>
                                <Button style="cancel">Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>}

            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default TopicManagement