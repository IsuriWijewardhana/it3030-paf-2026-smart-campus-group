import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1/facility-assets";

function AddFacilityAssetEntry() {
  const [user, setUser] = useState(null);
  const [resourceName, setResourceName] = useState('');
  const [resourceType, setResourceType] = useState('ROOM');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [availabilityWindows, setAvailabilityWindows] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, [navigate]);

  const fetchCurrentUser = async () => {
    try {
      const userInfoResponse = await axios.get('http://localhost:8089/api/v1/user/info', { withCredentials: true });
      if (!userInfoResponse.data?.authenticated) {
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const sessionUser = {
        userId: userInfoResponse.data.userId,
        username: userInfoResponse.data.username || userInfoResponse.data.name || 'User'
      };

      setUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));
    } catch (error) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!user?.userId) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      const description = [
        `Type: ${resourceType}`,
        `Capacity: ${capacity}`,
        `Location: ${location}`,
        `Availability Windows: ${availabilityWindows}`,
        `Status: ${status}`
      ].join('; ');
      
      const facilityAsset = {
        title: resourceName,
        description,
        userId: user.userId,
        username: user.username,
        status: status === 'ACTIVE' ? 'NOT_STARTED' : 'COMPLETED',
        isPublic: true,
        topics: [],
        resources: [],
        completionDeadline: null
      };
      
      const response = await axios.post(`${API_URL}/save`, facilityAsset, { withCredentials: true });
      
      if (response.data.success) {
        alert('Facility asset created successfully!');
        navigate('/facility-assets');
      } else {
        setError(response.data.message || 'Error creating facility asset');
      }
    } catch (error) {
      setError('Error creating facility asset');
      console.error('Error creating facility asset:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">Add Facility Asset</h3>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="resourceName" className="form-label">Asset Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="resourceName"
                      value={resourceName}
                      onChange={(e) => setResourceName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="resourceType" className="form-label">Asset Type</label>
                      <select
                        className="form-select"
                        id="resourceType"
                        value={resourceType}
                        onChange={(e) => setResourceType(e.target.value)}
                        required
                      >
                        <option value="ROOM">Room</option>
                        <option value="EQUIPMENT">Equipment</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="capacity" className="form-label">Capacity</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        id="capacity"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="availabilityWindows" className="form-label">Availability Windows</label>
                    <input
                      type="text"
                      className="form-control"
                      id="availabilityWindows"
                      value={availabilityWindows}
                      onChange={(e) => setAvailabilityWindows(e.target.value)}
                      placeholder="e.g., Mon-Fri 08:00-17:00"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="status" className="form-label">Operational Status</label>
                    <select
                      className="form-select"
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                    </select>
                  </div>
                  
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/facility-assets')}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Facility Asset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddFacilityAssetEntry;
