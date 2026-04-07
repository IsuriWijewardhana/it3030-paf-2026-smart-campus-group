import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1/facility-assets";

function FacilityAssetList() {
  const [user, setUser] = useState(null);
  const [facilityAssets, setFacilityAssets] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'public'
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const navigate = useNavigate();

  const normalizeFacilityAssets = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === 'object') {
      if (Array.isArray(data.facilityAssets)) {
        return data.facilityAssets;
      }

      if (Array.isArray(data.learningPlans)) {
        return data.learningPlans;
      }

      if (Array.isArray(data.data)) {
        return data.data;
      }

      if (typeof data[Symbol.iterator] === 'function') {
        return Array.from(data);
      }
    }

    return [];
  };
  
  useEffect(() => {
    fetchCurrentUser();
  }, [navigate, filter]);

  const fetchCurrentUser = async () => {
    try {
      const userInfoResponse = await axios.get('http://localhost:8089/api/v1/user/info', { withCredentials: true });
      if (!userInfoResponse.data?.authenticated) {
        navigate('/login');
        return;
      }

      const sessionUser = {
        userId: userInfoResponse.data.userId,
        username: userInfoResponse.data.username || userInfoResponse.data.name || 'User'
      };

      setUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      fetchFacilityAssets(sessionUser);
    } catch (error) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const fetchFacilityAssets = async (currentUser) => {
    try {
      let endpoint = '/getall';
      
      if (filter === 'my') {
        if (!currentUser?.userId) {
          setError('Unable to load your facility assets. User session not available.');
          return;
        }
        endpoint = `/user/${currentUser.userId}`;
      } else if (filter === 'public') {
        endpoint = '/public';
      }
      
      const response = await axios.get(`${API_URL}${endpoint}`, { withCredentials: true });
      setFacilityAssets(normalizeFacilityAssets(response.data));
    } catch (error) {
      setError('Error fetching catalogue entries');
      console.error('Error fetching catalogue entries:', error);
      setFacilityAssets([]);
    }
  };

  const handleViewFacilityAsset = (assetId) => {
    navigate(`/facility-asset/${assetId}`);
  };

  const handleEditFacilityAsset = (assetId) => {
    navigate(`/edit-facility-asset/${assetId}`);
  };

  const handleDeleteFacilityAsset = async (assetId) => {
    if (window.confirm('Are you sure you want to delete this facility asset?')) {
      try {
        await axios.delete(`${API_URL}/delete/${assetId}`, { withCredentials: true });
        alert('Facility asset deleted successfully');
        fetchFacilityAssets(user); // Refresh the list
      } catch (error) {
        setError('Error deleting facility asset');
        console.error('Error deleting facility asset:', error);
      }
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const renderFacilityAssetStatus = (status) => {
    switch (status) {
      case 'NOT_STARTED':
        return <span className="badge bg-success">Active</span>;
      case 'IN_PROGRESS':
        return <span className="badge bg-success">Active</span>;
      case 'COMPLETED':
        return <span className="badge bg-danger">Out of Stock</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
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

  const filteredFacilityAssets = facilityAssets.filter((asset) => {
    const filterText = getFilterableText(asset);
    const searchMatch = searchTerm
      ? filterText.includes(searchTerm.toLowerCase())
      : true;

    const locationValue = getTaggedFieldValue(asset, 'location');
    const locationMatch = locationFilter
      ? locationValue.includes(locationFilter.toLowerCase()) || filterText.includes(locationFilter.toLowerCase())
      : true;

    const capacityValue = getTaggedFieldValue(asset, 'capacity');
    const capacityMatch = capacityFilter
      ? capacityValue.includes(capacityFilter.toLowerCase()) || filterText.includes(capacityFilter.toLowerCase())
      : true;

    return searchMatch && locationMatch && capacityMatch;
  });

  const canManageAsset = (asset) => {
    return !!user?.userId && asset.userId === user.userId;
  };

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
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/notifications')}
                >
                  Notifications
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

            {facilityAssets.length === 0 ? (
              <div className="alert alert-info" role="alert">
                No catalogue entries found. Add your first facility or asset!
              </div>
            ) : filteredFacilityAssets.length === 0 ? (
              <div className="alert alert-warning" role="alert">
                No catalogue entries match your search/filter criteria.
              </div>
            ) : (
              <div className="row">
                {filteredFacilityAssets.map((asset) => (
                  <div key={asset._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">{asset.title}</h5>
                        {renderFacilityAssetStatus(asset.status)}
                      </div>
                      <div className="card-body">
                        <p className="card-text">{asset.description}</p>
                        <p className="card-text">
                          <small className="text-muted">
                            Added by: {asset.username}
                          </small>
                        </p>
                        <div className="d-flex justify-content-between">
                          <span>
                            <i className="bi bi-heart-fill text-danger"></i> {asset.likesCount} Favourites
                          </span>
                          <span>
                            <i className="bi bi-chat-fill text-primary"></i> {asset.commentsCount} Maintenance Feedback
                          </span>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-between">
                        <button
                          className="btn btn-info"
                          onClick={() => handleViewFacilityAsset(asset._id)}
                        >
                          View
                        </button>
                        {canManageAsset(asset) && (
                          <>
                            <button
                              className="btn btn-warning"
                              onClick={() => handleEditFacilityAsset(asset._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteFacilityAsset(asset._id)}
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

export default FacilityAssetList;
