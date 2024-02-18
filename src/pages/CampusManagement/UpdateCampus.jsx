import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import { Link, useParams } from 'react-router-dom';
import cities from '../../constants/cities.json';
import { toast } from 'react-toastify';
import APIService from '../../services/APIService';
import { useTable, useSortBy, usePagination } from 'react-table';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const UpdateCampus = () => {
    const params = useParams();
    const [openSection, setOpenSection] = useState(null);
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
        contactPersonPhone: '',
        city: ''
    }
    const [data, setData] = useState({
        spaceDetails: []
    });
    const [formData, setFormData] = useState(initialFormData);
    const [spaces, setSpaces] = useState([]);
    const [spaceData, setSpaceData] = useState({
        spaceId: '',
        typeOfSpace: '',
        spaceTitle: '',
        spaceCapacity: 0,
        isActive: 1
    });

    const {
        facilityName,
        contactPerson,
        facilityAddress,
        contactPersonEmail,
        contactPersonPhone,
        contactPersonAddress,
        city
    } = formData;

    useEffect(() => {
        fetchCampusDetails();
    }, [params.campusId]);

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleAddSpaces = () => {
        handleSectionToggle('addSpaces');
    }

    const fetchCampusDetails = async () => {
        try {
            const { data } = await APIService.get(`/campus/${params.campusId}`);
            setFormData(prevState => ({
                ...prevState,
                facilityName: data.data.facilityName,
                contactPerson: data.data.contactPerson,
                facilityAddress: data.data.facilityAddress,
                contactPersonEmail: data.data.contactPersonEmail,
                contactPersonPhone: data.data.contactPersonPhone,
                contactPersonAddress: data.data.contactPersonAddress,
                city: data.data.city
            }));
            setData(data.data);
        } catch (error) {
            toast.error('Temporarily unable to Campus  details');
        }
    }
    const onMutate = async e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async () => {
        const payload = {
            facilityName,
            contactPerson,
            facilityAddress,
            contactPersonEmail,
            contactPersonPhone,
            contactPersonAddress,
            city,
            spaceDetails: [
                ...data.spaceDetails, // Include existing spaces
                ...spaces // Include newly added spaces
            ]
        };
        await updateCampus(payload);
        clearFormData();
        setSpaces([]);
    }

    const updateCampus = async campusDetails => {
        try {
            const payload = { ...formData };
            payload.contactPersonAddress = formData.facilityAddress;
            const { data } = await APIService.patch(`/campus/${params.campusId}`, campusDetails);
            if (data.code === 200) toast.success('Campus Updated Successfully');
        } catch (error) {
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            toast.error('Temporarily Unable to Update Details');
        }
    }

    const clearFormData = () => {
        const clearedForm = {};
        for (const key in formData) clearedForm[key] = '';
        setFormData(clearedForm);
    };

    const tableHeader = [
        { Header: 'Serial No.', accessor: 'serialNo' },
        { Header: 'Space ID', accessor: 'spaceId' },
        { Header: 'Type of Space', accessor: 'typeOfSpace' },
        { Header: 'Space Title', accessor: 'spaceTitle' },
        { Header: 'Space Capacity', accessor: 'spaceCapacity' },
        { Header: 'Is Active', accessor: 'isActive' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <>
                    <button title="delete" onClick={() => handleDeleteSpace(row.original.id)}><DeleteRoundedIcon className='delete-icon text-gray-600' /></button>
                </>
            )
        }
    ]

    const tableColumn = useMemo(() => tableHeader, []);

    const updateSpacesWithSerialNo = useMemo(() => {
        return data.spaceDetails.map((space, index) => {
            return {
                ...space,
                serialNo: index + 1,
            };
        });
    }, [data]);

    const {
        headerGroups,
        getTableBodyProps,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        previousPage,
        nextPage,
        state: { pageIndex }
    } = useTable({
        columns: tableColumn, data: updateSpacesWithSerialNo
    }, useSortBy, usePagination);

    const saveAddSPaces = () => {
        spaceData.spaceId = Date.now().toString();
        spaceData.isActive = 1;

        // Check if "spaceTitle" is provided
        if (!spaceData.typeOfSpace) {
            toast.warn('Please Select a Type of Space');
            return; // Don't proceed if it is not provided
        }
        // Check if "spaceCapacity" is provided
        if (!spaceData.spaceTitle) {
            toast.warn('Space Title is required');
            return; // Don't proceed if it is not provided
        }

        // Check if "spaceCapacity" is provided
        if (!spaceData.spaceCapacity) {
            toast.warn('Space Capacity is required');
            return; // Don't proceed if it is not provided
        }

        setSpaces(prevState => [...prevState, spaceData]);
        clearSpaceData();
    }

    const clearSpaceData = () => {
        const clearedForm = {};
        for (const key in spaceData) clearedForm[key] = '';
        setSpaceData(clearedForm);
    };

    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className="main-page-content">
                    <TopHeader />
                    <main className='main'>
                        <div className='main-grid'>
                            <div className='page-content'>
                                {/* ------------------------------TOP CARD----------------------------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Update Campus</div>
                                        <div className='text-right'>
                                            <Link to='/campus-management'>
                                                <Button style="small">
                                                    <KeyboardBackspaceRoundedIcon className='icons mr-1' />
                                                    Back
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="facilityName">
                                                    Campus Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="facilityName"
                                                    id="facilityName"
                                                    className="form-select"
                                                    placeholder="Campus Name"
                                                    value={facilityName}
                                                    onChange={onMutate}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="contactPerson">
                                                    Campus Head Name<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="contactPerson"
                                                    name="contactPerson"
                                                    className="form-select"
                                                    placeholder='contactPerson'
                                                    value={contactPerson}
                                                    onChange={onMutate}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="facilityAddress">
                                                    Address<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="facilityAddress"
                                                    name="facilityAddress"
                                                    className="form-select"
                                                    placeholder="Address"
                                                    value={facilityAddress}
                                                    onChange={onMutate}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div>
                                                <label className="form-input" htmlFor="selectStudent" id="contactPersonEmail">
                                                    Email<sup className="text-red-600">*</sup>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="contactPersonEmail"
                                                    name="contactPersonEmail"
                                                    className="form-select"
                                                    placeholder="Email"
                                                    value={contactPersonEmail}
                                                    onChange={onMutate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="contactPersonPhone">
                                                    Phone No
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={10}
                                                    name="contactPersonPhone"
                                                    id="contactPersonPhone"
                                                    className="form-select"
                                                    placeholder="Phone No"
                                                    value={contactPersonPhone}
                                                    onChange={onMutate}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="city">
                                                    Select City
                                                </label>
                                                <select id="city" className='form-select' value={city} onChange={onMutate}>
                                                    <option value={''}>---Select City---</option>
                                                    {cities.map((city) => (
                                                        <option value={city.name}>
                                                            {city.name}</option>
                                                    ))}

                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                        </div>
                                        <div className="w-full mt-6 text-right">
                                            <Button style='small' onClick={onSubmit}>Save</Button>
                                            <Button style='cancel' onClick={clearFormData} >Cancel</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* -------------------------------------ADD SPACES-------------------------------------- */}
                                <div className='bottom-card h-[550px]'>
                                    <div className='card-content mb-2'>
                                        <div className='card-header'>Update Spaces</div>
                                        <div>
                                            <Button onClick={handleAddSpaces} style="small">
                                                Add Spaces
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='overflow-auto' style={{ maxHeight: '500px' }}>
                                        <table id='spaceList' className='table'>
                                            <thead className='table-head'>
                                                {headerGroups.map(headerGroup => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map(column => (
                                                            <th className='th' {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                                {column.render('Header')}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody {...getTableBodyProps()}>
                                                {page.map((row) => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map((cell) => {
                                                                return (
                                                                    <td className='td' {...cell.getCellProps()}>
                                                                        {cell.render('Cell')}
                                                                    </td>
                                                                )
                                                            })}
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
                </div>
            </div>
            {/* -------------------------------------------ADD SPACES MODAL-------------------------------------- */}
            {openSection === 'addSpaces' &&
                <div className='modal-open'>
                    <div className="modal-wrapper">
                        <div className="modal-opacity">
                            <div className="modal-op"></div>
                        </div>
                        <div className="modal-content">
                            <div className="modal-title-content">
                                <div className="modal-title-wrapper">
                                    <h3 className="modal-title">Add Spaces</h3>
                                    <button onClick={clearSpaceData} className="edit-cancel-button">
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="modal-section">
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" id="typeOfSpace">
                                            Select City<sup className="important">*</sup>
                                        </label>
                                        <select id="typeOfSpace" className='form-select' value={spaceData.typeOfSpace} onChange={e => setSpaceData({ ...spaceData, typeOfSpace: e.target.value })}>
                                            <option value={''}>Select Type of Space</option>
                                            {spaceTypes.map((type) => (
                                                <option value={type}>
                                                    {type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="spaceTitle">
                                            Space Title<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            name="spaceTitle"
                                            id="spaceTitle"
                                            className="form-select"
                                            placeholder="Space Title"
                                            value={spaceData.spaceTitle}
                                            onChange={e => setSpaceData({ ...spaceData, spaceTitle: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='card-content mt-2'>
                                    <div className="w-full">
                                        <label className="form-input" htmlFor="spaceCapacity">
                                            Space / Capacity<sup className="important">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            name="spaceCapacity"
                                            id="spaceCapacity"
                                            className="form-select"
                                            placeholder="Space / Capacity"
                                            value={spaceData.spaceCapacity}
                                            onChange={e => setSpaceData({ ...spaceData, spaceCapacity: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="light-divider"></div>
                            <div className='modal-button'>
                                <Button style='small' onClick={saveAddSPaces}>Save</Button>
                                <Button style='cancel' onClick={clearSpaceData}>Close</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default UpdateCampus