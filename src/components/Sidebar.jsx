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
    const [toggleStudentList, setToggleStudentList] = useState(false);
    const [toggleCampusList, setToggleCampusList] = useState(false);
    const [toggleProgramList, setToggleProgramList] = useState(false);

    const onToggleStudentList = () => {
        setToggleStudentList(!toggleStudentList);
        setToggleProgramList(false);
        setToggleCampusList(false);
    }

    const onToggleCampusList = () => {
        setToggleCampusList(!toggleCampusList);
        setToggleProgramList(false);
        setToggleStudentList(false);
    }

    const onToggleProgramList = () => {
        setToggleProgramList(!toggleProgramList);
        setToggleStudentList(false);
        setToggleCampusList(false);
    }

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

                            <div className="my-6 bg-gray-700 h-[1px]"></div>

                            {/* Dashboard */}
                            <Link>
                                <li className='list'>
                                    <div className="list-items">
                                        <DashboardCustomizeRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                        <span className="list-name ml-6">Dashboard</span>
                                    </div>
                                </li>
                            </Link>

                            {/* Student Management */}
                            <div>
                                <li className='list-dropdown'>
                                    <div onClick={onToggleStudentList} className="list-items-dropdown">
                                        <GroupRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                        <span className='list-name'>Student Management</span>
                                        {toggleStudentList ? <KeyboardArrowUpRoundedIcon className='icons' /> : <KeyboardArrowDownRoundedIcon className='icons' />}
                                    </div>
                                </li>
                                <ul className={`ml-8 ${toggleStudentList ? 'block' : 'hidden'}`}>
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

                            {/* Campus Management */}
                            <div>
                                <li className='list-dropdown'>
                                    <div className="list-items-dropdown" onClick={onToggleCampusList} >
                                        <ApartmentRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                        <span className='list-name'>Campus Management</span>
                                        {toggleCampusList ? <KeyboardArrowUpRoundedIcon className='icons' /> : <KeyboardArrowDownRoundedIcon className='icons' />}
                                    </div>
                                </li>
                                <ul className={`ml-8 ${toggleCampusList ? 'block' : 'hidden'}`}>
                                    <Link to="/campus-management">
                                        <li className='sublist'>
                                            <span className="list-name ml-5">Manage Campus</span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>

                            {/* Program Management */}
                            <div>
                                <li className='list-dropdown'>
                                    <div className="list-items-dropdown" onClick={onToggleProgramList} >
                                        <InventoryRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                        <span className='list-name ml-2'>Program Management</span>
                                        {toggleProgramList ? <KeyboardArrowUpRoundedIcon className='icons' /> : <KeyboardArrowDownRoundedIcon className='icons' />}
                                    </div>
                                </li>
                                <ul className={`ml-8 ${toggleProgramList ? 'block' : 'hidden'}`}>
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

                            {/* Faculty Management */}
                            <Link to="/faculty-management">
                                <li className='list'>
                                    <div className="list-items">
                                        <BadgeRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                        <span className='list-name ml-6'>Faculty Management</span>
                                    </div>
                                </li>
                            </Link>

                            {/* Schedule Management */}
                            <Link to='/schedule-management'>
                                <li className='list'>
                                    <div className="list-items">
                                        <EditCalendarRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                        <span className='list-name ml-6'>Schedule Management</span>
                                    </div>
                                </li>
                            </Link>

                            {/* Account Management */}
                            <Link to='/account-management'>
                                <li className='list'>
                                    <div className="list-items">
                                        <AccountBalanceRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                        <span className='list-name ml-6'>Account Management</span>
                                    </div>
                                </li>
                            </Link>

                            <Link>
                                <li className='list'>
                                    <div className="list-items">
                                        <ThreePRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                        <span className='list-name ml-6'>Leave Management</span>
                                    </div>
                                </li>
                            </Link>

                            {/* Academic Year Management */}
                            <Link to='/academicyear-management'>
                                <li className='list'>
                                    <div className="list-items">
                                        <CalendarMonthRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                        <span className='list-name ml-6'>Academic Year Management</span>
                                    </div>
                                </li>
                            </Link>

                            {/* Logout */}
                            <li className='list'>
                                <div className="list-items">
                                    <LogoutRoundedIcon className='icons' style={{ fontSize: '20px' }} />
                                    <span className='list-name ml-6'>Logout</span>
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