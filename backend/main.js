import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import cloudinary from 'cloudinary';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json()); 

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

const markerSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  title: String,
  description: String,
  image: String, 
  mapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Map' }, 
});

const mapSchema = new mongoose.Schema({
  filename: String, 
});

const Marker = mongoose.model('Marker', markerSchema);
const Map = mongoose.model('Map', mapSchema);

const markerUpload = multer({
  storage: multer.memoryStorage(), 
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
  limits: { fileSize: 500 * 1024 * 1024 }
});

app.get('/backend/pins', async (req, res) => {
  try {
    const markers = await Marker.find();
    res.json(markers);
  } catch (err) {
    console.error('Error fetching markers:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/backend/pins', markerUpload.single('image'), async (req, res) => {
  try {
    console.log('Request body:', req.body); 
    console.log('File:', req.file); 

    const { lat, lng, title, description } = req.body;
    
    if (!lat || !lng || !title || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const cloudinaryResponse = await cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
      if (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return res.status(500).send('Internal Server Error');
      }

      const imageUrl = result.secure_url;

      const newMarker = new Marker({ lat, lng, title, description, image: imageUrl });
      await newMarker.save(); 

      res.status(201).json(newMarker);
    });

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null); 
    bufferStream.pipe(cloudinaryResponse);

  } catch (error) {
    console.error('Error saving marker:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/backend/maps/upload', markerUpload.single('mapImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Map image is required');
  }

  try {
   
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null); 

    const cloudinaryResponse = await cloudinary.v2.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          return res.status(500).send('Internal Server Error');
        }

        const mapImageUrl = result.secure_url;

        const newMap = new Map({ filename: mapImageUrl });
        newMap.save()
          .then(() => {
            res.json({
              message: 'Map image uploaded and saved successfully',
              url: mapImageUrl,  
            });
          })
          .catch((err) => {
            console.error('Error saving map to MongoDB:', err);
            res.status(500).send('Internal Server Error');
          });
      }
    );

    bufferStream.pipe(cloudinaryResponse);

  } catch (err) {
    console.error('Error uploading map image to Cloudinary:', err);
    res.status(500).send('Internal Server Error');
  }
});

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
    const result = await Marker.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Marker not found' });
    }

    return res.status(200).json({ message: 'Marker deleted successfully' });
  } catch (error) {
    console.error('Error deleting marker:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/backend/pins/:id', markerUpload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, description, lat, lng } = req.body;

  const updatedData = {
    title,
    description,
    lat,
    lng,
  };

  if (req.file) {
    try {
      const cloudinaryResponse = await cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          return res.status(500).json({ message: 'Error uploading image' });
        }

        updatedData.image = result.secure_url;

        Marker.findByIdAndUpdate(id, updatedData, { new: true })
          .then(updatedMarker => {
            res.json(updatedMarker);
          })
          .catch(error => {
            console.error('Error updating marker:', error);
            res.status(500).json({ message: 'Internal server error' });
          });
      });

      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(cloudinaryResponse);

    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return res.status(500).json({ message: 'Error uploading image' });
    }
  } else {
    try {
      const updatedMarker = await Marker.findByIdAndUpdate(id, updatedData, { new: true });
      res.json(updatedMarker);
    } catch (error) {
      console.error('Error updating marker:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

app.listen(process.env.PORT || 3002, () => {
  console.log('Server running');
});
