import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import TableComponent from '../components/TableComponent';
import DownloadIcon from '@mui/icons-material/Download';
import GridViewIcon from '@mui/icons-material/GridView';

const Reports = () => {
    // Dummy list of reports
    const dummyReports = [
        { id: 1, reportName: 'Student Reports', reportType: 'StudentReports' }
    ];

    const [reportsData, setReportsData] = useState(dummyReports);
    const [loading, setLoading] = useState(false);

    // Handle row click to pass the id
    const handleReportClick = (id) => {
        console.log(`Clicked report with ID: ${id}`);
        // Add your logic here (e.g., navigation or fetching details)
    };

    const handleDownload = (reportType) => {
        console.log(`Downloading report of type: ${reportType}`);
        // Simulate download logic here
    };

    const columns = useMemo(
        () => [
            { Header: 'Serial No.', accessor: 'id' },
            {
                Header: 'List of Reports',
                accessor: 'reportName',
                Cell: ({ row }) => (
                    <span
                        onClick={() => handleReportClick(row.original.id)}
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    >
                        {row.original.reportName}
                    </span>
                ),
            },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <>
                        <button>
                            <GridViewIcon className="icon-style mr-2" />
                        </button>
                        <button onClick={() => handleDownload(row.original.reportType)}>
                            <DownloadIcon className="icon-style" />
                        </button>
                    </>
                ),
            },
        ],
        []
    );

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopHeader />
                <main>
                    <div className="main-grid">
                        <div className="page-content">
                            <div className="top-card">
                                <div className="card-content">
                                    <div className="card-header">Reports List</div>
                                </div>
                            </div>
                            <TableComponent
                                columns={columns}
                                data={reportsData}
                                tableName="Reports"
                                isButton={false}
                                height="700px"
                                loading={loading}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Reports;
