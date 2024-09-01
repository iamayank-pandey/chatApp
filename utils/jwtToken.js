const jwt = require('jsonwebtoken');

const signToken =  id => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const sendToken = function(user, statuscode, res) {
    const token = signToken(user._id);
    const option = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if(process.env.NODE_ENV === 'production') option.secure = true;

    //Remove the password from output
    user.password = undefined;

    res.status(statuscode).cookie('token',token, option).json({
        status :'success',
        token,
        data: {
            user
        }
    })
}

module.exports = sendToken;