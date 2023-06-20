const multer = require("multer");
const { dirname } = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${dirname(__dirname)}/public/uploads`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const uploader = multer({
    storage,
    onError: function (err, next) {
        console.log(err);
        next(err);
    },
});

module.exports = {
    uploader,
};
