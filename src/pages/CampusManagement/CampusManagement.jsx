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
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className="main-page-content">
                    <TopHeader />
                    <main className='main'>
                        <div className='grid'>
                            <div className='page-content'>
                                {/* TOP CARD */}
                                <div className='top-card '>
                                    <div className='card-content'>
                                        <div className='card-header'>Add Campus</div>
                                        <div>
                                            <Link to="/add-campus">
                                                <Button 
                                                  className="btn btn-primary"
                                                  type="button"
                                                  data-mdb-toggle="collapse"
                                                  href="#collapseWithScrollbar"
                                                  aria-expanded="false"
                                                  aria-controls="collapseExample"
                                                  style='small'>Add Campus
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* CAMPUS LISTS */}
                                <div className='bottom-card h-[650px] '>
                                    <div className='card-header '>Campus Lists </div>
                                    <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                        <table id="studentList" className="table">
                                            <thead className='table-head'>
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
                                            <tbody {...getTableBodyProps()}>
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
                                
                                {/* ------Pagination------ */}
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

export default CampusManagement