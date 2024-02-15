import React, { useState, useEffect, useMemo } from 'react';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import APIService from '../services/APIService';

import { useTable, useSortBy, usePagination } from 'react-table';

const LeaveManagement = () => {

    return (
        <>
            <div className="main-page">
                <div>
                    <Sidebar />
                </div>
                <div className="main-page-content">
                    <TopHeader />
                    <main className="main">
                        <div className="main-grid">
                            <div className="page-content">

                                <div>
                                    <div className='w-full'>
                                        <div className="card-content">
                                            <div className="card-title"> Welcome Back </div>
                                        </div>

                                        {/* Leave Card  */}
                                        <div className='flex space-x-6'>
                                            <div className="card-1">
                                                <div className="card-content">
                                                    <div className='text-2xl text-orange-400 font-bold'>
                                                        Casual Leave
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-1">
                                                <div className="card-content">
                                                    <div className='text-2xl text-orange-400 font-bold'>
                                                        Sick Leave
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-1">
                                                <div className="card-content">
                                                    <div className='text-2xl text-orange-400 font-bold'>
                                                        Annual Leave
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-1">
                                                <div className="card-content">
                                                    <div className='text-2xl text-orange-400 font-bold'>
                                                        Leave
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* LEAVE REQUEST CARD  */}
                                        <div>
                                            <div className="card-2">
                                                <div className='card-header'>Leave Request</div>
                                                <div className='overflow-auto' style={{ maxHeight: '350px' }}>
                                                    {/* <table id='leaveList' className='table max-h-3/5'>
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

                                                    </table> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-2/6'>
                                        <div className='flex justify-end'>
                                            <Button style="sample">
                                                Sample
                                            </Button>
                                        </div>
                                        <div className="card-3">
                                            <div className='card-content'>
                                                <div className="text-2xl font-bold">
                                                    Who's On Leave
                                                </div>
                                            </div>
                                            <hr className="w-full h-1 my-2 bg-gray-200 border-0 rounded dark:bg-gray-700" />
                                            <div className='card-content'>
                                                <div className='text-xl font-bold'> On Leave: </div>
                                                <select
                                                    className='day-select'
                                                    name="day"
                                                    id="day"
                                                >
                                                    <option value=''>
                                                        Today
                                                    </option>

                                                    <option value=''>
                                                        ---
                                                    </option>

                                                </select>
                                            </div>
                                        </div>
                                        <div className="card-3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default LeaveManagement