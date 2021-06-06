const mongoose = require('mongoose');

const nepseSchema = new mongoose.Schema({


    id: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    securityName: {
        type: String,
        required: true,
    },
    activeStatus: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default:() =>Date.now()
    },

});

module.exports = mongoose.model('nepse', nepseSchema);