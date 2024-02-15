import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { toast } from 'react-toastify';
import schedule from "../assets/images/schedule_bg.png";
import APIService from "../services/APIService";
import Sidebar from "../components/Sidebar";


const ScheduleManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [addEventData, setAddEventData] = useState([]);
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState([]);
    const [location, setLocation] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [formData, setFormData] = useState({
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
    });

    useEffect(() => {
        fetchAddEventData();
        fetchDropdownData();
    }, []);

    const fetchAddEventData = async () => {
        try {
            const { data } = await APIService.get('/event');
            setAddEventData(data.data);
        } catch (error) {
            handleRequestError('Error fetching added event data');
        }
    };

    const handleRequestError = error => {
        toast.error(error.response?.data?.message);
    };

    const handleSelect = selectInfo => {
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
    };

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
        const selectedTopics = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData(prevFormData => ({ ...prevFormData, selectedTopics }));
    };

    const addOrUpdateEvent = async event => {
        event.preventDefault();
        const { id, ...restFormData } = formData;

        try {
            const { data } = await APIService.post(`/event/${id || ''}`, {
                ...restFormData,
                topics: restFormData.selectedTopics.join(', ')
            });

            if (data.code === 201 || data.code === 200) {
                toast.success('Event Added/Updated Successfully');
                handleClose();
                window.location.reload();
                const newEvent = {
                    id: data.data.id,
                    start: restFormData.startDate,
                    end: restFormData.endDate,
                    title: `${data.data.batch.batchCode} - ${data.data.session.sessionName}`
                };
                setAddEventData(prevEvents => [...prevEvents.filter(e => e.id !== id), newEvent]);
            } else {
                toast.error('Failed to Add/Update Event');
            }
        } catch (error) {
            handleRequestError(error);
        }
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
                handleClose();
                setAddEventData(prevEvents => prevEvents.filter(event => event.id !== id));
            } else {
                toast.error('Failed to Delete Event');
            }
        } catch (error) {
            handleRequestError(error);
        }
    };


    const handleEventClick = clickedEvent => {
        const clickEventId = clickedEvent.id * 1
        const selectedEvent = addEventData.find(event => event.id === clickEventId);

        if (selectedEvent) {
            console.log(selectedEvent)
            const { startDate, endDate, locationId, batch, batchType, programType, program, courseId, session, topics } =
                selectedEvent;

            setFormData({
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
            });
            setSelectedEvent(selectedEvent);
            setShowModal(true);
        } else {
            setFormData({
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
            });
            setSelectedEvent(null);
            setShowModal(true);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedEvent(null);
        setFormData({
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
        });
    };
    return (
        <div className='main-page'>
            <div>
                <Sidebar />
            </div>
            <div className='main-page-content'>
                <main className='main'>
                    <div className='main-grid'>
                        <div className='page-content'>
                            <div id="calendar">
                                <FullCalendar
                                    editable
                                    initialView='dayGridMonth'
                                    selectable
                                    select={handleSelect}
                                    eventClick={info => handleEventClick(info.event)}
                                    events={addEventData?.map(event => ({
                                        id: event.id,
                                        title: `${event.batch.batchCode} - ${event.session.sessionName}`,
                                        start: event.startDate,
                                        end: event.endDate
                                    }))}
                                    headerToolbar={{
                                        start: 'today prev next',
                                        center: 'title',
                                        end: 'dayGridMonth timeGridWeek timeGridDay'
                                    }}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    views={{
                                        dayGridMonth: { buttonText: 'Month' },
                                        timeGridWeek: { buttonText: 'Week' },
                                        timeGridDay: { buttonText: 'Day' }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ScheduleManagement