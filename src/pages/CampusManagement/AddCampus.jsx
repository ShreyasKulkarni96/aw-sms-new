import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import cities from '../../constants/cities.json';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { toast } from 'react-toastify';
import APIService from '../../services/APIService';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

const AddCampus = () => {
    const spacesHeader = ['Type of space', 'Space Title', 'Space Capacity', 'Is Active', 'Action'];
    const spaceTypes = [
        'traditional classroom',
        'digital classroom',
        'seminar hall',
        'student lab',
        'recording studio',
        'music recording (small)',
        'music recording (large)',
        'dubbing',
        'foley',
        'film mix theater'
    ];

    const initialFormData = {
        facilityName: '',
        contactPerson: '',
        facilityAddress: '',
        contactPersonEmail: '',
        contactPersonNo: '',
        city: '',
    }
    const initialSpaceData = [{
        spaceId: '',
        typeOfSpace: '',
        spaceTitle: '',
        spaceCapacity: 0,
        isActive: 1
    }]
    const [mapSpace, setMapSpace] = useState([]);
    const navigate = useNavigate();
    const validEmailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const namePattern = /^[a-zA-Z .]{2,50}$/;
    const [formData, setFormData] = useState(initialFormData);
    const [spaceData, setSpaceData] = useState(initialSpaceData);
    const [AddSpacesModal, setAddSpacesModal] = useState(false);
    const { facilityName, contactPerson, facilityAddress, contactPersonEmail, contactPersonPhone, city } = formData;

    const onMutate = (e) => {
        const targetId = e.target.id;

        if (targetId.toLowerCase().includes('space')) {
            if (targetId === 'spaceCapacity') e.target.value = +e.target.value;

            // Map over the array and update the specific element
            setSpaceData(prevState => prevState.map((space, index) => {

                return { ...space, [targetId]: e.target.value };

            }));
            closeAddSpacesModal();
        }


        setFormData(prevState => ({ ...prevState, [targetId]: e.target.value }));
    };

    const openAddSpacesModal = () => {
        setAddSpacesModal(true);
    }

    const closeAddSpacesModal = () => {
        setAddSpacesModal(false);
    }

    const clearFormData = () => {
        setFormData(initialFormData);
    }

    const onSubmit = async () => {

        if (!facilityName) {
            toast.warn('Campus Name is required');
            return; // Don't proceed if it is not provided
        }

        if (!namePattern.test(facilityName)) {
            toast.warn('Please enter a valid Campus Name');
            return; // Don't proceed if it doesn't match the pattern
        }

        if (!contactPerson) {
            toast.warn('Campus Head Name is required');
            return; // Don't proceed if it is not provided
        }
        if (!namePattern.test(contactPerson)) {
            toast.warn('Please enter a valid Campus Head Name');
            return; // Don't proceed if it doesn't match the pattern
        }
        if (!facilityAddress) {
            toast.warn('Current Address is required.');
            return; // Don't proceed if it's empty
        }
        if (!contactPersonEmail) {
            toast.warn('Email is required');
            return; // Don't proceed if it is not provided
        }
        if (!validEmailRegEx.test(contactPersonEmail)) {
            toast.warn('Email is invalid');
            return; // Don't proceed if it doesn't match the pattern
        }

        const validMobileRegex = /^[6-9]\d{9}$/;
        if (!validMobileRegex.test(contactPersonPhone)) return toast.warn(' Phone No. is invalid');

        if (!city) {
            toast.warn('City is required');
            return; // Don't proceed if it is not provided
        }

        await addNewCampus();
        setSpaceData(initialSpaceData);
        setFormData(initialFormData);
    }

    const handleAddSpace = () => {
        setMapSpace((prevMapSpace) => [...prevMapSpace, ...spaceData]);
    }

    const addNewCampus = async () => {
        try {
            const payload = { ...formData };
            delete payload.spaceTitle;
            delete payload.typeOfSpace;
            delete payload.spaceCapacity;
            payload.contactPersonAddress = formData.facilityAddress;
            payload.spaceDetails = spaceData;
            const { data } = await APIService.post('/campus', payload);
            if (data.code === 201) toast.success('Campus Added Successfully');
            navigate('/campus-management');
            setSpaceData(initialSpaceData);
            setFormData(initialFormData)
        } catch (error) {
            console.log(error);
            setSpaceData(initialSpaceData);
            setFormData(initialFormData)
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            toast.error('Temporarily Unable to add campus');
        }
    }

    return (
        <>
            <div className="main-page">
                <div>
                    <Sidebar />
                </div>
                <div className="main-page-content">
                    <TopHeader />

                    <main className="main-div">
                        <div className='grid'>
                            <div className='col-span-12 mb-4'>
                                <div className='w-full border shadow-md p-4 border-gray-100 rounded-xl bg-white'>
                                    <div className='flex justify-between mb-4'>
                                        <div className='text-lg font-semibold text-gray-hover'>Add Campus</div>
                                        <div>
                                            <Link to='/campus-management'>
                                                <Button style="small">
                                                    <KeyboardBackspaceRoundedIcon className='icons mr-1' />
                                                    Back
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className="w-full">
                                            <div className="mb-4 mr-4">
                                                <label className="block text-base font-medium text-gray-600" htmlFor="facilityName">
                                                    Campus Name<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="facilityName"
                                                    className="w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                    placeholder="Campus Name"
                                                    onChange={onMutate}
                                                    value={formData.facilityName}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mb-4 mr-4">
                                                <label className="block text-base font-medium text-gray-600" htmlFor="contactPerson">
                                                    Campus Head Name <sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="contactPerson"
                                                    className="w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                    placeholder="Campus Head Name"
                                                    onChange={onMutate}
                                                    value={formData.contactPerson}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mb-4 mr-4">
                                                <label className="block text-base font-medium text-gray-600" htmlFor="facilityAddress">
                                                    Address<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="facilityAddress"
                                                    className="w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                    placeholder="Address"
                                                    onChange={onMutate}
                                                    value={formData.facilityAddress}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="block text-base font-medium text-gray-600" htmlFor="contactPersonEmail">
                                                    Email<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="contactPersonEmail"
                                                    className="w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                    placeholder="Email"
                                                    onChange={onMutate}
                                                    value={formData.contactPersonEmail}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-between mb-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="block text-base font-medium text-gray-600" htmlFor="contactPersonPhone">
                                                    Phone No<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="contactPersonPhone"
                                                    className="w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                    placeholder="Phone No"
                                                    onChange={onMutate}
                                                    value={formData.contactPersonNo}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="block text-base font-medium text-gray-600" htmlFor="contactPersonPhone">
                                                    Select City<sup className="text-red-600">*</sup>
                                                </label>
                                                <select id="city" className='w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400' onChange={onMutate} value={formData.city}>
                                                    <option value={''}>---Select City---</option>
                                                    {cities.map((city) => (
                                                        <option value={city.name}>
                                                            {city.name}</option>
                                                    ))}

                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full flex h-1/4 mt-7">
                                            <Button onClick={onSubmit} style='primary'>Save</Button>
                                            <Button style='cancle' onClick={clearFormData}>Cancle</Button>
                                        </div>
                                        <div className='w-full' />
                                    </div>
                                </div>
                                {/* -----------ADD SPACES--------- */}
                                <div className='w-full border shadow-md p-4 border-gray-100 rounded-xl bg-white mt-4'>
                                    <div className='flex justify-between mb-4'>
                                        <div className='text-lg font-semibold text-gray-hover'>Add Spaces</div>
                                        <div>
                                            <Button style="small" onClick={openAddSpacesModal}>
                                                Add Spaces
                                            </Button>
                                        </div>
                                    </div>

                                    {/* ---------------LIST OF SPACES------------ */}
                                    <div>
                                        <table className='table-auto w-full border overflow-y-auto'>
                                            <thead>
                                                <tr>
                                                    {spacesHeader.map((headers) => (
                                                        <th className='border text-left bg-orange-600 p-2 text-base font-semibold' >
                                                            {headers}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="overflow-y-auto">
                                                {mapSpace.map((space, idx) => {
                                                    return (
                                                        <tr key={space.spaceId || idx + 1}>
                                                            <td className='border p-2 text-base'>{space.typeOfSpace}</td>
                                                            <td className='border p-2 text-base'>{space.spaceTitle}</td>
                                                            <td className='border p-2 text-base'>{space.spaceCapacity}</td>
                                                            <td className='border p-2 text-base'>
                                                                {' '}
                                                                <span className={`badge rounded-pill bg-${space.isActive ? 'success' : 'danger'}`}>
                                                                    {space.isActive ? 'YES' : 'NO'}
                                                                </span>
                                                            </td>
                                                            <td className='border p-2 text-base'>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteSpace(space.spaceId)}
                                                                >
                                                                    <DeleteRoundedIcon className='delete-icon text-gray-600' />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div >
            </div>


            {/* --------------------------------------------MODAL FOR ADD SPACES------------------------------------------ */}
            {AddSpacesModal &&
                <div id='myModal' className='fixed inset-0 overflow-y-hidden'>
                    <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                        <div className='fixed inset-0 bg-gray-500 opacity-75'></div>
                        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
                                <div className='flex justify-between items-center '>
                                    <h3 className='text-lg font-semibold'>
                                        Add Space
                                    </h3>
                                    <CloseRoundedIcon onClick={closeAddSpacesModal} />
                                </div>
                                <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                                    <div className="mb-4">
                                        <label className="block text-base font-medium text-gray-600" htmlFor="typeOfSpace">
                                            Select City<sup className="text-red-600">*</sup>
                                        </label>
                                        <select id="typeOfSpace" className='w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400' onChange={onMutate}>
                                            <option value={''}>Select Type of Space</option>
                                            {spaceTypes.map((type) => (
                                                <option value={type}>
                                                    {type}</option>
                                            ))}

                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-base font-medium text-gray-600" htmlFor="spaceTitle">
                                            Space Title<sup className="text-red-600">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="spaceTitle"
                                            className="w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                            placeholder="Space Title"
                                            onChange={onMutate}

                                        />

                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-base font-medium text-gray-600" htmlFor="spaceCapacity">
                                            Space / Capacity<sup className="text-red-600">*</sup>
                                        </label>
                                        <input
                                            onChange={onMutate}
                                            type="number"
                                            id="spaceCapacity"
                                            className="w-full text-sm p-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                            placeholder="Space Capacity"

                                        />
                                    </div>
                                    <div class="flex justify-end">
                                        <Button style='small' onClick={handleAddSpace}>Save</Button>
                                        <Button style='cancle' onClick={closeAddSpacesModal}>Close</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }

        </>
    )
}

export default AddCampus