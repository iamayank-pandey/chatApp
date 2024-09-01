const catchAsync = require("./utils/catchAsync");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = async (file) => {
    const uploadResult = await new Promise((resolve) => {
        cloudinary.uploader.upload_stream({ folder: process.env.CLOUDINARY_PROFILE_PICTURE_FOLDER }, (error, uploadResult) => {
            return resolve(uploadResult);
        }).end(file);
    });
    const url = cloudinary.url(uploadResult.public_id, {
        transformation: [
            {
                quality: "auto",
                fetch_format: "auto"
            }
        ]
    })
    return url;
}

