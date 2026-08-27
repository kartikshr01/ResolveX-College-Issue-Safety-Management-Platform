const cloudinary = require("cloudinary").v2; // const {cloudinary:v2} = require("cloudinary");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
 

module.exports = cloudinary ; 


// const cloudinary = require("cloudinary").v2;
// const dotenv = require("dotenv");

// const result = dotenv.config({
//   path: "backend/.env",
// });

// console.log("dotenv error:", result.error ? result.error.message : "none");

// console.log({
//   cloudLoaded: !!process.env.CLOUDINARY_CLOUD,
//   apiKeyLoaded: !!process.env.CLOUDINARY_API_KEY,
//   apiSecretLoaded: !!process.env.CLOUDINARY_API_SECRET,
// });

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// module.exports = cloudinary;