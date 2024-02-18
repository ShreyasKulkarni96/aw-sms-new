import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';

import { useTable, useSortBy, usePagination } from 'react-table';
import { Link } from 'react-router-dom';

const LeaveManagement = () => {
    const [openSection, setOpenSection] = useState(null);

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <>
            <div className="main-page overflow-y-scroll scrollbar-hide">
                <div>
                    <Sidebar />
                </div>
                <div className="main-page-content">
                    <TopHeader />
                    <main className="main">
                        <div className="main-grid">
                            <div className="page-content">
                                {/* -------------------------------------------LEAVE MANAGEMENT CARD----------------------------------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Leave Management</div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className="w-full text-center">
                                            <div className="mr-4">
                                                <Button onClick={() => handleSectionToggle('dailyAttendance')} style="small">Manage Daily Attendance</Button>
                                            </div>
                                        </div>
                                        <div className="w-full text-center">
                                            <div className="mr-4">
                                                <Button onClick={() => handleSectionToggle('leaves')} style="small">Manage Leaves</Button>
                                            </div>
                                        </div>
                                        <div className="w-full text-center">
                                            <div className="mr-4">
                                                <Button onClick={() => handleSectionToggle('reports')} style="small">Leave Reports</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* ----------------------------------------------------LEAVE MANAGEMENT BOTTOM CARD-------------------------------------- */}

                                <div className='bottom-card h-[660px]'>
                                    {openSection === null &&
                                        <div>
                                            <div className='card-header'>Who's on Leave Today</div>
                                            <div className='card-content'>
                                                <div className="w-1/3">
                                                    <div className="mr-4">
                                                        Shreyas is on leave today
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {openSection === "dailyAttendance" &&
                                        <div>
                                            <div className='card-header'>Manage Daily Attendance</div>
                                            <div className='card-content mt-4'>
                                                <div className="w-1/3">
                                                    <div className="mr-4">
                                                        <label className="form-input" htmlFor="batch_code">
                                                            Batch Code<sup className="text-red-600">*</sup>
                                                        </label>
                                                        <select
                                                            className='form-select'
                                                            name="batch_code"
                                                            id="batch_code"
                                                        >
                                                            <option value=''>
                                                                Select Batch
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-3'>
                                                <div className='overflow-auto' style={{ maxHeight: '400px' }}>
                                                    <table className="table">
                                                        <thead className='table-head'>
                                                            <tr>
                                                                <th className="th">Serial No.</th>
                                                                <th className="th">Student Name</th>
                                                                <th className="th">Planned/Unplanned leaves</th>
                                                                <th className="th">Mark Attendance</th>
                                                                <th className="th">Action</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {openSection === "leaves" &&
                                        <div>
                                            <div className='card-header'>Manage Leaves</div>
                                            <div className='card-content mt-4'>
                                                <div className="w-1/3">
                                                    <div className="mr-4">
                                                        <label className="form-input" htmlFor="batch_code">
                                                            Batch Code<sup className="text-red-600">*</sup>
                                                        </label>
                                                        <select
                                                            className='form-select'
                                                            name="batch_code"
                                                            id="batch_code"
                                                        >
                                                            <option value=''>
                                                                Select Batch
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-3'>
                                                <div className='overflow-auto' style={{ maxHeight: '400px' }}>
                                                    <table className="table">
                                                        <thead className='table-head'>
                                                            <tr>
                                                                <th className="th">Serial No.</th>
                                                                <th className="th">Student Name</th>
                                                                <th className="th">Reason</th>
                                                                <th className="th">Accept/Reject</th>
                                                                <th className="th">Action</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {openSection === "reports" &&
                                        <div>
                                            <div className='card-header'>Leave Reports</div>
                                            <div className='card-content'>
                                                <div className="w-1/3">
                                                    <div className="mr-4">
                                                        <label className="form-input" htmlFor="batch_code">
                                                            Batch Wise Reports<sup className="text-red-600">*</sup>
                                                        </label>
                                                        <select
                                                            className='form-select'
                                                            name="batch_code"
                                                            id="batch_code"
                                                        >
                                                            <option value=''>
                                                                Select Batch
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="w-1/3">
                                                    <div className="mr-4">
                                                        <label className="form-input" htmlFor="batch_code">
                                                            Unplanned Reports<sup className="text-red-600">*</sup>
                                                        </label>
                                                        <select
                                                            className='form-select'
                                                            name="batch_code"
                                                            id="batch_code"
                                                        >
                                                            <option value=''>
                                                                Select Batch
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="w-1/3"></div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default LeaveManagement