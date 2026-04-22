const cloudinary = require('cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cấu hình địa chỉ "kho chứa"
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Thiết lập cách lưu trữ
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'taskora_avatars', 
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});

// 3. Khởi tạo Multer với cấu hình lưu trữ trên
const uploadCloud = multer({ storage });

module.exports = uploadCloud;