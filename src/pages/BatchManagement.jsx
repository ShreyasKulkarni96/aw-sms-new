import React, { useState, useMemo } from 'react';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import APIService from '../services/APIService';

import { useTable, useSortBy, usePagination } from 'react-table';


const BatchManagement = () => {
    const [batches, setBatches] = useState([]);
    const tableHeader = [
    { Header: '#', accessor: 'id' },
    { Header: 'Batch', accessor: 'batchCode' },
    { Header: 'Program Code', accessor: 'programId' },
    { Header: 'Start Date', accessor: 'startDate' },
    { Header: 'End Date', accessor: 'endDate' },
    { Header: 'Capacity', accessor: 'capacity' },
    { Header: 'Enrolled Count', accessor: 'enrolled' },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ row }) => (
        <Fragment>
          <button
            type="button"
            className="btn btn-primary btn-floating"
            data-bs-toggle="tooltip"
            title="Edit"
            data-toggle="modal"
            data-target="#edit_details"
            onClick={() => setEditBatchData({ ...row.original })}
          >
            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-floating"
            data-bs-toggle="tooltip"
            data-toggle="modal"
            data-target="#del_conf"
            title="Delete"
            onClick={() => setBatchId(row.original.id)}
          >
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </button>
        </Fragment>
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
  } = useTable({ columns: tableColumn, data: batches }, useSortBy, usePagination);

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
                                {/* --------------TOP CARD--------------- */}
                                <div className='top-card '>
                                    <div className='card-content'>
                                        <div className='card-header'>Create Batch</div>
                                    </div>
                                    <div className='card-content'>
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
                                                <label className="form-input" htmlFor="program">
                                                    Select Program
                                                </label>
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
                                        <div className="w-full mt-6 text-center">
                                            <Button style="small">Add Core batch</Button>
                                            <Button style="small">Add Elective batch</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* ------------------BOTTOM CARD------------- */}
                                <div className='bottom-card h-[600px]'>
                                    <div className='card-header'>List of Batches</div>
                                    <div className=' overflow-y-auto' style={{ maxHeight: '350px' }}>
                                        <table id='studentList' className='table max-h-3/5'>
                                            <thead>
                                                {headerGroups.map(headerGroup => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map(column => (
                                                            <th className='th'{...column.getHeaderProps(column.getSortByToggleProps())}>
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
                                                                        className={cell.column.id === 'action' ? 'tab_btn' : ''}
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

export default BatchManagement