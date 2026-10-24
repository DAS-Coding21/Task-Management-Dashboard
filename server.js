const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

let db;

// Initialize Database and Server
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: path.join(__dirname, 'taskFlow.db'),
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `);
        console.log('✅ Database connected and "users" table ready.');

        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        process.exit(1);
    }
};

initializeDBAndServer();

// Sign Up Endpoint
app.post('/users/register/', async (req, res) => {
    const { signUpUsername, name, email, password } = req.body;

    if (!signUpUsername || !name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    try {
        // Check if user already exists
        const getUserQuery = `SELECT * FROM users WHERE email = ?`;
        const existingUser = await db.get(getUserQuery, [email]);

        if (existingUser === undefined) {
            // Encrypt password securely
            const hashedPassword = await bcrypt.hash(password, 10);

            const createUser = `
                INSERT INTO users (username, name, email, password)
                VALUES (?, ?, ?, ?);
            `;

            const userDetails = await db.run(createUser, [signUpUsername, name, email, hashedPassword]);

            return res.status(200).json({
                success: true,
                message: 'User registered successfully!',
                user: { id: userDetails.lastID, signUpUsername, name, email }
            });
        } else {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Sign In Endpoint
app.post('/users/login/', async (req, res) =>{
    const {signInUsernameVal, userPaswordVal} = req.body;

    const getUserQuery = `SELECT * FROM users WHERE username = ?`;
    const existingUser = await db.get(getUserQuery, [signInUsernameVal]);

    if(!signInUsernameVal || !userPaswordVal){
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if(existingUser === undefined){
        // alert("Invalid User Id");
        return res.status(400).json({
            success: false,
            message: 'Invalid User ID'
        });
    }
    else {
        const compareHashedPassword = await bcrypt.compare(userPaswordVal, existingUser.password);
        if(compareHashedPassword === true){
            // alert("Login Successfully");
            return res.status(200).json({
                success: true,
                message: 'Login Successfully'
            });
        }
        else{
            // alert("Incorrect Password");
            return res.status(400).json({
                success: false,
                message: 'Incorrect Password'
            });
        }
    }

})