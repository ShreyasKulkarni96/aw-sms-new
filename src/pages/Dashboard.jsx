import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { jwtDecode } from 'jwt-decode';
import Roles from '../constants/roles'
import Button from '../components/Button';
import APIService from '../services/APIService';
import { REGISTER_USER } from '../constants/api';
import { toast } from "react-toastify";


const Dashboard = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const initialData = {
        name: "",
        DOB: "",
        gender: "",
        email: "",
        phone1: "",
        localAddress: "",
        permanentAddress: "",
        roleId: ''
    };

    const [formData, setFormData] = useState(initialData);

    let { name, DOB, gender, email, phone1, localAddress, permanentAddress, roleId } = formData;

    const filteredRoles = decodedToken.role === "ADMIN"
        ? Roles.filter(role => role.userRole !== "ADMIN")
        : Roles;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await APIService.post(REGISTER_USER, {
                headers: {
                    'Content-Type': 'application/json',
                    'userrole': `${decodedToken.role}`
                },
                body: JSON.stringify(formData),
            });

            const { data } = response;

            if (data.status === "success") {
                toast.success("User Registered Successfully!");
            }
            setFormData(initialData);
        } catch (error) {
            setFormData(initialData);
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            toast.error('Something Went Wrong');
        }
    };


    return (
        <div className="flex h-screen">
            <div>
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-10">
                    <div>
                        <h1 className='text-lg font-bold'>Hello ,<span className='text-orangePrimary'>{decodedToken.name}</span> . Welcome to the portal!</h1>
                    </div>
                    {(decodedToken.role === "ADMIN" || decodedToken.role === "SUPER_ADMIN") && (
                        <div className=' w-1/4 mt-2 h-full rounded-xl'>
                            <h1 className='mt-4 ml-2 text-xl font-extrabold text-gray-500'>Add a new user role</h1>
                            <form className='mt-4 ml-4 flex flex-col' onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-lg font-bold" htmlFor="roleId"> User Role:</label>
                                    <select className='form-select' id="roleId" name="roleId" value={roleId} onChange={handleInputChange}>
                                        <option value="">
                                            Select Role
                                        </option>
                                        {filteredRoles.map((role) => (
                                            <option key={role.userId} value={role.userId}>
                                                {role.userRole}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='mt-2'>
                                    <label className="block text-lg font-bold" htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-select"
                                        placeholder="Name"
                                        value={name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='mt-2' >
                                    <label className="block text-lg font-bold" htmlFor="DOB">Date of Birth:</label>
                                    <input
                                        type="date"
                                        id="DOB"
                                        name="DOB"
                                        className="form-select"
                                        value={DOB}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='mt-2' >
                                    <label className="text-lg font-bold" htmlFor="gender">Gender:</label>
                                    <div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="gender"
                                                name="gender"
                                                value="M"
                                                className="mr-1"
                                                checked={gender === "M"}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="gender" className="mr-4">Male</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="gender"
                                                name="gender"
                                                value="F"
                                                className="mr-1"
                                                checked={gender === "F"}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="gender">Female</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-2' >
                                    <label className="block text-lg font-bold" htmlFor="email">Email:</label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        className="form-select"
                                        placeholder="Email"
                                        value={email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='mt-2' >
                                    <label className="block text-lg font-bold" htmlFor="phone1">Phone 1:</label>
                                    <input
                                        type="text"
                                        name="phone1"
                                        id="phone1"
                                        className="form-select"
                                        placeholder="Phone"
                                        value={phone1}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='mt-2' >
                                    <label className="block text-lg font-bold" htmlFor="localAddress">Local Address:</label>
                                    <input
                                        type="text"
                                        name="localAddress"
                                        id="localAddress"
                                        className="form-select"
                                        placeholder="Local Address"
                                        value={localAddress}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='mt-2' >
                                    <label className="block text-lg font-bold" htmlFor="permanentAddress">Permanent Address:</label>
                                    <input
                                        type="text"
                                        name="permanentAddress"
                                        id="permanentAddress"
                                        className="form-select"
                                        placeholder="Permanent Address"
                                        value={permanentAddress}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='mt-4 flex justify-end' >
                                    <Button style='small' type="submit">Create</Button>
                                </div>
                            </form >
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;