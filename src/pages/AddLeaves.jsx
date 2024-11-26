import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const AddLeaves = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;
    const userId = decodedToken.userId;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
    });

    const [error, setError] = useState('');

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const clearFormData = () => {
        setFormData({
            startDate: '',
            endDate: '',
            reason: '',
        });
        setError('');
    };

    const submitLeave = async () => {
        try {
            const headers = { userrole: userRole };
            const response = await APIService.post(`/leave/${userId}`, formData, { headers });
            alert('Leave added successfully!');
            navigate('/leave-management');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to add leave';
            setError(message);
            toast.error(error);
        }
    };

    return (
        <>
            <div className='flex h-screen'>
                <div>
                    <Sidebar />
                </div>
                <div className='flex-1 flex-col h-screen overflow-hidden'>
                    <TopHeader />
                    <main className='main'>
                        <div className='main-grid'>
                            <div className='page-content'>
                                <div className='top-card h-[300px] relative'>
                                    <div className='card-content'>
                                        <div className='card-header'>Add Leaves</div>
                                        <div>
                                            <Link to="/leave-management">
                                                <Button onClick={clearFormData} style='small'>
                                                    <KeyboardBackspaceRoundedIcon className='icons mr-1' />
                                                    Back
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='card-content mb-4'>
                                        <div className="mr-4 w-full">
                                            <label className="form-input" htmlFor="startDate">
                                                Date From<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                name="startDate"
                                                className="form-select"
                                                onChange={onChange}
                                                value={formData.startDate}

                                            />
                                        </div>
                                        <div className="mr-4 w-full">
                                            <label className="form-input" htmlFor="endDate">
                                                Date To<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="date"
                                                id="endDate"
                                                name="endDate"
                                                className="form-select"
                                                onChange={onChange}
                                                value={formData.endDate}

                                            />
                                        </div>
                                    </div>
                                    <div className='card-content mb-4'>
                                        <div className="mr-4 w-full">
                                            <label className="form-input" htmlFor="reason">
                                                Reason<sup className="important">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                id="reason"
                                                name="reason"
                                                className="form-select"
                                                onChange={onChange}
                                                value={formData.reason}
                                            />
                                        </div>
                                        <div className="mr-4 w-full">

                                        </div>
                                    </div>
                                    {error && <div className="error-message">{error}</div>}
                                    <div className="light-divider"></div>
                                    <div className='modal-button'>
                                        <Button style="small" onClick={submitLeave} >Add Leave</Button>
                                        <Button style="cancel" onClick={clearFormData}>Cancel</Button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default AddLeaves;