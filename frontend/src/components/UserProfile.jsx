import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1";

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [facilityAssets, setFacilityAssets] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/150';
  
  useEffect(() => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetchUserData();
    fetchUserProfile();
    fetchUserFacilityAssets();
    checkFollowStatus();
  }, [userId, navigate]);

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

  const normalizeProfile = (data) => {
    if (!data) {
      return null;
    }

    if (data.userId || data._id) {
      return data;
    }

    if (data.profile) {
      return data.profile;
    }

    if (data.data) {
      return data.data;
    }

    return null;
  };

  const fetchUserData = async () => {
    try {
      // In a real application, you would have an endpoint to get user details by ID
      // For now, we'll simulate this with the current user if it's their profile
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      if (currentUser.userId === userId) {
        setUser(currentUser);
      } else {
        // In a real app, you would fetch the user data from the server
        // For now, we'll just set some placeholder data
        setUser({
          userId: userId,
          username: "Loading...", // This would be fetched from the server
          email: "",
          role: ""
        });
      }
    } catch (error) {
      setError('Error fetching user data');
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/profiles/user/${userId}`, { withCredentials: true });
      const normalizedProfile = normalizeProfile(response.data);
      setProfile(normalizedProfile);
      setLoading(false);
      
      // If we didn't have user data, update it from the profile
      if (user && user.username === "Loading..." && normalizedProfile) {
        setUser(prevUser => ({
          ...prevUser,
          username: normalizedProfile.username || "Unknown User"
        }));
      }
    } catch (error) {
      setError('Error fetching user profile');
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const fetchUserFacilityAssets = async () => {
    try {
      const response = await axios.get(`${API_URL}/facility-assets/user/${userId}/public`, { withCredentials: true });
      setFacilityAssets(normalizeFacilityAssets(response.data));
    } catch (error) {
      console.error('Error fetching catalogue entries:', error);
      setFacilityAssets([]);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser.userId !== userId) {
        const response = await axios.get(
          `${API_URL}/follows/check/follower/${currentUser.userId}/following/${userId}`,
          { withCredentials: true }
        );
        setIsFollowing(response.data.isFollowing);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      if (isFollowing) {
        // Unfollow
        await axios.delete(
          `${API_URL}/follows/unfollow/follower/${currentUser.userId}/following/${userId}`,
          { withCredentials: true }
        );
        setIsFollowing(false);
      } else {
        // Follow
        await axios.post(`${API_URL}/follows/follow`, {
          followerId: currentUser.userId,
          followerUsername: currentUser.username,
          followingId: userId,
          followingUsername: user.username
        }, { withCredentials: true });
        setIsFollowing(true);
      }
      
      // Refresh profile to update followers count
      fetchUserProfile();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const resolveProfileImage = (imageUrl) => {
    const trimmed = (imageUrl || '').trim();
    if (!trimmed) {
      return DEFAULT_PROFILE_IMAGE;
    }

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
      return trimmed;
    }

    // Accept URLs entered without protocol (e.g., example.com/image.jpg)
    return `https://${trimmed}`;
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

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-danger" role="alert">
            {error || 'User profile not found'}
          </div>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isCurrentUser = currentUser.userId === userId;
  const normalizedRole = (currentUser.role || '').toString().trim().toUpperCase();
  const isCurrentUserAdmin = isCurrentUser && (normalizedRole === 'ADMIN' || normalizedRole === 'ROLE_ADMIN');
  const displayUser = user || {
    userId,
    username: profile?.username || 'User',
    email: ''
  };
  const resolvedProfileImage = resolveProfileImage(profile.profilePictureUrl);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">{displayUser.username}'s Profile</h3>
              </div>
              <div className="card-body text-center">
                {profile?.profilePictureUrl ? (
                  <img
                    src={resolvedProfileImage}
                    alt={`${displayUser.username}'s profile`}
                    className="rounded-circle img-fluid mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_PROFILE_IMAGE) {
                        e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                      }
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '150px', height: '150px', background: '#f1f3f5', color: '#6c757d' }}
                  >
                    <i className="bi bi-person-circle" style={{ fontSize: '96px', lineHeight: 1 }}></i>
                  </div>
                )}
                
                <h4>{displayUser.username}</h4>
                {displayUser.email && <p className="text-muted">{displayUser.email}</p>}
                
                <div className="d-flex justify-content-around mb-3">
                  <Link to={`/followers/${userId}`} className="text-decoration-none">
                    <div className="text-center">
                      <h5>{profile.followersCount}</h5>
                      <p className="text-muted mb-0">Followers</p>
                    </div>
                  </Link>
                  <Link to={`/following/${userId}`} className="text-decoration-none">
                    <div className="text-center">
                      <h5>{profile.followingCount}</h5>
                      <p className="text-muted mb-0">Following</p>
                    </div>
                  </Link>
                  <div className="text-center">
                    <h5>{profile.facilityAssetsCount ?? profile.learningPlansCount ?? 0}</h5>
                    <p className="text-muted mb-0">Catalogue Entries</p>
                  </div>
                </div>
                
                {!isCurrentUser ? (
                  <button 
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} w-100`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                ) : (
                  <Link to="/edit-profile" className="btn btn-primary w-100">
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">About</h4>
              </div>
              <div className="card-body">
                <h5>Bio</h5>
                <p>{profile.bio || 'No bio provided'}</p>
                
                {profile.skills && (
                  <>
                    <h5>Skills</h5>
                    <p>{profile.skills}</p>
                  </>
                )}
                
                {profile.interests && (
                  <>
                    <h5>Interests</h5>
                    <p>{profile.interests}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Facilities & Assets Catalogue</h4>
                {isCurrentUserAdmin && (
                  <Link to="/add-facility-asset" className="btn btn-sm btn-primary">
                    Add New Entry
                  </Link>
                )}
              </div>
              <div className="card-body">
                {facilityAssets.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    No catalogue entries to display.
                  </div>
                ) : (
                  <div className="row">
                    {facilityAssets.map((asset) => (
                      <div key={asset._id} className="col-md-6 mb-3">
                        <div className="card h-100">
                          <div className="card-header bg-primary text-white">
                            <h5 className="card-title mb-0">{asset.title}</h5>
                          </div>
                          <div className="card-body">
                            <p className="card-text">{asset.description}</p>
                            <div className="d-flex justify-content-between">
                              <span>
                                <i className="bi bi-heart-fill text-danger"></i> {asset.likesCount} Favourites
                              </span>
                              <span>
                                <i className="bi bi-chat-fill text-primary"></i> {asset.commentsCount} Maintenance Feedback
                              </span>
                            </div>
                          </div>
                          <div className="card-footer">
                            <Link to={`/facility-asset/${asset._id}`} className="btn btn-sm btn-info w-100">
                              View Entry
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
