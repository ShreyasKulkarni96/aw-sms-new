import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { jwtDecode } from 'jwt-decode';
import { format, subYears, isDate } from 'date-fns';
import TableComponent from '../components/TableComponent';

const LeaveManagement = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

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
                                {(decodedToken.role !== "STUDENT" &&
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
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default LeaveManagement;