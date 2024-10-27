

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
let loggedInTid=null;

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'mentormap2'
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

        // If no projects are found, return an empty array instead of an error
        if (projects.length === 0) {
            return res.json([]); // Return an empty array
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




// Route for faculty signup
app.post('/faculty', (req, res) => {
    const { T_ID, NAME, EMAIL, PASS, DEPT_ID } = req.body;

    // Validate the input fields
    if (!T_ID || !NAME || !EMAIL || !PASS || !DEPT_ID) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // SQL query to insert into the Teacher table
    const sql = 'INSERT INTO Teacher (T_ID, NAME, EMAIL, PASS, DEPT_ID) VALUES (?, ?, ?, ?, ?)';
    const values = [T_ID, NAME, EMAIL, PASS, DEPT_ID];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }

        console.log('Faculty signed up successfully');
        res.status(200).json({ message: 'Faculty signed up successfully' });
    });
});

app.post('/facultylogin', (req, res) => {
    const { tid, password } = req.body;
    console.log(tid);
    const loginQuery = 'SELECT * FROM teacher WHERE T_ID = ?';
    db.query(loginQuery, [tid], (err, results) => {
        if (err) {
            return res.status(500).send('Error checking credentials.');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid Tid or password.');
        }

        const userteacher = results[0];

        if (userteacher.PASS === password) {
            loggedInTid = userteacher.T_ID; // Store the SRN in the variable
            console.log('Logged in Tid:', loggedInTid); // Debugging statement
            res.send('Login successful.');
        } else {
            res.status(401).send('Invalid Tidd or password.');
        }
    });
});

// In your backend (Node.js/Express)

app.get('/teacherdashboard', (req, res) => {
    const teacherId = loggedInTid; // assuming `loggedInTid` contains the teacher's ID
    const query = `
        SELECT 
            Project.P_ID, 
            Project.TITLE, 
            Project.DESCRIPTION, 
            Project.SYNOPSIS, 
            Courses.COURSE_NAME, 
            Department.NAME AS DEPARTMENT_NAME
        FROM 
            Project
        JOIN 
            Courses ON Project.COURSE_ID = Courses.COURSE_ID
        JOIN 
            Department ON Courses.DEPT_ID = Department.DEPT_ID
        WHERE 
            Project.T_ID = ?;
    `;

    db.query(query, [teacherId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching projects' });
        }
        console.log(results);
        res.json(results);
    });
});

app.get('/teacherdashboard/filter/class', (req, res) => {
    const teacherId =loggedInTid;
    const { classFilter } = req.query;

    const query = `
        SELECT p.project_id, p.project_name, c.class_name 
        FROM projects p
        JOIN classes c ON p.class_id = c.class_id
        WHERE p.teacher_id = ? AND c.class_name = ?
    `;

    db.query(query, [teacherId, classFilter], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching projects by class.');
        }
        res.json(results);
    });
});
app.get('/teacherdashboard/filter/project', (req, res) => {
    const teacherId =loggedInTid;
    const { projectIdFilter } = req.query;

    const query = `
        SELECT p.project_id, p.project_name, c.class_name 
        FROM projects p
        JOIN classes c ON p.class_id = c.class_id
        WHERE p.teacher_id = ? AND p.project_id = ?
    `;

    db.query(query, [teacherId, projectIdFilter], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching projects by project ID.');
        }
        res.json(results);
    });
});

app.get('/teacherdashboard/project/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const query = `
        SELECT 
            Project.P_ID, Project.TITLE, Project.DESCRIPTION, Project.SYNOPSIS,
            Student.NAME AS studentName, Student.SRN
        FROM 
            Project
        LEFT JOIN 
            Marks ON Project.P_ID = Marks.P_ID
        LEFT JOIN 
            Student ON Marks.SRN = Student.SRN
        WHERE 
            Project.P_ID = ?;
    `;
    db.query(query, [projectId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching project details' });
        
        const project = {
            P_ID: results[0].P_ID,
            TITLE: results[0].TITLE,
            DESCRIPTION: results[0].DESCRIPTION,
            SYNOPSIS: results[0].SYNOPSIS,
            teamMembers: results.map(row => ({ NAME: row.studentName, SRN: row.SRN }))
        };
        
        res.json(project);
    });
});

app.post('/teacherdashboard/submit', (req, res) => {
    const { projectId, feedback, marks } = req.body;
    const insertReview = `
        INSERT INTO Review (FEEDBACK, P_ID) VALUES (?, ?);
    `;
    const updateMarks = `
        UPDATE Marks SET FINAL_MARKS = ? WHERE P_ID = ?;
    `;
    
    db.query(insertReview, [feedback, projectId], (err, reviewResults) => {
        if (err) return res.status(500).json({ error: 'Error saving feedback' });

        db.query(updateMarks, [marks, projectId], (err, marksResults) => {
            if (err) return res.status(500).json({ error: 'Error updating marks' });
            res.json({ message: 'Feedback and marks submitted successfully' });
        });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
