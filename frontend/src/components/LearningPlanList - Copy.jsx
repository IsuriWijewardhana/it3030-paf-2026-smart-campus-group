import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1/learning-plans";

function LearningPlanList() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'public'
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    fetchLearningPlans();
  }, [navigate, filter]);

  const fetchLearningPlans = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      let endpoint = '/getall';
      
      if (filter === 'my') {
        endpoint = `/user/${user.userId}`;
      } else if (filter === 'public') {
        endpoint = '/public';
      }
      
      const response = await axios.get(`${API_URL}${endpoint}`);
      setLearningPlans(response.data);
    } catch (error) {
      setError('Error fetching catalogue entries');
      console.error('Error fetching catalogue entries:', error);
    }
  };

  const handleNavigateToAddLearningPlan = () => {
    navigate('/add-learning-plan');
  };

  const handleViewLearningPlan = (planId) => {
    navigate(`/learning-plan/${planId}`);
  };

  const handleEditLearningPlan = (planId) => {
    navigate(`/edit-learning-plan/${planId}`);
  };

  const handleDeleteLearningPlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this catalogue entry?')) {
      try {
        await axios.delete(`${API_URL}/delete/${planId}`);
        alert('Catalogue entry deleted successfully');
        fetchLearningPlans(); // Refresh the list
      } catch (error) {
        setError('Error deleting catalogue entry');
        console.error('Error deleting catalogue entry:', error);
      }
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const renderLearningPlanStatus = (status) => {
    switch (status) {
      case 'NOT_STARTED':
        return <span className="badge bg-secondary">Available</span>;
      case 'IN_PROGRESS':
        return <span className="badge bg-primary">In Use</span>;
      case 'COMPLETED':
        return <span className="badge bg-success">Under Maintenance</span>;
      default:
        return <span className="badge bg-secondary">Available</span>;
    }
  };

  const getFilterableText = (plan) => {
    const topicText = (plan.topics || [])
      .map((topic) => `${topic.title || ''} ${topic.description || ''}`)
      .join(' ')
      .toLowerCase();

    return `${plan.title || ''} ${plan.description || ''} ${topicText}`.toLowerCase();
  };

  const getTaggedFieldValue = (plan, fieldName) => {
    const combinedText = getFilterableText(plan);
    const fieldPattern = new RegExp(`${fieldName}\\s*[:=-]\\s*([^,;\\n]+)`, 'i');
    const match = combinedText.match(fieldPattern);
    return match ? match[1].trim() : '';
  };

  const filteredLearningPlans = learningPlans.filter((plan) => {
    const filterText = getFilterableText(plan);
    const searchMatch = searchTerm
      ? filterText.includes(searchTerm.toLowerCase())
      : true;

    const locationValue = getTaggedFieldValue(plan, 'location');
    const locationMatch = locationFilter
      ? locationValue.includes(locationFilter.toLowerCase()) || filterText.includes(locationFilter.toLowerCase())
      : true;

    const capacityValue = getTaggedFieldValue(plan, 'capacity');
    const capacityMatch = capacityFilter
      ? capacityValue.includes(capacityFilter.toLowerCase()) || filterText.includes(capacityFilter.toLowerCase())
      : true;

    return searchMatch && locationMatch && capacityMatch;
  });

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-4">Facilities & Assets Catalogue</h1>
            
            <div className="d-flex justify-content-between mb-4">
              <div className="btn-group" role="group">
                <button 
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleFilterChange('all')}
                >
                  All Entries
                </button>
                <button 
                  className={`btn ${filter === 'my' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleFilterChange('my')}
                >
                  My Entries
                </button>
                <button 
                  className={`btn ${filter === 'public' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleFilterChange('public')}
                >
                  Public Catalogue
                </button>
              </div>
              
              <button
                className="btn btn-success"
                onClick={handleNavigateToAddLearningPlan}
              >
                Add Catalogue Entry
              </button>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label htmlFor="catalogueSearch" className="form-label">Search</label>
                    <input
                      id="catalogueSearch"
                      type="text"
                      className="form-control"
                      placeholder="Search by name, description or specs"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="locationFilter" className="form-label">Location</label>
                    <input
                      id="locationFilter"
                      type="text"
                      className="form-control"
                      placeholder="e.g., Lab 01"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="capacityFilter" className="form-label">Capacity</label>
                    <input
                      id="capacityFilter"
                      type="text"
                      className="form-control"
                      placeholder="e.g., 40"
                      value={capacityFilter}
                      onChange={(e) => setCapacityFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {learningPlans.length === 0 ? (
              <div className="alert alert-info" role="alert">
                No catalogue entries found. Add your first facility or asset!
              </div>
            ) : filteredLearningPlans.length === 0 ? (
              <div className="alert alert-warning" role="alert">
                No catalogue entries match your search/filter criteria.
              </div>
            ) : (
              <div className="row">
                {filteredLearningPlans.map((plan) => (
                  <div key={plan._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">{plan.title}</h5>
                        {renderLearningPlanStatus(plan.status)}
                      </div>
                      <div className="card-body">
                        <p className="card-text">{plan.description}</p>
                        <p className="card-text">
                          <small className="text-muted">
                            Added by: {plan.username}
                          </small>
                        </p>
                        <p className="card-text">
                          <small className="text-muted">
                            Specifications: {plan.topics ? plan.topics.length : 0}
                          </small>
                        </p>
                        <div className="d-flex justify-content-between">
                          <span>
                            <i className="bi bi-heart-fill text-danger"></i> {plan.likesCount}
                          </span>
                          <span>
                            <i className="bi bi-chat-fill text-primary"></i> {plan.commentsCount}
                          </span>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-between">
                        <button
                          className="btn btn-info"
                          onClick={() => handleViewLearningPlan(plan._id)}
                        >
                          View
                        </button>
                        {plan.userId === user.userId && (
                          <>
                            <button
                              className="btn btn-warning"
                              onClick={() => handleEditLearningPlan(plan._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteLearningPlan(plan._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LearningPlanList;
