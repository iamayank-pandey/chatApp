const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//Email vaidation remaining.
const userSchema = new mongoose.Schema({
    name: {
        type: 'String',
        trim: true,
        required: [true, 'User name is required.']
    },
    email: {
        type: 'String',
        required: [true, 'Email is required.'],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Enter a valid email address.']
    },
    phone:{
        type: Number,
        required: [true, 'Please enter your phone number']
    },
    profilePicture: {
        type: String,
        unique: true
    },
    password: {
        type: 'String',
        required: [true, 'Password is required.'],
        minlength: 8,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
{
    timestamps: true
});

// For User.findByIdAndUpdate will NOT work!
userSchema.pre('save', async function(next){
    //return if password is not modified.
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// For User.findByIdAndUpdate will NOT work!
userSchema.pre('save', async function(next){
    //return if password is not modified or document is new.
    if(!this.isModified("password") || this.isNew) return next();
    //there might be a slightest difference between the creating token and storing it.
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

//instance method available for document
//Here we can't use this.password because select is false for Password due to security.
userSchema.methods.comparePassword = async function(enteredPassword, userPassword){
    return await bcrypt.compare(enteredPassword, userPassword);
}

//Handle scenario if password is changed after JWT token assigned.
userSchema.methods.isPasswordChangedAfterJWT = function(JWTTimestamp){
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    //false means not change
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User