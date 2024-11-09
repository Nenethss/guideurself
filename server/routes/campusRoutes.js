import express from 'express';
import Campus from '../models/Campus.js';

const router = express.Router();

// Add a new campus
router.post('/', async (req, res) => {
    const { name } = req.body; 

    try {
        if (!name) {
            return res.status(400).json({ message: 'Campus name is required' });
        }

        const newCampus = new Campus({ name });
        await newCampus.save();
        res.status(201).json(newCampus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all campuses
router.get('/', async (req, res) => {
    try {
        const campuses = await Campus.find();
        res.json(campuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific campus by ID
router.get('/:id', async (req, res) => {
    try {
        const campus = await Campus.findById(req.params.id).populate('maps');
        if (!campus) return res.status(404).json({ message: 'Campus not found' });
        res.json(campus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
