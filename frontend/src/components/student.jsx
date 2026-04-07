import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8089/api/v1/student";

function Student() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/getall`);
      setStudents(response.data);
    } catch (error) {
      setError("Error fetching details");
    }
  };

  const handleNavigateToAddStudent = () => {
    navigate("/post");
  };

  const handleEditStudent = (studentId) => {
    navigate(`/editpost/${studentId}`);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`${API_URL}/delete/${studentId}`);
      alert("Successfully Deleted");
      fetchStudents(); // Refetch data after deletion
    } catch (error) {
      setError("Error deleting student details");
    }
  };

  return (
    <center>
      <div>
        <br />
        <h1 style={{   background: "linear-gradient(to right, #ff7e5f, #feb47b)" 
 }}>Workout Plans</h1>
        <br />
        <br />
        <br />
        <button
          className="btn btn-primary mt-4"
          onClick={handleNavigateToAddStudent}
        >
          Add New Workout Plan
        </button>
        <br />
        <br />
        <div>
          <div
            className="card-container mt-4"
            style={{
        
              justifyContent: "center",
              marginTop: "20px",
              width: "500px",
            }}
          >
            {students.map((student) => (
              <div key={student._id} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{student.studentname}</h5>
                  <p className="card-text">
                    <strong>Date:</strong> {student.studentname}
                  </p>
                  <p style={{ background: "linear-gradient(to right, #ff7e5f, #feb47b)" }} className="card-text">
                    <strong>Fitness Goal:</strong> {student.studentaddress}
                  </p>
                  <p className="card-text">
                    <strong>Goal-oriented Routines:</strong> {student.status}
                  </p>
                  <p className="card-text">
                    <strong>Exercise:</strong> {student.noofpushups}
                  </p>
                  <p className="card-text">
                    <strong>Set:</strong> {student.randistance}
                  </p>
                  <p className="card-text">
                    <strong>Repetition:</strong>{" "}
                    {student.weightlifted}
                  </p>
                  <button
                    type="button"
                    className="btn btn-success mr-2"
                    onClick={() => handleEditStudent(student._id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteStudent(student._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <br />
        <br />
        <br />
      </div>
    </center>
  );
}

export default Student;
