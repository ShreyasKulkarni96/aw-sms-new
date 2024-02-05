import { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import APIService from '../../services/APIService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded';
import DeleteModal from '../../components/shared/DeleteModal';
import EditModal from '../../components/shared/EditModal';

const ProgramManagement = () => {
    const [programs, setPrograms] = useState([]);
    const [programId, setProgramId] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const { data } = await APIService.get('/program');
            setPrograms(data.data);
        } catch (error) {
            console.log(error);
            toast.error('Some Error occurred while fetching programs');
        }
    };

    const tableHeader = [
        { Header: 'Sr.No', accessor: 'id' },
        { Header: 'Code', accessor: 'programCode' },
        { Header: 'Name', accessor: 'programName' },
        { Header: 'Type', accessor: 'type' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <EditModal data={[
                        row.original.id,
                        row.original.programCode,
                        row.original.programName,
                        row.original.type,
                        row.original.details
                    ]}
                        labels={['Program Code', 'Program Name', 'Type', 'Details']}
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
            Header: 'Show Courses',
            accessor: 'showCourses',
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
    } = useTable({ columns: tableColumn, data: programs }, useSortBy, usePagination);

    const handleConfirmation = (id) => {
        setProgramId(id);
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        try {
            if (programId) {
                await APIService.delete(`/program/${programId}`);
                await fetchPrograms();
                setDeleteModalOpen(false);
                toast.success('Program deleted successfully');
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Program';
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

                                {/* TOP CARD  */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                    <div className='card-header'>Programs</div>
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
                                        <div>
                                            <Button style='small'>Core Program</Button>
                                            <Button style='small'>Elective Program</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM CARD  */}
                                <div className='bottom-card h-[450px]'>
                                    <div className='card-header'>Program Lists</div>
                                    <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                        <table id='programList' className='table max-h-3/5'>
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

                                {/*-------------PAGINATION------------*/}
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

            {/* ----------------MODAL POPUP FOR CORE PROGRAM-------------- */}
            <div>

            </div>
            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default ProgramManagement