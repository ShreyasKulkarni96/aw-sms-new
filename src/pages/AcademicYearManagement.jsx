import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import Button from "../components/Button";
import APIService from "../services/APIService";
import { ACADEMIC_YEAR_URL } from "../constants/api";
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import DeleteModal from "../components/shared/DeleteModal";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

function AcademicYearManagement() {
    const [academicyears, setAcademicYears] = useState([]);
    const [academicYearId, setAcademicYearId] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchAcademicYear();
    }, []);

    const fetchAcademicYear = async () => {
        try {
            const { data } = await APIService.get(ACADEMIC_YEAR_URL);
            setAcademicYears(data.data);
        } catch (error) {
            toast.error('Some Error occurred while fetching academic year data');
        }
    };

    async function handleAddAcademicYear() {
        if (academicyears.length >= 10) return toast.error('Cannot add more Academic Years. Limit is upto 10 years.')
        try {
            const { data } = await APIService.post(ACADEMIC_YEAR_URL);
            setAcademicYears((prevState) => [...prevState, data.data]);
            toast.success('Academic year added successfully!')
        } catch (error) {
            toast.error('Some Error occured while fetching academic year data');
        }
    }

    const handleConfirmation = (id) => {
        setAcademicYearId(id);
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        try {
            if (academicYearId) {
                await APIService.delete(`${ACADEMIC_YEAR_URL}/${academicYearId}`);
                await fetchAcademicYear();
                toast.success('Academic year deleted successfully!')
            }
        } catch (error) {
            const errorMessage = "Temporarily unable to delete academic year";
            if (error.response && error.response.data) {
                return toast.error(errorMessage || error.response.data.message);
            }
            toast.error(errorMessage)
        }
        setDeleteModalOpen(false);
    }

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    }

    return (
        <>
            <div className="main-page">
                <div>
                    <Sidebar />
                </div>
                {/* Main Content */}
                <div className="main-page-content">
                    {/* Header */}
                    <TopHeader />

                    {/* Main Content Area */}
                    <main className="main-div">
                        <div className='ay-main-content'>
                            <div className='ay-addyear-div'>
                                <div></div>
                                <Button style='small' onClick={handleAddAcademicYear}>Add Year</Button>
                            </div>
                            <div>
                                <h4 className="ay-header">
                                    Academic Year (AY)
                                </h4>
                                {academicyears.map((academicYear) => {
                                    return (
                                        <>
                                            <div key={academicYear.id} className="ay-lists">
                                                {academicYear.name}
                                                <span className="ay-lists-icon" title="delete" onClick={() => handleConfirmation(academicYear.id)}>
                                                    <DeleteRoundedIcon className='icon-style' />
                                                </span>
                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    )
}

export default AcademicYearManagement;