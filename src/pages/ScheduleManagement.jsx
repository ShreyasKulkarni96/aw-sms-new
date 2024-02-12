import React from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import FullCalendar from '@fullcalendar/react';

const ScheduleManagement = () => {
    return (
        <div className='main-page'>
            <div>
                <Sidebar />
            </div>
            <div className='main-page-content'>
                <TopHeader />
                <main className='main'>
                    <div className='main-grid'>
                        <div className='page-content'>
                            <div id="calendar">

                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ScheduleManagement