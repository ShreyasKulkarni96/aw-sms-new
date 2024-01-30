import React, { useEffect, useState, useMemo } from 'react';

import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import APIService from '../../services/APIService';

import { toast } from 'react-toastify';
import { useTable, useSortBy, usePagination } from 'react-table';

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    console.log(students)

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await APIService.get('/student-details');
            setStudents(data.data);
        } catch (error) {
            toast.error('Some Error occurred while fetching Students data');
        }
    }

    const tableHeader = [
        { Header: 'Unique_ID', accessor: 'U_S_ID' },
        { Header: 'Name', accessor: 'studentName' },
        { Header: 'Phone', accessor: 'phone1' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Parent/Guardian', accessor: 'guardianDetails.name' },
        { Header: 'DOB', accessor: 'DOB' },
        { Header: 'Gender', accessor: 'gender' },
        { Header: 'Enrollment Date', accessor: `enrolledAt` },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <buton className="mr-2"><BorderColorRoundedIcon className='delete-icon text-gray-600' /></buton>
                    <button><DeleteRoundedIcon className='delete-icon text-gray-600' /></button>
                </>
            )
        }
    ];

    const tableColumn = useMemo(() => tableHeader, []);

    const {
        headerGroups,
        getTableBodyProps,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        previousPage,
        nextPage,
        state: { pageIndex } } = useTable({ columns: tableColumn, data: students }, useSortBy, usePagination);

    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className='main-page-content'>
                    <TopHeader />
                    <main className='main-div h-full'>
                        <div className='grid'>
                            <div className='card-container h-full'>
                                {/* --------FILTER STUDENTS--------- */}
                                <div className='card'>
                                    <div className='card-content'>
                                        <div></div>
                                        <div>
                                            <Button style='small'>Enroll New Student</Button>
                                            <Button style='small'>Import Bulk Students</Button>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className='w-full'>
                                            <div className="mb-4 mr-4">
                                                <label className="form-input" htmlFor="academicYear">
                                                    Select Academic Year
                                                </label>
                                                <select
                                                    type="text"
                                                    id="academicYear"
                                                    name="academicYear"
                                                    className="form-select"
                                                    placeholder="Academic Year"
                                                >
                                                    <option>Select Academic Year</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='w-full'>
                                            <div className="mb-4 mr-4">
                                                <label className="form-input" htmlFor="programType">
                                                    Select Program Type
                                                </label>
                                                <select
                                                    type="text"
                                                    id="programType"
                                                    name="programType"
                                                    className="form-select"
                                                    placeholder="Program Type"
                                                >
                                                    <option>Select Program Type</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='w-full'>
                                            <div className="mb-4 mr-4">
                                                <label className="form-input" htmlFor="electiveProgram">
                                                    Select Elective Program
                                                </label>
                                                <select
                                                    type="text"
                                                    id="electiveProgram"
                                                    name="electiveProgram"
                                                    className="form-select"
                                                    placeholder="Elective program"
                                                >
                                                    <option>Select Elective Program</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-content'>
                                        <div className='w-full'>
                                            <div className="mb-2 mr-4">
                                                <label className="form-input" htmlFor="fromDate">
                                                    Admission From Date
                                                </label>
                                                <input type='date' id='fromDate' name='fromDate' className='form-date-select' />
                                            </div>
                                        </div>
                                        <div className='w-full'>
                                            <div className="mb-2 mr-4">
                                                <label className="form-input" htmlFor="toDate">
                                                    Admission To Date
                                                </label>
                                                <input type='date' id='toDate' name='toDate' className='form-date-select' />
                                            </div>
                                        </div>
                                        <div className='w-full'>
                                            <div className="mb-2 mr-4">
                                                <label className="form-input" htmlFor="batch">
                                                    Select Batch
                                                </label>
                                                <select
                                                    type="text"
                                                    id="batch"
                                                    name="batch"
                                                    className="form-select"
                                                    placeholder="Elective program"
                                                >
                                                    <option>Select Batch</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* ----------LIST OF STUDENTS---------- */}
                                <div className='bottom-card h-4/5'>
                                    <div className='card-header'>Student Lists</div>
                                    <div className=' overflow-y-auto'>
                                        <table id='studentList' className='table max-h-3/5'>
                                            <thead>
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
                                            <tbody className='table-body' {...getTableBodyProps()}>
                                                {page.map(row => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map(cell => {
                                                                return (
                                                                    <td
                                                                        {...cell.getCellProps()}
                                                                        className="td"
                                                                    >
                                                                        {cell.render('Cell')}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* -----------PAGINATION------------- */}
                                <div className='pagination-wrapper'>
                                    <button className='previous-button'>
                                        Previous
                                    </button>
                                    <span className='span-pagination'>1</span>
                                    <button className='back-button'>
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

export default StudentManagement;