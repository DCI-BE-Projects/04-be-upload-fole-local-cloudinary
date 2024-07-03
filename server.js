import express from "express";
import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";


const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
  });

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static("uploads"));

//http://localhost:5000/images
app.use("/images", express.static("images"));

// MULTER LOCAL STORAGE
// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "./images");
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });



var upload = multer({ storage: storage }).single("avatar");

app.post("/uploads", async (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).send({ error: err.message });
    } else {
      const imgUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
      res.send({ imgUrl });
    }
  });
});

app.get("/images/:filename", () => {
  const filename = req.params.filename;
  res.send(`<img src="/images/${filename}" alt="Uploaded image" />`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
