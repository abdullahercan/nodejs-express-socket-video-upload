const express = require("express");
const multer = require("multer");
const hbjs = require("handbrake-js");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res, next) => {
  const file = req.file;
  const input = file.path;
  const outputPath = `uploads/out-${Date.now()}.m4v`;

  await hbjs
    .spawn({
      input,
      output: `./public/${outputPath}`,
      preset: "Gmail Large 3 Minutes 720p30",
    })
    .on("error", (err) => {
      console.log("error: ", err);
    })
    .on("progress", (progress) => {
      console.log("progress: ", progress);
      res.io.emit("upload_start", progress);
    })
    .on("complete", () => {
      res.io.emit("upload_complete", {
        outputPath,
      });
      console.log("complete");
    });
  res.json({ file: req.file });
});

module.exports = router;
