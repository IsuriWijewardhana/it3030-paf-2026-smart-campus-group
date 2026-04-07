import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import CommentSection from './CommentSection';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1";

function FacilityAssetDetail() {
  const { assetId } = useParams();
  const [facilityAsset, setFacilityAsset] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    fetchFacilityAsset();
    checkLikeStatus();
    checkFollowStatus();
  }, [assetId, navigate]);

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
      const response = await axios.get(`${API_URL}/facility-assets/${assetId}`, { withCredentials: true });
      const normalized = normalizeFacilityAsset(response.data);

      if (!normalized) {
        setError('Facility asset not found');
        setFacilityAsset(null);
      } else {
        setFacilityAsset(normalized);
        setError(null);
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching facility asset details');
      console.error('Error fetching facility asset details:', error);
      setFacilityAsset(null);
      setLoading(false);
    }
  };

  const renderAvailabilityStatus = (status) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'Active';
      case 'IN_PROGRESS':
        return 'Active';
      case 'COMPLETED':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const parseDescriptionField = (text, fieldName) => {
    const safeText = text || '';
    const pattern = new RegExp(`${fieldName}\\s*:\\s*([^;\\n]+)`, 'i');
    const match = safeText.match(pattern);
    return match ? match[1].trim() : '-';
  };

  const checkLikeStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(
        `${API_URL}/likes/check/user/${user.userId}/resource/${assetId}/type/FACILITY_ASSET`,
        { withCredentials: true }
      );
      setHasLiked(response.data.hasLiked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const checkFollowStatus = async () => {
    try {
      if (facilityAsset) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.userId !== facilityAsset.userId) {
          const response = await axios.get(
            `${API_URL}/follows/check/follower/${user.userId}/following/${facilityAsset.userId}`,
            { withCredentials: true }
          );
          setIsFollowing(response.data.isFollowing);
        }
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleLike = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (hasLiked) {
        // Unlike
        await axios.delete(
          `${API_URL}/likes/user/${user.userId}/resource/${assetId}/type/FACILITY_ASSET`,
          { withCredentials: true }
        );
        setHasLiked(false);
      } else {
        // Like
        await axios.post(`${API_URL}/likes/save`, {
          userId: user.userId,
          username: user.username,
          resourceId: assetId,
          resourceType: 'FACILITY_ASSET'
        }, { withCredentials: true });
        setHasLiked(true);
      }
      
      // Refresh asset details to update like count
      fetchFacilityAsset();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (isFollowing) {
        // Unfollow
        await axios.delete(
          `${API_URL}/follows/unfollow/follower/${user.userId}/following/${facilityAsset.userId}`,
          { withCredentials: true }
        );
        setIsFollowing(false);
      } else {
        // Follow
        await axios.post(`${API_URL}/follows/follow`, {
          followerId: user.userId,
          followerUsername: user.username,
          followingId: facilityAsset.userId,
          followingUsername: facilityAsset.username
        }, { withCredentials: true });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
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

  if (error || !facilityAsset) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-danger" role="alert">
            {error || 'Facility asset not found'}
          </div>
          <Link to="/facility-assets" className="btn btn-primary">
            Back to Catalogue
          </Link>
        </div>
      </>
    );
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const isOwner = user.userId === facilityAsset.userId;
  const parsedType = parseDescriptionField(facilityAsset.description, 'Type');
  const parsedCapacity = parseDescriptionField(facilityAsset.description, 'Capacity');
  const parsedLocation = parseDescriptionField(facilityAsset.description, 'Location');
  const parsedAvailabilityWindows = parseDescriptionField(facilityAsset.description, 'Availability Windows');
  const parsedOperationalStatus = parseDescriptionField(facilityAsset.description, 'Status');

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h2 className="mb-0">{facilityAsset.title}</h2>
                <div>
                  {!isOwner && (
                    <button 
                      className={`btn ${isFollowing ? 'btn-secondary' : 'btn-outline-light'} me-2`}
                      onClick={handleFollow}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'} {facilityAsset.username}
                    </button>
                  )}
                  <button 
                    className={`btn ${hasLiked ? 'btn-danger' : 'btn-outline-light'}`}
                    onClick={handleLike}
                  >
                    {hasLiked ? 'Unfavourite' : 'Favourite'} ({facilityAsset.likesCount})
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h5>Facility Asset Details</h5>
                  <div className="row g-3">
                    <div className="col-md-6"><strong>Type:</strong> {parsedType}</div>
                    <div className="col-md-6"><strong>Capacity:</strong> {parsedCapacity}</div>
                    <div className="col-md-6"><strong>Location:</strong> {parsedLocation}</div>
                    <div className="col-md-6"><strong>Availability Windows:</strong> {parsedAvailabilityWindows}</div>
                    <div className="col-md-6"><strong>Operational Status:</strong> {parsedOperationalStatus}</div>
                    <div className="col-md-6"><strong>System Status:</strong> {renderAvailabilityStatus(facilityAsset.status)}</div>
                  </div>
                  <p>
                    <small className="text-muted">
                      Added by: <Link to={`/profile/${facilityAsset.userId}`}>{facilityAsset.username}</Link>
                    </small>
                  </p>
                </div>

                {isOwner && (
                  <div className="d-flex justify-content-end">
                    <Link to={`/edit-facility-asset/${assetId}`} className="btn btn-warning me-2">
                      Edit Facility Asset
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <CommentSection 
              resourceId={assetId} 
              resourceType="FACILITY_ASSET" 
              commentsCount={facilityAsset.commentsCount}
              onCommentAdded={fetchFacilityAsset}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default FacilityAssetDetail;
