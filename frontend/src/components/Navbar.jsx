import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1";

function Navbar() {
  const [user, setUser] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchUnreadNotificationsCount(loggedInUser.userId);
    }
  }, []);

  const fetchUnreadNotificationsCount = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/notifications/count/user/${userId}/unread`);
      setUnreadNotifications(response.data.count);
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/learning-plans">
Smart Campus        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/learning-plans">
                    Catalogue
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link position-relative" to="/notifications">
                    <i className="bi bi-bell-fill"></i>
                    {unreadNotifications > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadNotifications}
                        <span className="visually-hidden">unread notifications</span>
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Welcome, {user.username}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <Link className="dropdown-item" to={`/profile/${user.userId}`}>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/learning-plans">
                        My Catalogue Entries
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
