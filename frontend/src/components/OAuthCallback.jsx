import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089";

function OAuthCallback() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get OAuth2 user info from the backend
        const response = await axios.get(`${API_URL}/oauth2/success`);
        
        if (response.data.success) {
          // Store user info in localStorage for session management
          localStorage.setItem('user', JSON.stringify({
            userId: response.data.userId,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role,
            provider: response.data.provider,
            imageUrl: response.data.imageUrl
          }));
          
          // Redirect to catalogue after successful login
          navigate('/learning-plans');
        } else {
          setError(response.data.message || 'Authentication failed');
        }
      } catch (error) {
        setError('Authentication failed. Please try again.');
        console.error('OAuth callback error:', error);
      }
    };

    processOAuthCallback();
  }, [navigate, location]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center">Authentication in Progress</h3>
            </div>
            <div className="card-body text-center">
              {error ? (
                <div>
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <div>
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Please wait while we complete your authentication...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback;
