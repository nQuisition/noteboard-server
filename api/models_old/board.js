const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notes' }],
    default: { type: Boolean, default: false }
});

module.exports = mongoose.model('Boards', boardSchema); 