import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1";

function CommentSection({ resourceId, resourceType, commentsCount, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [resourceId, resourceType]);

  const normalizeComments = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === 'object') {
      if (Array.isArray(data.comments)) {
        return data.comments;
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

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/comments/resource/${resourceId}/type/${resourceType}`,
        { withCredentials: true }
      );
      setComments(normalizeComments(response.data));
      setError(null);
      setLoading(false);
    } catch (error) {
      setError('Error fetching maintenance feedback');
      console.error('Error fetching maintenance feedback:', error);
      setComments([]);
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      await axios.post(`${API_URL}/comments/save`, {
        content: newComment,
        userId: user.userId,
        username: user.username,
        resourceId: resourceId,
        resourceType: resourceType
      }, { withCredentials: true });
      
      setNewComment('');
      fetchComments();
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      setError('Error adding maintenance feedback');
      console.error('Error adding maintenance feedback:', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editedContent.trim()) {
      return;
    }
    
    try {
      await axios.put(`${API_URL}/comments/edit/${commentId}`, {
        content: editedContent
      }, { withCredentials: true });
      
      setEditingCommentId(null);
      fetchComments();
    } catch (error) {
      setError('Error updating maintenance feedback');
      console.error('Error updating maintenance feedback:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this maintenance feedback?')) {
      try {
        await axios.delete(`${API_URL}/comments/delete/${commentId}`, { withCredentials: true });
        fetchComments();
        
        if (onCommentAdded) {
          onCommentAdded();
        }
      } catch (error) {
        setError('Error deleting maintenance feedback');
        console.error('Error deleting maintenance feedback:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <h4>Maintenance Feedback ({commentsCount || comments.length})</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleAddComment} className="mb-4">
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Add maintenance feedback..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit Feedback
          </button>
        </form>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No maintenance feedback yet. Be the first to share feedback!
          </div>
        ) : (
          <div className="list-group">
            {comments.map((comment) => (
              <div key={comment._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <Link to={`/profile/${comment.userId}`} className="fw-bold text-decoration-none">
                      {comment.username}
                    </Link>
                    <small className="text-muted ms-2">
                      {formatDate(comment.createdAt)}
                      {comment.isEdited && <span> (edited)</span>}
                    </small>
                  </div>
                  {(user.userId === comment.userId || 
                   ((resourceType === 'LEARNING_PLAN' || resourceType === 'FACILITY_ASSET') && user.userId === comments[0]?.userId)) && (
                    <div>
                      {user.userId === comment.userId && (
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditComment(comment)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                {editingCommentId === comment._id ? (
                  <div>
                    <textarea
                      className="form-control mb-2"
                      rows="3"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      required
                    ></textarea>
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleSaveEdit(comment._id)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mb-0">{comment.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
