const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
        file: {
            type: String,
            required: true,
        },
        created: {
            type: Date,
            required: true,
            default: () => Date.now(),


        },
    }



);

module.exports = mongoose.model('image', imageSchema);