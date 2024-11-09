import express from 'express';
import multer from 'multer';
import { createMarker, getMarker, getMarkersByCampusId } from '../controllers/markerController.js';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/360'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage }); 

const router = express.Router();

router.post('/', upload.single('image'), createMarker);  
router.get('/:id', getMarker);    
router.get('/campus/:campusId', getMarkersByCampusId); 

export default router;









