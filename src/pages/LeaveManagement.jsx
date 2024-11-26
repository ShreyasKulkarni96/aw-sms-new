import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { jwtDecode } from 'jwt-decode';
import { format } from 'date-fns';
import TableComponent from '../components/TableComponent';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import APIService from "../services/APIService";
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

const LeaveManagement = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const [openSection, setOpenSection] = useState(null);
    const [leaves, setLeaves] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [updatedStatus, setUpdatedStatus] = useState('');

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const editLeaves = (data) => {
        handleSectionToggle('editLeaves');
        setSelectedLeave({ ...data });
        setUpdatedStatus(data.status);
    }

    useEffect(() => {
        fetchLeaves();
    }, []);

    const columns = React.useMemo(
        () => [
            { Header: 'Serial No.', accessor: 'serialNo' },
            { Header: 'Name', accessor: 'requester.name' },
            { Header: 'Reason', accessor: 'reason' },
            { Header: 'Date From', accessor: 'startDate' },
            { Header: 'Date To', accessor: 'endDate' },
            { Header: 'Status', accessor: 'status' },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <>
                        <Link data-toggle="modal" data-target="#editLeaves">
                            <button onClick={() => editLeaves(row.original)} className="mr-2"><BorderColorRoundedIcon className='icon-style' /></button>
                        </Link>
                    </>
                )
            }
        ], []
    );

    const fetchLeaves = async () => {
        try {
            const { data } = await APIService.get('/leave');
            console.log(data)
            setLeaves(data.data);
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            toast.error('Some Error occurred while fetching Leaves data');
        }
    }

    const saveStatus = async () => {
        if (!updatedStatus) {
            toast.error('Please select a valid status!');
            return;
        }
        try {
            await APIService.put(`/leave/${selectedLeave.id}`, { status: updatedStatus });
            toast.success('Status updated successfully!');
            setOpenSection(null);
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to update status. Please try again.');
        }
    };

    const processLeavesData = useMemo(() => {
        return leaves.map((leave, index) => {
            return {
                ...leave,
                serialNo: index + 1,
                requesterName: leave.requester?.name || 'N/A',
                reason: leave.reason || 'No reason provided',
                startDate: new Date(leave.startDate).toLocaleDateString(),
                endDate: new Date(leave.endDate).toLocaleDateString(),
            };
        });
    }, [leaves]);

    const getDropdownOptions = (status) => {
        switch (status) {
            case 'approved':
                return ['rejected'];
            case 'pending':
                return ['approved', 'rejected'];
            case 'rejected':
                return ['approved'];
            default:
                return [];
        }
    };

    const clearFormData = () => {
        setUpdatedStatus('');
        setOpenSection(null);
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
                                {(decodedToken.role == "STUDENT" &&
                                    <><div className='top-card'>
                                        <div className='card-content'>
                                            <div className='card-header'>Leaves</div>
                                        </div>
                                        <div className='card-content'>
                                            <div className="w-full">
                                                <div className="mr-4">
                                                    <label className="form-input" htmlFor="leaveType">
                                                        Leave Type
                                                    </label>
                                                    <select
                                                        className='form-select'
                                                        name="leaveType"
                                                        id="leaveType"
                                                    >
                                                        <option value=''>
                                                            Select Leave Type
                                                        </option>
                                                        <option value="applied">Applied</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mr-4 w-full">
                                                <label className="form-input" htmlFor="startDate">
                                                    Start Date<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="date"
                                                    id="startDate"
                                                    name="startDate"
                                                    className="form-select"
                                                    max={format(new Date(), 'yyyy-MM-dd')}
                                                />
                                            </div>
                                            <div className="mr-4 w-full">
                                                <label className="form-input" htmlFor="endDate">
                                                    End Date (or expected)<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="date"
                                                    id="endDate"
                                                    name="endDate"
                                                    className="form-select"
                                                    placeholder='End Date'
                                                    max={format(new Date(), 'yyyy-MM-dd')}
                                                />
                                            </div>
                                        </div>
                                        <div className='mt-4'>
                                            <Link to="/add-leave">
                                                <Button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    data-mdb-toggle="collapse"
                                                    href="#collapseWithScrollbar"
                                                    aria-expanded="false"
                                                    aria-controls="collapseExample"
                                                    style='small'>Add Leave
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    </>
                                )}
                                <><div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Leaves</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="leaveType">
                                                    Leave Type
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="leaveType"
                                                    id="leaveType"
                                                >
                                                    <option value=''>
                                                        Select Leave Type
                                                    </option>
                                                    <option value="applied">Applied</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mr-4 w-full">
                                            <label className="form-input" htmlFor="startDate">
                                                Start Date<sup className="text-red-600">*</sup>
                                            </label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                name="startDate"
                                                className="form-select"
                                                max={format(new Date(), 'yyyy-MM-dd')}
                                            />
                                        </div>
                                        <div className="mr-4 w-full">
                                            <label className="form-input" htmlFor="endDate">
                                                End Date (or expected)<sup className="text-red-600">*</sup>
                                            </label>
                                            <input
                                                type="date"
                                                id="endDate"
                                                name="endDate"
                                                className="form-select"
                                                placeholder='End Date'
                                                max={format(new Date(), 'yyyy-MM-dd')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                </>

                                {/* -------------------------------BOTTOM CARD------------------------------ */}
                                <TableComponent columns={columns} data={processLeavesData} tableName="Leave List" isButton={false} height="640px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {
                openSection === 'editLeaves' && selectedLeave &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="show-details-model">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Show Leave Details</h3>
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
                                <p><strong className='text-base font-medium'>Name:</strong> <span>{selectedLeave.requesterName}</span></p>
                                <label htmlFor="status" className='text-base font-medium'>Status:</label>
                                <select
                                    id="status"
                                    value={updatedStatus}
                                    onChange={(e) => setUpdatedStatus(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Select Status</option>
                                    {getDropdownOptions(selectedLeave.status).map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <div className='modal-button'>
                                    <Button style="small" onClick={saveStatus} >Save Status</Button>
                                    <Button style="cancel" onClick={clearFormData}>Cancel</Button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default LeaveManagement;