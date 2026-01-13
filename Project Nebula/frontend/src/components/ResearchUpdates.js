import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResearchUpdates.css';

// Initial seed research updates data
const initialUpdates = [
  {
    _id: 'seed-1',
    title: 'Clinical Trial of ARCT-032 Reports Early Positive Signs',
    description: 'ARCT-032, an experimental inhaled therapy for CF developed by Arcturus Therapeutics, has been well tolerated so far in a clinical trial. Early data also suggest it may help clear mucus from the lungs. The Phase 2 clinical trial, called LunairCF, is testing various doses of ARCT-032 inhaled daily for a month to evaluate its safety. The trial is still recruiting participants at sites in the U.S. and is open to adults with CF who are not eligible for or are not taking CFTR modulators due to drug intolerance, poor response, or lack of access.',
    link: 'https://www.cysticfibrosisnewstoday.com/news-posts/2023/08/01/clinical-trial-arct-032-reports-early-positive-signs/',
    updateType: 'Clinical Trial',
    category: 'Treatment',
    tags: ['ARCT-032', 'inhaled therapy', 'clinical trial', 'Phase 2', 'mucus clearance'],
    imageUrl: '',
    publishedDate: '2025-08-01',
    isHighPriority: true,
    source: 'Arcturus Therapeutics',
    researchOrganization: 'Arcturus Therapeutics'
  },
  {
    _id: 'seed-2',
    title: 'GRAIL Announces Results of Cancer Screening Study',
    description: '25,578 people participated in GRAIL\'s PATHFINDER 2 study, the largest interventional study of a Multi-Cancer Early Detection (MCED) test in the U.S. Adding Galleri - a blood test that uses DNA methylation patterns to detect over 50 types of cancer at an early, potentially curable stage - to standard-of-care screenings for breast, cervical, colorectal, and lung cancers led to a more than seven-fold increase in the number of cancers found within a year. CFRI has been advocating for inclusion of MCED testing for those on Medicare.',
    link: 'https://grail.com/press-releases/grail-announces-results-pathfinder-2-study/',
    updateType: 'Research Study',
    category: 'Cancer Screening',
    tags: ['cancer screening', 'MCED', 'Galleri', 'early detection', 'PATHFINDER 2'],
    imageUrl: '',
    publishedDate: '2025-09-15',
    isHighPriority: true,
    source: 'GRAIL',
    researchOrganization: 'GRAIL Inc.'
  },
  {
    _id: 'seed-3',
    title: 'New Experimental Treatment for Cystic Fibrosis Shows Promise',
    description: 'Researchers in Italy developed a novel compound called 3b, a "dual-action" therapy for CF that addresses the dysfunction of the CFTR protein and protects against viral threats that can worsen lung problems. In lab tests, 3b was able to restore CFTR activity, block the growth of several respiratory viruses in different cell models, and enhance the effect of CFTR modulators. The therapy has the potential to simplify treatment for people with CF by reducing the therapy burden and risk of drug interactions.',
    link: 'https://www.cysticfibrosisnewstoday.com/news-posts/2023/09/05/new-experimental-treatment-shows-promise/',
    updateType: 'Treatment Development',
    category: 'Drug Development',
    tags: ['compound 3b', 'dual-action therapy', 'CFTR protein', 'antiviral', 'Italy research'],
    imageUrl: '',
    publishedDate: '2025-09-05',
    isHighPriority: true,
    source: 'Italian Research Team',
    researchOrganization: 'Italian CF Research Institute'
  },
  {
    _id: 'seed-4',
    title: 'Mental Health Diagnosis and Medication Changes After Initiation of Trikafta',
    description: 'A team of US researchers conducted a multicenter study to evaluate the effects of Trikafta on mental health diagnoses and associated medication use in people with CF. Of the 1,046 people with CF included in the study, 453 of them had a new mental health diagnosis and/or started mental health medication use after the initiation of Trikafta – a significant increase. The rate of medication use for mental health issues remained consistent for those that were already on medications before starting Trikafta.',
    link: 'https://www.cysticfibrosisnewstoday.com/news-posts/2023/10/12/mental-health-trikafta-study/',
    updateType: 'Drug Study',
    category: 'Mental Health',
    tags: ['Trikafta', 'mental health', 'medication', 'CFTR modulators', 'side effects'],
    imageUrl: '',
    publishedDate: '2025-10-12',
    isHighPriority: true,
    source: 'US Research Team',
    researchOrganization: 'US Multicenter Study Group'
  },
  {
    _id: 'seed-5',
    title: 'Enrolling Now: Observational Study of Health Outcomes of LGBTQ+ People with CF (PRIDE-CF)',
    description: 'Through this study, researchers hope to learn more about the health and health-related experiences of people living with CF who identify as lesbian, gay, bisexual, transgender, queer, asexual, intersex, and other sexual and gender minority (LGBTQIA+). Participants will complete questionnaires over three years; participation can be completely remote and there are no study visits. Those enrolled in the PRIDE-CF cohort are part of a larger study of health outcomes of the LGBTQA+ community.',
    link: 'https://redcap.iths.org/surveys/?s=YNPW8XNRJM',
    updateType: 'Health Survey',
    category: 'Community Health',
    tags: ['LGBTQ+', 'PRIDE-CF', 'health outcomes', 'diversity', 'observational study'],
    imageUrl: '',
    publishedDate: '2025-11-01',
    isHighPriority: false,
    source: 'PRIDE-CF Research Team',
    researchOrganization: 'CF Foundation / LGBTQ+ Health Research'
  }
];

const ResearchUpdates = () => {
  const { token } = useAuth();
  const [updates, setUpdates] = useState(initialUpdates);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    description: '',
    link: '',
    updateType: 'Research Study',
    category: 'Treatment',
    tags: '',
    imageUrl: '',
    publishedDate: '',
    isHighPriority: false,
    source: '',
    researchOrganization: ''
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/research-updates');
      const data = await response.json();
      
      if (data.success && data.updates.length > 0) {
        const backendUpdateIds = new Set(data.updates.map(u => u._id));
        const uniqueInitialUpdates = initialUpdates.filter(u => !backendUpdateIds.has(u._id));
        setUpdates([...data.updates, ...uniqueInitialUpdates]);
      } else {
        setUpdates(initialUpdates);
      }
    } catch (error) {
      console.error('Error fetching research updates:', error);
      setUpdates(initialUpdates);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUpdate(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateUpdate = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to add a research update');
      return;
    }

    try {
      const updateData = {
        ...newUpdate,
        tags: newUpdate.tags ? newUpdate.tags.split(',').map(tag => tag.trim()) : []
      };

      const response = await fetch('http://localhost:5000/api/research-updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Research update added successfully!');
        setShowCreateModal(false);
        setUpdates(prevUpdates => [data.update, ...prevUpdates]);
        resetForm();
      } else {
        toast.error(data.message || 'Failed to add research update');
      }
    } catch (error) {
      console.error('Error creating research update:', error);
      toast.error('Failed to add research update: ' + error.message);
    }
  };

  const resetForm = () => {
    setNewUpdate({
      title: '',
      description: '',
      link: '',
      updateType: 'Research Study',
      category: 'Treatment',
      tags: '',
      imageUrl: '',
      publishedDate: '',
      isHighPriority: false,
      source: '',
      researchOrganization: ''
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

  const filteredUpdates = updates.filter(update => {
    if (filterType !== 'all' && update.updateType !== filterType) return false;
    if (filterCategory !== 'all' && update.category !== filterCategory) return false;
    return true;
  });

  if (loading) {
    return <div className="updates-loading">Loading research updates...</div>;
  }

  return (
    <div className="updates-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="updates-header">
        <h1>Research Updates</h1>
        <p>Stay informed about the latest CF research, clinical trials, and medical breakthroughs</p>
        {token && (
          <button 
            className="create-update-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Add Update
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="updates-filters">
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="Clinical Trial">Clinical Trial</option>
          <option value="Research Study">Research Study</option>
          <option value="Treatment Development">Treatment Development</option>
          <option value="Medical Discovery">Medical Discovery</option>
          <option value="Health Survey">Health Survey</option>
          <option value="Drug Study">Drug Study</option>
          <option value="Technology">Technology</option>
          <option value="Other">Other</option>
        </select>

        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="Treatment">Treatment</option>
          <option value="Mental Health">Mental Health</option>
          <option value="Cancer Screening">Cancer Screening</option>
          <option value="CFTR Modulators">CFTR Modulators</option>
          <option value="Clinical Trials">Clinical Trials</option>
          <option value="Gene Therapy">Gene Therapy</option>
          <option value="Drug Development">Drug Development</option>
          <option value="Community Health">Community Health</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Updates Grid */}
      <div className="updates-grid">
        {filteredUpdates.length === 0 ? (
          <div className="no-updates">
            <p>No research updates found matching your filters.</p>
          </div>
        ) : (
          filteredUpdates.map(update => (
            <div key={update._id} className={`update-card ${update.isHighPriority ? 'high-priority' : ''}`}>
              {update.isHighPriority && (
                <div className="priority-banner">🔬 High Priority Research</div>
              )}
              
              {update.imageUrl && (
                <div className="update-image">
                  <img src={update.imageUrl} alt={update.title} />
                </div>
              )}
              
              <div className="update-content">
                <div className="update-badges">
                  <span className={`update-type-badge ${update.updateType.toLowerCase().replace(/ /g, '-')}`}>
                    {update.updateType}
                  </span>
                  <span className={`category-badge ${update.category.toLowerCase().replace(/ /g, '-')}`}>
                    {update.category}
                  </span>
                </div>

                <h3 className="update-title">{update.title}</h3>
                <p className="update-description">{update.description}</p>

                <div className="update-meta">
                  {update.researchOrganization && (
                    <div className="meta-item">
                      <span className="meta-icon">🏢</span>
                      <span>{update.researchOrganization}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>{formatDate(update.publishedDate)}</span>
                  </div>
                  {update.source && (
                    <div className="meta-item">
                      <span className="meta-icon">📰</span>
                      <span>{update.source}</span>
                    </div>
                  )}
                </div>

                {update.tags && update.tags.length > 0 && (
                  <div className="update-tags">
                    {update.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="update-actions">
                  <a 
                    href={update.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-update-btn"
                  >
                    Read Full Update →
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Update Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="update-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Research Update</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateUpdate} className="update-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newUpdate.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., New Clinical Trial Results"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={newUpdate.description}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  placeholder="Describe the research update..."
                />
              </div>

              <div className="form-group">
                <label>Link *</label>
                <input
                  type="url"
                  name="link"
                  value={newUpdate.link}
                  onChange={handleInputChange}
                  required
                  placeholder="https://..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Update Type *</label>
                  <select
                    name="updateType"
                    value={newUpdate.updateType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Clinical Trial">Clinical Trial</option>
                    <option value="Research Study">Research Study</option>
                    <option value="Treatment Development">Treatment Development</option>
                    <option value="Medical Discovery">Medical Discovery</option>
                    <option value="Health Survey">Health Survey</option>
                    <option value="Drug Study">Drug Study</option>
                    <option value="Technology">Technology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={newUpdate.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Treatment">Treatment</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Cancer Screening">Cancer Screening</option>
                    <option value="CFTR Modulators">CFTR Modulators</option>
                    <option value="Clinical Trials">Clinical Trials</option>
                    <option value="Gene Therapy">Gene Therapy</option>
                    <option value="Drug Development">Drug Development</option>
                    <option value="Community Health">Community Health</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Research Organization</label>
                  <input
                    type="text"
                    name="researchOrganization"
                    value={newUpdate.researchOrganization}
                    onChange={handleInputChange}
                    placeholder="e.g., Arcturus Therapeutics"
                  />
                </div>

                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    name="source"
                    value={newUpdate.source}
                    onChange={handleInputChange}
                    placeholder="e.g., CF News Today"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Published Date</label>
                <input
                  type="date"
                  name="publishedDate"
                  value={newUpdate.publishedDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={newUpdate.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., clinical trial, CFTR, treatment"
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={newUpdate.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isHighPriority"
                    checked={newUpdate.isHighPriority}
                    onChange={handleInputChange}
                  />
                  Mark as high priority research
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
                  Add Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchUpdates;
