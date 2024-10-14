import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const Reports = () => {
    return (
        <>
            <div className="flex h-screen">
                <div>
                    <Sidebar />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <TopHeader />
                </div>
            </div>
        </>
    )
};

export default Reports;