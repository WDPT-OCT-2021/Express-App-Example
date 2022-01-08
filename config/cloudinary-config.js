const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    // this is what is used for the original cloudinary method
    cloudinary,

    params: {
        folder: "locations",
        allowedFormats: ["jpg", "png"],
        resource_type: "raw",
    },

    // this is what is used for the cloudinary v2 method
    // cloudinary: cloudinary.v2,

    // folder: 'locations'
    // allowedFormats: ['jpg', 'png', 'svg']

    filename: (req, file, cb) => {
        cb(null, file.originalName);
    },
});

const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;
