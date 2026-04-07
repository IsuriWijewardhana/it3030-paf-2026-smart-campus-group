import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8089/api/v1/facility-assets';

function EditFacilityAssetEntry() {
  const { assetId } = useParams();
  const [resourceName, setResourceName] = useState('');
  const [resourceType, setResourceType] = useState('ROOM');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [availabilityWindows, setAvailabilityWindows] = useState('');
  const [operationalStatus, setOperationalStatus] = useState('ACTIVE');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    fetchFacilityAsset();
  }, [assetId, navigate]);

  const parseField = (text, fieldName) => {
    const safeText = text || '';
    const pattern = new RegExp(`${fieldName}\\s*:\\s*([^;\\n]+)`, 'i');
    const match = safeText.match(pattern);
    return match ? match[1].trim() : '';
  };

  const normalizeFacilityAsset = (data) => {
    if (!data) {
      return null;
    }

    if (data._id) {
      return data;
    }

    if (data.facilityAsset && data.facilityAsset._id) {
      return data.facilityAsset;
    }

    if (data.data && data.data._id) {
      return data.data;
    }

    return null;
  };

  const fetchFacilityAsset = async () => {
    try {
      const response = await axios.get(`${API_URL}/${assetId}`, { withCredentials: true });
      const facilityAsset = normalizeFacilityAsset(response.data);

      if (!facilityAsset) {
        setError('Facility asset not found');
        setLoading(false);
        return;
      }

      setResourceName(facilityAsset.title || '');
      setResourceType(parseField(facilityAsset.description, 'Type') || 'ROOM');
      setCapacity(parseField(facilityAsset.description, 'Capacity') || '');
      setLocation(parseField(facilityAsset.description, 'Location') || '');
      setAvailabilityWindows(parseField(facilityAsset.description, 'Availability Windows') || '');

      const parsedStatus = parseField(facilityAsset.description, 'Status');
      if (parsedStatus === 'OUT_OF_SERVICE') {
        setOperationalStatus('OUT_OF_SERVICE');
      } else {
        setOperationalStatus('ACTIVE');
      }

      setIsPublic(!!facilityAsset.isPublic);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError('Error fetching facility asset details');
      console.error('Error fetching facility asset details:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const description = [
        `Type: ${resourceType}`,
        `Capacity: ${capacity}`,
        `Location: ${location}`,
        `Availability Windows: ${availabilityWindows}`,
        `Status: ${operationalStatus}`
      ].join('; ');

      const facilityAsset = {
        _id: assetId,
        title: resourceName,
        description,
        userId: user.userId,
        username: user.username,
        status: operationalStatus === 'ACTIVE' ? 'NOT_STARTED' : 'COMPLETED',
        isPublic,
        topics: [],
        resources: [],
        completionDeadline: null
      };

      const response = await axios.put(`${API_URL}/edit/${assetId}`, facilityAsset, { withCredentials: true });

      if (response.data.success) {
        alert('Facility asset updated successfully!');
        navigate(`/facility-asset/${assetId}`);
      } else {
        setError(response.data.message || 'Error updating facility asset');
      }
    } catch (err) {
      setError('Error updating facility asset');
      console.error('Error updating facility asset:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">Edit Facility Asset</h3>
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

                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Operational Status</label>
                    <select
                      className="form-select"
                      id="status"
                      value={operationalStatus}
                      onChange={(e) => setOperationalStatus(e.target.value)}
                      required
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="isPublic">
                        List this entry in the public catalogue
                      </label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate(`/facility-asset/${assetId}`)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Facility Asset
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

export default EditFacilityAssetEntry;
