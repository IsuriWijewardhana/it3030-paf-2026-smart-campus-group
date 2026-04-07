import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Home() {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="jumbotron text-center">
          <h1 className="display-4">Welcome to Facility & Asset Management System</h1>
          <p className="lead">
            A platform for managing facilities, assets, and availability.
          </p>
          <hr className="my-4" />
          <p>
            Browse the catalogue, register an account, or login to manage resources.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/facility-assets" className="btn btn-primary btn-lg">
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
                <h3 className="card-title">Centralized Catalogue</h3>
                <p className="card-text">
                  Keep all facilities and assets organized in one place.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="card-title">Real-Time Availability</h3>
                <p className="card-text">
                  Track active and out-of-stock resources quickly.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="card-title">Simple Collaboration</h3>
                <p className="card-text">
                  Use likes, comments, and follows for team visibility.
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
