import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1";

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetchUserData();
    fetchUserProfile();
    fetchUserLearningPlans();
    checkFollowStatus();
  }, [userId, navigate]);

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
      const response = await axios.get(`${API_URL}/profiles/user/${userId}`);
      setProfile(response.data);
      setLoading(false);
      
      // If we didn't have user data, update it from the profile
      if (user && user.username === "Loading...") {
        setUser(prevUser => ({
          ...prevUser,
          username: response.data.username || "Unknown User"
        }));
      }
    } catch (error) {
      setError('Error fetching user profile');
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const fetchUserLearningPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/learning-plans/user/${userId}/public`);
      setLearningPlans(response.data);
    } catch (error) {
      console.error('Error fetching catalogue entries:', error);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser.userId !== userId) {
        const response = await axios.get(
          `${API_URL}/follows/check/follower/${currentUser.userId}/following/${userId}`
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
          `${API_URL}/follows/unfollow/follower/${currentUser.userId}/following/${userId}`
        );
        setIsFollowing(false);
      } else {
        // Follow
        await axios.post(`${API_URL}/follows/follow`, {
          followerId: currentUser.userId,
          followerUsername: currentUser.username,
          followingId: userId,
          followingUsername: user.username
        });
        setIsFollowing(true);
      }
      
      // Refresh profile to update followers count
      fetchUserProfile();
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

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">{user.username}'s Profile</h3>
              </div>
              <div className="card-body text-center">
                <img
                  src={profile.profilePictureUrl || "https://via.placeholder.com/150"}
                  alt={`${user.username}'s profile`}
                  className="rounded-circle img-fluid mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                
                <h4>{user.username}</h4>
                {user.email && <p className="text-muted">{user.email}</p>}
                
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
                    <h5>{profile.learningPlansCount}</h5>
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
                {isCurrentUser && (
                  <Link to="/add-learning-plan" className="btn btn-sm btn-primary">
                    Add New Entry
                  </Link>
                )}
              </div>
              <div className="card-body">
                {learningPlans.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    No catalogue entries to display.
                  </div>
                ) : (
                  <div className="row">
                    {learningPlans.map((plan) => (
                      <div key={plan._id} className="col-md-6 mb-3">
                        <div className="card h-100">
                          <div className="card-header bg-primary text-white">
                            <h5 className="card-title mb-0">{plan.title}</h5>
                          </div>
                          <div className="card-body">
                            <p className="card-text">{plan.description}</p>
                            <div className="d-flex justify-content-between">
                              <span>
                                <i className="bi bi-heart-fill text-danger"></i> {plan.likesCount}
                              </span>
                              <span>
                                <i className="bi bi-chat-fill text-primary"></i> {plan.commentsCount}
                              </span>
                            </div>
                          </div>
                          <div className="card-footer">
                            <Link to={`/learning-plan/${plan._id}`} className="btn btn-sm btn-info w-100">
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
