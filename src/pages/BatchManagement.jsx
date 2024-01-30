import React from 'react';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const BatchManagement = () => {
    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className='main-page-content'>
                    <TopHeader />
                </div>
            </div>
        </>
    )
}

export default BatchManagement