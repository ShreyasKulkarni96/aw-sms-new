import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from 'react-table';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import DeleteModal from '../../components/shared/DeleteModal';
import APIService from '../../services/APIService';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import FormatIndentIncreaseRoundedIcon from '@mui/icons-material/FormatIndentIncreaseRounded';
import { FACULTY } from '../../constants/api';

const FacultyManagement = () => {
    const [faculties, setFaculties] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [facultyId, setFacultyId] = useState('');

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        try {
            const { data } = await APIService.get(FACULTY);
            setFaculties(data.data);
        } catch (error) {
            toast.error('Some Error occurred while fetching faculties');
        }
    }

    const tableHeader = [
        { Header: 'Serial No', accessor: 'serialNo' },
        { Header: 'FID', accessor: 'facultyId' },
        { Header: 'Faculty Name', accessor: 'facultyName' },
        {
            Header: 'Expertise', accessor: 'expertise',
            Cell: ({ row }) => (
                <Link className='text-blue underline' to={{ pathname: `/faculty-experience/${row.original.facultyId}/${row.original.facultyName}` }}>
                    <FormatIndentIncreaseRoundedIcon style={{ fontSize: '18px' }} /> Show Details
                </Link>
            )
        },
        { Header: 'Phone 1', accessor: 'phone1' },
        { Header: 'Type', accessor: 'facultyType' },
        { Header: 'Availability', accessor: 'availability' },
        { Header: 'Rem. Plan', accessor: 'remunerationPlan' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <Link to={{ pathname: `/edit-faculty/${row.original.facultyId}` }}>
                        <button className="mr-2"><BorderColorRoundedIcon className='icon-style' /></button>
                    </Link>
                    <button onClick={() => handleConfirmation(row.original.id)}><DeleteRoundedIcon className='icon-style' /></button>
                </>
            )
        }
    ];

    const facultiesWithSerialNo = useMemo(() => {
        return faculties.map((faculty, index) => ({
            ...faculty,
            serialNo: index + 1,
            facultyId: faculty?.facultyId,
            facultyName: faculty?.facultyName?.toLowerCase(),
            expertise: faculty?.expertise?.toLowerCase(),
            phone1: faculty?.phone1,
            facultyType: faculty?.facultyType?.toLowerCase(),
            availability: faculty?.availability?.toLowerCase(),
            remunerationPlan: faculty?.remunerationPlan?.toLowerCase(),
            action: faculty?.action,
        }));
    }, [faculties]);

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
        state: { pageIndex, pageSize } } = useTable({ columns: tableColumn, data: facultiesWithSerialNo, initialState: { pageSize: 10 } }, useSortBy, usePagination);

    const handleConfirmation = (id) => {
        setFacultyId(id);
        setDeleteModalOpen(true);
    }

    const handleDelete = async () => {
        try {
            if (facultyId) {
                await APIService.delete(`${FACULTY}/${facultyId}`);
                await fetchFaculties();
                toast.success('Faculty deleted successfully')
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Faculty';
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
                        <div className='main-grid'>
                            <div className='page-content'>

                                {/* TOP CARD */}
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
                                        <div className="w-full mt-6 text-right">
                                            <Link to='/add-faculty'>
                                                <Button style="small">Add New Faculty</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* ----------------BOTTOM CARD------------------- */}
                                <div className='bottom-card h-[600px]'>
                                    <div className='card-header '>List of Faculty</div>
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

export default FacultyManagement