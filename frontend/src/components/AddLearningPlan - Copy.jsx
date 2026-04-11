import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1/learning-plans";

function AddLearningPlan() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('NOT_STARTED');
  const [isPublic, setIsPublic] = useState(true);
  const [completionDeadline, setCompletionDeadline] = useState('');
  const [topics, setTopics] = useState([{ title: '', description: '', completed: false }]);
  const [resources, setResources] = useState([{ title: '', url: '', type: 'ARTICLE' }]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Filter out empty topics and resources
      const filteredTopics = topics.filter(topic => topic.title.trim() !== '');
      const filteredResources = resources.filter(resource => resource.title.trim() !== '' && resource.url.trim() !== '');
      
      const learningPlan = {
        title,
        description,
        userId: user.userId,
        username: user.username,
        status,
        isPublic,
        topics: filteredTopics,
        resources: filteredResources,
        completionDeadline: completionDeadline || null
      };
      
      const response = await axios.post(`${API_URL}/save`, learningPlan);
      
      if (response.data.success) {
        alert('Catalogue entry created successfully!');
        navigate('/learning-plans');
      } else {
        setError(response.data.message || 'Error creating catalogue entry');
      }
    } catch (error) {
      setError('Error creating catalogue entry');
      console.error('Error creating catalogue entry:', error);
    }
  };

  const handleAddTopic = () => {
    setTopics([...topics, { title: '', description: '', completed: false }]);
  };

  const handleRemoveTopic = (index) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  const handleTopicChange = (index, field, value) => {
    const newTopics = [...topics];
    newTopics[index][field] = value;
    setTopics(newTopics);
  };

  const handleAddResource = () => {
    setResources([...resources, { title: '', url: '', type: 'ARTICLE' }]);
  };

  const handleRemoveResource = (index) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };

  const handleResourceChange = (index, field, value) => {
    const newResources = [...resources];
    newResources[index][field] = value;
    setResources(newResources);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">Add Facility / Asset Entry</h3>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Facility / Asset Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="status" className="form-label">Availability Status</label>
                      <select
                        className="form-select"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="NOT_STARTED">Available</option>
                        <option value="IN_PROGRESS">In Use</option>
                        <option value="COMPLETED">Under Maintenance</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="completionDeadline" className="form-label">Next Inspection Date (Optional)</label>
                      <input
                        type="date"
                        className="form-control"
                        id="completionDeadline"
                        value={completionDeadline}
                        onChange={(e) => setCompletionDeadline(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="isPublic">
                        List this entry in the public catalogue
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">Specifications</label>
                    {topics.map((topic, index) => (
                      <div key={index} className="card mb-2">
                        <div className="card-body">
                          <div className="mb-2">
                            <label htmlFor={`topicTitle${index}`} className="form-label">Specification Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id={`topicTitle${index}`}
                              value={topic.title}
                              onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                              required={index === 0}
                            />
                          </div>
                          <div className="mb-2">
                            <label htmlFor={`topicDescription${index}`} className="form-label">Specification Details</label>
                            <textarea
                              className="form-control"
                              id={`topicDescription${index}`}
                              rows="2"
                              value={topic.description}
                              onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                            ></textarea>
                          </div>
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`topicCompleted${index}`}
                              checked={topic.completed}
                              onChange={(e) => handleTopicChange(index, 'completed', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor={`topicCompleted${index}`}>
                              Verified
                            </label>
                          </div>
                          {topics.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveTopic(index)}
                            >
                              Remove Specification
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleAddTopic}
                    >
                      Add Specification
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">Asset Documents</label>
                    {resources.map((resource, index) => (
                      <div key={index} className="card mb-2">
                        <div className="card-body">
                          <div className="mb-2">
                            <label htmlFor={`resourceTitle${index}`} className="form-label">Document Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id={`resourceTitle${index}`}
                              value={resource.title}
                              onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                              required={index === 0}
                            />
                          </div>
                          <div className="mb-2">
                            <label htmlFor={`resourceUrl${index}`} className="form-label">Document URL</label>
                            <input
                              type="url"
                              className="form-control"
                              id={`resourceUrl${index}`}
                              value={resource.url}
                              onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                              required={index === 0}
                            />
                          </div>
                          <div className="mb-2">
                            <label htmlFor={`resourceType${index}`} className="form-label">Document Type</label>
                            <select
                              className="form-select"
                              id={`resourceType${index}`}
                              value={resource.type}
                              onChange={(e) => handleResourceChange(index, 'type', e.target.value)}
                            >
                              <option value="ARTICLE">Manual</option>
                              <option value="VIDEO">Inspection Record</option>
                              <option value="BOOK">Warranty</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>
                          {resources.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveResource(index)}
                            >
                              Remove Document
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleAddResource}
                    >
                      Add Document
                    </button>
                  </div>
                  
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/learning-plans')}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Catalogue Entry
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

export default AddLearningPlan;
