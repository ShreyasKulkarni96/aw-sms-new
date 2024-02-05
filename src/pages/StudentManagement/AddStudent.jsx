import React, { useState } from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import APIService from "../../services/APIService";
import TopHeader from '../../components/TopHeader';
import { Link } from 'react-router-dom';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';


const AddStudent = () => {

    const Relation = [
        'Father',
        'Mother',
        'Spouse',
        'Brother',
        'Sister',
        'Grandfather',
        'Grandmother',
        'Uncle',
        'Aunt',
        'Cousins',
        'Other'
    ];


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
                                <div className='top-card h-[800px]'>
                                    <div className='card-content'>
                                        <div className='card-header'>Add Student</div>
                                        <div>
                                            <Link to="/student-management">
                                                <Button style='small'>
                                                    <KeyboardBackspaceRoundedIcon className='icons mr-1' />
                                                    Back
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* -------------------------PERSONALE DETAILS----------------------*/}
                                    {/* <div className='mt-4'>
                                        <div className="w-full border-2 bg-gray-200 rounded-md p-2 mt-6">
                                            <div className='w-full flex justify-between cursor-pointer'>
                                                <span className="text-lg ml-4 text-gray-main font-semibold">Personal Details</span>
                                                <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />
                                            </div>
                                        </div>
                                        <div className="p-4 border-2 rounded-md bg-white">
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="name">
                                                        Name<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-select"
                                                        placeholder='Name'
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="dob">
                                                        Date of Birth<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="dob"
                                                        name="dob"
                                                        className="form-select"
                                                    />
                                                </div>
                                                <div className="w-full">

                                                </div>
                                            </div>
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="currentAddress">
                                                        Current Address<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="currentAddress"
                                                        name="currentAddress"
                                                        className="form-select"
                                                        placeholder='Current Address'
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="permanentAddress">
                                                        Permanent Address<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="permanentAddress"
                                                        name="permanentAddress"
                                                        className="form-select"
                                                        placeholder='Permanent Address'
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label className="form-input" htmlFor="email">
                                                        Email<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        className="form-select"
                                                        placeholder='Email'
                                                    />
                                                </div>
                                            </div>
                                            <div className='card-content '>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="phoneNo1">
                                                        Phone No 1<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phoneNo1"
                                                        name="phoneNo1"
                                                        className="form-select"
                                                        placeholder='Phone No 1'
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="phoneNo2">
                                                        Phone No 2<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phoneNo2"
                                                        name="phoneNo2"
                                                        className="form-select"
                                                        placeholder='Phone No 2'
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label className="form-input" htmlFor="studentId">
                                                        Student ID<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="studentId"
                                                        name="studentId"
                                                        className="form-disabled"
                                                        placeholder='ST-XXXXXXXXXXX'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    {/* ----------------------PARENT/GAURDIAN DETAILS------------------ */}
                                    <div className='mt-4'>
                                        <div className="w-full border-2 bg-gray-200 rounded-md p-2 mt-6">
                                            <div className='w-full flex justify-between cursor-pointer'>
                                                <span className="text-lg ml-4 text-gray-main font-semibold">Parent / Gaurdian Details</span>
                                                <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />
                                            </div>
                                        </div>
                                        <div className="p-4 border-2 rounded-md bg-white">
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="parentName">
                                                        Parent Name<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="parentName"
                                                        name="parentName"
                                                        className="form-select"
                                                        placeholder='Parent Name'
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="relation">
                                                        Relation<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <select
                                                        className='form-select'
                                                        id="relation"
                                                        name="relation"
                                                    >
                                                        <option value=" ">Select Relation</option>
                                                        {Relation.map(item => {
                                                            return (
                                                                <option key={item.toLowerCase()} value={item}>
                                                                    {item}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="mr-4 w-full">

                                                </div>
                                            </div>
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="address">
                                                        Address<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        name="address"
                                                        className="form-select"
                                                        placeholder='Address'
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="email">
                                                        Email<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        className="form-select"
                                                        placeholder='Email'
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="phoneNo">
                                                        Phone No<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phoneNo"
                                                        name="phoneNo"
                                                        className="form-select"
                                                        placeholder='Phone No'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ----------------------ACADEMIC DETAILS------------------------- */}
                                    <div className='mt-4'>
                                        <div className="w-full border-2 bg-gray-200 rounded-md p-2 mt-6">
                                            <div className='w-full flex justify-between cursor-pointer'>
                                                <span className="text-lg ml-4 text-gray-main font-semibold">Academic Details</span>
                                                <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />
                                            </div>
                                        </div>
                                        <div className="p-4 border-2 rounded-md bg-white">
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="batch">
                                                        Batch<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <select
                                                        className='form-select'
                                                        id="relation"
                                                        name="relation"
                                                    >
                                                        <option value=" ">Select Batch</option>
                                                    </select>
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="dateOfAdmission">
                                                        Date of Admission<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="dateOfAdmissio"
                                                        name="dateOfAdmissiob"
                                                        className="form-select"
                                                    />
                                                </div>
                                                <div className="w-full">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <div className="w-full border-2 bg-gray-200 rounded-md p-2 mt-6">
                                            <div className='w-full flex justify-between cursor-pointer'>
                                                <span className="text-lg ml-4 text-gray-main font-semibold">Account Details</span>
                                                <KeyboardArrowDownRoundedIcon style={{ fontSize: '30px' }} />
                                            </div>
                                        </div>
                                        <div className="p-4 border-2 rounded-md bg-white">
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="paymentPlan">
                                                        Payment Plan<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <select
                                                        className='form-select'
                                                        id="paymentPlan"
                                                        name="paymentPlan"
                                                    >
                                                        <option value=" ">Select Payment Plan</option>
                                                    </select>
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="totalFees">
                                                        Total Fees<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="totalFees"
                                                        name="totalFee"
                                                        className="form-select"
                                                        placeholder='Total Fees'
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label className="form-input" htmlFor="discount">
                                                        Discount (if any)<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="discount"
                                                        name="discount"
                                                        className="form-select"
                                                        placeholder='Discount'
                                                    />
                                                </div>
                                                <div className="w-full">

                                                </div>
                                            </div>
                                            <div className='card-content mb-2'>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="totalPayable">
                                                        Total Payable<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        readOnly
                                                        type="text"
                                                        id="totalPayable"
                                                        name="totalPayable"
                                                        className="form-disabled"
                                                        placeholder='Total Payable'
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="paidFees">
                                                        Paid Fees<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="paidFees"
                                                        name="paidFees"
                                                        className="form-select"
                                                        placeholder='Paid Fees'
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="balanceAmount">
                                                        Balance Amount<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        readOnly
                                                        type="text"
                                                        id="balanceAmount"
                                                        name="balanceAmount"
                                                        className="form-disabled"
                                                        placeholder='Balance Amount'
                                                    />
                                                </div>
                                                <div className="mr-4 w-full">
                                                    <label className="form-input" htmlFor="pdcDetails">
                                                        Balance Amount<sup className="text-red-600">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="pdcDetails"
                                                        name="pdcDetails"
                                                        className="form-select"
                                                        placeholder='PDC Details'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>

    )
}

export default AddStudent;