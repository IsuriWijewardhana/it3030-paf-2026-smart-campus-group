import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1";

function EditProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePictureUrl: '',
    code: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, [navigate]);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/info`, { withCredentials: true });
      if (!res.data?.authenticated) {
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      const sessionUser = {
        userId: res.data.userId,
        username: res.data.username || res.data.name || 'User',
        email: res.data.email || ''
      };
      setCurrentUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));

      // Pre-fill username and email
      setForm(prev => ({
        ...prev,
        username: sessionUser.username,
        email: sessionUser.email
      }));

      // Also fetch profile picture
      try {
        const profileRes = await axios.get(`${API_URL}/profiles/user/${sessionUser.userId}`, { withCredentials: true });
        setProfileId(profileRes.data._id || null);
        setForm(prev => ({ ...prev, profilePictureUrl: profileRes.data.profilePictureUrl || '' }));
      } catch (_) { /* profile picture is optional */ }

      setLoading(false);
    } catch (err) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // 1. Update login credentials / role
      const credPayload = {
        username: form.username,
        email: form.email,
        ...(form.password ? { password: form.password } : {}),
        ...(form.code ? { code: form.code } : {})
      };
      const credRes = await axios.put(
        `${API_URL}/auth/update/${currentUser.userId}`,
        credPayload,
        { withCredentials: true }
      );

      if (!credRes.data?.success) {
        setError(credRes.data?.message || 'Update failed.');
        return;
      }

      // 2. Update profile picture if changed
      try {
        if (profileId) {
          await axios.put(
            `${API_URL}/profiles/edit/${profileId}`,
            { userId: currentUser.userId, profilePictureUrl: form.profilePictureUrl },
            { withCredentials: true }
          );
        } else {
          await axios.post(
            `${API_URL}/profiles/save`,
            { userId: currentUser.userId, profilePictureUrl: form.profilePictureUrl },
            { withCredentials: true }
          );
        }
      } catch (_) { /* profile picture update failure is non-fatal */ }

      // 3. Update localStorage with new username
      const updatedUser = { ...currentUser, username: form.username, email: form.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const roleMsg = credRes.data.role === 'ADMIN' ? ' You now have Admin access.' : '';
      setSuccess(`Account updated successfully.${roleMsg}`);
      setTimeout(() => navigate(`/profile/${currentUser.userId}`), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed.');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4 d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
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
          <div className="col-md-7">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Account Settings</h4>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>

                  {/* Profile picture */}
                  <div className="mb-3 text-center">
                    {form.profilePictureUrl ? (
                      <img
                        src={form.profilePictureUrl}
                        alt="Profile Preview"
                        className="rounded-circle mb-2"
                        style={{ width: '90px', height: '90px', objectFit: 'cover', border: '3px solid #0d6efd' }}
                      />
                    ) : (
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                        style={{ width: '90px', height: '90px', background: '#e9ecef', fontSize: '2rem', fontWeight: 'bold', color: '#6c757d' }}
                      >
                        {form.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <label htmlFor="profilePictureUrl" className="form-label">Profile Picture URL</label>
                      <input
                        type="url"
                        className="form-control"
                        id="profilePictureUrl"
                        name="profilePictureUrl"
                        value={form.profilePictureUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/your-image.jpg"
                      />
                    </div>
                  </div>

                  <hr />

                  {/* Username */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">New Password <small className="text-muted">(leave blank to keep current)</small></label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                    />
                  </div>

                  <hr />

                  {/* Special code */}
                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">Your Code <small className="text-muted">(optional)</small></label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      placeholder="Enter your special code if you have one"
                    />
                    <div className="form-text">If you have an access code, enter it here to unlock special permissions.</div>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate(`/profile/${currentUser.userId}`)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
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
