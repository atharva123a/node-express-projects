const CustomError = require("../errors");

const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");

const UploadProductImageLocal = async (req, res) => {
  if (!req.files || !req.files.image) {
    throw new CustomError.BadRequestError("Please upload image!");
  }

  if (!req.files.image.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image!");
  }

  const maxSize = 1024 * 1024; // 1 MB:

  if (req.files.image.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }
  const productImage = req.files.image;
  const imagePath = path.join(
    __dirname,
    `../public/uploads/${productImage.name}`
  );

  const data = await productImage.mv(imagePath);

  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

// uploading files to our cloudinary cloud account!
const UploadProductImage = async (req, res) => {
  const data = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: "file-upload",
  });

  // remove the tmp files:
  fs.unlinkSync(req.files.image.tempFilePath);

  res.status(StatusCodes.OK).json({ image: { src: data.secure_url } });
};

module.exports = { UploadProductImage };
