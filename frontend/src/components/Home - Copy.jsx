import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Home() {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="jumbotron text-center">
          <h1 className="display-4">Welcome to Learning Management System</h1>
          <p className="lead">
            A platform for online learning and course management
          </p>
          <hr className="my-4" />
          <p>
            Browse our courses, register for an account, or login to access your dashboard.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/learning-plans" className="btn btn-primary btn-lg">
              Browse Catalogue
            </Link>
            <Link to="/register" className="btn btn-success btn-lg">
              Register
            </Link>
            <Link to="/login" className="btn btn-info btn-lg">
              Login
            </Link>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="card-title">Learn Anywhere</h3>
                <p className="card-text">
                  Access our courses from anywhere, anytime, on any device.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="card-title">Expert Instructors</h3>
                <p className="card-text">
                  Learn from industry experts and experienced professionals.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="card-title">Diverse Courses</h3>
                <p className="card-text">
                  Choose from a wide range of courses across various categories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
