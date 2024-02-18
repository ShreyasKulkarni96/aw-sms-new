import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
// import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ThreePRoundedIcon from '@mui/icons-material/ThreePRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';

const Sidebar = () => {
    const [openSection, setOpenSection] = useState(null);

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };


    return (
        <>
            <div className="sidebar">
                <div>
                    <div className='sidebar-logo'>
                        <img src={Logo} alt="sidebar-logo" />
                    </div>
                    <div className="divider"></div>
                </div>
                <div className='sidebar-menu'>
                    <nav>
                        <ul>
                            <li className='list-search'>
                                <SearchRoundedIcon className='icons' />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="search-input"
                                />
                            </li>

                            <div className="my-4 bg-gray-700 h-[1px]"></div>

                            {/* ---------------------DASHBOARD----------------------- */}
                            <Link to="/dashboard">
                                <li className='list'>
                                    <div className="list-items">
                                        <DashboardCustomizeRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                        <span className="list-name ml-4">Dashboard</span>
                                    </div>
                                </li>
                            </Link>

                            {/*-------------------STUDENT MANAGEMENT------------------*/}
                            <div>
                                <li className='list-dropdown'>
                                    <div onClick={() => handleSectionToggle('studentManagement')} className="list-items-dropdown">
                                        <GroupRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                        <span className='list-name ml-3'>Student Management</span>
                                        {openSection === "studentManagement" ? <KeyboardArrowUpRoundedIcon className='icons' /> : <KeyboardArrowDownRoundedIcon className='icons' />}
                                    </div>
                                </li>
                                <ul className={`ml-8 ${openSection === "studentManagement" ? 'block' : 'hidden'}`}>
                                    <Link to="/student-management">
                                        <li className='sublist'>
                                            <span className="list-name ml-5">Manage Student</span>
                                        </li>
                                    </Link>
                                    <Link to="/manage-batch">
                                        <li className='sublist'>
                                            <span className="list-name ml-5">Manage Batch</span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>

                            {/*-------------------------CAMPUS MANAGEMENT------------------------------*/}
                            <div>
                                <li className='list-dropdown'>
                                    <div className="list-items-dropdown" onClick={() => handleSectionToggle('campusManagement')} >
                                        <ApartmentRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                        <span className='list-name ml-3'>Campus Management</span>
                                        {openSection === "campusManagement" ? <KeyboardArrowUpRoundedIcon className='icons' /> : <KeyboardArrowDownRoundedIcon className='icons' />}
                                    </div>
                                </li>
                                <ul className={`ml-8 ${openSection === "campusManagement" ? 'block' : 'hidden'}`}>
                                    <Link to="/campus-management">
                                        <li className='sublist'>
                                            <span className="list-name ml-5">Manage Campus</span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>

                            {/* -----------------------PROGRAM MANAGEMENT---------------------------------------- */}
                            <div>
                                <li className='list-dropdown'>
                                    <div className="list-items-dropdown" onClick={() => handleSectionToggle('programManagement')} >
                                        <InventoryRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                        <span className='list-name ml-3'>Program Management</span>
                                        {openSection === "programManagement" ? <KeyboardArrowUpRoundedIcon className='icons' /> : <KeyboardArrowDownRoundedIcon className='icons' />}
                                    </div>
                                </li>
                                <ul className={`ml-8 ${openSection === "programManagement" ? 'block' : 'hidden'}`}>
                                    <Link to="/program-management">
                                        <li className='sublist'>
                                            <span className="list-name ml-5">Manage Program</span>
                                        </li>
                                    </Link>
                                    <Link to='/course-management'>
                                        <li className='sublist'>
                                            <span className="list-name ml-5">Manage Course</span>
                                        </li>
                                    </Link>
                                    <Link to='/session-management'>
                                        <li className='sublist'>
                                            <span className="list-name ml-5">Manage Session</span>
                                        </li>
                                    </Link>
                                    <Link to='/topic-management'>
                                        <li className='sublist'>
                                            <span className="list-name ml-5">Manage Topic</span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>

                            {/* ----------------------FACULTY MANAGEMENT----------------------------------------- */}
                            <Link to="/faculty-management">
                                <li className='list'>
                                    <div className="list-items">
                                        <BadgeRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                        <span className='list-name ml-4'>Faculty Management</span>
                                    </div>
                                </li>
                            </Link>

                            {/* ----------------------SCHEDULE MANAGEMENT------------------------------------------ */}
                            <Link to='/schedule-management'>
                                <li className='list'>
                                    <div className="list-items">
                                        <EditCalendarRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                        <span className='list-name ml-4'>Schedule Management</span>
                                    </div>
                                </li>
                            </Link>

                            {/* -----------------------ACCOUNT MANAGEMENT------------------------- */}
                            <Link to='/account-management'>
                                <li className='list'>
                                    <div className="list-items">
                                        <AccountBalanceRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                        <span className='list-name ml-4'>Account Management</span>
                                    </div>
                                </li>
                            </Link>

                            {/* ---------------------------------LEAVE MANAGEMENT----------------------------- */}
                            <Link to='/leave-management'>
                                <li className='list'>
                                    <div className="list-items">
                                        <ThreePRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                        <span className='list-name ml-4'>Leave Management</span>
                                    </div>
                                </li>
                            </Link>

                            {/* -----------------------ACADEMIC YEAR MANAGEMENT--------------------------*/}
                            <Link to='/academicyear-management'>
                                <li className='list'>
                                    <div className="list-items">
                                        <CalendarMonthRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                        <span className='list-name ml-4'>Academic Year Management</span>
                                    </div>
                                </li>
                            </Link>

                            {/* --------------------------LOGOUT---------------------*/}
                            <li className='list'>
                                <div className="list-items">
                                    <LogoutRoundedIcon className='icons' style={{ fontSize: '26px' }} />
                                    <span className='list-name ml-4'>Logout</span>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Sidebar