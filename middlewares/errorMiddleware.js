const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid token. Please log in again!', 401);

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

    // Programming or other unknown error: don't leak error details
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

// By provinding 4 parameters Express automatically knows it is Global Error Handler Middleware
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        //occur when there is not id matched in database
        if (error.name === 'CastError') error = handleCastErrorDB(error);

        //Handling the mongoose the duplicate key error
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);

        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        //Handling wrong JWT error
        if(err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') error = handleJWTError();

        sendErrorProd(error, res);
    }
};