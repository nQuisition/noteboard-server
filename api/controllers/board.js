const mongoose = require('mongoose');

const Note = require('../models/note');

const errorController = require('./error');

exports.getOwn = (req, res, next) => {
    const userId = req.userData.userId;
    const params = { owner: userId };
    Note.find({ owner: userId }).exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                notes: result
            });
        })
        .catch(err => {
            console.log(err);
            errorController.generic(err, res);
        });
};

exports.postOwn = (req, res, next) => {
    const userId = req.userData.userId;
    //Trust the middleware to ensure userid exists?
    const note = new Note({
        _id: new mongoose.Types.ObjectId,
        title: req.body.title,
        body: req.body.body?req.body.body:'',
        owner: userId
    });
    note.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Note successfully created',
                note: result
            });
        })
        .catch(err => {
            console.log(err);
            errorController.generic(err, res);
        });
};

exports.deleteOwn = (req, res, next) => {
    const userId = req.userData.userId;
    const noteId = req.body.noteid;
    let resultNote = null;
    Note.findOne({ _id:noteId, owner: userId }).exec()
        .then(result => {
            if(!result) {
                throw new Error('notFound');
            }
            resultNote = result;
            return Note.remove({ _id:noteId })
        })
        .then(result => {
            res.status(200).json({
                message: "Note successfully deleted",
                note: resultNote
            });
        })
        .catch(err => {
            console.log(err);
            if(err.message === 'notFound') {
                errorController.notFound(res);
            } else {
                errorController.generic(err, res);
            }
        });
};

exports.updateOwn = (req, res, next) => {
    const userId = req.userData.userId;
    const noteId = req.body.noteid;
    Note.findOneAndUpdate({ _id:noteId, owner: userId }, { $set: req.body.note }, { new: true }).exec()
        .then(result => {
            console.log(result);
            if(!result) {
                return errorController.notFound(res);
            }
            res.status(200).json({
                message: "Note successfully patched",
                note: result
            });
        })
        .catch(err => {
            console.log(err);
            errorController.generic(err, res);
        });
};