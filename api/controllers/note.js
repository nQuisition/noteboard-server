const db = require('../../db/models');
const Op = db.Sequelize.Op;
const Note = db.Note;
const Board = db.Board;

const errorController = require('./error');

exports.getOwn = (req, res, next) => {
    const userId = req.userData.userId;
    Note.findAll({
        where: {
            ownerId: userId
        }
    })
    .then(result => {
        const notes = result.map(note => note.toJSON());
        res.status(200).json({
            count: notes.length,
            notes: notes
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
    let note = null;

    Board.findOne({
        where: {
            def: true,
            ownerId: userId
        }
    })
    .then(result => {
        if(!result) {
            throw new Error('notFound');
        }
        boardId = result.toJSON().id;
        note = Note.build({
            title: req.body.title,
            body: req.body.body,
            ownerId: userId,
            ownerBoardId: boardId
        });
        return note.save();
    })
    .then(result => {
        note = result.toJSON();
        console.log(note);
        res.status(201).json({
            message: 'Note successfully created',
            note: note
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

exports.deleteOwn = (req, res, next) => {
    const userId = req.userData.userId;
    const noteId = req.body.noteId;
    let resultNote = null;
    Note.findOne({
        where: {
            id: noteId,
            ownerId: userId
        }
    })
    .then(result => {
        if(!result) {
            throw new Error('notFound');
        }
        resultNote = result.toJSON();
        return Note.destroy({
            where: {
                id: noteId
            }
        });
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
    const noteId = req.body.noteId;
    const params = {};
    //TODO better way?
    if(req.body.note.title) {
        params.title = req.body.note.title
    }
    if(req.body.note.body) {
        params.body = req.body.note.body
    }

    Note.update(params, {
        where: {
            id: noteId,
            ownerId: userId
        }
    })
    .then(result => {
        console.log(result);
        if(result[0] <= 0) {
            throw new Error('notFound');
        }
        return Note.findOne({
            where: {
                id: noteId
            }
        })
    })
    .then(result => {
        res.status(200).json({
            message: "Note successfully patched",
            note: result.toJSON()
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