import React, { useState, useEffect, useMemo} from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import APIService from '../../services/APIService';

import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteModal from '../../components/shared/DeleteModal';

const TopicManagement = ()  => {
    const [topics, setTopics] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const { data } = await APIService.get('/topic');
            setTopics(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching topics');
        }
    };

    const tableHeader = [
        { Header: '#', accessor: 'id'},
        { Header: 'Topic', accessor: 'topic' },
        { Header: 'Version', accessor: 'version' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <EditModal data={[
                        row.original.id,
                        row.original.topic,
                        row.original.version,
                        row.original.details
                    ]}
                        labels={['Program', 'Topic', 'Version', 'Details']}
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
        // {
        //     Header: 'View Topics',
        //     accessor: 'viewTopics',
        //     Cell: ({ row }) => (
        //         <Link to={{ pathname: `/session-management/${row.id}` }}>
        //             <button>
        //                 <AudioFileRoundedIcon className='text-blue' />
        //             </button>
        //         </Link>
        //     )
        // }
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
    } = useTable({ columns: tableColumn, data: topics }, useSortBy, usePagination);

    const handleConfirmation = (id) => {
        setProgramId(id);
        setDeleteModalOpen(true)
    }
    
    const handleDelete = async () => {
        try {
            if (programId) {
                await APIService.delete(`/topic/${programId}`);
                await fetchPrograms();
                setDeleteModalOpen(false);
                toast.success('Topic deleted successfully');
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Topic';
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
                    <main className="main">
                        <div className="main-grid">
                            <div className="page-content">

                                {/* TOP CARD  */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Topic</div>
                                        <div>
                                            <Button style='small'>Core Topic</Button>
                                            <Button style='small'>Elective Topic</Button>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select
                                                    className='form-select'
                                                    name="courseType"
                                                    id="courseType"
                                                >
                                                    <option value=''>
                                                        Select Core Type
                                                    </option>

                                                    <option value=''>
                                                        Core
                                                    </option>

                                                    <option value=''>
                                                        Elective
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select
                                                    className='form-select'
                                                    name="courseName"
                                                    id="courseName"
                                                >
                                                    <option value=''>
                                                        Select Program Type
                                                    </option>

                                                    <option value=''>
                                                        Diploma in Sound Engineering
                                                    </option>

                                                    <option value=''>
                                                        Live Sound Elective
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select
                                                    className='form-select'
                                                    name="version"
                                                    id="version"
                                                >
                                                    <option value=''>
                                                        Select Version
                                                    </option>

                                                    <option value=''>
                                                        Core
                                                    </option>

                                                    <option value=''>
                                                        Elective
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <select
                                                    className='form-select'
                                                    name="session"
                                                    id="session"
                                                >
                                                    <option value=''>
                                                        Select Session 
                                                    </option>

                                                    <option value=''>
                                                        Diploma in Sound Engineering
                                                    </option>

                                                    <option value=''>
                                                        Live Sound Elective
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM CARD  */}
                                <div className='bottom-card h-[450px]'>
                                    <div className='card-header'>Topics</div>
                                    <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                        <table id='topicList' className='table max-h-3/5'>
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

export default TopicManagement