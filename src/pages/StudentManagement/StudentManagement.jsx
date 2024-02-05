import React, { useEffect, useState, useMemo } from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import APIService from "../../services/APIService";
import TopHeader from '../../components/TopHeader';
import { toast } from 'react-toastify';
import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { STUDENT_DETAILS } from '../../constants/api';
import { Link } from 'react-router-dom';


const StudentManagement = () => {
    const [students, setStudents] = useState([]);

    // Handle all the errors
    const handleRequestError = (error) => {
        toast.error(error.response?.data?.message || 'An error occurred during the request.');
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await APIService.get(STUDENT_DETAILS);
            setStudents(data.data);
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            }
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
                    <buton className="mr-2"><BorderColorRoundedIcon className='icon-style' /></buton>
                    <button><DeleteRoundedIcon className='icon-style' /></button>
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
                    <main className='main'>
                        <div className='main-grid'>
                            <div className='page-content'>
                                {/* -------------TOP CARD---------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Add Students</div>
                                        <div>
                                            <Link to="/add-student">
                                                <Button style='small'>Enroll New Student</Button>
                                            </Link>
                                            <Button style='small'>Import Bulk Students</Button>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
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
                                                <label className="form-input" htmlFor="electiveProgram">
                                                    Select Elective Program
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="electiveProgram"
                                                    id="electivePrograme"
                                                >
                                                    <option value=''>
                                                        Select Elective Program
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="admissionFromDate">
                                                    Admission From Date
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="admissionFromDate"
                                                    id="admissionFromDate"
                                                >
                                                    <option value=''>
                                                        Admission From Date
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="admissionToDate">
                                                    Admission To Date
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="admissionToDate"
                                                    id="admissionToDate"
                                                >
                                                    <option value=''>
                                                        Admission To Date
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="selectBatch">
                                                    Select Batch
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="selectBatch"
                                                    id="selectBatch"
                                                >
                                                    <option value=''>
                                                        Select Batch
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ----------------BOTTOM CARD------------------- */}
                                <div className='bottom-card h-[520px]'>
                                    <div className='card-header '>List of Students</div>
                                    <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                        <table id="studentList" className="table">
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

                                {/* -----------------------PAGINATIOn----------------------------- */}
                                <div className='pagination-wrapper'>
                                    <button className='pagination-button'>
                                        Previous
                                    </button>
                                    <span className='span-pagination'>Page </span>
                                    <button className='pagination-button'>
                                        Next
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

export default StudentManagement