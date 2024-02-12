import React, { useEffect, useState, useMemo } from 'react';

import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';

import APIService from '../../services/APIService';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { COURSE } from '../../constants/api';

const CourseManagement = () => {
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
                                {/* ------------------------------TOP CARD----------------------------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Courses</div>
                                    </div>
                                    <div className='card-content'>
                                        <div className=' w-full'>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value={'core'}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Core</label>
                                            </label>
                                            <label className="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value={'elective'}
                                                />
                                                <label className="filter-name" htmlFor="flexRadioDefault1">Elective</label>
                                            </label>
                                            <label class="filter-label">
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    value={'ALL'}
                                                />
                                                <label class="filter-name" htmlFor="flexRadioDefault1">All</label>
                                            </label>
                                        </div>
                                        <div className='w-full mb-2'>
                                            <select className="form-select" name="filterByProgram">
                                                <option value={''}>Select Program</option>
                                            </select>
                                        </div>
                                        <div className='w-full text-right'>
                                            <Button style='small'>Add Core Course</Button>
                                            <Button style='small'>Add Elective Course</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <div className='bottom-card h-[630px]'>
                                    <div className='card-header'>Program Lists</div>
                                    <div className='overflow-auto' style={{ maxHeight: '600px' }}>
                                        <table id='programList' className='table '>
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
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )

}

export default CourseManagement;