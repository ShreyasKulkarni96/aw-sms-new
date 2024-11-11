import React, { useEffect, useState, useMemo } from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import APIService from '../../services/APIService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteModal from '../../shared/DeleteModal';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { PROGRAMS } from '../../constants/api';
import TableComponent from '../../components/TableComponent';

const programDetails = {
    coreProgramCode: '***/CR/V1.0',
    electiveProgramCode: '***/EL/V1.0',
    programName: '',
    type: '',
    details: ''
};


const ProgramManagement = () => {
    const [filterOn, setFilterOn] = useState(true);
    const [allPrograms, setAllPrograms] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [programId, setProgramId] = useState(null);
    const [openSection, setOpenSection] = useState(null);
    const [formData, setFormData] = useState(programDetails);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const programNameRegex = /^[A-Za-z0-9\s\-.]+$/;
    const { coreProgramCode, electiveProgramCode, programName, details } = formData;

    const generateRandomCode = (length = 3) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const generateProgramCode = (type = 'CR') => {
        const randomCode = generateRandomCode();
        return `${randomCode}/${type}/V1.0`;
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const { data } = await APIService.get(PROGRAMS);
            setPrograms(data.data);
            setAllPrograms(data.data)
        } catch (error) {
            toast.error('Some Error occurred while fetching programs');
        }
    };

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const columns = React.useMemo(
        () => [
            { Header: 'Serial.No', accessor: 'id' },
            { Header: 'Code', accessor: 'programCode' },
            { Header: 'Name', accessor: 'programName' },
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
                Header: 'Show Courses',
                accessor: 'showCourses',
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

    const clearFormData = () => {
        setOpenSection(null);
        setFormData(programDetails);
    }

    const onMutate = e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async programType => {
        // 1.) validations
        formData.type = programType;

        const programCode = generateProgramCode(programType === 'core' ? 'CR' : 'EL');

        // Validate that the topicName is not empty and matches the pattern
        if (!formData.programName) {
            toast.warn('Program Name cannot be empty');
            return;
        }

        // check if the programName is valid
        if (!programNameRegex.test(formData.programName)) {
            toast.warn('Program Name is invalid');
            return;
        }

        // Validate that the Details is not empty and matches the pattern
        if (!formData.details) {
            toast.warn('Details  cannot be empty');
            return;
        }

        // check if the Details is valid
        if (!programNameRegex.test(formData.details)) {
            toast.warn('Details  is invalid');
            return;
        }

        // 2.) Hit the API;
        const newProgram = await addProgram(formData);

        formData.type = programType;
        formData.programCode = programCode;

        //3.) Add to Course List
        if (newProgram) {
            newProgram.program = programs.find(el => el.id === newProgram.programId);
            setPrograms([...programs, newProgram]);
        }
        clearFormData();
    };

    const handleDelete = async () => {
        try {
            if (programId) {
                await APIService.delete(`${PROGRAMS}/${programId}`);
                await fetchPrograms();
                setDeleteModalOpen(false);
                toast.success('Program deleted successfully');
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Program';
            if (error.response && error.response.data) {
                return toast.error(errorMessage || error.response.data.message);
            }
            toast.error(errorMessage)
        }
        setDeleteModalOpen(false);
    }

    const handleCancelDelete = () => {
        setFormData(programDetails);
        setDeleteModalOpen(false);
    }

    const handleDeleteConfirmation = (id) => {
        setProgramId(id);
        setDeleteModalOpen(true)
    }

    const addProgram = async formData => {
        try {
            const payload = { ...formData };
            delete payload.coreProgramCode;
            delete payload.electiveProgramCode;

            const { data } = await APIService.post(PROGRAMS, payload);

            if (data.code === 201) toast.success('Program Added Successfully');
            clearFormData();
            return data.data;

        } catch (error) {
            clearFormData();
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
                return false;
            }
            toast.error('Temporarily Unable to Add Program');
            return false;
        }
    };

    const filterPrograms = (e) => {
        const filterType = e.target.value;

        if (filterType === 'ALL') {
            setFilterOn(true);
            setPrograms(allPrograms);
        } else {
            setFilterOn(false);
            const filteredPrograms = allPrograms.filter(item => item.type === filterType);
            setPrograms(filteredPrograms);
        }
    };

    const handleEdit = async (id) => {
        try {
            const { data } = await APIService.get(`${PROGRAMS}/${id}`);
            setFormData({
                ...data.data,
            });

            setOpenSection('editProgram');
            setProgramId(id);
        } catch (error) {
            toast.error('Unable to fetch program details');
        }
    };


    const handleProgramUpdate = async () => {
        if (!formData.programName || !programNameRegex.test(formData.programName)) {
            toast.warn('Program Name is invalid or empty');
            return;
        }

        if (!formData.details || !programNameRegex.test(formData.details)) {
            toast.warn('Details are invalid or empty');
            return;
        }

        try {
            const payload = { ...formData };

            const { data } = await APIService.patch(`${PROGRAMS}/${programId}`, payload);

            if (data.code === 200) {
                toast.success('Program Updated Successfully');
                await fetchPrograms();  // Refresh programs list
            }
            clearFormData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update program');
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
                                        <div className='card-header'>Programs</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className='mt-2'>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value={'core'}
                                                    onChange={filterPrograms}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Core</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value={'elective'}
                                                    onChange={filterPrograms}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Elective</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value={'ALL'}
                                                    onChange={filterPrograms}
                                                    checked={filterOn}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">All</label>
                                            </label>
                                        </div>
                                        <div>
                                            <Button style='small' onClick={() => handleSectionToggle('core')}>Core Program</Button>
                                            <Button style='small' onClick={() => handleSectionToggle('elective')}>Elective Program</Button>
                                        </div>
                                    </div>
                                </div>
                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <TableComponent columns={columns} data={programs} tableName="Program Lists" isButton={false} height="630px" />
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
                                    <h3 className="modal-title">Add Core Program</h3>
                                    <Button onClick={clearFormData} className="edit-cancel-button">
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
                                    </Button>
                                </div>
                            </div>
                            <div className="modal-section">
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="code">
                                            Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            className="form-disabled"
                                            placeholder='Program Code'
                                            value={coreProgramCode}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="programName">
                                            Program Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="programName"
                                            name="programName"
                                            className="form-select"
                                            placeholder='Program Name'
                                            value={programName}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="details">
                                            Program Details<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="details"
                                            name="details"
                                            className="form-select"
                                            placeholder='Program Details'
                                            value={details}
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
            {/* --------------------------------------ADD ELECTIVE PROGRAM---------------------------------------- */}
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
                                    <h3 className="modal-title">Add Elective Program</h3>
                                    <button
                                        onClick={clearFormData}
                                        className="edit-cancel-button">
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
                                        <label className="form-input" htmlFor="code">
                                            Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            className="form-disabled"
                                            placeholder='Program Code'
                                            value={electiveProgramCode}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="programName">
                                            Program Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="programName"
                                            name="programName"
                                            className="form-select"
                                            placeholder='Program Name'
                                            value={programName}
                                            onChange={onMutate}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="details">
                                            Program Details<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="details"
                                            name="details"
                                            className="form-select"
                                            placeholder='Program Details'
                                            value={details}
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
            {/* --------------------------------EDIT PROGRAM----------------------------- */}
            {openSection === 'editProgram' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Edit Program</h3>
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
                                        <label className="form-input" htmlFor="code">
                                            Program Code<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            className="form-disabled"
                                            placeholder='Program Code'
                                            value={formData.programCode}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="programName">
                                            Program Name<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="programName"
                                            name="programName"
                                            className="form-select"
                                            placeholder='Program Name'
                                            value={formData.programName}
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
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="details">
                                            Details<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="details"
                                            name="details"
                                            className="form-select"
                                            placeholder='Details'
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" onClick={handleProgramUpdate}>Save</Button>
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

export default ProgramManagement;