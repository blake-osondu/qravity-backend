require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
// const MongoStore = require('connect-mongo'); //Haven't decide to use this
const { authenticateUser, allowUnauthenticatedAccess } = require('./src/middleware/auth');
const AutomationService = require('./src/services/AutomationService');

const app = express();

// Middleware
app.use(express.static('src/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({ // Haven't decided to use this or not
    //     mongoUrl: process.env.MONGODB_URI,
    //     ttl: 24 * 60 * 60 // Session TTL (1 day)
    // }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Database connection
mongoose.connect('mongodb://localhost/job-portal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Initialize automation service
AutomationService.initialize().catch(console.error);

// Route handler for landing page
app.get('/', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/index.html'));
});

app.get('/dashboard', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/dashboard-jobseeker.html'));
});

app.get('/login', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/login.html'));
});

app.get('/signup', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/signup.html'));
});

app.get('/forgot-password', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/forgot-password.html'));
});

app.get('/reset-password', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/reset-password.html'));
});
//Route handler for auth
app.use('/auth', require('./src/routes/auth'));
//Route handler for resume
app.use('/api/resume', require('./src/routes/resume'));
//Route handler for automation
app.use('/api/automation', require('./src/routes/automation'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
