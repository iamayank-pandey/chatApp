const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE)
    .then(() => console.log('DB connection successful!'));