
// import React, { useEffect, useState } from 'react';
// import './StudentDashboard.css'; // Import the CSS file

// const StudentDashboard = () => {
//     const [projects, setProjects] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedProject, setSelectedProject] = useState(null);

//     // Modified state for new project with additional fields
//     const [newProject, setNewProject] = useState({
//         P_ID: '',
//         title: '',
//         courseId: '',
//         description: '',
//         synopsis: '',
//         T_ID: null, // Teacher ID is set to null initially
//     });

//     const fetchProjects = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/studentDashboard', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({}) // Add any necessary data here
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const data = await response.json();
//             console.log(data);
//             setProjects(data); // Adjust if your data structure is different
//         } catch (err) {
//             console.error('Error fetching projects:', err);
//             setError('Failed to fetch projects');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     const handleProjectClick = (project) => {
//         setSelectedProject(project);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewProject({ ...newProject, [name]: value });
//     };

//     const handleAddProject = async (e) => {
//         e.preventDefault(); // Prevent page reload

//         const projectToAdd = {
//             P_ID: parseInt(newProject.P_ID),  // Ensuring P_ID is an integer
//             title: newProject.title,
//             courseId: newProject.courseId,
//             description: newProject.description,
//             synopsis: newProject.synopsis,
//             T_ID: null // Assuming T_ID is null for now
//         };

//         try {
//             const response = await fetch('http://localhost:5000/addProject', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(projectToAdd),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to add project');
//             }

//             const result = await response.json();
//             console.log('Project added successfully:', result);

//             // Optionally refresh the list of projects after adding
//             fetchProjects();
//         } catch (error) {
//             console.error('Error adding project:', error);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
//     }

//     return (
//         <div className="background">
//             <div className="container-dashboard glassyText">
//                 <h1>Projects</h1>
//                 {projects.length > 0 ? (
//                     projects.map((project) => (
//                         <div key={project.P_ID} className="project-item" onClick={() => handleProjectClick(project)}>
//                             <h2>{project.TITLE}</h2>
//                             <p>{project.DESCRIPTION}</p>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No projects found.</p>
//                 )}

//                 {selectedProject && (
//                     <div className="project-details">
//                         <h2>Project Details</h2>
//                         <p><strong>Description:</strong> {selectedProject.DESCRIPTION}</p>
//                         <p><strong>Feedback:</strong> {selectedProject.FEEDBACK || 'No feedback available.'}</p>
//                         <p><strong>Final Marks:</strong> {selectedProject.FINAL_MARKS || 'Not graded yet.'}</p>
//                         <h3>Team Members</h3>
//                         <ul>
//                             {selectedProject.teamMembers.map((member, index) => (
//                                 <li key={index}>{member.NAME} (SRN: {member.SRN})</li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}

//                 <form onSubmit={handleAddProject} className="add-project-form">
//                     <h2>Add New Project</h2>

//                     <input 
//                         type="text" 
//                         name="P_ID" 
//                         placeholder="Project ID" 
//                         value={newProject.P_ID} 
//                         onChange={handleInputChange} 
//                         required 
//                     />

//                     <input 
//                         type="text" 
//                         name="title" 
//                         placeholder="Project Title" 
//                         value={newProject.title} 
//                         onChange={handleInputChange} 
//                         required 
//                     />

//                     <input 
//                         type="text" 
//                         name="courseId" 
//                         placeholder="Course ID" 
//                         value={newProject.courseId} 
//                         onChange={handleInputChange} 
//                         required 
//                     />

//                     <textarea 
//                         name="description" 
//                         placeholder="Project Description" 
//                         value={newProject.description} 
//                         onChange={handleInputChange} 
//                         required 
//                     ></textarea>

//                     <textarea 
//                         name="synopsis" 
//                         placeholder="Project Synopsis" 
//                         value={newProject.synopsis} 
//                         onChange={handleInputChange} 
//                         required 
//                     ></textarea>

//                     <button type="submit">Add Project</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default StudentDashboard;


import React, { useEffect, useState } from 'react';
import './StudentDashboard.css'; // Import the CSS file

const StudentDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const [newProject, setNewProject] = useState({
        P_ID: '',
        title: '',
        courseId: '',
        description: '',
        synopsis: '',
        T_ID: null, // Teacher ID is set to null initially
    });

    const [showContributeForm, setShowContributeForm] = useState(false); // Control Contribute form
    const [contributeProjectId, setContributeProjectId] = useState('');  // Store Project ID input for Contribute

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/studentDashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}) // Add any necessary data here
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setProjects(data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    const handleAddProject = async (e) => {
        e.preventDefault();

        const projectToAdd = {
            P_ID: parseInt(newProject.P_ID),
            title: newProject.title,
            courseId: newProject.courseId,
            description: newProject.description,
            synopsis: newProject.synopsis,
            T_ID: null
        };

        try {
            const response = await fetch('http://localhost:5000/addProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectToAdd),
            });

            if (!response.ok) {
                throw new Error('Failed to add project');
            }

            const result = await response.json();
            console.log('Project added successfully:', result);

            fetchProjects();
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    // Handle contribute button click
    const handleContributeClick = () => {
        setShowContributeForm(true);
    };

const handleContributeSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/contribute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectId: contributeProjectId }), // Send the project ID to backend
        });

        if (!response.ok) {
            throw new Error('Failed to contribute');
        }

        const result = await response.json();
        console.log('Contribution successful:', result);

        // Hide the contribute form and fetch the updated list of projects
        setShowContributeForm(false);
        setContributeProjectId(''); // Clear the input

        // Fetch updated projects immediately after contribution
        await fetchProjects(); // Refresh projects list

    } catch (error) {
        console.error('Error contributing:', error);
    }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="background">
            <div className="container-dashboard glassyText">
                <h1>Projects</h1>
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project.P_ID} className="project-item" onClick={() => handleProjectClick(project)}>
                            <h2>{project.TITLE}</h2>
                            <p>{project.DESCRIPTION}</p>
                        </div>
                    ))
                ) : (
                    <p>No projects found.</p>
                )}

                {selectedProject && (
                    <div className="project-details">
                        <h2>Project Details</h2>
                        <p><strong>Description:</strong> {selectedProject.DESCRIPTION}</p>
                        <p><strong>Feedback:</strong> {selectedProject.FEEDBACK || 'No feedback available.'}</p>
                        <p><strong>Final Marks:</strong> {selectedProject.FINAL_MARKS || 'Not graded yet.'}</p>
                        <h3>Team Members</h3>
                        <ul>
                            {selectedProject.teamMembers.map((member, index) => (
                                <li key={index}>{member.NAME} (SRN: {member.SRN})</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Add Project form */}
                <form onSubmit={handleAddProject} className="add-project-form">
                    <h2>Add New Project</h2>
                    <input type="text" name="P_ID" placeholder="Project ID" value={newProject.P_ID} onChange={handleInputChange} required />
                    <input type="text" name="title" placeholder="Project Title" value={newProject.title} onChange={handleInputChange} required />
                    <input type="text" name="courseId" placeholder="Course ID" value={newProject.courseId} onChange={handleInputChange} required />
                    <textarea name="description" placeholder="Project Description" value={newProject.description} onChange={handleInputChange} required />
                    <textarea name="synopsis" placeholder="Project Synopsis" value={newProject.synopsis} onChange={handleInputChange} required />
                    <button type="submit">Add Project</button>
                </form>

                {/* Contribute button */}
                <button onClick={handleContributeClick} >Contribute</button>

                {/* Contribute form */}
                {showContributeForm && (
                    <form onSubmit={handleContributeSubmit} className="contribute-form">
                        <h2>Contribute to Project</h2>
                        <input
                            type="text"
                            name="projectId"
                            placeholder="Enter Project ID"
                            value={contributeProjectId}
                            onChange={(e) => setContributeProjectId(e.target.value)}
                            required
                        />
                        <button type="submit">Submit Contribution</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
