import React, { useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Sidebar from "../components/Sidebar";
import APIService from '../services/APIService';
import { toast } from 'react-toastify';
import Button from '../components/Button';

const ScheduleManagement = () => {
    const initialData = {
        startDate: '',
        endDate: '',
        locationId: '',
        batchId: '',
        batchType: '',
        programType: 'Full-time',
        programId: '',
        courseId: '',
        sessionId: '',
        selectedTopics: []
    }
    const [formData, setFormData] = useState(initialData);
    const [addEventData, setAddEventData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState([]);
    const [location, setLocation] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
        fetchDropdownData();
    }, [showModal]);

    const handleRequestError = error => {
        toast.error(error.response?.data?.message);
    };

    const fetchEvents = async () => {
        try {
            const { data } = await APIService.get('/event');
            setAddEventData(data.data);
        } catch (error) {
            handleRequestError('Error fetching added event data');
        }
    }

    const handleSelect = (selectInfo) => {
        const today = new Date();
        const selectedDate = new Date(selectInfo.startStr);
        if (selectedDate <= today && selectedDate.getDate() !== today.getDate()) {
            return;
        }
        const { start, end, id } = selectInfo;
        const formattedStartDate = end.toISOString().slice(0, 16);
        const formattedEndDate = end.toISOString().slice(0, 16);
        const selectedEvent = addEventData.find(event => event.id === id);
        if (selectedEvent) {
            setFormData({
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                locationId: selectedEvent.location.id,
                batchId: selectedEvent.batch.id,
                batchType: selectedEvent.batchType,
                programType: selectedEvent.programType,
                programId: selectedEvent.program.id,
                courseId: selectedEvent.course.id,
                sessionId: selectedEvent.session.id,
                selectedTopics: selectedEvent.topics.map(topic => topic.id)
            });
            setShowModal(true);
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                startDate: formattedStartDate,
                endDate: formattedEndDate
            }));
            setShowModal(true);
        }
    }

    const handleEventClick = clickedEvent => {
        const clickEventId = clickedEvent.id * 1;
        const selectedEvent = addEventData.find(event => event.id === clickEventId);

        if (selectedEvent) {
            const { startDate, endDate, locationId, batch, batchType, programType, program, courseId, session, topics } = selectedEvent;
            setFormData(prevFormData => ({
                ...prevFormData,
                startDate: new Date(startDate).toISOString().slice(0, 16),
                endDate: new Date(endDate).toISOString().slice(0, 16),
                locationId: locationId,
                batchId: batch.id,
                batchType,
                programType,
                programId: program.id,
                courseId: courseId,
                sessionId: session.id,
                selectedTopics: topics
            }));
            setSelectedEvent(selectedEvent);
            setShowModal(true);

        } else {
            setSelectedEvent(null);
            setFormData(initialData)
            setShowModal(true);
        }
    }

    const fetchDropdownData = async () => {
        try {
            const { data } = await APIService.get('/scheduleData/event');
            const { location, batch, Courses, program, session, topic } = data.data;

            setLocation(location);
            setBatches(batch);
            setCourses(Courses);
            setPrograms(program);
            setSessions(session);
            setTopics(topic);
        } catch (error) {
            handleRequestError('Error fetching dropdown data');
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };

    const handleTopicsChange = e => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const selectedTopics = selectedOptions.map(option => option.value);
        setFormData(prevFormData => ({ ...prevFormData, selectedTopics }));
    };

    const handleDelete = async () => {
        const { id, batch } = selectedEvent;

        const isConfirmed = window.confirm(`Are you sure you want to delete the event for batch ${batch.batchCode}?`);

        if (!isConfirmed) {
            return;
        }

        try {
            const { data } = await APIService.delete(`/event/${id}`);

            if (data.code === 200) {
                toast.success('Event Deleted Successfully');
                setAddEventData(prevEvents => prevEvents.filter(event => event.id !== id));
                handleClose();
            } else {
                toast.error('Failed to Delete Event');
            }
        } catch (error) {
            handleRequestError(error);
            handleClose();
        }
    };

    const addEvent = async event => {
        event.preventDefault();
        const { id, ...restFormData } = formData;

        try {
            let eventDataToPost = { ...restFormData };
            eventDataToPost = {
                ...eventDataToPost,
                topics: restFormData.selectedTopics.join(', ')
            };
            console.log(eventDataToPost)
            const { data } = await APIService.post(`/event/${id || ''}`, eventDataToPost);
            if (data.code === 201 || data.code === 200) {
                toast.success('Event Added Successfully');
                handleClose();
                const newEvent = {
                    id: data.data.id,
                    start: restFormData.startDate,
                    end: restFormData.endDate,
                    title: `${data.data.batch.batchCode} - ${data.data.session.sessionName}`
                };
                setAddEventData(prevEvents => [...prevEvents.filter(e => e.id !== id), newEvent]);
            } else {
                toast.error('Failed to Add Event');
            }
        } catch (error) {
            handleRequestError(error);
        }
    };

    const updateEvent = async event => {
        event.preventDefault();
        const { id, ...restFormData } = formData;

        try {
            let eventDataToPost = { ...restFormData };
            eventDataToPost = {
                ...eventDataToPost,
                topics: restFormData.selectedTopics.join(', ')
            };
            console.log(eventDataToPost)
            const { data } = await APIService.post(`/event/${id || ''}`, eventDataToPost);
            if (data.code === 201 || data.code === 200) {
                toast.success('Event Updated Successfully');
                handleClose();
                const newEvent = {
                    id: data.data.id,
                    start: restFormData.startDate,
                    end: restFormData.endDate,
                    title: `${data.data.batch.batchCode} - ${data.data.session.sessionName}`
                };
                setAddEventData(prevEvents => [...prevEvents.filter(e => e.id !== id), newEvent]);
            } else {
                toast.error('Failed to Update Event');
            }
        } catch (error) {
            handleRequestError(error);
        }
    };


    const handleClose = () => {
        setFormData(initialData);
        setShowModal(false);
        setSelectedEvent(null);
    }

    return (
        <>
            <div className='flex flex-col md:flex-row overflow-hidden'>
                <div >
                    <Sidebar />
                </div>
                <div className='flex-1'>
                    <main className='h-screen overflow-hidden'>
                        <div className='h-screen m-3 p-6'>
                            <FullCalendar
                                editable
                                initialView='dayGridMonth'
                                selectable
                                headerToolbar={{
                                    start: 'today prev next',
                                    center: 'title',
                                    end: 'dayGridMonth timeGridWeek timeGridDay'
                                }}
                                select={handleSelect}
                                eventClick={info => handleEventClick(info.event)}
                                height={"90vh"}
                                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                                views={{
                                    dayGridMonth: { buttonText: 'Month' },
                                    timeGridWeek: { buttonText: 'Week' },
                                    timeGridDay: { buttonText: 'Day' }
                                }}
                                events={addEventData?.map(event => ({
                                    id: event.id,
                                    title: `${event.batch.batchCode} - ${event.session.sessionName}`,
                                    start: event.startDate,
                                    end: event.endDate
                                }))}
                            />
                        </div>

                        {/* -----------------------------------POPUP MODAL TO ADD EVENTS------------------------------- */}
                        {showModal &&
                            <div className='fixed inset-0 z-50 overflow-auto'>
                                <div className="flex items-end justify-center min-h-screen pt-4 px-20 pb-20 text-center sm:block sm:p-0 rounded-lg">
                                    <div className="fixed inset-0 transition-opacity">
                                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                    </div>
                                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl w-full">
                                        {/* -----------------MODAL TOP HEADER-------------- */}
                                        <div className="bg-orange-200 px-4 pt-5 pb-4 sm:p-5 sm:pb-3">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-semibold text-gray-900">New Schedule</h3>
                                                <button onClick={handleClose} className="cancel-button">
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
                                        {/* ----------------------CONTENT FOR MODAL---------------------- */}
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className='flex justify-between'>
                                                <div className='w-9/12'>
                                                    <div className="flex w-full">
                                                        <label className="block text-base font-medium w-2/12">Select Batch</label>
                                                        <select
                                                            className="w-4/12 text-sm p-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                            name="batchId"
                                                            value={formData.batchId}
                                                            onChange={handleChange}
                                                        >
                                                            <option>Select Batch</option>
                                                            {batches.map(batch => (
                                                                <option key={batch.id} value={batch.id}>
                                                                    {batch.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex w-full mt-6">
                                                        <div className='flex w-1/2'>
                                                            <label className="block text-base font-medium w-2/6">When</label>
                                                            <input
                                                                type="datetime-local"
                                                                className="w-4/6 text-sm p-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                                name="startDate"
                                                                value={formData.startDate}
                                                                onChange={handleChange}
                                                                min={new Date().toISOString().slice(0, 16)}
                                                            />
                                                        </div>
                                                        <div className='flex w-1/2'>
                                                            <label className="block text-base font-medium text-center w-2/6">To</label>
                                                            <input
                                                                type="datetime-local"
                                                                className="w-4/6 text-sm p-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                                name="endDate"
                                                                value={formData.endDate}
                                                                onChange={handleChange}
                                                                min={new Date().toISOString().slice(0, 16)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full mt-6">
                                                        <label className="block text-base font-medium w-2/12">Select batch Type</label>
                                                        <select
                                                            className="w-4/12 text-sm p-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                            name="batchType"
                                                            value={formData.batchType}
                                                            onChange={handleChange}
                                                        >
                                                            <option>Select Type</option>
                                                            <option>Theory</option>
                                                            <option>Practical</option>
                                                            <option>Studio</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex w-full mt-6">
                                                        <div className='flex w-1/2'>
                                                            <label className="block text-base font-medium w-2/6" htmlFor="locationId">Training venue</label>
                                                            <select
                                                                className="w-4/6 text-sm p-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                                name="locationId"
                                                                value={formData.locationId}
                                                                onChange={handleChange}
                                                            >
                                                                <option>Select Training Venue</option>
                                                                {location.map(location => (
                                                                    <option key={location.id} value={location.id}>
                                                                        {location.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='flex w-1/2 justify-center'>
                                                            <label className="relative inline-flex text-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-orange after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-orange-400"
                                                                ></div>
                                                                <span className="block text-base font-medium ml-4">Online Training</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full mt-6">
                                                        <div className='flex w-1/2'>
                                                            <label className="block text-base font-medium w-2/6">What</label>
                                                            <label className="relative inline-flex text-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-orange after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-orange-400"
                                                                ></div>
                                                                <span className="block text-base font-medium ml-4">Core Program</span>
                                                            </label>
                                                        </div>
                                                        <div className='w-1/2'>
                                                            <div className='w-full'>
                                                                <select
                                                                    className="w-full text-sm p-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                                    name="programId"
                                                                    value={formData.programId}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option>Select Program</option>
                                                                    {programs.map(program => (
                                                                        <option key={program.id} value={program.id}>
                                                                            {program.programName}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='w-full mt-4'>
                                                                <select
                                                                    className="w-full text-sm p-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                                    name="courseId"
                                                                    value={formData.courseId}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option>Select Course</option>
                                                                    {courses.map(Course => (
                                                                        <option key={Course.id} value={Course.id}>
                                                                            {Course.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='w-full mt-4'>
                                                                <select
                                                                    className="w-full text-sm p-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                                    name="sessionId"
                                                                    value={formData.sessionId}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option>Select Session</option>
                                                                    {sessions.map(session => (
                                                                        <option key={session.id} value={session.id}>
                                                                            {session.sessionName}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='w-full mt-4'>
                                                                <select
                                                                    className="w-full text-sm p-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                                                    multiple
                                                                    aria-label="Default select example"
                                                                    data-live-search="true"
                                                                    name="selectedTopics"
                                                                    value={JSON.stringify(formData.selectedTopics)}
                                                                    onChange={handleTopicsChange}
                                                                >
                                                                    {topics.map(topic => (
                                                                        <option key={topic.id} value={topic.id}>
                                                                            {topic.topicName}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='w-3/12 font-semibold text-base text-gray-900 ml-2'>
                                                    Selected Batch Details
                                                </div>
                                            </div>
                                        </div>
                                        <div className='modal-button'>
                                            {selectedEvent ?
                                                <Button style='small' id="save-event" onClick={updateEvent}>
                                                    Update
                                                </Button> :
                                                <Button style='small' id="save-event" onClick={addEvent}>
                                                    Create Event
                                                </Button>
                                            }
                                            <Button style='cancel' onClick={handleClose}>Close</Button>
                                            {selectedEvent && (
                                                <Button variant="danger" style="delete" onClick={handleDelete}>
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </main>
                </div>
            </div>
        </>
    )
}

export default ScheduleManagement;