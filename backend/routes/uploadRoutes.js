const path = require('path');
const express = require('express')
const multer  = require('multer')
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },

    filename: function (req, file, cb) {
      cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  })

  const checkFileType = (file, cb) => {
    const filetypes = /png|jpg|jpeg/;
    const mimetypes = /image\/jpeg|image\/png|image\/webp/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if(extname && mimetype) {
        cb(null, true);
    } else {
      cb(new Error('Images only!'), false);
    }
  }
  
const upload = multer({ storage, checkFileType });


router.post('/', upload.single('image'), (req, res) => {
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; // http://hostname/uploads/filename
  console.log(req.file.path)
  res.send({
      message: 'Image Uploaded',
      image: imageUrl,
  });
});

 
module.exports = router;

  // router.post('/', upload.single('image'), function (req, res) {
    //     res.send({
    //         message: 'Image Uploaded',
    //         image: `/${req.file.path}`,
    //     })
    //  })
  
