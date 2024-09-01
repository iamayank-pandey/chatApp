class AppError extends Error {
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        //If any error thrown then this class will not come come in stack trace.
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError