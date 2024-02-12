import React, { useState, useEffect, useMemo} from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import APIService from '../../services/APIService';

import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteModal from '../../components/shared/DeleteModal';

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const { data } = await APIService.get('/session');
            setSessions(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching sessions');
        }
    };

    const tableHeader = [
        { Header: '#', accessor: 'id'},
        { Header: 'Session Code', accessor: 'sessionCode' },
        { Header: 'Name', accessor: 'sessionName' },
        { Header: 'Duration', accessor: 'duration'},
        { Header: 'Type', accessor: 'type' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <EditModal data={[
                        row.original.id,
                        row.original.sessionCode,
                        row.original.sessionName,
                        row.original.duration,
                        row.original.type,
                        row.original.details
                    ]}
                        labels={['Program', 'Session Code', 'Name', 'Duration', 'Type', 'Details']}
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
            Header: 'View Topics',
            accessor: 'viewTopics',
            Cell: ({ row }) => (
                <Link to={{ pathname: `/session-management/${row.id}` }}>
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
    } = useTable({ columns: tableColumn, data: sessions }, useSortBy, usePagination);

    const handleConfirmation = (id) => {
        setProgramId(id);
        setDeleteModalOpen(true)
    }
    
    const handleDelete = async () => {
        try {
            if (programId) {
                await APIService.delete(`/session/${programId}`);
                await fetchPrograms();
                setDeleteModalOpen(false);
                toast.success('Session deleted successfully');
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Session';
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

    const filterSessions = async e => {
        if (e.target.value !== 'ALL' && e.target.name !== 'filterByCourse') setFilterOn(false);
        if (e.target.value === 'ALL') {
          setFilterOn(true);
          await fetchSession();
          return;
        }
        if (e.target.name === 'filterByType') {
          let filterVal = e.target.value;
          if (!filterVal) {
            await fetchCourses();
            await fetchSession();
            return;
          }
          // filterVal = parseInt(e.target.value);
          const filteredCourses = courses.filter(item => item.type === filterVal);
          setCourses(filteredCourses);
          const filteredSessions = session.filter(item => item.course.type === filterVal);
          setSession(filteredSessions);
          return;
        }
        if (e.target.name === 'filterByCourse') {
          let filterVal = e.target.value;
          if (!filterVal) {
            await fetchSession();
            return;
          }
          filterVal = parseInt(e.target.value);
          const filteredSessions = session.filter(item => item.courseId === filterVal);
          setSession(filteredSessions);
          return;
        }
        const filteredSessions = session.filter(item => item.type === e.target.value);
        setSession(filteredSessions);
      };


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

                                {/* TOP CARD  */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Session </div>
                                    </div>
                                    <div className='card-content'>
                                    <div className="w-full">
                                        <div className="mr-4">

                                            <select
                                                className='form-select'
                                                name="courseType"
                                                id="courseType"
                                            >
                                                <option value=''>
                                                    Select Course Type
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
                                                    Select Course 
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="w-full mt-6 text-center">
                                        <Button style="small">Core Session</Button>
                                        <Button style="small">Elective Session</Button>
                                    </div>
                                    </div>
                                    <div className='card-content'>
                                        <div className='mt-2'>
                                            <label class="inline-flex items-center mr-6">
                                                <input type="radio" class="form-radio" name="session" onChange={filterSessions} value="classroom" />
                                                <span class="ml-2 text-base font-medium">Classroom</span>
                                            </label>

                                            <label class="inline-flex items-center mr-6">
                                                <input type="radio" class="form-radio" name="session" onChange={filterSessions} value="lab" />
                                                <span class="ml-2 text-base font-medium">Lab</span>
                                            </label>

                                            <label class="inline-flex items-center mr-6">
                                                <input type="radio" class="form-radio" name="session" onChange={filterSessions} value="studio" />
                                                <span class="ml-2 text-base font-medium">Studio</span>
                                            </label>

                                            <label class="inline-flex items-center mr-6">
                                                <input type="radio" class="form-radio" name="session" onChange={filterSessions} value="fieldvisit" />
                                                <span class="ml-2 text-base font-medium">Field Visit</span>
                                            </label>

                                            <label class="inline-flex items-center mr-6">
                                                <input type="radio" class="form-radio" name="session" onChange={filterSessions} value="all" />
                                                <span class="ml-2 text-base font-medium">All</span>
                                            </label>

                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM CARD  */}
                                <div className='bottom-card h-[450px]'>
                                    <div className='card-header'>Program Lists</div>
                                    <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                        <table id='sessionList' className='table max-h-3/5'>
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

export default SessionManagement