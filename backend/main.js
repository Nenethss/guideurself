import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import cloudinary from 'cloudinary';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: 'dtv9zeo30', // Replace with your Cloudinary cloud name
  api_key: '449921846459426', // Replace with your Cloudinary API key
  api_secret: '-HaGM1iVapQyQOXk16OBmVN4ybQ', // Replace with your Cloudinary API secret
});

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests

// MongoDB connection
const db_password = 'admin123'; // Replace with your actual DB password
const mongoURI = `mongodb+srv://admin:${db_password}@cluster0.qd6mw.mongodb.net/mapdb?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// MongoDB Schemas
const markerSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  title: String,
  description: String,
  image: String, // Store marker image filename
  mapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Map' }, // Reference the map
});

const mapSchema = new mongoose.Schema({
  filename: String, // Store map image filename
});

const Marker = mongoose.model('Marker', markerSchema);
const Map = mongoose.model('Map', mapSchema);

// Configure multer for marker uploads
const markerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Save marker images to images folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const markerUpload = multer({
  storage: markerStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only images are allowed');
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50MB
});

// Configure multer for map uploads
const mapStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'maps/'); // Save map images to maps folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const mapUpload = multer({
  storage: mapStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only images are allowed');
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50MB
});

// API route to fetch all markers from the database
app.get('/backend/pins', async (req, res) => {
  try {
    const markers = await Marker.find();
    res.json(markers);
  } catch (err) {
    console.error('Error fetching markers:', err);
    res.status(500).send('Internal Server Error');
  }
});

// API route to save a new marker in the database
// API route to save a new marker in the database
app.post('/backend/pins', markerUpload.single('image'), async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the request body
    console.log('File:', req.file); // Log the uploaded file

    const { lat, lng, title, description } = req.body;
    
    if (!lat || !lng || !title || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Upload the image to Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(req.file.path);

    // Save the image URL returned from Cloudinary
    const imageUrl = cloudinaryResponse.secure_url;

    // Save marker to database
    const newMarker = new Marker({ lat, lng, title, description, image: imageUrl });
    await newMarker.save();

    // Respond with the saved marker data
    res.status(201).json({ lat, lng, title, description, image: imageUrl });
  } catch (error) {
    console.error('Error saving marker:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/backend/maps/upload', mapUpload.single('mapImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Map image is required');
  }

  try {
    // Upload the image to Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(req.file.path);

    // Get the Cloudinary URL for the map image
    const mapImageUrl = cloudinaryResponse.secure_url;

    // Save the Cloudinary URL to MongoDB (Map collection)
    const newMap = new Map({ filename: mapImageUrl });
    await newMap.save();  // Save the map in the database

    // Return the Cloudinary URL and a success message
    res.json({
      message: 'Map image uploaded and saved successfully',
      url: mapImageUrl,  // Return the Cloudinary URL
    });
  } catch (err) {
    console.error('Error uploading map image to Cloudinary:', err);
    res.status(500).send('Internal Server Error');
  }
});

// API route to fetch the current map images
app.get('/backend/maps', async (req, res) => {
  try {
    const maps = await Map.find();
    res.json(maps);
  } catch (err) {
    console.error('Error fetching maps:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/backend/pins/:id', async (req, res) => {
  const { id } = req.params;

  try {
      // Attempt to delete the marker from the database
      const result = await Marker.findByIdAndDelete(id); // Replace 'Marker' with your actual model name

      if (!result) {
          // If result is null, it means the marker was not found
          return res.status(404).json({ message: 'Marker not found' });
      }

      // Return a success response
      return res.status(200).json({ message: 'Marker deleted successfully' });
  } catch (error) {
      console.error('Error deleting marker:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

// API route to update an existing marker
// API route to update an existing marker
app.put('/backend/pins/:id', markerUpload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, description, lat, lng } = req.body;
  
  // Prepare the updated data object
  const updatedData = {
    title,
    description,
    lat,
    lng,
  };

  // If a new image was uploaded, upload it to Cloudinary
  if (req.file) {
    try {
      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(req.file.path);
      updatedData.image = cloudinaryResponse.secure_url; // Save the full Cloudinary URL
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return res.status(500).json({ message: 'Error uploading image' });
    }
  }

  try {
    // Find the marker by ID and update it
    const updatedMarker = await Marker.findByIdAndUpdate(
      id,
      updatedData, // Updated fields
      { new: true } // Return the updated document
    );

    if (!updatedMarker) {
      return res.status(404).json({ message: 'Marker not found' });
    }

    // Respond with the updated marker data
    res.json(updatedMarker);
  } catch (error) {
    console.error('Error updating marker:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Start the server on port 3002
app.listen(process.env.PORT || 3002, () => {
  console.log('Server running');
});
