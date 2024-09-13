const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Store user data in memory (no encryption for now)
const users = [
    { email: 'me@email.com', password: 'password123' }
];

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static('public'));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Function to log login attempts
function logLoginAttempt(email, password, success) {
    const logData = `Login attempt by ${email} with password ${password} at ${new Date().toISOString()} - Success: ${success}\n`;
    const logFilePath = path.join(__dirname, 'login-attempts.log');
    
    fs.appendFile(logFilePath, logData, (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });
}

// Handle login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password match
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        logLoginAttempt(email, password, true);
        res.json({ success: true });
    } else {
        logLoginAttempt(email, password, false);
        res.json({ success: false });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
