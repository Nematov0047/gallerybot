const {Schema, model} = require('mongoose');

const gallerySchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    file_id: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    }
})

module.exports = model('Gallery', gallerySchema);