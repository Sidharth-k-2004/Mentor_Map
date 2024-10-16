
// const express = require('express');
// const mysql = require('mysql');
// const cors = require('cors'); // Import cors
// const PORT = process.env.PORT || 5000;
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors()); // Enable CORS for all routes

// // Create a connection to the MySQL database
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root', 
//     password: 'root123', 
//     database: 'mentormap'
// });

// // Connect to the MySQL database
// db.connect(err => {
//     if (err) {
//         throw err;
//     }
//     console.log('Connected to MySQL database.');
// });

// // Route for signup
// app.post('/', (req, res) => {
//     const { SRN, NAME, CLASS, EMAIL, PASS, DEPT_ID } = req.body;
  
//     const sql = 'INSERT INTO student (SRN, NAME, CLASS, EMAIL, PASS, DEPT_ID) VALUES (?, ?, ?, ?, ?, ?)';
//     const values = [SRN, NAME, CLASS, EMAIL, PASS, DEPT_ID];
  
//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error('Error inserting into database:', err);
//         return res.status(500).json({ error: 'Database insertion failed' });
//       }
  
//       console.log('Student signed up successfully');
//       res.status(200).json({ message: 'Student signed up successfully' });
//     });
//   });
  

// app.post('/login', (req, res) => {
//     const { srn, password } = req.body;

//     // Check if the credentials match a student in the database
//     const loginQuery = 'SELECT * FROM Student WHERE SRN = ?';
//     db.query(loginQuery, [srn], (err, results) => {
//         if (err) {
//             return res.status(500).send('Error checking credentials.');
//         }

//         // If user not found
//         if (results.length === 0) {
//             return res.status(401).send('Invalid SRN or password.');
//         }

//         const user = results[0];

//         // Here you should verify the password (if hashed)
//         // For demonstration, we're checking plain text. In production, use bcrypt or similar.
//         if (user.PASS === password) {
//             res.send('Login successful.');
//         } else {
//             res.status(401).send('Invalid SRN or password.');
//         }
//     });
// });
// app.post('/faculty', (req, res) => {
//     const { T_ID, NAME, EMAIL, PASS, DEPT_ID } = req.body;
  
//     const sql = 'INSERT INTO teacher (T_ID, NAME,  EMAIL, PASS, DEPT_ID) VALUES (?, ?, ?, ?, ?)';
//     const values = [T_ID, NAME,  EMAIL, PASS, DEPT_ID];
  
//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error('Error inserting into database:', err);
//         return res.status(500).json({ error: 'Database insertion failed' });
//       }
  
//       console.log('signed up successfully');
//       res.status(200).json({ message: 'Student signed up successfully' });
//     });
//   });
  

// app.post('/facultylogin', (req, res) => {
//     const { tid, password } = req.body;

//     // Check if the credentials match a student in the database
//     const loginQuery = 'SELECT * FROM teacher WHERE T_ID = ?';
//     db.query(loginQuery, [tid], (err, results) => {
//         if (err) {
//             return res.status(500).send('Error checking credentials.');
//         }

//         // If user not found
//         if (results.length === 0) {
//             return res.status(401).send('Invalid tid or password.');
//         }

//         const user = results[0];

//         // Here you should verify the password (if hashed)
//         // For demonstration, we're checking plain text. In production, use bcrypt or similar.
//         if (user.PASS === password) {
//             res.send('Login successful.');
//         } else {
//             res.status(401).send('Invalid teacherid or password.');
//         }
//     });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Declare a variable to store the logged-in user's SRN
let loggedInSRN = null; // This will hold the current user's SRN

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'mentormap'
});

// Connect to the MySQL database
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database.');
});

// Route for signup
app.post('/signup', (req, res) => {
    const { SRN, NAME, CLASS, EMAIL, PASS, DEPT_ID } = req.body;

    const sql = 'INSERT INTO Student (SRN, NAME, CLASS, EMAIL, PASS, DEPT_ID) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [SRN, NAME, CLASS, EMAIL, PASS, DEPT_ID];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }

        console.log('Student signed up successfully');
        res.status(200).json({ message: 'Student signed up successfully' });
    });
});

app.post('/login', (req, res) => {
    const { srn, password } = req.body;

    const loginQuery = 'SELECT * FROM Student WHERE SRN = ?';
    db.query(loginQuery, [srn], (err, results) => {
        if (err) {
            return res.status(500).send('Error checking credentials.');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid SRN or password.');
        }

        const user = results[0];

        if (user.PASS === password) {
            loggedInSRN = user.SRN; // Store the SRN in the variable
            console.log('Logged in SRN:', loggedInSRN); // Debugging statement
            res.send('Login successful.');
        } else {
            res.status(401).send('Invalid SRN or password.');
        }
    });
});

// app.post('/studentDashboard', (req, res) => {
//     console.log("hi");
//     console.log('User SRN from variable:', loggedInSRN); 
//     if (!loggedInSRN) {
//         return res.status(401).json({ error: 'User not logged in' });
//     }
//     const projectQuery = `
//         SELECT p.P_ID, p.TITLE, p.DESCRIPTION, p.SYNOPSIS, 
//                r.REVIEW_DATE, r.FEEDBACK, m.FINAL_MARKS 
//         FROM Project p
//         LEFT JOIN Review r ON p.P_ID = r.P_ID
//         LEFT JOIN Marks m ON p.P_ID = m.P_ID AND m.SRN = ?
//         WHERE p.P_ID IN (
//             SELECT P_ID FROM Marks WHERE SRN = ?
//         )
//     `;

//     db.query(projectQuery, [loggedInSRN, loggedInSRN], (err, projects) => {
//         if (err) {
//             console.error('Error fetching projects:', err);
//             return res.status(500).send('Error fetching projects.');
//         }

//         console.log('Projects fetched:', projects); // Debugging statement

//         // Map projects to fetch team members
//         const projectIds = projects.map(project => project.P_ID);
//         console.log('Project IDs:', projectIds); // Debugging statement

//         const teamMembersQuery = `
//             SELECT SRN, NAME 
//             FROM Student 
//             WHERE SRN IN (
//                 SELECT SRN FROM Marks WHERE P_ID IN (?)
//             )
//         `;

//         db.query(teamMembersQuery, [projectIds], (err, teamMembers) => {
//             if (err) {
//                 console.error('Error fetching team members:', err);
//                 return res.status(500).send('Error fetching team members.');
//             }

//             console.log('Team members fetched:', teamMembers); // Debugging statement

//             // Prepare the final response
//             const response = projects.map(project => {
//                 const members = teamMembers.filter(member => member.P_ID === project.P_ID);
//                 console.log("team members are:",members);
//                 return {
//                     ...project,
//                     // teamMembers: members
//                     teamMembers: teamMembers
//                 };
//             });

//             console.log('Final response:', response); // Debugging statement
//             res.json(response);
//         });
//     });
// });
app.post('/studentDashboard', (req, res) => {
    console.log("hi");
    console.log('User SRN from variable:', loggedInSRN); 
    if (!loggedInSRN) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    
    // Query to fetch projects and their related reviews and marks
    const projectQuery = `
        SELECT p.P_ID, p.TITLE, p.DESCRIPTION, p.SYNOPSIS, 
               r.REVIEW_DATE, r.FEEDBACK, m.FINAL_MARKS 
        FROM Project p
        LEFT JOIN Review r ON p.P_ID = r.P_ID
        LEFT JOIN Marks m ON p.P_ID = m.P_ID AND m.SRN = ?
        WHERE p.P_ID IN (
            SELECT P_ID FROM Marks WHERE SRN = ?
        )
    `;

    // Execute the project query
    db.query(projectQuery, [loggedInSRN, loggedInSRN], (err, projects) => {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).send('Error fetching projects.');
        }

        console.log('Projects fetched:', projects); // Debugging statement

        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found for the user.' });
        }

        // Get project IDs to fetch team members
        const projectIds = projects.map(project => project.P_ID);
        console.log('Project IDs:', projectIds); // Debugging statement

        // Query to fetch team members associated with the projects
        const teamMembersQuery = `
            SELECT s.SRN, s.NAME, m.P_ID 
            FROM Student s
            JOIN Marks m ON s.SRN = m.SRN
            WHERE m.P_ID IN (?)
        `;

        // Execute the team members query
        db.query(teamMembersQuery, [projectIds], (err, teamMembers) => {
            if (err) {
                console.error('Error fetching team members:', err);
                return res.status(500).send('Error fetching team members.');
            }

            console.log('Team members fetched:', teamMembers); // Debugging statement

            // Prepare the final response by mapping team members to their respective projects
            const response = projects.map(project => {
                const members = teamMembers.filter(member => member.P_ID === project.P_ID);
                return {
                    ...project,
                    teamMembers: members.map(member => ({ SRN: member.SRN, NAME: member.NAME }))
                };
            });

            console.log('Final response:', response); // Debugging statement
            res.json(response);
        });
    });
});

// app.post('/addProject', (req, res) => {
//     const { P_ID, title, courseId, description, synopsis, T_ID } = req.body;

//     if (!P_ID || !title || !courseId || !description || !synopsis) {
//         return res.status(400).json({ error: 'All fields except T_ID are required' });
//     }

//     // SQL query to insert a new project
//     const sql = 'INSERT INTO project (P_ID, TITLE, COURSE_ID, DESCRIPTION, SYNOPSIS, T_ID) VALUES (?, ?, ?, ?, ?, ?)';

//     db.query(sql, [P_ID, title, courseId, description, synopsis, T_ID], (err, result) => {
//         if (err) {
//             console.error('Error inserting project:', err);
//             return res.status(500).json({ error: 'Failed to add project' });
//         }
//         console.log('Project added:', result);
//         res.status(201).json({ message: 'Project added successfully', projectId: result.insertId });
//     });
// });

app.post('/addProject', (req, res) => {
    const { P_ID, title, courseId, description, synopsis, T_ID } = req.body;

    if (!P_ID || !title || !courseId || !description || !synopsis) {
        return res.status(400).json({ error: 'All fields except T_ID are required' });
    }

    if (!loggedInSRN) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    // SQL query to insert a new project
    const projectSql = 'INSERT INTO project (P_ID, TITLE, COURSE_ID, DESCRIPTION, SYNOPSIS, T_ID) VALUES (?, ?, ?, ?, ?, ?)';

    // Insert the project first
    db.query(projectSql, [P_ID, title, courseId, description, synopsis, T_ID], (err, result) => {
        if (err) {
            console.error('Error inserting project:', err);
            return res.status(500).json({ error: 'Failed to add project' });
        }

        console.log('Project added:', result);

        // After project insertion, insert into the marks table for the logged-in SRN
        const marksSql = 'INSERT INTO marks (P_ID, SRN) VALUES (?, ?)';

        db.query(marksSql, [P_ID, loggedInSRN], (err, marksResult) => {
            if (err) {
                console.error('Error inserting marks:', err);
                return res.status(500).json({ error: 'Failed to add marks for the student' });
            }

            console.log('Marks added:', marksResult);
            res.status(201).json({ message: 'Project and marks added successfully', projectId: result.insertId });
        });
    });
});

app.post('/contribute', (req, res) => {
    const { projectId } = req.body;
    console.log(projectId);
    const sql = 'INSERT INTO Marks (P_ID, SRN) VALUES (?, ?)';
    const values = [projectId, loggedInSRN]; // Use the logged-in SRN

    db.query(sql, [projectId, loggedInSRN], (err, result) => {
        if (err) {
            console.error('Error contributing to project:', err);
            return res.status(500).json({ error: 'Failed to contribute to project' });
        }

        console.log('Contribution recorded successfully');
        res.status(200).json({ message: 'Contribution successful' });
    });
});


// Logout route to reset loggedInSRN
app.post('/logout', (req, res) => {
    loggedInSRN = null; // Clear the variable on logout
    res.send('Logged out successfully.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
