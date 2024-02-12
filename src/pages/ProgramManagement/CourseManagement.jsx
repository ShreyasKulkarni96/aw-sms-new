import React, { useState, useEffect, useMemo} from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import APIService from '../../services/APIService';

import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteModal from '../../components/shared/DeleteModal';
// import { Link } from 'react-router-dom';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await APIService.get('/course');
            setCourses(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching courses');
        }
    };

    const tableHeader = [
        { Header: '#', accessor: 'id'},
        { Header: 'Program', accessor: 'program' },
        { Header: 'Course Code', accessor: 'courseCode' },
        { Header: 'Course Name', accessor: 'courseName' },
        { Header: 'Type', accessor: 'type' },
        { Header: 'Course Description', accessor: 'courseDesc'},
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <EditModal data={[
                        row.original.id,
                        row.original.courseCode,
                        row.original.courseName,
                        row.original.type,
                        row.original.courseDesc,
                        row.original.details
                    ]}
                        labels={['Program', 'Course Code', 'Course Name', 'Type', 'Course Description', 'Details']}
                    // onSave={handleProgramUpdate}
                    />
                    <button>
                        <BorderColorRoundedIcon className='icon-style mr-2' />
                    </button>
                    <button onClick={() => handleConfirmation(row.original.id)}>
                        <DeleteRoundedIcon className='icon-style' />
                    </button>
                </>
            )
        },
        {
            Header: 'Sessions',
            accessor: 'session',
            Cell: ({ row }) => (
                <Link to={{ pathname: `/course-management/${row.id}` }}>
                    <button>
                        <AudioFileRoundedIcon className='text-blue' />
                    </button>
                </Link>
            )
        }
    ];

    const tableColumn = useMemo(() => tableHeader, []);
    const {
        headerGroups,
        getTableProps,
        getTableBodyProps,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        previousPage,
        nextPage,
        state: { pageIndex }
    } = useTable({ columns: tableColumn, data: courses }, useSortBy, usePagination);

    const handleConfirmation = (id) => {
        setProgramId(id);
        setDeleteModalOpen(true)
    }
    
    const handleDelete = async () => {
        try {
            if (programId) {
                await APIService.delete(`/course/${programId}`);
                await fetchPrograms();
                setDeleteModalOpen(false);
                toast.success('Course deleted successfully');
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Course';
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
                <div className='main-page-content'>
                    <TopHeader />
                    <main className='main'>
                        <div className="main-grid">
                            <div className="page-content">

                                {/* TOP CARD  */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                    <div className='card-header'>Courses</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className='mt-2'>
                                            <label class="inline-flex items-center mr-6">
                                                <input type="radio" class="form-radio" name="course" value="core" />
                                                <span class="ml-2 text-base font-medium">Core</span>
                                            </label>

                                            <label class="inline-flex items-center mr-6">
                                                <input type="radio" class="form-radio" name="course" value="elective" />
                                                <span class="ml-2 text-base font-medium">Elective</span>
                                            </label>

                                            <label class="inline-flex items-center">
                                                <input type="radio" class="form-radio" name="course" value="all" />
                                                <span class="ml-2 text-base font-medium">All</span>
                                            </label>
                                        </div>
                                        <div className="w">
                                            <div className="mr-4">
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
                                        <div>
                                            <Button style='small'>Core Course</Button>
                                            <Button style='small'>Elective Course</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM CARD  */}
                                <div className='bottom-card h-[450px]'>
                                    <div className='card-header'>Program Lists</div>
                                    <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                        <table id='courseList' className='table max-h-3/5'>
                                            <thead className='sticky top-0 left-0'>
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
                                            <tbody {...getTableBodyProps()}>
                                                {page.map((row) => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map((cell) => {
                                                                return (
                                                                    <td className='td' {...cell.getCellProps()}>
                                                                        {cell.render('Cell')}
                                                                    </td>
                                                                )
                                                            })}
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* PAGINATION  */}
                                <div className='flex mt-4'>
                                    <button onClick={() => previousPage()} className='mr-2 px-4 py-2 bg-orange-600 hover:bg-orange-300 rounded-xl shadow-lg'>
                                        Previous
                                    </button>
                                    <span className='m-3 font-bold'>Page {pageIndex + 1} of {page.length}</span>
                                    <button onClick={() => nextPage()} className='mr-2 px-4 py-2 bg-orange-600 hover:bg-orange-300 rounded-xl shadow-lg'>
                                        Next
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            
            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default CourseManagement