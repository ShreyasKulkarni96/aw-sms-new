import React from 'react';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const BatchManagement = () => {
    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className='main-page-content'>
                    <TopHeader />
                    <main className='main'>
                        <div className='main-grid'>
                            <div className='page-content'>
                                {/* --------------TOP CARD--------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Create Batch</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="academicYear">
                                                    Select Academic Year
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="academicYear"
                                                    id="academicYear"
                                                >
                                                    <option value=''>
                                                        Select Academic Year
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="programType">
                                                    Select Program Type
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="programType"
                                                    id="programType"
                                                >
                                                    <option value=''>
                                                        Select Program Type
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="program">
                                                    Select Program
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="program"
                                                    id="program"
                                                >
                                                    <option value=''>
                                                        Select Program
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full mt-6 text-center">
                                            <Button style="small">Add Core batch</Button>
                                            <Button style="small">Add Elective batch</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* ------------------BOTTOM CARD------------- */}
                                <div className='bottom-card h-[600px]'>
                                    <div className='card-header '>List of Batch</div>
                                    <div className='overflow-auto' style={{ maxHeight: '550px' }}>

                                    </div>
                                </div>

                                {/* ------Pagination------ */}
                                <div className='flex mt-4'>
                                    <button className='mr-2 px-4 py-2 bg-orange-600 hover:bg-orange-300 rounded-xl shadow-lg'>
                                        Previous
                                    </button>
                                    <span className='m-3 font-bold'>Page </span>
                                    <button className='mr-2 px-4 py-2 bg-orange-600 hover:bg-orange-300 rounded-xl shadow-lg'>
                                        back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default BatchManagement