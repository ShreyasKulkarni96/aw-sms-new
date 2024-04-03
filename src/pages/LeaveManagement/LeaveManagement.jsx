import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import { jwtDecode } from "jwt-decode";
import APIService from '../../services/APIService';

const LeaveManagement = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const initialData = {
        startDate: "",
        endDate: "",
        reason: ""
    }
    const [formData, setFormData] = useState(initialData);
    const [leaves, setleaves] = useState([]);

    useEffect(() => {
        fetchLeaves();
    })

    const onMutate = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const addLeave = async (e) => {
        e.preventDefault();
        try {
            const { data } = await APIService.post(`/leave/${userId}`, formData);
            if (data.code === 200) {
                toast.success('Leave applied successfully!');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
        }
    }

    const fetchLeaves = async (e) => {
        e.preventDefault();
        try {
            const { data } = await APIService.get(`/leave/${userId}`);
            setLeaves(data.data)
            if (data.code === 200) {
                toast.success('Leave applied successfully!');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
        }
    }



    return (
        <>
            <div className='flex h-screen overflow-y-scroll scrollbar-hide'>
                <div>
                    <Sidebar />
                </div>
                <div className='flex-1 flex-col h-screen'>
                    <TopHeader />
                    {decodedToken.role === "STUDENT" ?
                        // STUDENT VIEW
                        <main className='h-full'>
                            <div className='grid'>
                                <div className="h-full m-2 p-6">
                                    <div className='text-xl font-bold text-gray-600 mb-2'>Leave Management</div>

                                    <div className='w-full border shadow-md p-4 border-gray-100 rounded-xl bg-white'>
                                        <div className='text-lg font-bold text-gray-500'>Add Leaves</div>
                                        <div className='flex justify-between mt-4 mb-2'>

                                            <div className='mr-4 w-full'>
                                                <label className='block text-base font-medium'>Date From</label>
                                                <input
                                                    type='date'
                                                    id='startDate'
                                                    name='startDate'
                                                    className='w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400'
                                                    onChange={onMutate}
                                                />
                                            </div>
                                            <div className='mr-4 w-full'>
                                                <label className='block text-base font-medium'>Date To</label>
                                                <input
                                                    type='date'
                                                    id='endDate'
                                                    name='endDate'
                                                    className='w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400'
                                                    onChange={onMutate}
                                                />
                                            </div>
                                            <div className='w-full'>
                                                <label className='block text-base font-medium'>Reason</label>
                                                <input
                                                    type='text'
                                                    id='reason'
                                                    name='reason'
                                                    className='w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400'
                                                    value={formData.reason}
                                                    onChange={onMutate}
                                                />
                                            </div>

                                        </div>
                                        <div className='flex justify-end mt-2'>
                                            <Button style="small" onClick={addLeave}>Apply Leave</Button>
                                        </div>
                                    </div>

                                    <div className='w-full mt-8 border shadow-md p-4 border-gray-100 rounded-xl bg-white'>
                                        <div className='text-lg font-bold text-gray-500'>List of Leaves</div>

                                        <div className='flex mt-4 mb-2'>
                                            <div className='mr-4 w-1/3'>
                                                <label className='block text-base font-medium'>Select Filter</label>
                                                <select
                                                    className='form-select'
                                                    name="filterLeaves"
                                                    id="filterLeaves"
                                                >
                                                    <option value=''>
                                                        Select Filters
                                                    </option>
                                                    <option value='applied'>
                                                        Applied
                                                    </option>
                                                    <option value='approved'>
                                                        Approved
                                                    </option>
                                                    <option value='rejected'>
                                                        Rejected
                                                    </option>
                                                </select>
                                            </div>
                                            <div className='mr-4 w-1/3'>
                                                <label className='block text-base font-medium'>Select Date</label>
                                                <input
                                                    type='date'
                                                    className='w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400'
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <table id="leaveList" className="table">

                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                        :
                        // OTHER'S VIEW
                        <main className=' h-full'>
                            <div className='grid'>
                                <div className="h-full m-2 p-6">
                                    <div className='text-xl font-bold text-gray-600 mb-2'>Leave Management</div>
                                    <div className='w-full border shadow-md p-4 border-gray-100 rounded-xl bg-white'>
                                        TAB VIEW
                                    </div>

                                    <div className='w-full mt-8 border shadow-md p-4 border-gray-100 rounded-xl bg-white'>

                                    </div>
                                </div>
                            </div>
                        </main>
                    }
                </div>
            </div>
        </>
    )
}

export default LeaveManagement