import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import TableComponent from '../components/TableComponent';
import DownloadIcon from '@mui/icons-material/Download';
import GridViewIcon from '@mui/icons-material/GridView';

const Reports = () => {

    const columns = React.useMemo(
        () => [
            { Header: 'Serial No.', accessor: 'id' },
            {
                Header: 'List of Reports',
                accessor: 'listsOfReports',
            },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <>
                        <button>
                            <GridViewIcon className='icon-style mr-2' />
                        </button>
                        <button>
                            <DownloadIcon className='icon-style' />
                        </button>
                    </>
                )
            }
        ], []
    );


    const data = [
        {
            id: 1,
            listsOfReports: 'Annual Financial Report',
            action: ''
        },
        {
            id: 2,
            listsOfReports: 'Quarterly Performance Report',
            action: ''
        },
        {
            id: 3,
            listsOfReports: 'Customer Feedback Report',
            action: ''
        },
        {
            id: 4,
            listsOfReports: 'Employee Satisfaction Report',
            action: ''
        },
        {
            id: 5,
            listsOfReports: 'Market Analysis Report',
            action: ''
        }
    ];

    return (
        <>
            <div className="flex h-screen">
                <div>
                    <Sidebar />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <TopHeader />
                    <main>
                        <div className='main-grid'>
                            <div className='page-content'>
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Reports List</div>
                                    </div>
                                </div>
                                {/* -----------------------------BOTTOM CARD---------------------------------- */}
                                <TableComponent columns={columns} data={data} tableName="Course Lists" isButton={false} height="700px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
};

export default Reports;