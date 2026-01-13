import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Events.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Initial seed events data
const initialEvents = [
  {
    _id: 'seed-1',
    title: 'CF Awareness Webinar: Living Well with CF',
    description: 'Join us for an informative webinar about managing daily life with Cystic Fibrosis. Expert speakers will discuss nutrition, exercise, and mental health strategies.',
    eventType: 'Webinar',
    startDate: '2025-12-15T14:00:00',
    endDate: '2025-12-15T16:00:00',
    location: 'Zoom',
    isVirtual: true,
    virtualLink: 'https://zoom.us/j/example123',
    organizer: {
      name: 'CF Foundation',
      email: 'events@cffoundation.org',
      organization: 'Cystic Fibrosis Foundation'
    },
    maxAttendees: 100,
    registeredAttendees: [],
    tags: ['health', 'education', 'wellness'],
    imageUrl: '',
    status: 'Upcoming',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  {
    _id: 'seed-2',
    title: 'Annual CF Fundraising Gala',
    description: 'A spectacular evening of dining, entertainment, and fundraising to support CF research. All proceeds go toward finding a cure for Cystic Fibrosis.',
    eventType: 'Fundraiser',
    startDate: '2026-01-20T18:00:00',
    endDate: '2026-01-20T23:00:00',
    location: 'Grand Ballroom, City Center, New York',
    isVirtual: false,
    virtualLink: '',
    organizer: {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@cfgala.org',
      organization: 'CF Care Alliance'
    },
    maxAttendees: 250,
    registeredAttendees: [],
    tags: ['fundraiser', 'charity', 'social'],
    imageUrl: '',
    status: 'Upcoming',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  {
    _id: 'seed-3',
    title: 'CF Support Group Meeting - December',
    description: 'Monthly virtual support group for individuals with CF and their families. Share experiences, get advice, and connect with others who understand.',
    eventType: 'Support Group',
    startDate: '2025-12-10T19:00:00',
    endDate: '2025-12-10T20:30:00',
    location: 'Google Meet',
    isVirtual: true,
    virtualLink: 'https://meet.google.com/abc-defg-hij',
    organizer: {
      name: 'Dr. Emily Johnson',
      email: 'emily.j@cfsupport.org',
      organization: 'CF Support Network'
    },
    maxAttendees: 30,
    registeredAttendees: [],
    tags: ['support', 'mental health', 'community'],
    imageUrl: '',
    status: 'Upcoming',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  {
    _id: 'seed-4',
    title: 'Respiratory Care Workshop',
    description: 'Hands-on workshop teaching airway clearance techniques, proper inhaler use, and breathing exercises specifically designed for CF patients.',
    eventType: 'Workshop',
    startDate: '2025-12-28T10:00:00',
    endDate: '2025-12-28T15:00:00',
    location: 'Community Health Center, Los Angeles',
    isVirtual: false,
    virtualLink: '',
    organizer: {
      name: 'Respiratory Therapy Team',
      email: 'respiratory@healthcenter.org',
      organization: 'LA Community Health Center'
    },
    maxAttendees: 20,
    registeredAttendees: [],
    tags: ['health', 'education', 'respiratory'],
    imageUrl: '',
    status: 'Upcoming',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  {
    _id: 'seed-5',
    title: 'International CF Conference 2026',
    description: 'The premier annual conference bringing together CF researchers, clinicians, and patients from around the world to discuss latest breakthroughs and treatments.',
    eventType: 'Conference',
    startDate: '2026-03-15T09:00:00',
    endDate: '2026-03-17T17:00:00',
    location: 'Convention Center, Boston, MA',
    isVirtual: false,
    virtualLink: '',
    organizer: {
      name: 'International CF Association',
      email: 'conference@cfworld.org',
      organization: 'CF World Association'
    },
    maxAttendees: 500,
    registeredAttendees: [],
    tags: ['conference', 'research', 'medical', 'networking'],
    imageUrl: '',
    status: 'Upcoming',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  {
    _id: 'seed-6',
    title: 'Virtual Game Night for CF Community',
    description: 'Join us for a fun evening of online games and socializing! Open to all ages. A great way to meet others in the CF community in a relaxed setting.',
    eventType: 'Social Gathering',
    startDate: '2025-12-05T20:00:00',
    endDate: '2025-12-05T22:00:00',
    location: 'Discord',
    isVirtual: true,
    virtualLink: 'https://discord.gg/cfcommunity',
    organizer: {
      name: 'CF Youth Network',
      email: 'youth@cfnetwork.org',
      organization: 'CF Youth Connect'
    },
    maxAttendees: null,
    registeredAttendees: [],
    tags: ['social', 'gaming', 'community', 'fun'],
    imageUrl: '',
    status: 'Upcoming',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  {
    _id: 'seed-7',
    title: 'Nutrition and CF: Healthy Eating Workshop',
    description: 'Learn about nutrition strategies specific to CF, including high-calorie meal planning, enzyme management, and maintaining a healthy weight.',
    eventType: 'Workshop',
    startDate: '2026-01-10T13:00:00',
    endDate: '2026-01-10T16:00:00',
    location: 'Zoom',
    isVirtual: true,
    virtualLink: 'https://zoom.us/j/nutrition123',
    organizer: {
      name: 'Jennifer Davis, RD',
      email: 'jdavis@nutrition.org',
      organization: 'CF Nutrition Network'
    },
    maxAttendees: 50,
    registeredAttendees: [],
    tags: ['nutrition', 'health', 'education'],
    imageUrl: '',
    status: 'Upcoming',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  {
    _id: 'seed-8',
    title: 'Great Strides Walk - Boston Chapter',
    description: 'Join thousands of walkers for the CF Foundation\'s signature fundraising event. Walk to raise money for CF research and connect with the community.',
    eventType: 'Fundraiser',
    startDate: '2026-05-17T09:00:00',
    endDate: '2026-05-17T13:00:00',
    location: 'Boston Common, Boston, MA',
    isVirtual: false,
    virtualLink: '',
    organizer: {
      name: 'Boston CF Foundation Chapter',
      email: 'boston@cff.org',
      organization: 'CF Foundation - Boston'
    },
    maxAttendees: null,
    registeredAttendees: [],
    tags: ['fundraiser', 'walk', 'outdoor', 'charity'],
    imageUrl: '',
    status: 'Upcoming',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  // Past Events
  {
    _id: 'seed-past-1',
    title: 'CF Awareness Month Kickoff Event',
    description: 'Celebrated the start of CF Awareness Month with stories from the community, educational sessions, and a virtual walk.',
    eventType: 'Awareness Campaign',
    startDate: '2025-09-01T10:00:00',
    endDate: '2025-09-01T14:00:00',
    location: 'Virtual Event',
    isVirtual: true,
    virtualLink: '',
    organizer: {
      name: 'CF Foundation',
      email: 'awareness@cff.org',
      organization: 'Cystic Fibrosis Foundation'
    },
    maxAttendees: null,
    registeredAttendees: [],
    tags: ['awareness', 'community', 'education'],
    imageUrl: '',
    status: 'Completed',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  {
    _id: 'seed-past-2',
    title: 'Summer CF Family Picnic',
    description: 'Family-friendly outdoor picnic with games, food, and activities. A wonderful opportunity to connect with other CF families.',
    eventType: 'Social Gathering',
    startDate: '2025-08-12T11:00:00',
    endDate: '2025-08-12T16:00:00',
    location: 'Central Park, New York',
    isVirtual: false,
    virtualLink: '',
    organizer: {
      name: 'NY CF Families',
      email: 'families@nycf.org',
      organization: 'NY CF Family Network'
    },
    maxAttendees: 100,
    registeredAttendees: [],
    tags: ['social', 'family', 'outdoor'],
    imageUrl: '',
    status: 'Completed',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  },
  {
    _id: 'seed-past-3',
    title: 'Mental Health and CF: Coping Strategies Workshop',
    description: 'Workshop focused on mental health challenges specific to living with CF, including anxiety, depression, and stress management techniques.',
    eventType: 'Workshop',
    startDate: '2025-10-15T15:00:00',
    endDate: '2025-10-15T17:30:00',
    location: 'Zoom',
    isVirtual: true,
    virtualLink: '',
    organizer: {
      name: 'Dr. Michael Roberts',
      email: 'mroberts@cfmentalhealth.org',
      organization: 'CF Mental Health Initiative'
    },
    maxAttendees: 40,
    registeredAttendees: [],
    tags: ['mental health', 'wellness', 'education'],
    imageUrl: '',
    status: 'Completed',
    createdBy: { name: 'Admin', email: 'admin@nebula.com' }
  }
];

const Events = () => {
  const { user, token } = useAuth();
  const [events, setEvents] = useState(initialEvents);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my-events'
  const [filterType, setFilterType] = useState('all');
  const [filterVirtual, setFilterVirtual] = useState('all');
  const [filterStatus, setFilterStatus] = useState('upcoming'); // 'all', 'upcoming', 'past'
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventType: 'Webinar',
    startDate: '',
    endDate: '',
    location: '',
    isVirtual: false,
    virtualLink: '',
    organizer: {
      name: '',
      email: '',
      organization: ''
    },
    maxAttendees: '',
    tags: '',
    imageUrl: ''
  });

  // Update organizer info when user changes or modal opens
  useEffect(() => {
    if (user && showCreateModal) {
      setNewEvent(prev => ({
        ...prev,
        organizer: {
          ...prev.organizer,
          name: user.name || '',
          email: user.email || ''
        }
      }));
    }
  }, [user, showCreateModal]);

  useEffect(() => {
    fetchEvents();
    if (token) {
      fetchMyEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchEvents = async () => {
    try {
      // First, try to fetch from backend
      const response = await fetch(`${API_URL}/api/events`);
      const data = await response.json();
      
      if (data.success && data.events.length > 0) {
        // Merge backend events with initial events, avoiding duplicates
        const backendEventIds = new Set(data.events.map(e => e._id));
        const uniqueInitialEvents = initialEvents.filter(e => !backendEventIds.has(e._id));
        setEvents([...data.events, ...uniqueInitialEvents]);
      } else {
        // If no backend events, use initial events
        setEvents(initialEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // On error, fall back to initial events
      setEvents(initialEvents);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/my-events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setMyEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching my events:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('organizer.')) {
      const field = name.split('.')[1];
      setNewEvent(prev => ({
        ...prev,
        organizer: {
          ...prev.organizer,
          [field]: value
        }
      }));
    } else {
      setNewEvent(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    console.log('handleCreateEvent called');
    console.log('Token:', token ? 'exists' : 'missing');
    console.log('Event data:', newEvent);
    
    if (!token) {
      toast.error('Please login to create an event');
      return;
    }

    try {
      const eventData = {
        ...newEvent,
        maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : null,
        tags: newEvent.tags ? newEvent.tags.split(',').map(tag => tag.trim()) : []
      };

      console.log('Sending event data:', eventData);

      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        toast.success('Event created successfully!');
        setShowCreateModal(false);
        // Add new event to local state immediately
        setEvents(prevEvents => [data.event, ...prevEvents]);
        if (token) {
          fetchMyEvents();
        }
        resetForm();
      } else {
        toast.error(data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event: ' + error.message);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleRegister = async (eventId) => {
    if (!token) {
      toast.error('Please login to register for events');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userName: user.name,
          userEmail: user.email
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully registered for event!');
        fetchEvents();
        fetchMyEvents();
      } else {
        toast.error(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Failed to register for event');
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleUnregister = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}/unregister`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully unregistered from event');
        fetchEvents();
        fetchMyEvents();
      } else {
        toast.error(data.message || 'Failed to unregister');
      }
    } catch (error) {
      console.error('Error unregistering:', error);
      toast.error('Failed to unregister from event');
    }
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      description: '',
      eventType: 'Webinar',
      startDate: '',
      endDate: '',
      location: '',
      isVirtual: false,
      virtualLink: '',
      organizer: {
        name: user?.name || '',
        email: user?.email || '',
        organization: ''
      },
      maxAttendees: '',
      tags: '',
      imageUrl: ''
    });
  };

  // eslint-disable-next-line no-unused-vars
  const isUserRegistered = (event) => {
    if (!user) return false;
    return event.registeredAttendees.some(
      attendee => attendee.userEmail === user.email
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const filteredEvents = events.filter(event => {
    if (filterType !== 'all' && event.eventType !== filterType) return false;
    if (filterVirtual === 'virtual' && !event.isVirtual) return false;
    if (filterVirtual === 'in-person' && event.isVirtual) return false;
    
    // Filter by status
    if (filterStatus === 'upcoming') {
      const eventDate = new Date(event.startDate);
      const now = new Date();
      if (eventDate < now || event.status === 'Completed') return false;
    } else if (filterStatus === 'past') {
      const eventDate = new Date(event.startDate);
      const now = new Date();
      if (eventDate >= now && event.status !== 'Completed') return false;
    }
    
    return true;
  });

  const displayEvents = activeTab === 'all' ? filteredEvents : myEvents;

  if (loading) {
    return <div className="events-loading">Loading events...</div>;
  }

  return (
    <div className="events-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="events-header">
        <h1>CF Community Events</h1>
        <p>Connect with others, learn, and participate in community events</p>
        {token && (
          <button 
            className="create-event-btn"
            onClick={() => {
              console.log('Create event button clicked');
              setShowCreateModal(true);
            }}
          >
            + Create Event
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="events-tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Events
        </button>
        {token && (
          <button
            className={`tab-btn ${activeTab === 'my-events' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-events')}
          >
            My Events ({myEvents.length})
          </button>
        )}
      </div>

      {/* Filters */}
      {activeTab === 'all' && (
        <div className="events-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
          </select>

          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="Webinar">Webinar</option>
            <option value="Workshop">Workshop</option>
            <option value="Support Group">Support Group</option>
            <option value="Fundraiser">Fundraiser</option>
            <option value="Awareness Campaign">Awareness Campaign</option>
            <option value="Conference">Conference</option>
            <option value="Social Gathering">Social Gathering</option>
            <option value="Other">Other</option>
          </select>

          <select 
            value={filterVirtual} 
            onChange={(e) => setFilterVirtual(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Locations</option>
            <option value="virtual">Virtual Only</option>
            <option value="in-person">In-Person Only</option>
          </select>
        </div>
      )}

      {/* Events Grid */}
      <div className="events-grid">
        {displayEvents.length === 0 ? (
          <div className="no-events">
            <p>
              {activeTab === 'my-events' 
                ? 'You haven\'t registered for any events yet.' 
                : 'No events found matching your filters.'}
            </p>
          </div>
        ) : (
          displayEvents.map(event => (
            <div key={event._id} className="event-card">
              {event.imageUrl && (
                <div className="event-image">
                  <img src={event.imageUrl} alt={event.title} />
                </div>
              )}
              
              <div className="event-content">
                <div className="event-badges">
                  <span className={`event-type-badge ${event.eventType.toLowerCase().replace(' ', '-')}`}>
                    {event.eventType}
                  </span>
                  {event.status === 'Completed' && (
                    <span className="status-badge completed">✓ Completed</span>
                  )}
                  {event.isVirtual && (
                    <span className="virtual-badge">🌐 Virtual</span>
                  )}
                  {event.maxAttendees && (
                    <span className="attendees-badge">
                      {event.registeredAttendees.length}/{event.maxAttendees}
                    </span>
                  )}
                </div>

                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>

                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🕐</span>
                    <span>{formatTime(event.startDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                  {event.organizer && (
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <span>{event.organizer.name}</span>
                    </div>
                  )}
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="event-tags">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Event</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="event-form">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., CF Awareness Webinar"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe your event..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Type *</label>
                  <select
                    name="eventType"
                    value={newEvent.eventType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Webinar">Webinar</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Support Group">Support Group</option>
                    <option value="Fundraiser">Fundraiser</option>
                    <option value="Awareness Campaign">Awareness Campaign</option>
                    <option value="Conference">Conference</option>
                    <option value="Social Gathering">Social Gathering</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Max Attendees</label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={newEvent.maxAttendees}
                    onChange={handleInputChange}
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={newEvent.startDate}
                    onChange={handleInputChange}
                    required
                    min={getMinDateTime()}
                  />
                </div>

                <div className="form-group">
                  <label>End Date & Time</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={newEvent.endDate}
                    onChange={handleInputChange}
                    min={newEvent.startDate || getMinDateTime()}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isVirtual"
                    checked={newEvent.isVirtual}
                    onChange={handleInputChange}
                  />
                  This is a virtual event
                </label>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  required
                  placeholder={newEvent.isVirtual ? "e.g., Zoom, Google Meet" : "e.g., City, State"}
                />
              </div>

              {newEvent.isVirtual && (
                <div className="form-group">
                  <label>Virtual Meeting Link</label>
                  <input
                    type="url"
                    name="virtualLink"
                    value={newEvent.virtualLink}
                    onChange={handleInputChange}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              )}

              <div className="form-group">
                <label>Organizer Name *</label>
                <input
                  type="text"
                  name="organizer.name"
                  value={newEvent.organizer.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Organizer Email *</label>
                <input
                  type="email"
                  name="organizer.email"
                  value={newEvent.organizer.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Organization</label>
                <input
                  type="text"
                  name="organizer.organization"
                  value={newEvent.organizer.organization}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={newEvent.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., health, support, education"
                />
              </div>

              <div className="form-group">
                <label>Event Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={newEvent.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
