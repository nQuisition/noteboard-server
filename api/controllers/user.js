const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const errorController = require('./error');

exports.signUp = (req, res, next) => {
    User.find({$or: [{email: req.body.email}, {name: req.body.name}]})
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return errorController.conflict('Email exists', res);
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return errorController.generic(err, res);
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            email: req.body.email,
                            name: req.body.name,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User successfully created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                errorController.generic(err, res);
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            errorController.generic(err, res);
        });
};

exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
        //.select('name, email, password, role, _id')
        .exec()
        .then(user => {
            if(user.length < 1) {
                return errorController.authFailed(res);
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return errorController.authFailed(res);
                }
                if(result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        name: user[0].name,
                        role: user[0].role,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, { expiresIn: '1h' });
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token,
                        user: {
                            name: user[0].name,
                            email: user[0].email,
                            role: user[0].role,
                            _id: user[0]._id
                        }
                    });
                }
                return errorController.authFailed(res);
            });
        })
        .catch(err => {
            console.log(err);
            errorController.generic(err, res);
        });
};

exports.getAll = (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            res.status(200).json({
                count: users.length,
                users: users
            });
        })
        .catch(err => {
            console.log(err);
            errorController.generic(err, res);
        });
};

exports.delete = (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            errorController.generic(err, res);
        });
}