const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// configure cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Instance of cloudinary storage

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg','png',"jpeg"],
    params: {
        folder: "blog-api",
        transformation:[{width:500,height:500,crop:"limit"}],
    }
})

module.exports = storage;