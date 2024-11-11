import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import TopHeader from '../../components/TopHeader';
import { Link } from 'react-router-dom';
import TableComponent from '../../components/TableComponent';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteModal from '../../shared/DeleteModal';
import { toast } from 'react-toastify';
import APIService from "../../services/APIService";

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await APIService.get('/student-details');
            setStudents(data.data);
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            toast.error('Some Error occurred while fetching Students data');
        }
    }

    const handleDeleteConfirmation = (id) => {
        setStudentId(id);
        setDeleteModalOpen(true);
    }

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    }

    const handleDelete = async () => {
        try {
            if (studentId) {
                await APIService.delete(`/student-details/${studentId}`);
                await fetchStudents();
                toast.success('Student deleted successfully')
            }
        } catch (error) {
            const errorMessage = 'Temporarily Unable to delete Student';
            if (error.response && error.response.data) {
                return toast.error(errorMessage || error.response.data.message);
            }
            toast.error(errorMessage)
        }
        setDeleteModalOpen(false);
    }

    const columns = React.useMemo(
        () => [
            { Header: 'Serial No.', accessor: 'serialNo' },
            { Header: 'Unique_ID', accessor: 'U_S_ID' },
            { Header: 'Name', accessor: 'studentName' },
            { Header: 'Phone', accessor: 'phone1' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Parent/Guardian', accessor: 'guardianDetails.name' },
            { Header: 'DOB', accessor: 'DOB' },
            { Header: 'Gender', accessor: 'gender' },
            { Header: 'Enrollment Date', accessor: `enrolledAt` },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <>
                        <Link to={`/edit-student/${row.original.studentId}`}>
                            <button className="mr-2"><BorderColorRoundedIcon className='icon-style' /></button>
                        </Link>
                        <button onClick={() => handleDeleteConfirmation(row.original.studentId)}><DeleteRoundedIcon className='icon-style' /></button>
                    </>
                )
            }
        ], []
    );

    const studentWithSerialNo = useMemo(() => {
        return students.map((student, index) => {
            const formattedEnrolledAt = new Date(student.enrolledAt).toISOString().replace('T', ' ').split('.')[0]; // Format enrollment date
            return {
                ...student,
                serialNo: index + 1,
                enrolledAt: formattedEnrolledAt
            };
        });
    }, [students]);

    const handleImportButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = async e => {
        const fileInput = document.getElementById('fileInput');
        const file = e.target.files[0];

        if (!file) {
            toast.error('Please select a file to import students.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            await APIService.post('/student-addBulk', formData);

            toast.success('Bulk students imported successfully.');
            fetchStudents();
            // Reset the file input field
            fileInput.value = null;
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data.message === 'Student with data already exists') {
                toast.error('Student with data already exists');
            } else {
                toast.error('An error occurred while importing students.');
            }
            fileInput.value = null;
        }
    };

    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className='main-page-content'>
                    <TopHeader />
                    <main>
                        <div className='main-grid'>
                            <div className='page-content'>
                                {/* ------------------------------TOP CARD---------------------------------- */}
                                <div className='top-card'>
                                    <div className='card-content'>
                                        <div className='card-header'>Student Management</div>
                                        <div>
                                            <Link to="/add-student">
                                                <Button style='small'>Enroll New Student</Button>
                                            </Link>
                                            <button type="button" className='import-file-button' onClick={handleImportButtonClick}>
                                                Import Bulk Student
                                            </button>
                                            <input
                                                type="file"
                                                id="fileInput"
                                                accept=".xlsx"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="academicYear">
                                                    Select Academic Year
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="academicYear"
                                                    id="academicYear"
                                                >
                                                    <option value=''>
                                                        Select Academic Year
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="programType">
                                                    Select Program Type
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="programType"
                                                    id="programType"
                                                >
                                                    <option value=''>
                                                        Select Program Type
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="electiveProgram">
                                                    Select Elective Program
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="electiveProgram"
                                                    id="electivePrograme"
                                                >
                                                    <option value=''>
                                                        Select Elective Program
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-content mt-2'>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="admissionFromDate">
                                                    Admission From Date
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="admissionFromDate"
                                                    id="admissionFromDate"
                                                >
                                                    <option value=''>
                                                        Admission From Date
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="admissionToDate">
                                                    Admission To Date
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="admissionToDate"
                                                    id="admissionToDate"
                                                >
                                                    <option value=''>
                                                        Admission To Date
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mr-4">
                                                <label className="form-input" htmlFor="selectBatch">
                                                    Select Batch
                                                </label>
                                                <select
                                                    className='form-select'
                                                    name="selectBatch"
                                                    id="selectBatch"
                                                >
                                                    <option value=''>
                                                        Select Batch
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* -------------------------------BOTTOM CARD------------------------------ */}
                                <TableComponent columns={columns} data={studentWithSerialNo} tableName="Students List" isButton={false} height="550px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleDelete} />
        </>
    );
}

export default StudentManagement;