import axios from "axios";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1/student";

function AddPost() {
  const [studentname, setStudentName] = useState("");
  const [studentaddress, setStudentAddress] = useState("");
  const [status, setStatus] = useState("");
  const [noofpushups, setnoofpushups] = useState("");
  const [randistance, setrandistance] = useState("");
  const [weightlifted, setweightlifted] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${API_URL}/save`, {
        studentname,
        studentaddress,
        status,
        noofpushups,
        randistance,
        weightlifted,
      });
      alert("Added Successfully!");
      setStudentName("");
      setStudentAddress("");
      setStatus("");
      setnoofpushups("");
      setrandistance("");
      setweightlifted("");
      navigate("/");
    } catch (error) {
      setError("Error saving details");
    }
  };

  return (
    <div style={{background: "linear-gradient(to right, #ff7e5f, #feb47b)"}}className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <br />
          <br />
          <h1>Add Workout Plan Details</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label for="studentname">Date</label>
              <input
                type="date"
                className="form-control"
                id="studentname"
                value={studentname}
                onChange={(event) => setStudentName(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label for="studentaddress">Fitness Goal</label>
              <input
                type="text"
                className="form-control"
                id="studentaddress"
                value={studentaddress}
                onChange={(event) => setStudentAddress(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Goal-oriented Routines</label>
              <select
                className="form-control"
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="Weight Loss Routine">Weight Loss Routine</option>
                <option value="Muscle Building Routine">Muscle Building Routine</option>
                <option value="Endurance Training Routine">Endurance Training Routine</option>
                <option value="Flexibility Routine">Flexibility Routine</option>

                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Exercise</label>
              <input
                type="text"
                className="form-control"
                id="status"
                value={noofpushups}
                onChange={(event) => setnoofpushups(event.target.value)}
                required
              />
              
            </div>

            <div className="form-group">
              <label for="randistance">Set</label>
              <input
                type="text"
                className="form-control"
                id="randistance"
                value={randistance}
                onChange={(event) => setrandistance(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label for="weightlifted">Repetition</label>
              <input
                type="number"
                className="form-control"
                id="weightlifted"
                value={weightlifted}
                onChange={(event) => setweightlifted(event.target.value)}
                required
              />
            </div>
            <center><button type="submit" className="btn btn-primary mt-4">
              Add Workout Plan
            </button></center>
          </form>
          {error && <div className="alert alert-danger">{error}</div>}
          <br/>

        </div>
      </div>
    </div>
  );
}

export default AddPost;
