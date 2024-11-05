



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TeachersDashboard = () => {
//     const [projects, setProjects] = useState([]);
//     const [selectedProject, setSelectedProject] = useState(null); // For modal
//     const [classFilter, setClassFilter] = useState('');
//     const [projectIdFilter, setProjectIdFilter] = useState('');
//     const [feedback, setFeedback] = useState('');
//     const [studentMarks, setStudentMarks] = useState({});
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchAllProjects();
//     }, []);

//     const fetchAllProjects = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/teacherdashboard');
//             setProjects(response.data);
//         } catch (error) {
//             console.error("Error fetching all projects:", error);
//             setError(error);
//         }
//     };

//     const fetchProjectDetails = async (projectId) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/teacherdashboard/project/${projectId}`);
//             setSelectedProject(response.data);
//             const initialMarks = {};
//             response.data.teamMembers.forEach(member => {
//                 initialMarks[member.SRN] = ''; // Initialize marks for each student
//             });
//             setStudentMarks(initialMarks);
//         } catch (error) {
//             console.error('Error fetching project details:', error);
//         }
//     };

//     const filterByClass = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/teacherdashboard/filter/class', {
//                 params: { classFilter },
//             });
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error filtering by class:', error);
//         }
//     };

//     const filterByProjectId = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/teacherdashboard/filter/project', {
//                 params: { projectIdFilter },
//             });
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error filtering by project ID:', error);
//         }
//     };

//     const handleStudentMarkChange = (srn, value) => {
//         const intValue = parseInt(value, 10);
//         if (!isNaN(intValue) && intValue >= 0) { // Assuming marks cannot be negative
//             setStudentMarks(prevMarks => ({ ...prevMarks, [srn]: intValue }));
//         } else if (value === '') {
//             setStudentMarks(prevMarks => ({ ...prevMarks, [srn]: '' })); // Allow clearing input
//         }
//     };
    

//     // const submitFeedbackAndMarks = async () => {
//     //     try {
//     //         await axios.post('http://localhost:5000/teacherdashboard/submit', {
//     //             projectId: selectedProject.P_ID,
//     //             feedback,
//     //             studentMarks
//     //         });
//     //         alert('Feedback and marks submitted successfully.');
//     //         setSelectedProject(null); // Close modal
//     //         setFeedback('');
//     //         setStudentMarks({});
//     //     } catch (error) {
//     //         console.error('Error submitting feedback and marks:', error);
//     //     }
//     // };

//     const submitFeedbackAndMarks = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/teacherdashboard/submit', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     projectId: selectedProject.P_ID,
//                     feedback,
//                     studentMarks,
//                 }),
//             });
    
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
    
//             await response.json(); // Optional: Process the response if needed
    
//             alert('Feedback and marks submitted successfully.');
//             setSelectedProject(null); // Close modal
//             setFeedback('');
//             setStudentMarks({});
//         } catch (error) {
//             console.error('Error submitting feedback and marks:', error);
//         }
//     };
    
//     return (
//         <div style={{ padding: '20px' }}>
//             <h1>Teacher's Dashboard</h1>

//             <div style={{ marginBottom: '20px' }}>
//                 <input
//                     type="text"
//                     placeholder="Filter by Class"
//                     value={classFilter}
//                     onChange={(e) => setClassFilter(e.target.value)}
//                 />
//                 <button onClick={filterByClass}>Search by Class</button>

//                 <input
//                     type="text"
//                     placeholder="Filter by Project ID"
//                     value={projectIdFilter}
//                     onChange={(e) => setProjectIdFilter(e.target.value)}
//                 />
//                 <button onClick={filterByProjectId}>Search by Project ID</button>

//                 <button onClick={fetchAllProjects}>Show All Projects</button>
//             </div>

//             <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
//                 {projects.map((project) => (
//                     <div key={project.P_ID} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
//                         <h3 onClick={() => fetchProjectDetails(project.P_ID)}>{project.TITLE}</h3>
//                     </div>
//                 ))}
//                 {projects.length === 0 && <p>No projects found.</p>}
//             </div>

//             {/* Modal for Project Details */}
//             {selectedProject && (
//                 <div style={{
//                     position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
//                 }}>
//                     <div style={{ backgroundColor: 'white', padding: '20px', width: '500px' }}>
//                         <h2>{selectedProject.TITLE}</h2>
//                         <p>Description: {selectedProject.DESCRIPTION}</p>
//                         <p>Synopsis: {selectedProject.SYNOPSIS}</p>
//                         <h4>Team Members</h4>
//                         <ul>
//                             {selectedProject.teamMembers.map(member => (
//                                 <li key={member.SRN}>
//                                     {member.NAME} ({member.SRN})
//                                     <input
//                                         type="number"
//                                         placeholder="Enter Marks"
//                                         value={studentMarks[member.SRN]}
//                                         onChange={(e) => handleStudentMarkChange(member.SRN, e.target.value)}
//                                         style={{ marginLeft: '10px' }}
//                                     />
//                                 </li>
//                             ))}
//                         </ul>
//                         <textarea
//                             placeholder="Enter Feedback"
//                             value={feedback}
//                             onChange={(e) => setFeedback(e.target.value)}
//                             rows="4"
//                             style={{ width: '100%', marginTop: '10px' }}
//                         />
//                         <button onClick={submitFeedbackAndMarks}>Submit</button>
//                         <button onClick={() => setSelectedProject(null)}>Close</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TeachersDashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TeachersDashboard = () => {
//     const [projects, setProjects] = useState([]);
//     const [selectedProject, setSelectedProject] = useState(null); // For modal
//     const [classFilter, setClassFilter] = useState('');
//     const [projectIdFilter, setProjectIdFilter] = useState('');
//     const [feedback, setFeedback] = useState('');
//     const [studentMarks, setStudentMarks] = useState({});
//     const [studentsBelowAverage, setStudentsBelowAverage] = useState([]); // State to hold students below average
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchAllProjects();
//     }, []);

//     const fetchAllProjects = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/teacherdashboard');
//             setProjects(response.data);
//         } catch (error) {
//             console.error("Error fetching all projects:", error);
//             setError(error);
//         }
//     };

//     const fetchProjectDetails = async (projectId) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/teacherdashboard/project/${projectId}`);
//             setSelectedProject(response.data);
//             const initialMarks = {};
//             response.data.teamMembers.forEach(member => {
//                 initialMarks[member.SRN] = ''; // Initialize marks for each student
//             });
//             setStudentMarks(initialMarks);
//         } catch (error) {
//             console.error('Error fetching project details:', error);
//         }
//     };

//     const filterByClass = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/teacherdashboard/filter/class', {
//                 params: { classFilter },
//             });
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error filtering by class:', error);
//         }
//     };

//     const filterByProjectId = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/teacherdashboard/filter/project', {
//                 params: { projectIdFilter },
//             });
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error filtering by project ID:', error);
//         }
//     };

//     const handleStudentMarkChange = (srn, value) => {
//         const intValue = parseInt(value, 10);
//         if (!isNaN(intValue) && intValue >= 0) { // Assuming marks cannot be negative
//             setStudentMarks(prevMarks => ({ ...prevMarks, [srn]: intValue }));
//         } else if (value === '') {
//             setStudentMarks(prevMarks => ({ ...prevMarks, [srn]: '' })); // Allow clearing input
//         }
//     };

//     const submitFeedbackAndMarks = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/teacherdashboard/submit', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     projectId: selectedProject.P_ID,
//                     feedback,
//                     studentMarks,
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             await response.json(); // Optional: Process the response if needed

//             alert('Feedback and marks submitted successfully.');
//             setSelectedProject(null); // Close modal
//             setFeedback('');
//             setStudentMarks({});
//         } catch (error) {
//             console.error('Error submitting feedback and marks:', error);
//         }
//     };

//     // New function to fetch students below average marks
//     const fetchStudentsBelowAverage = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/students-below-average');
//             setStudentsBelowAverage(response.data); // Update the state with the fetched students
//         } catch (error) {
//             console.error('Error fetching students below average:', error);
//         }
//     };

//     return (
//         <div style={{ padding: '20px' }}>
//             <h1>Teacher's Dashboard</h1>

//             <div style={{ marginBottom: '20px' }}>
//                 <input
//                     type="text"
//                     placeholder="Filter by Class"
//                     value={classFilter}
//                     onChange={(e) => setClassFilter(e.target.value)}
//                 />
//                 <button onClick={filterByClass}>Search by Class</button>

//                 <input
//                     type="text"
//                     placeholder="Filter by Project ID"
//                     value={projectIdFilter}
//                     onChange={(e) => setProjectIdFilter(e.target.value)}
//                 />
//                 <button onClick={filterByProjectId}>Search by Project ID</button>

//                 <button onClick={fetchAllProjects}>Show All Projects</button>
//                 <button onClick={fetchStudentsBelowAverage}>Get Students Below Average</button>
//             </div>

//             <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
//                 {projects.map((project) => (
//                     <div key={project.P_ID} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
//                         <h3 onClick={() => fetchProjectDetails(project.P_ID)}>{project.TITLE}</h3>
//                     </div>
//                 ))}
//                 {projects.length === 0 && <p>No projects found.</p>}
//             </div>

//             {/* Modal for Project Details */}
//             {selectedProject && (
//                 <div style={{
//                     position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
//                 }}>
//                     <div style={{ backgroundColor: 'white', padding: '20px', width: '500px' }}>
//                         <h2>{selectedProject.TITLE}</h2>
//                         <p>Description: {selectedProject.DESCRIPTION}</p>
//                         <p>Synopsis: {selectedProject.SYNOPSIS}</p>
//                         <h4>Team Members</h4>
//                         <ul>
//                             {selectedProject.teamMembers.map(member => (
//                                 <li key={member.SRN}>
//                                     {member.NAME} ({member.SRN})
//                                     <input
//                                         type="number"
//                                         placeholder="Enter Marks"
//                                         value={studentMarks[member.SRN]}
//                                         onChange={(e) => handleStudentMarkChange(member.SRN, e.target.value)}
//                                         style={{ marginLeft: '10px' }}
//                                     />
//                                 </li>
//                             ))}
//                         </ul>
//                         <textarea
//                             placeholder="Enter Feedback"
//                             value={feedback}
//                             onChange={(e) => setFeedback(e.target.value)}
//                             rows="4"
//                             style={{ width: '100%', marginTop: '10px' }}
//                         />
//                         <button onClick={submitFeedbackAndMarks}>Submit</button>
//                         <button onClick={() => setSelectedProject(null)}>Close</button>
//                     </div>
//                 </div>
//             )}

//             {/* Displaying Students Below Average */}
//             {studentsBelowAverage.length > 0 && (
//                 <div style={{ marginTop: '20px' }}>
//                     <h2>Students Below Average Marks</h2>
//                     <ul>
//                         {studentsBelowAverage.map(student => (
//                             <li key={student.SRN}>{student.NAME} ({student.SRN})</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TeachersDashboard;




import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeachersDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null); // For modal
    const [classFilter, setClassFilter] = useState('');
    const [projectIdFilter, setProjectIdFilter] = useState('');
    const [feedback, setFeedback] = useState('');
    const [studentMarks, setStudentMarks] = useState({});
    const [studentsBelowAverage, setStudentsBelowAverage] = useState([]); // State to hold students below average
    const [studentsWithHighestMarks, setStudentsWithHighestMarks] = useState([]); // State to hold students with highest marks
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllProjects();
    }, []);

    const fetchAllProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/teacherdashboard');
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching all projects:", error);
            setError(error);
        }
    };

    const fetchProjectDetails = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:5000/teacherdashboard/project/${projectId}`);
            setSelectedProject(response.data);
            const initialMarks = {};
            response.data.teamMembers.forEach(member => {
                initialMarks[member.SRN] = ''; // Initialize marks for each student
            });
            setStudentMarks(initialMarks);
        } catch (error) {
            console.error('Error fetching project details:', error);
        }
    };

    const filterByClass = async () => {
        try {
            const response = await axios.get('http://localhost:5000/teacherdashboard/filter/class', {
                params: { classFilter },
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Error filtering by class:', error);
        }
    };

    const filterByProjectId = async () => {
        try {
            const response = await axios.get('http://localhost:5000/teacherdashboard/filter/project', {
                params: { projectIdFilter },
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Error filtering by project ID:', error);
        }
    };

    const handleStudentMarkChange = (srn, value) => {
        const intValue = parseInt(value, 10);
        if (!isNaN(intValue) && intValue >= 0) { // Assuming marks cannot be negative
            setStudentMarks(prevMarks => ({ ...prevMarks, [srn]: intValue }));
        } else if (value === '') {
            setStudentMarks(prevMarks => ({ ...prevMarks, [srn]: '' })); // Allow clearing input
        }
    };

    const submitFeedbackAndMarks = async () => {
        try {
            const response = await fetch('http://localhost:5000/teacherdashboard/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: selectedProject.P_ID,
                    feedback,
                    studentMarks,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await response.json(); // Optional: Process the response if needed

            alert('Feedback and marks submitted successfully.');
            setSelectedProject(null); // Close modal
            setFeedback('');
            setStudentMarks({});
        } catch (error) {
            console.error('Error submitting feedback and marks:', error);
        }
    };

    // New function to fetch students below average marks
    const fetchStudentsBelowAverage = async () => {
        try {
            const response = await axios.get('http://localhost:5000/students-below-average');
            setStudentsBelowAverage(response.data); // Update the state with the fetched students
        } catch (error) {
            console.error('Error fetching students below average:', error);
        }
    };

    // New function to fetch students with the highest marks
    const fetchStudentsWithHighestMarks = async () => {
        try {
            const response = await fetch('http://localhost:5000/students-highest-marks');
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            setStudentsWithHighestMarks(data); // Update the state with the fetched students
        } catch (error) {
            console.error('Error fetching students with highest marks:', error);
        }
    };
    

    return (
        <div style={{ padding: '20px' }}>
            <h1>Teacher's Dashboard</h1>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Filter by Class"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                />
                <button onClick={filterByClass}>Search by Class</button>

                <input
                    type="text"
                    placeholder="Filter by Project ID"
                    value={projectIdFilter}
                    onChange={(e) => setProjectIdFilter(e.target.value)}
                />
                <button onClick={filterByProjectId}>Search by Project ID</button>

                <button onClick={fetchAllProjects}>Show All Projects</button>
                <button onClick={fetchStudentsBelowAverage}>Get Students Below Average</button>
                <button onClick={fetchStudentsWithHighestMarks}>Get Students with Highest Marks</button>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                {projects.map((project) => (
                    <div key={project.P_ID} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
                        <h3 onClick={() => fetchProjectDetails(project.P_ID)}>{project.TITLE}</h3>
                    </div>
                ))}
                {projects.length === 0 && <p>No projects found.</p>}
            </div>

            {/* Modal for Project Details */}
            {selectedProject && (
                <div style={{
                    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', width: '500px' }}>
                        <h2>{selectedProject.TITLE}</h2>
                        <p>Description: {selectedProject.DESCRIPTION}</p>
                        <p>Synopsis: {selectedProject.SYNOPSIS}</p>
                        <h4>Team Members</h4>
                        <ul>
                            {selectedProject.teamMembers.map(member => (
                                <li key={member.SRN}>
                                    {member.NAME} ({member.SRN})
                                    <input
                                        type="number"
                                        placeholder="Enter Marks"
                                        value={studentMarks[member.SRN]}
                                        onChange={(e) => handleStudentMarkChange(member.SRN, e.target.value)}
                                        style={{ marginLeft: '10px' }}
                                    />
                                </li>
                            ))}
                        </ul>
                        <textarea
                            placeholder="Enter Feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="4"
                            style={{ width: '100%', marginTop: '10px' }}
                        />
                        <button onClick={submitFeedbackAndMarks}>Submit</button>
                        <button onClick={() => setSelectedProject(null)}>Close</button>
                    </div>
                </div>
            )}

            {/* Displaying Students Below Average */}
            {studentsBelowAverage.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Students Below Average Marks</h2>
                    <ul>
                        {studentsBelowAverage.map(student => (
                            <li key={student.SRN}>{student.NAME} ({student.SRN})</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Displaying Students with Highest Marks */}
            {studentsWithHighestMarks.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Students with Highest Marks</h2>
                    <ul>
                        {studentsWithHighestMarks.map(student => (
                            <li key={student.SRN}>{student.NAME} ({student.SRN}) - Marks: {student.MARKS}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TeachersDashboard;
