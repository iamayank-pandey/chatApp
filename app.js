const express = require('express');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./middlewares/errorMiddleware');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(fileUpload());

// Set security HTTP headers
app.use(helmet())

// Limit requests from same API
const limiter = rateLimit({
    max: 25,
    windowMs: 5 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// Body parser, reading data from body into req.body
app.use(express.json({limit: '100kb'}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// whitelist allow duplicate properties in query string
//only use last query in /api/v1/tours?duration=5&duration=3
// app.use(
//     hpp({
//         whitelist: [
//             'duration',
//             'ratingsQuantity',
//             'ratingsAverage',
//             'maxGroupSize',
//             'difficulty',
//             'price'
//         ]
//     })
// );

const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const messageRouter = require('./routes/messageRoutes');

app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/message', messageRouter);

app.all('*', (req, res, next)=>{
    //Whatever you pass in next() it will automatically taken as error and diretly send to error middleware
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;