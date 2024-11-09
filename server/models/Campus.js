import mongoose from 'mongoose';

const campusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    maps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Map',
    }],
});

const Campus = mongoose.model('Campus', campusSchema);
export default Campus;
