import React, { useEffect, useState, useMemo } from 'react';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import APIService from '../../services/APIService';
import { useTable, useSortBy, usePagination } from 'react-table';
import { toast } from 'react-toastify';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteModal from '../../components/shared/DeleteModal';
import FormatIndentIncreaseRoundedIcon from '@mui/icons-material/FormatIndentIncreaseRounded';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';

const CampusManagement = () => {
    const [campuses, setCampuses] = useState([]);
    const [campusId, setCampusId] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchCampuses();
    }, [])

    const fetchCampuses = async () => {
        try {
            const { data } = await APIService.get('/campus');
            setCampuses(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching campus');
        }
    }

    const tableHeader = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Campus Name', accessor: 'facilityName' },
        { Header: 'City', accessor: 'city' },
        { Header: 'State', accessor: 'state' },
        { Header: 'Campus Head', accessor: 'contactPerson' },
        { Header: 'Phone', accessor: 'contactPersonPhone' },
        { Header: 'Email', accessor: 'contactPersonEmail' },
        {
            Header: 'Campus Details',
            accessor: 'campusDetails',
            Cell: ({ row }) => (
                <Link to='#' onClick={() => setSelectedCampus(row.original)} data-toggle="modal" data-target="#campusDetails">
                    <div className="text-blue underline">
                        <FormatIndentIncreaseRoundedIcon style={{ fontSize: '20px' }} /> Show Details
                    </div>
                </Link>
            )
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <Link>
                        <button className="mr-2"><BorderColorRoundedIcon className='delete-icon text-gray-600' /></button>
                    </Link>
                    <button title="delete" onClick={() => handleConfirmation(row.original.id)}><DeleteRoundedIcon className='delete-icon text-gray-600' /></button>
                </>
            )
        }
    ]

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
        state: { pageIndex }
    } = useTable({
        columns: tableColumn, data: campuses, initialState: {
            sortBy: [
                {
                    id: 'id',
                    desc: false
                }
            ]
        }
    }, useSortBy, usePagination);

    const handleConfirmation = (id) => {
        setCampusId(id)
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        try {
            if (campusId) {
                await APIService.delete(`/campus/${campusId}`);
                await fetchCampuses();
                toast.success('Campus deleted successfully')
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Campus';
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
            <div className="main-page">
                <div>
                    <Sidebar />
                </div>
                {/* Main Content */}
                <div className="main-page-content">
                    {/* Header */}
                    <TopHeader />

                    {/* Main Content Area */}
                    <main className="main-div">
                        <div className='grid'>
                            <div className='col-span-12 mb-8'>
                                <div className='w-full border shadow-md p-4 border-gray-100 rounded-xl bg-white'>
                                    <div className='flex justify-between'>
                                        <div></div>
                                        <div>
                                            <Link to='/add-campus'>
                                                <Button style="small">Add Campus</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* CAMPUS LISTS */}
                            <div className='col-span-12 mb-4'>
                                <div className='w-full border shadow-md p-4 border-gray-100 rounded-xl bg-white'>
                                    <h4 className='text-xl font-bold text-gray-600'>
                                        Campus Lists
                                    </h4>
                                    <div className='mt-4'>
                                        <table className='table-auto w-full border overflow-y-auto'>
                                            <thead>
                                                {headerGroups.map(headerGroup => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map(column => (
                                                            <th className='border text-left bg-orange-600 p-2 text-base font-semibold' {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                                {column.render('Header')}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody className="overflow-y-auto"  {...getTableBodyProps()}>
                                                {page.map(row => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map(cell => {
                                                                return (
                                                                    <td className='border p-2 text-base'
                                                                        {...cell.getCellProps()}
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
                            </div>
                            {/* ------------PAGINATION-------------- */}
                            <div className='flex justify-center pb-10'>
                                <button className='mr-2 px-4 py-2 bg-orange-600 hover:bg-orange-300 rounded-xl shadow-lg'>
                                    Previous
                                </button>
                                <span className='m-3 font-bold'>1</span>
                                <button className='mr-2 px-4 py-2 bg-orange-600 hover:bg-orange-300 rounded-xl shadow-lg'>
                                    back
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default CampusManagement