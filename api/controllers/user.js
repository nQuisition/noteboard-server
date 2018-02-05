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
                throw new Error('conflict');
            }
            return bcrypt.hash(req.body.password, 10);
        })
        .then(hash => {
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                email: req.body.email,
                name: req.body.name,
                password: hash
            });
            return user.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'User successfully created'
            });
        })
        .catch(err => {
            console.log(err);
            if(err.message === 'conflict') {
                errorController.conflict('Email exists', res);
            } else {
                errorController.generic(err, res);
            }
        });
};

exports.login = (req, res, next) => {
    let resultUser = null;
    User.find({ email: req.body.email })
        //.select('name, email, password, role, _id')
        .exec()
        .then(user => {
            if(user.length < 1) {
                throw new Error('authFailed');
            }
            resultUser = user[0];
            return bcrypt.compare(req.body.password, user[0].password);
        })
        .then(result => {
            if(!result) {
                throw new Error('authFailed');
            }
            const token = jwt.sign({
                email: resultUser.email,
                name: resultUser.name,
                role: resultUser.role,
                userId: resultUser._id
            }, process.env.JWT_KEY, { expiresIn: '1h' });
            
            res.status(200).json({
                message: 'Authentication successful',
                token: token,
                user: {
                    name: resultUser.name,
                    email: resultUser.email,
                    role: resultUser.role,
                    _id: resultUser._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            if(err.message === 'authFailed') {
                errorController.authFailed(res);
            } else {
                errorController.generic(err, res);
            }
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