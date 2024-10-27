// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TeachersDashboard = () => {
//     const [projects, setProjects] = useState([]);
//     const [classFilter, setClassFilter] = useState('');
//     const [projectIdFilter, setProjectIdFilter] = useState('');

//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchAllProjects();
//     }, []);

//     const fetchAllProjects = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/teacherdashboard'); // Ensure this URL is correct
//             console.log(response.data);
//             setProjects(response.data);

//         } catch (error) {
//             console.error("Error fetching all projects:", error);
//             setError(error);
//         }
//     };

//     const filterByClass = async () => {
//         try {
//             const response = await axios.get('/teacherdashboard/filter/class', {
//                 params: { classFilter },
//             });
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error filtering by class:', error);
//         }
//     };

//     const filterByProjectId = async () => {
//         try {
//             const response = await axios.get('/teacherdashboard/filter/project', {
//                 params: { projectIdFilter },
//             });
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error filtering by project ID:', error);
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
//                         <h3>{project.TITLE}</h3>
                        
//                     </div>
//                 ))}
//                 {projects.length === 0 && <p>No projects found.</p>}
//             </div>
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
    const [marks, setMarks] = useState('');
    const [feedback, setFeedback] = useState('');
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

    const submitFeedbackAndMarks = async () => {
        try {
            await axios.post('http://localhost:5000/teacherdashboard/submit', {
                projectId: selectedProject.P_ID,
                feedback,
                marks
            });
            alert('Feedback and marks submitted successfully.');
            setSelectedProject(null); // Close modal
            setMarks('');
            setFeedback('');
        } catch (error) {
            console.error('Error submitting feedback and marks:', error);
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
                                <li key={member.SRN}>{member.NAME} ({member.SRN})</li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            placeholder="Enter Marks"
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                        />
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
        </div>
    );
};

export default TeachersDashboard;
