const express = require('express')
const router = require('./src/routes/api')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')

// Security Middleware Imports
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors')
// Use helmet to set various HTTP headers for security
app.use(helmet());

// Limit requests from the same IP address
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// Clean data against XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Enable CORS
app.use(cors());


// Init Middleware
app.use(bodyParser.json());

//Morgan Middleware
const morgan = require('morgan');
app.use(morgan('dev'));

// Connect to MongoDB
// const mongoose = require('mongoose');
// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect('mongodb://localhost:27017/mydatabase', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useCreateIndex: true,
//             useFindAndModify: false
//         });
//         console.log(`MongoDB connected: ${conn.connection.host}`);
//     } catch (err) {
//         console.error(err);
//         process.exit(1);
//     }
// };

// connectDB();

// Define Routes
app.use('/api/v1', router)



module.exports = app