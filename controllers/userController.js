// const User = require('../models/userModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const factory = require('./factory/handlerFactory');

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach(el => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

// exports.getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// };

// exports.updateMe = catchAsync(async (req, res, next) => {
//   // 2) Filtered out unwanted fields names that are not allowed to be updated
//   const filteredBody = filterObj(req.body, 'name', 'email');

//   // 3) Update user document
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedUser
//     }
//   });
// });

// // exports.deleteMe = catchAsync(async (req, res, next) => {
// //   await User.findByIdAndUpdate(req.user.id, { active: false });

// //   res.status(204).json({
// //     status: 'success',
// //     data: null
// //   });
// // });

// // exports.createUser = (req, res) => {
// //   res.status(500).json({
// //     status: 'error',
// //     message: 'This route is not defined! Please use /signup instead'
// //   });
// // };

// exports.getUser = factory.getOne(User);
// exports.getAllUsers = factory.getAll(User);

// // Do NOT update passwords with this!
// exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);

exports.searchUser = catchAsync(async (req, res, next) => {
    const searchQuery = req.query.search;
    if(!searchQuery){
        return next(new AppError("Search text is empty", 400));
    }
    const searchQueryArray = [ 
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
    ]
    if(!Number.isNaN(Number(searchQuery))){
        searchQueryArray.push({$expr: {
            $regexMatch: {
                input: { $toString: "$phone" }, 
                regex: searchQuery 
            }
        }});
    }
    const results = await User.find({
        $or: searchQueryArray,
        _id: { $ne: req.user._id }
    });
    res.status(200).json({
        status :'success',
        numberOfUsers: results.length,
        data: {
            results
        }
    })
});