import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import DeleteModal from '../../shared/DeleteModal';
import APIService from '../../services/APIService';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import FormatIndentIncreaseRoundedIcon from '@mui/icons-material/FormatIndentIncreaseRounded';
import TableComponent from '../../components/TableComponent';
import { FACULTY } from '../../constants/api';

const FacultyManagement = () => {
    const [faculties, setFaculties] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [facultyId, setFacultyId] = useState('');
    const [facultyTypeFilter, setFacultyTypeFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        try {
            const { data } = await APIService.get(FACULTY);
            setFaculties(data.data);
        } catch (error) {
            toast.error('Some Error occurred while fetching faculties');
        }
    }

    const handleDelete = async () => {
        try {
            if (facultyId) {
                await APIService.delete(`${FACULTY}/${facultyId}`);
                await fetchFaculties();
                toast.success('Faculty deleted successfully')
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Faculty';
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

    const handleConfirmation = (id) => {
        setFacultyId(id);
        setDeleteModalOpen(true);
    }

    const filteredFaculties = useMemo(() => {
        return faculties.filter(faculty => {
            const matchesFacultyType = facultyTypeFilter ? faculty.facultyType.toLowerCase().includes(facultyTypeFilter.toLowerCase()) : true;
            const matchesAvailability = availabilityFilter ? faculty.availability.toLowerCase().includes(availabilityFilter.toLowerCase()) : true;
            return matchesFacultyType && matchesAvailability;
        });
    }, [faculties, facultyTypeFilter, availabilityFilter]);

    const columns = React.useMemo(
        () => [
            { Header: 'Serial No', accessor: 'serialNo' },
            { Header: 'FID', accessor: 'facultyId' },
            { Header: 'Faculty Name', accessor: 'facultyName' },
            {
                Header: 'Expertise', accessor: 'expertise',
                Cell: ({ row }) => (
                    <Link className='text-blue underline' to={{ pathname: `/faculty-experience/${row.original.facultyId}/${row.original.facultyName}` }}>
                        <FormatIndentIncreaseRoundedIcon style={{ fontSize: '18px' }} /> Show Details
                    </Link>
                )
            },
            { Header: 'Phone 1', accessor: 'phone1' },
            { Header: 'Type', accessor: 'facultyType' },
            { Header: 'Availability', accessor: 'availability' },
            { Header: 'Rem. Plan', accessor: 'remunerationPlan' },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <>
                        <Link to={{ pathname: `/edit-faculty/${row.original.facultyId}` }}>
                            <button className="mr-2"><BorderColorRoundedIcon className='icon-style' /></button>
                        </Link>
                        <button onClick={() => handleConfirmation(row.original.id)}><DeleteRoundedIcon className='icon-style' /></button>
                    </>
                )
            }
        ], []
    );

    const facultiesWithSerialNo = useMemo(() => {
        return filteredFaculties.map((faculty, index) => ({
            ...faculty,
            serialNo: index + 1,
            facultyId: faculty?.facultyId,
            facultyName: faculty?.facultyName?.toLowerCase(),
            expertise: faculty?.expertise?.toLowerCase(),
            phone1: faculty?.phone1,
            facultyType: faculty?.facultyType?.toLowerCase(),
            availability: faculty?.availability?.toLowerCase(),
            remunerationPlan: faculty?.remunerationPlan?.toLowerCase(),
            action: faculty?.action,
        }));
    }, [faculties, filteredFaculties]);

    const handleFacultyTypeChange = (event) => {
        setFacultyTypeFilter(event.target.value);
    }

    const handleAvailabilityChange = (event) => {
        setAvailabilityFilter(event.target.value);
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
                                {/*-----------------------------------------------TOP CARD--------------------------------------------*/}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Faculty Management</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="facultyType">
                                                    Faculty Type
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="facultyType"
                                                    id="facultyType"
                                                    value={facultyTypeFilter}
                                                    onChange={handleFacultyTypeChange}
                                                >
                                                    <option value=''>
                                                        Select Faculty Type
                                                    </option>
                                                    <option value="EMPLOYEE">Employee</option>
                                                    <option value="PROFESSIONAL">Professional</option>
                                                    <option value="AMATEUR">Amateur</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="availability">
                                                    Faculty Availability
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="availability"
                                                    id="availability"
                                                    value={availabilityFilter}
                                                    onChange={handleAvailabilityChange}
                                                >
                                                    <option value=''>
                                                        Select availability
                                                    </option>
                                                    <option value="General">General</option>
                                                    <option value="Rare Sessions">Rare Session</option>
                                                    <option value="Regular Sessions">Regular Session</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full mt-6 text-right">
                                            <Link to='/add-faculty'>
                                                <Button style="small">Add New Faculty</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                {/*-----------------------------------------------BOTTOM CARD--------------------------------------------*/}
                                <TableComponent columns={columns} data={facultiesWithSerialNo} tableName="Faculty Lists" isButton={false} height="630px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default FacultyManagement;