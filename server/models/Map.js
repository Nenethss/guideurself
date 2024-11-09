import mongoose from 'mongoose';

const mapSchema = new mongoose.Schema({
    campusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campus',
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
      }
    },{
      timestamps: true  // This will add createdAt and updatedAt fields
  });

const Map = mongoose.model('Map', mapSchema);
export default Map;

