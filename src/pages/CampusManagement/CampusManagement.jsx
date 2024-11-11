import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import APIService from '../../services/APIService';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteModal from '../../shared/DeleteModal';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import FormatIndentIncreaseRoundedIcon from '@mui/icons-material/FormatIndentIncreaseRounded';
import TableComponent from '../../components/TableComponent';
import { CAMPUS_API } from '../../constants/api';

const tableHeaderShowDetails = [
    'Type of Space',
    'Space Title',
    'Space Capacity',
    'Is Active'
];

const CampusManagement = () => {
    const [campuses, setCampuses] = useState([]);
    const [campusId, setCampusId] = useState(null);
    const [openSection, setOpenSection] = useState(null);
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const showCampusDetails = (data) => {
        handleSectionToggle('showDetails');
        setSelectedCampus({ ...data, spaceDetails: data.spaceDetails || [] });
    }

    const columns = [
        { Header: 'Serial No.', accessor: 'serialNo' },
        { Header: 'ID', accessor: 'id' },
        { Header: 'Campus Name', accessor: 'facilityName' },
        { Header: 'City', accessor: 'city' },
        { Header: 'State', accessor: 'state' },
        { Header: 'Campus Head', accessor: 'contactPerson' },
        { Header: 'Phone', accessor: 'contactPersonPhone' },
        { Header: 'Email', accessor: 'contactPersonEmail' },
        {
            Header: 'Campus Details', accessor: 'campusDetails',
            Cell: ({ row }) => (
                <Link to='#' onClick={() => showCampusDetails(row.original)} data-toggle="modal" data-target="#campusDetails">
                    <div className="text-blue underline">
                        <FormatIndentIncreaseRoundedIcon style={{ fontSize: '20px' }} /> Show Details
                    </div>
                </Link>
            )
        },
        {
            Header: 'Action', accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <Link to={{
                        pathname: `/update-campus/${row.original.id}`
                    }}>
                        <button className="mr-2"><BorderColorRoundedIcon className='delete-icon text-gray-600' /></button>
                    </Link>
                    <button title="delete" onClick={() => handleConfirmation(row.original.id)}><DeleteRoundedIcon className='delete-icon text-gray-600' /></button>
                </>
            )
        }
    ];


    useEffect(() => {
        fetchCampuses();
    }, []);

    const fetchCampuses = async () => {
        try {
            const { data } = await APIService.get(CAMPUS_API);
            setCampuses(data.data.campuses);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching campus');
        }
    }

    const campusWithSerialNo = useMemo(() => {
        return campuses.map((campus, index) => {
            return {
                ...campus,
                serialNo: index + 1,
            };
        });
    }, [campuses]);

    const handleConfirmation = (id) => {
        setCampusId(id)
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        try {
            if (campusId) {
                await APIService.delete(`${CAMPUS_API}/${campusId}`);
                await fetchCampuses();
                toast.success('Campus deleted successfully')
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Campus';
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

    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className="main-page-content">
                    <TopHeader />
                    <main>
                        <div className='grid'>
                            <div className='page-content'>
                                {/* -------------------------------------TOP CARD------------------------------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Campus Management</div>
                                        <div>
                                            <Link to="/add-campus">
                                                <Button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    data-mdb-toggle="collapse"
                                                    href="#collapseWithScrollbar"
                                                    aria-expanded="false"
                                                    aria-controls="collapseExample"
                                                    style='small'>Add Campus
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* -------------------------------------CAMPUS LISTS--------------------------------------- */}
                                <TableComponent columns={columns} data={campusWithSerialNo} tableName="Campus Lists" isButton={false} height="700px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {/* --------------------------------------CAMPUS DETAILS------------------------------------- */}
            {openSection === 'showDetails' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="show-details-model ">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Show Campus Details</h3>
                                    <button onClick={() => handleSectionToggle(null)} className="cancel-button">
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
                                <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                    <table id="campusSpaces" className="w-full border">
                                        <thead className='sticky border top-0 text-left p-2 text-base font-bold'>
                                            <tr>
                                                {tableHeaderShowDetails.map((header) => {
                                                    return (
                                                        <th className='border text-left p-2 text-base font-semibold'>{header}</th>
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody className="">
                                            {selectedCampus?.spaceDetails?.length > 0 ? (
                                                selectedCampus.spaceDetails.map((space, ind) => {
                                                    return (
                                                        <tr key={space.spaceId || ind + 1}>
                                                            <td className='td'>{space.typeOfSpace}</td>
                                                            <td className='td'>{space.spaceTitle}</td>
                                                            <td className='td'>{space.spaceCapacity}</td>
                                                            <td className='td'>
                                                                <span className={`badge rounded-pill bg-${space.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                                    {space.isActive ? 'YES' : 'NO'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className='text-center'>No space details available.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="light-divider"></div>
                                <div className='modal-button'>
                                    <Button style="cancel" onClick={() => handleSectionToggle(null)}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default CampusManagement;