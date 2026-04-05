import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1/notifications";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
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

    fetchNotifications();
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${API_URL}/user/${user.userId}`);
      
      // Sort notifications by date (newest first)
      const sortedNotifications = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setNotifications(sortedNotifications);
      setLoading(false);
      
      // Mark all as read
      await axios.put(`${API_URL}/read/all/user/${user.userId}`);
    } catch (error) {
      setError('Error fetching notifications');
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_URL}/delete/${notificationId}`);
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
    } catch (error) {
      setError('Error deleting notification');
      console.error('Error deleting notification:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getNotificationLink = (notification) => {
    switch (notification.resourceType) {
      case 'LEARNING_PLAN':
        return `/learning-plan/${notification.resourceId}`;
      case 'USER':
        return `/profile/${notification.resourceId}`;
      default:
        return '#';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return <i className="bi bi-heart-fill text-danger me-2"></i>;
      case 'COMMENT':
        return <i className="bi bi-chat-fill text-primary me-2"></i>;
      case 'FOLLOW':
        return <i className="bi bi-person-plus-fill text-success me-2"></i>;
      default:
        return <i className="bi bi-bell-fill text-warning me-2"></i>;
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
                <h3 className="mb-0">Notifications</h3>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                {notifications.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    You have no notifications.
                  </div>
                ) : (
                  <div className="list-group">
                    {notifications.map((notification) => (
                      <div key={notification._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div>
                          <Link 
                            to={getNotificationLink(notification)} 
                            className="text-decoration-none"
                          >
                            <div className="d-flex align-items-center">
                              {getNotificationIcon(notification.type)}
                              <div>
                                <p className="mb-1">{notification.message}</p>
                                <small className="text-muted">
                                  {formatDate(notification.createdAt)}
                                </small>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteNotification(notification._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
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

export default Notifications;
