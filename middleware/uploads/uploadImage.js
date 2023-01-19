const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const Storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("application")) {
    cb(null, true);
  } else if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("no file ", false));
  }
};

const uploadImageProfile = multer({
  storage: Storage,
  fileFilter: multerFilter,
  limit: { fileSize: 1000000 },
});

const profilePhotoResize = async (req, res, next) => {
  if (!req.file && !req.files) return next();
  if (req.file) {
    req.file.filename = `profile-${Date.now()}-${req.file.originalname}`;

    await sharp(req.file.buffer)
      .resize(800, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(`public/image/profile/${req.file.filename}`));

    next();
  }

  if (req.files) {
    const images = req.files?.map(
      (file) => (file.filename = `profile-${Date.now()}-${file.originalname}`)
    );

    const resize = async (num) => {
      await sharp(req.files[num].buffer)
        .resize(800, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(path.join(`public/image/profile/${req.files[num].filename}`));

      if (num === req.files.length - 1) {
        return next();
      }
      num++;
      resize(num);
    };
    resize(0);
  }
};

module.exports = { uploadImageProfile, profilePhotoResize };
