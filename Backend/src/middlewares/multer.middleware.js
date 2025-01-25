import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Relative path to the 'public/temp' directory
const tempFolder = "./public/temp";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

// Set up Multer to store files in the 'public/temp' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Destination Path:', tempFolder); // Log the destination path

    // Check if the folder exists
    if (!fs.existsSync(tempFolder)) {
      console.error('Directory does not exist. Creating:', tempFolder);
      fs.mkdirSync(tempFolder, { recursive: true }); // Create the directory if it doesn't exist
    } else {
      console.log('Directory exists:', tempFolder);
    }

    cb(null, tempFolder); // Proceed with the destination path
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, bytes) => {
      if (err) {
        console.error('Error generating random bytes:', err); // Log any errors in generating random bytes
        return cb(err);
      }
      const fn = bytes.toString('hex') + path.extname(file.originalname);
      console.log('Generated Filename:', fn); // Log the generated filename
      cb(null, fn);

      // Check if the file persists after 5 seconds
      const filePath = path.join(tempFolder, fn);
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          console.log('File is still present:', filePath);
        } else {
          console.error('File has been deleted:', filePath);
        }
      }, 5000);
    });
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } });

export { upload };
