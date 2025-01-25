import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up Multer to store files in the 'public/temp' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get the current filename and directory from import.meta.url
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);  // Correctly use path.dirname to get the directory name

    // Go up four levels from the current directory (assuming __dirname is inside a subfolder)
    const uploadPath = path.join(__dirname, '..', '..', 'public', 'temp');
    
    // Create the 'temp' folder if it doesn't exist and save the file to the temp folder
    return cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, bytes) => {
      const fn = bytes.toString("hex") + path.extname(file.originalname);
      return cb(null, fn);
    });
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

export { upload };
