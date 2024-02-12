import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import APIService from '../../services/APIService';
import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteModal from '../../components/shared/DeleteModal';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const FacultyExperience = () => {
    const params = useParams();
    const [faculty, setFaculty] = useState({});
    const [facultyExp, setFacultyExp] = useState([]);
    const [addFacultyModalOpen, setAddFacultyModalOpen] = useState(false);
    const initialData = {
        designation: '',
        employer: '',
        from: '',
        to: '',
        area: '',
        skills: ''
    }
    const [formData, setFormData] = useState(initialData);

    const { designation, employer, from, to, area, skills } = formData;

    useEffect(() => {
        // do an API call
        fetchExperience();
        // eslint-disable-next-line
    }, []);

    const fetchExperience = async () => {
        try {
            const { data } = await APIService.get(`/faculty-experience/${params.facultyId}`);
            setFaculty(data.data);
            setFacultyExp(data.data.careerDetails);
            // setIsLoading(false);
        } catch (error) {
            console.log(error);
            // setIsLoading(false);
            toast.error('Some Error occurred while fetching experience');
        }
    };

    const onMutate = e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async () => {
        // 1.) Add validations on data @Nikhil
        // console.log(formData);

        // 2.) Hit the API
        const newExp = await addExperience();
        clearFormData();

        //3.) Add to FacultyExp List
        setFacultyExp(newExp);
    };

    const addExperience = async () => {
        try {
            const payload = [{ ...formData }];
            const { data } = await APIService.post(`/faculty-experience/${params.facultyId}`, payload);
            if (data.code === 200) toast.success('Experience Added Successfully');
            // setIsLoading(false);
            return data.data.careerDetails;
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            // setIsLoading(false);
            toast.error('Temporarily Unable to Experience');
        }
    };

    const clearFormData = () => {
        setFormData(initialData);
    };

    const tableHeader = [
        { Header: 'Serial No', accessor: 'serialNo' },
        { Header: 'Designation', accessor: 'designation' },
        { Header: 'Employer', accessor: 'employer' },
        { Header: 'From', accessor: 'from' },
        { Header: 'To', accessor: 'to' },
        { Header: 'Area', accessor: 'area' },
        { Header: 'Skills', accessor: 'skills' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <buton className="mr-2"><BorderColorRoundedIcon className='icon-style' /></buton>
                    <button onClick={() => handleConfirmation(row.original.id)}><DeleteRoundedIcon className='icon-style' /></button>
                </>
            )
        }
    ]

    const tableColumn = useMemo(() => tableHeader, []);

    const facultyExperience = useMemo(() => {
        return facultyExp.map((faculty, index) => ({
            ...faculty,
            serialNo: index + 1
        }))
    }, [facultyExp]);

    const {
        headerGroups,
        getTableBodyProps,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        previousPage,
        nextPage,
        setPageSize,
        state: { pageIndex, pageSize } } = useTable({ columns: tableColumn, data: facultyExperience, initialState: { pageSize: 10 } }, useSortBy, usePagination);

    const handleAddExperienceModal = () => {
        setAddFacultyModalOpen(true);
    }


    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className="main-page-content">
                    <TopHeader />
                    <main className='main'>
                        <div className='grid'>
                            <div className='page-content'>
                                {/* ---------------------TOP CARD-------------------------- */}
                                <div className='top-card '>
                                    <div className='card-content'>
                                        <Link to="/faculty-management">
                                            <Button style='small'><KeyboardBackspaceRoundedIcon className='icons mr-1' />Back</Button>
                                        </Link>
                                        <div className='mt-2 bg-gray-300 rounded-full'>
                                            <span className='card-header'>Experience details of: </span>
                                            <b className='text-xl font-bold p-4'>
                                                {faculty.gender === 'M' ? 'Mr.' : 'Ms.'} {params.facultyName}
                                            </b>
                                        </div>
                                        <Button style='small' onClick={handleAddExperienceModal}>Add Experience</Button>
                                    </div>
                                </div>

                                {/* ------------------------BOTTOM CARD--------------------- */}
                                <div className='bottom-card h-[700px] '>
                                    <div className='card-header'>Experiences</div>
                                    <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                        <table id="experienceList" className="table">
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
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {/* -------------------------------------ADD FACULTY MODAL------------------------- */}
            {addFacultyModalOpen &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Faculty Experience</h3>
                                    <button onClick={() => setAddFacultyModalOpen(false)} className="edit-cancel-button">
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
                                        <label className="form-input" htmlFor="designation">
                                            Designation<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="designation"
                                            name="designation"
                                            className="form-select"
                                            placeholder='Designation'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="employer">
                                            Employer<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="employer"
                                            name="employer"
                                            className="form-select"
                                            placeholder='Employer'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="from">
                                            From<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="from"
                                            name="from"
                                            className="form-select"
                                            placeholder='From'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="to">
                                            To<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="to"
                                            name="to"
                                            className="form-select"
                                            placeholder='To'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="area">
                                            Area<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="area"
                                            name="area"
                                            className="form-select"
                                            placeholder='Area'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="skills">
                                            Skills<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="skills"
                                            name="skills"
                                            className="form-select"
                                            placeholder='Skills'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" >Save</Button>
                                <Button style="cancel" onClick={() => setAddFacultyModalOpen(false)}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* -------------------------------------EDIT FACULTY MODAL------------------------- */}
            {/* {addFacultyModalOpen &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Faculty Experience</h3>
                                    <button onClick={() => setAddFacultyModalOpen(false)} className="edit-cancel-button">
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
                                        <label className="form-input" htmlFor="designation">
                                            Designation<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="designation"
                                            name="designation"
                                            className="form-select"
                                            placeholder='Designation'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="employer">
                                            Employer<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="employer"
                                            name="employer"
                                            className="form-select"
                                            placeholder='Employer'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="from">
                                            From<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="from"
                                            name="from"
                                            className="form-select"
                                            placeholder='From'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="to">
                                            To<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="to"
                                            name="to"
                                            className="form-select"
                                            placeholder='To'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="area">
                                            Area<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="area"
                                            name="area"
                                            className="form-select"
                                            placeholder='Area'
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-3'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="skills">
                                            Skills<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="skills"
                                            name="skills"
                                            className="form-select"
                                            placeholder='Skills'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style="small" >Save</Button>
                                <Button style="cancel" onClick={() => setAddFacultyModalOpen(false)}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            } */}

            {/* <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} /> */}
        </>
    )
}

export default FacultyExperience;