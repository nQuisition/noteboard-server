const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    body: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
});

module.exports = mongoose.model('Notes', noteSchema); 