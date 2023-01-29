const cloudinary = require("cloudinary").v2;

const uploadImgToCloudinay = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });

  try {
    const data = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });

    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};
module.exports = uploadImgToCloudinay;
