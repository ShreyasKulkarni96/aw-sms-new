import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const Dashboard = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };


    return (
        <>
            <div className="flex h-screen">
                <div>
                    <Sidebar />
                </div>
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <TopHeader />

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-10">
                        Main Content
                        <button className="bg-blue-500 p-2 mt-4" onClick={togglePopup}>
                            Open Popup
                        </button>
                    </main>
                </div>
                {isPopupVisible && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <p>Popup Content</p>
                            <button className="bg-red-500 text-white p-2 mt-4" onClick={togglePopup}>
                                Close Popup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Dashboard