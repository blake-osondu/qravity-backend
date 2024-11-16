const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ImageService {
    static storage = multer.memoryStorage();
    
    static upload = multer({
        storage: this.storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Not an image! Please upload an image.'), false);
            }
        }
    });

    static async processAndSaveImage(file, options = {}) {
        const {
            width = 500,
            height = 500,
            quality = 80,
            format = 'jpeg'
        } = options;

        try {
            // Generate unique filename
            const filename = `${uuidv4()}.${format}`;
            const uploadPath = path.join(__dirname, '../public/uploads');
            const filePath = path.join(uploadPath, filename);

            // Ensure upload directory exists
            await fs.mkdir(uploadPath, { recursive: true });

            // Process image with sharp
            await sharp(file.buffer)
                .resize(width, height, {
                    fit: 'cover',
                    position: 'center'
                })
                .toFormat(format)
                .jpeg({ quality })
                .toFile(filePath);

            return `/uploads/${filename}`;
        } catch (error) {
            console.error('Error processing image:', error);
            throw new Error('Failed to process image');
        }
    }

    static async deleteImage(filepath) {
        try {
            const fullPath = path.join(__dirname, '../public', filepath);
            await fs.unlink(fullPath);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }
}

module.exports = ImageService; 