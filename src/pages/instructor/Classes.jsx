import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import personIcon from '../../media/person-icon.svg';
import '../../css/Classes.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [newStudent, setNewStudent] = useState({ fname: '', lname: '', email: '' }); // State for new student details
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/classes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setClasses(data.classes);
        } else {
          setError(data.error || 'Error fetching classes');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('An error occurred while fetching classes.');
      }
    };

    fetchClasses();
  }, []);

  const handleClassClick = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/class/${classId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSelectedClass(data.class);
      } else {
        setError(data.error || 'Error fetching class details');
      }
    } catch (err) {
      console.error('Error fetching class details:', err);
      setError('An error occurred while fetching class details.');
    }
  };

  // Function to handle adding a new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/class/${selectedClass._id}/add-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newStudent),
      });

      const data = await response.json();
      if (data.success) {
        // Update the selected class with the new student
        setSelectedClass(data.class);
        // Reset the new student form
        setNewStudent({ fname: '', lname: '', email: '' });
      } else {
        setError(data.error || 'Error adding student');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setError('An error occurred while adding the student.');
    }
  };

  return (
    <div id='classes' className="container">
      <main className="main-content">
        {error && <p className="error">{error}</p>}
        {classes.length === 0 && <p>No classes available.</p>}
        <div className="grid">
          {classes.map((classItem, index) => (
            <div
              className="card"
              key={index}
              onClick={() => handleClassClick(classItem._id)}
            >
              <div className="card-content">
                <h3 className="card-title">{classItem.name}</h3>
                <hr />
                <p>{classItem.description}</p>
                <p className="card-text">
                  <img src={personIcon} alt="Students Icon" className="icon-image" />
                  {classItem.students.length} Students Enrolled
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedClass && (
          <div className="selected-class-details">
            <h3>{selectedClass.name}</h3>
            <p><strong>Description:</strong> {selectedClass.description}</p>
            {selectedClass.type === 'private' ? (
              <p><strong>Class Code:</strong> {selectedClass.code}</p>
            ) : (
              <p><strong>Class Type:</strong> Public</p>
            )}
            <h4>Enrolled Students:</h4>
            <ul>
              {selectedClass.students && selectedClass.students.length > 0 ? (
                selectedClass.students.map((student, index) => (
                  <li key={index}>
                    {student.fname} {student.lname} ({student.email})
                  </li>
                ))
              ) : (
                <p>No students enrolled.</p>
              )}
            </ul>

            {/* Form to add a new student */}
            <h4>Add Student:</h4>
            <form onSubmit={handleAddStudent}>
              <input
                type="text"
                placeholder="First Name"
                value={newStudent.fname}
                onChange={(e) => setNewStudent({ ...newStudent, fname: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newStudent.lname}
                onChange={(e) => setNewStudent({ ...newStudent, lname: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                required
              />
              <button type="submit">Add Student</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

Classes.propTypes = {
  onCardClick: PropTypes.func.isRequired,
};

export default Classes;
