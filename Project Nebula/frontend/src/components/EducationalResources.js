import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EducationalResources.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Initial seed resources data
const initialResources = [
  {
    _id: 'seed-1',
    title: 'CFRI Conference Recordings Available for Viewing',
    description: 'CFRI held its 38th National CF Education Conference, A World of Possibility, as a hybrid event July 25 - 27, 2025. During the event, attendees from across the country and globe heard from nationally renowned speakers on a wide range of CF-related topics, including phage therapy, aging with CF, reproductive health, pain in CF, and nucleic acid-based therapy approaches. Recordings of all presentations are now available for viewing on CFRI\'s YouTube channel.',
    link: 'https://www.youtube.com/playlist?list=PLj8VGC3qF9cJ8Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9',
    organization: 'CFRI',
    resourceType: 'Conference',
    category: 'Medical Updates',
    tags: ['conference', 'phage therapy', 'aging', 'reproductive health', 'research'],
    imageUrl: '',
    publishedDate: '2025-07-27',
    isFeatured: true
  },
  {
    _id: 'seed-2',
    title: 'One Step at a Time to Reach Your Goals',
    description: 'When you set a goal, you\'re not just planning an outcome — you are setting an intention. Elyse Elconin-Goldberg, an adult with CF, shares her journey climbing from Yosemite Valley to Glacier Point. Read about Elyse\'s journey setting a goal that opened up a new world of possibility and reinforced that anyone, no matter who they are, can push themselves physically, mentally, and emotionally.',
    link: 'https://api.neonemails.com/emails/tracking/click-link/JbdraTVl6_huANzbWLLePxyb6yJA1fMRO24tJrc5cEQ=/afcSQVDjdro-RWRpiRsIYzyOZRI96LzjaiRRVVX64GY=',
    organization: 'CFRI',
    resourceType: 'Blog Post',
    category: 'Patient Stories',
    tags: ['inspiration', 'goals', 'exercise', 'mental health'],
    imageUrl: '',
    publishedDate: '2025-08-15',
    isFeatured: false
  },
  {
    _id: 'seed-3',
    title: 'Vaccines for the Cystic Fibrosis Patient — Richard Moss, MD',
    description: 'People living with CF face unique health challenges, especially when it comes to respiratory infections. In this podcast, Dr. Richard Moss provides data demonstrating which populations are most at risk of adverse health complications post-infection, and explores why vaccines for the flu, COVID-19, and RSV are essential tools for protecting those with CF.',
    link: 'https://www.youtube.com/watch?v=FdMRap3aaeY',
    organization: 'CFRI',
    resourceType: 'Podcast',
    category: 'Medical Updates',
    tags: ['vaccines', 'respiratory health', 'COVID-19', 'flu', 'RSV'],
    imageUrl: '',
    publishedDate: '2025-09-10',
    isFeatured: true
  },
  {
    _id: 'seed-4',
    title: 'Gut Microbiome & Cystic Fibrosis',
    description: 'Many people with CF report gastro-intestinal discomfort as a daily challenge and barrier to optimal quality of life. In this podcast, Emily Yelencich, MS, RD, provides an overview of the key differences within the microbiome of people with CF compared to the general population, and how they result in difficulties with digestion, reduced absorption of nutrients, lower lung function, and higher rates of colorectal cancer.',
    link: 'https://cfri.podbean.com/e/gut-microbiome-cystic-fibrosis-%e2%80%94-emily-yelencich-ms-rd/',
    organization: 'CFRI',
    resourceType: 'Podcast',
    category: 'Nutrition',
    tags: ['gut health', 'microbiome', 'nutrition', 'digestion'],
    imageUrl: '',
    publishedDate: '2025-08-20',
    isFeatured: false
  },
  {
    _id: 'seed-5',
    title: 'CF Community Voices Podcast Series',
    description: 'A wealth of information on our YouTube and Podbean channels! Get information about scholarships, patient assistance, hemoptysis, CF and mental health, bone health, advocacy, CF and COVID-19, and much more. Our CF Community Voices podcast series covers it all! Many recordings on YouTube are available with Spanish and Hindi captions.',
    link: 'https://cfri.podbean.com/',
    organization: 'CFRI',
    resourceType: 'Podcast',
    category: 'General Information',
    tags: ['podcast series', 'education', 'advocacy', 'mental health', 'scholarships'],
    imageUrl: '',
    publishedDate: '2025-01-01',
    isFeatured: true
  },
  {
    _id: 'seed-6',
    title: 'Patient Voices: Rohini Thukral McKee',
    description: 'Rohini Thukral McKee, CFRI Board Member and mother of a child with CF, is featured in a new American Thoracic Society Public Advisory Roundtable (ATS PAR) Patient Voices video. Rohini shares the impacts of CF on her daughter, the need to elevate the patient voice and to fund medical research.',
    link: 'https://www.thoracic.org/patients/patient-resources/patient-voices.php',
    organization: 'ATS PAR / CFRI',
    resourceType: 'Video',
    category: 'Patient Stories',
    tags: ['patient advocacy', 'research funding', 'patient voice'],
    imageUrl: '',
    publishedDate: '2025-10-01',
    isFeatured: false
  }
];

const EducationalResources = () => {
  const { token } = useAuth();
  const [resources, setResources] = useState(initialResources);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    link: '',
    organization: '',
    resourceType: 'Article',
    category: 'General Information',
    tags: '',
    imageUrl: '',
    publishedDate: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${API_URL}/api/resources`);
      const data = await response.json();
      
      if (data.success && data.resources.length > 0) {
        const backendResourceIds = new Set(data.resources.map(r => r._id));
        const uniqueInitialResources = initialResources.filter(r => !backendResourceIds.has(r._id));
        setResources([...data.resources, ...uniqueInitialResources]);
      } else {
        setResources(initialResources);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources(initialResources);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to add a resource');
      return;
    }

    try {
      const resourceData = {
        ...newResource,
        tags: newResource.tags ? newResource.tags.split(',').map(tag => tag.trim()) : []
      };

      const response = await fetch(`${API_URL}/api/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resourceData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Resource added successfully!');
        setShowCreateModal(false);
        setResources(prevResources => [data.resource, ...prevResources]);
        resetForm();
      } else {
        toast.error(data.message || 'Failed to add resource');
      }
    } catch (error) {
      console.error('Error creating resource:', error);
      toast.error('Failed to add resource: ' + error.message);
    }
  };

  const resetForm = () => {
    setNewResource({
      title: '',
      description: '',
      link: '',
      organization: '',
      resourceType: 'Article',
      category: 'General Information',
      tags: '',
      imageUrl: '',
      publishedDate: '',
      isFeatured: false
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredResources = resources.filter(resource => {
    if (filterType !== 'all' && resource.resourceType !== filterType) return false;
    if (filterCategory !== 'all' && resource.category !== filterCategory) return false;
    return true;
  });

  if (loading) {
    return <div className="resources-loading">Loading educational resources...</div>;
  }

  return (
    <div className="resources-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="resources-header">
        <h1>Educational Resources</h1>
        <p>Learn more about CF through articles, videos, podcasts, and research</p>
        {token && (
          <button 
            className="create-resource-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Add Resource
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="resources-filters">
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="Video">Video</option>
          <option value="Article">Article</option>
          <option value="Podcast">Podcast</option>
          <option value="Blog Post">Blog Post</option>
          <option value="Conference">Conference</option>
          <option value="Webinar">Webinar</option>
          <option value="Research Paper">Research Paper</option>
          <option value="Guide">Guide</option>
          <option value="Other">Other</option>
        </select>

        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="Treatment">Treatment</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Mental Health">Mental Health</option>
          <option value="Research">Research</option>
          <option value="Exercise">Exercise</option>
          <option value="General Information">General Information</option>
          <option value="Patient Stories">Patient Stories</option>
          <option value="Medical Updates">Medical Updates</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Resources Grid */}
      <div className="resources-grid">
        {filteredResources.length === 0 ? (
          <div className="no-resources">
            <p>No resources found matching your filters.</p>
          </div>
        ) : (
          filteredResources.map(resource => (
            <div key={resource._id} className="resource-card">
              {resource.imageUrl && (
                <div className="resource-image">
                  <img src={resource.imageUrl} alt={resource.title} />
                </div>
              )}
              
              <div className="resource-content">
                <div className="resource-badges">
                  <span className={`resource-type-badge ${resource.resourceType.toLowerCase().replace(' ', '-')}`}>
                    {resource.resourceType}
                  </span>
                  <span className={`category-badge ${resource.category.toLowerCase().replace(' ', '-')}`}>
                    {resource.category}
                  </span>
                  {resource.isFeatured && (
                    <span className="featured-badge">⭐ Featured</span>
                  )}
                </div>

                <h3 className="resource-title">{resource.title}</h3>
                <p className="resource-description">{resource.description}</p>

                <div className="resource-meta">
                  <div className="meta-item">
                    <span className="meta-icon">🏢</span>
                    <span>{resource.organization}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>{formatDate(resource.publishedDate)}</span>
                  </div>
                </div>

                {resource.tags && resource.tags.length > 0 && (
                  <div className="resource-tags">
                    {resource.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="resource-actions">
                  <a 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-resource-btn"
                  >
                    View Resource →
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Resource Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="resource-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Resource</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="resource-form">
              <div className="form-group">
                <label>Resource Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newResource.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., CF Research Update"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={newResource.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe the resource..."
                />
              </div>

              <div className="form-group">
                <label>Resource Link *</label>
                <input
                  type="url"
                  name="link"
                  value={newResource.link}
                  onChange={handleInputChange}
                  required
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Organization *</label>
                <input
                  type="text"
                  name="organization"
                  value={newResource.organization}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., CFRI, CF Foundation"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Resource Type *</label>
                  <select
                    name="resourceType"
                    value={newResource.resourceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Video">Video</option>
                    <option value="Article">Article</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Blog Post">Blog Post</option>
                    <option value="Conference">Conference</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Guide">Guide</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={newResource.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Treatment">Treatment</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Research">Research</option>
                    <option value="Exercise">Exercise</option>
                    <option value="General Information">General Information</option>
                    <option value="Patient Stories">Patient Stories</option>
                    <option value="Medical Updates">Medical Updates</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Published Date</label>
                <input
                  type="date"
                  name="publishedDate"
                  value={newResource.publishedDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={newResource.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., health, research, treatment"
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={newResource.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={newResource.isFeatured}
                    onChange={handleInputChange}
                  />
                  Mark as featured resource
                </label>
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
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalResources;
