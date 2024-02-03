import React from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import APIService from "../../services/APIService";
import TopHeader from '../../components/TopHeader';

const AddStudent = () => {
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
                                <div className='top-card h-[800px]'>

                                </div>
                            </div>
                        </div>
                    </main>
                </div>

            </div>
        </>

    )
}

export default AddStudent