import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import APIService from '../../services/APIService';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteModal from '../../shared/DeleteModal';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { FACULTY_EXP } from '../../constants/api';

const FacultyExperience = () => {
    const params = useParams();
    const [faculty, setFaculty] = useState({});
    const [facultyExp, setFacultyExp] = useState([]);
    const [addFacultyModalOpen, setAddFacultyModalOpen] = useState(false);
    const initialData = {
        designation: '',
        employer: '',
        from: '',
        to: '',
        area: '',
        skills: ''
    }
    const [formData, setFormData] = useState(initialData);
    const { designation, employer, from, to, area, skills } = formData;

    useEffect(() => {
        fetchExperience();
    }, []);

    const fetchExperience = async () => {
        try {
            const { data } = await APIService.get(`${FACULTY_EXP}/${params.facultyId}`);
            setFaculty(data.data);
            setFacultyExp(data.data.careerDetails);
            // setIsLoading(false);
        } catch (error) {
            console.log(error);
            // setIsLoading(false);
            toast.error('Some Error occurred while fetching experience');
        }
    };

    const onMutate = e => {
        setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
    };

    const onSubmit = async () => {

        // 2.) Hit the API
        const newExp = await addExperience();
        clearFormData();

        //3.) Add to FacultyExp List
        setFacultyExp(newExp);
    };

    const addExperience = async () => {
        try {
            const payload = [{ ...formData }];
            const { data } = await APIService.post(`${FACULTY_EXP}/${params.facultyId}`, payload);
            if (data.code === 200) toast.success('Experience Added Successfully');
            // setIsLoading(false);
            return data.data.careerDetails;
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                return toast.error(error.response.data?.message || 'Something Went Wrong');
            }
            // setIsLoading(false);
            toast.error('Temporarily Unable to Experience');
        }
    };

    const clearFormData = () => {
        setFormData(initialData);
    };

    const columns = React.useMemo(
        () => [
            { Header: 'Serial No', accessor: 'serialNo' },
            { Header: 'Designation', accessor: 'designation' },
            { Header: 'Employer', accessor: 'employer' },
            { Header: 'From', accessor: 'from' },
            { Header: 'To', accessor: 'to' },
            { Header: 'Area', accessor: 'area' },
            { Header: 'Skills', accessor: 'skills' },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <>
                        <buton className="mr-2"><BorderColorRoundedIcon className='icon-style' /></buton>
                        <button onClick={() => handleConfirmation(row.original.id)}><DeleteRoundedIcon className='icon-style' /></button>
                    </>
                )
            }
        ], []
    )

    const facultyExperience = useMemo(() => {
        return facultyExp.map((faculty, index) => ({
            ...faculty,
            serialNo: index + 1
        }))
    }, [facultyExp]);

    const handleAddExperienceModal = () => {
        setAddFacultyModalOpen(true);
    }

    return (
        <>
            <div className='main-page'>
                <div>
                    <Sidebar />
                </div>
                <div className="main-page-content">
                    <TopHeader />
                    <main>
                        <div className='grid'>
                            <div className='page-content'>
                                {/* ---------------------TOP CARD-------------------------- */}
                                <div className='top-card '>
                                    <div className='card-content'>
                                        <Link to="/faculty-management">
                                            <Button style='small'><KeyboardBackspaceRoundedIcon className='icons mr-1' />Back</Button>
                                        </Link>
                                        <div className='mt-2 bg-gray-300 rounded-full'>
                                            <span className='card-header'>Experience details of: </span>
                                            <b className='text-xl font-bold p-4'>
                                                {faculty.gender === 'M' ? 'Mr.' : 'Ms.'} {params.facultyName}
                                            </b>
                                        </div>
                                        <Button style='small' onClick={handleAddExperienceModal}>Add Experience</Button>
                                    </div>
                                </div>
                                {/* ------------------------BOTTOM CARD--------------------- */}
                                <TableComponent columns={columns} data={facultiesWithSerialNo} tableName="Faculty Experience" isButton={false} height="630px" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );

}

export default FacultyExperience;