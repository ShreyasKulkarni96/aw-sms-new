import React from 'react';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import APIService from '../../services/APIService';

const FacultyManagement = () => {
    const [faculties, setFaculties] = useState([]);
    const [facultyId, setFacultyId] = useState('');

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        try {
            const { data } = await APIService.get('/faculty');
            setFaculties(data.data);
        } catch (error) {
            toast.error('Some Error occurred while fetching faculties');
        }
    }

    const tableHeader = [
        { Header: 'FID', accessor: 'facultyId' },
        { Header: 'Faculty Name', accessor: 'facultyName' },
        { Header: 'Expertise', accessor: 'expertise' },
        { Header: 'Phone 1', accessor: 'phone1' },
        { Header: 'Type', accessor: 'facultyType' },
        { Header: 'Availability', accessor: 'availability' },
        { Header: 'Rem. Plan', accessor: 'remunerationPlan' },
        {
            Header: 'Action',
            accessor: 'action',
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
        setPageSize,
        state: { pageIndex, pageSize } } = useTable({ columns: tableColumn, data: faculties, initialState: { pageSize: 10 } }, useSortBy, usePagination);

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
                                {/* ----------------------TOP CARD------------------ */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Faculty Management</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="facultyType">
                                                    Faculty Type
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="facultyType"
                                                    id="facultyType"
                                                >
                                                    <option value=''>
                                                        Select Faculty Type
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="availability">
                                                    Faculty Availability
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="availability"
                                                    id="availability"
                                                >
                                                    <option value=''>
                                                        Select availability
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">

                                        </div>
                                        <div className="w-full mt-6 text-right">
                                            <Button style="small">Add New Faculty</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* ----------------BOTTOM CARD------------------- */}
                                <div className='bottom-card h-[600px]'>
                                    <div className='card-header '>List of Faculty</div>
                                    <div className='overflow-auto' style={{ maxHeight: '550px' }}>
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

export default FacultyManagement