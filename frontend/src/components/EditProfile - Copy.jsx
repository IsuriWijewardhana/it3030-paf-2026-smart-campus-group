import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1";

function EditProfile() {
  const [profile, setProfile] = useState({
    bio: '',
    profilePictureUrl: '',
    skills: '',
    interests: '',
    socialMediaLinks: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    fetchUserProfile(user.userId);
  }, [navigate]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/profiles/user/${userId}`);

      // Set profile data
      setProfile({
        _id: response.data._id,
        userId: response.data.userId,
        bio: response.data.bio || '',
        profilePictureUrl: response.data.profilePictureUrl || '',
        skills: response.data.skills || '',
        interests: response.data.interests || '',
        socialMediaLinks: response.data.socialMediaLinks || ''
      });

      setLoading(false);
    } catch (error) {
      setError('Error fetching user profile');
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));

      // Ensure userId is set
      const updatedProfile = {
        ...profile,
        userId: user.userId
      };

      let response;

      if (profile._id) {
        // Update existing profile
        response = await axios.put(`${API_URL}/profiles/edit/${profile._id}`, updatedProfile);
      } else {
        // Create new profile
        response = await axios.post(`${API_URL}/profiles/save`, updatedProfile);
      }

      if (response.data.success) {
        alert('Profile updated successfully!');
        navigate(`/profile/${user.userId}`);
      } else {
        setError(response.data.message || 'Error updating profile');
      }
    } catch (error) {
      setError('Error updating profile');
      console.error('Error updating profile:', error);
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
                <h3 className="mb-0">Edit Profile</h3>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="profilePictureUrl" className="form-label">Profile Picture URL</label>
                    <input
                      type="url"
                      className="form-control"
                      id="profilePictureUrl"
                      name="profilePictureUrl"
                      value={profile.profilePictureUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/your-image.jpg"
                    />
                    {profile.profilePictureUrl && (
                      <div className="mt-2 text-center">
                        <img
                          src={profile.profilePictureUrl}
                          alt="Profile Preview"
                          className="rounded-circle"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      rows="3"
                      value={profile.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="skills" className="form-label">Skills (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="skills"
                      name="skills"
                      value={profile.skills}
                      onChange={handleChange}
                      placeholder="JavaScript, React, Spring Boot, etc."
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="interests" className="form-label">Interests (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="interests"
                      name="interests"
                      value={profile.interests}
                      onChange={handleChange}
                      placeholder="Web Development, Machine Learning, etc."
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="socialMediaLinks" className="form-label">Social Media Links (JSON format)</label>
                    <textarea
                      className="form-control"
                      id="socialMediaLinks"
                      name="socialMediaLinks"
                      rows="3"
                      value={profile.socialMediaLinks}
                      onChange={handleChange}
                      placeholder='{"linkedin": "https://linkedin.com/in/username", "github": "https://github.com/username"}'
                    ></textarea>
                    <small className="form-text text-muted">
                      Enter links in JSON format: &#123;"platform": "url", "platform2": "url2"&#125;
                    </small>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        const user = JSON.parse(localStorage.getItem('user'));
                        navigate(`/profile/${user.userId}`);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Profile
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

export default EditProfile;
