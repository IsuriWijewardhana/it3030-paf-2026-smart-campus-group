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

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/comments/resource/${resourceId}/type/${resourceType}`
      );
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching comments');
      console.error('Error fetching comments:', error);
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
      });
      
      setNewComment('');
      fetchComments();
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      setError('Error adding comment');
      console.error('Error adding comment:', error);
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
      });
      
      setEditingCommentId(null);
      fetchComments();
    } catch (error) {
      setError('Error updating comment');
      console.error('Error updating comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await axios.delete(`${API_URL}/comments/delete/${commentId}`);
        fetchComments();
        
        if (onCommentAdded) {
          onCommentAdded();
        }
      } catch (error) {
        setError('Error deleting comment');
        console.error('Error deleting comment:', error);
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
        <h4>Comments ({commentsCount || comments.length})</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleAddComment} className="mb-4">
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Post Comment
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
            No comments yet. Be the first to comment!
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
                   (resourceType === 'LEARNING_PLAN' && user.userId === comments[0]?.userId)) && (
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
