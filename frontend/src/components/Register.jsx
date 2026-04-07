import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1/auth";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || API_URL.replace('/api/v1/auth', '');

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleRegister = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Sending registration request to:', `${API_URL}/register`);
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
        role: 'STUDENT' // Default role
      });

      console.log('Registration response:', response.data);
      if (response.data.success) {
        alert('Registration successful! Please login.');
        navigate('/login', { replace: true });
        return;
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        setError(error.response.data?.message || `Error ${error.response.status}: Registration failed`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response received from server. Please try again later.');
      } else {
        console.error('Error message:', error.message);
        setError(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center">Register for Smart Campus</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={handleGoogleRegister}
                  >
                    Continue with Google
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <p>
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
