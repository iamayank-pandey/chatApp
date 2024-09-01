const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('Please log in to get access.', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('User does not exist with current token.', 401));
    }
    if (currentUser.isPasswordChangedAfterJWT(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    //this line is crucial to work with restrictTo middleware.
    req.user = currentUser;
    next();
});

//This function take array of all roles that are in argument and compare it with database role if matched then only you have accessed.
exports.restrictTo = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(
            new AppError(`You do not have access to this resource.`, 403));
        }
        next();
    }
}