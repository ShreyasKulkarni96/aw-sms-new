import React from 'react';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

function TopHeader() {
    return (
        <>
            <div className='topheader-wrapper'>
                <nav className='flex'>
                    <ol className='topheader-breadcrum'>
                        <li className='inline-flex items-center'>
                            <a className="inline-flex text-sm items-center font-medium text-gray-700 hover:text-grey cursor-pointer">
                                <HomeRoundedIcon className="w-3 h-3 me-2.5" style={{ fontSize: "18px" }} />
                                Dashboard
                            </a>
                        </li>
                    </ol>
                </nav>
                <div className='topheader-searchbar'>
                    <SearchRoundedIcon className='text-black' />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="topheader-searchbar-input"
                    />
                </div>
                <nav>
                    <ul className='flex'>
                        <li className='mr-6'>
                            <PersonRoundedIcon className='icon-style' />
                        </li>
                        <li className='mr-6'>
                            <NotificationsRoundedIcon className='icon-style' />
                        </li>
                        <li className='mr-6'>
                            <SettingsRoundedIcon className='icon-style' />
                        </li>
                    </ul>
                </nav>
            </div >
        </>

    )
}

export default TopHeader;