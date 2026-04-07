import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8089';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const hasLoginError = new URLSearchParams(window.location.search).get('error') === 'true';
  const [error, setError] = useState(hasLoginError ? 'Invalid username/email or password.' : null);

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${BACKEND_URL}/oauth2/authorization/google`;
    console.log('Starting Google OAuth2 flow. Redirecting to:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    console.log('Submitting form login to:', form.action);
    form.submit();
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center mb-0">Login to Smart Campus</h3>
            </div>

            <div className="card-body">
              <form method="post" action={`${BACKEND_URL}/login`} onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Login Failed:</strong> {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary fw-bold">
                    Login
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark fw-bold"
                    onClick={handleGoogleLogin}
                  >
                    <i className="fab fa-google me-2"></i>
                    Continue with Google
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer text-center bg-light">
              <small className="text-muted">
                Don't have an account? <Link to="/register" className="fw-bold">Register here</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
