import React, { useState } from 'react';
import axios from 'axios';

const AdminAssignTeacher = () => {
  const [projectId, setProjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [message, setMessage] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('/projects/updateTeacher', {
  //       projectId,
  //       teacherId,
  //     });
  //     setMessage(response.data.message || 'Teacher assigned successfully!');
  //     setProjectId('');
  //     setTeacherId('');
  //   } catch (error) {
  //     setMessage('Error assigning teacher: ' + error.response.data.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if projectId and teacherId are valid before sending the request
    if (!projectId || isNaN(parseInt(projectId)) || !teacherId) {
        setMessage('Please enter a valid project ID and teacher ID');
        return;
    }

    try {
        // Send POST request to the backend using fetch
        const response = await fetch('http://localhost:5000/projects/updateTeacher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId: parseInt(projectId), // Convert projectId to an integer
                teacherId,
            }),
        });

        // Handle response
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to assign teacher');
        }

        const result = await response.json();
        setMessage(result.message || 'Teacher assigned successfully!');

        // Clear input fields after successful submission
        setProjectId('');
        setTeacherId('');
    } catch (error) {
        setMessage('Error assigning teacher: ' + error.message);
    }
};


  return (
    <div>
      <h2>Assign Teacher to Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Project ID:
            <input
              type="number"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Teacher ID:
            <input
              type="text"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Assign Teacher</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminAssignTeacher;
