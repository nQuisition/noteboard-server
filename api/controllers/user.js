const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../../db/models');
const Op = db.Sequelize.Op;
const User = db.User;
const Role = db.Role;
const Board = db.Board;
const errorController = require('./error');

exports.signUp = (req, res, next) => {
    User.findOne({
        where: {
            [Op.or]: [{email: req.body.email}, {name: req.body.name}]
        }
    })
    .then(user => {
        if(user) {
            throw new Error('conflict');
        }
        return bcrypt.hash(req.body.password, 10);
    })
    .then(hash => {
        const user = User.build({
            email: req.body.email,
            name: req.body.name,
            password: hash,
            //TODO
            roleId: 2
        });
        return user.save();
    })
    .then(result => {
        const board = Board.build({
            title: "Default",
            ownerId: result.dataValues.id,
            def: true
        });
        console.log(result, board);
        return board.save();
    })
    .then(result => {
        res.status(201).json({
            message: 'User successfully created'
        });
    })
    .catch(err => {
        console.log(err);
        if(err.message === 'conflict') {
            errorController.conflict('Email or username exists', res);
        } else {
            errorController.generic(err, res);
        }
    });
};

exports.login = (req, res, next) => {
    let resultUser = null;
    User.findOne({
        attributes: { exclude: ['roleId'] },
        include: [ {model: Role, as: 'role'} ],
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(!user) {
            throw new Error('authFailed');
        }
        resultUser = user.toJSON();
        console.log(resultUser);
        return bcrypt.compare(req.body.password, resultUser.password);
    })
    .then(result => {
        if(!result) {
            throw new Error('authFailed');
        }
        //console.log(resultUser);
        const token = jwt.sign({
            email: resultUser.email,
            name: resultUser.name,
            role: resultUser.role,
            userId: resultUser.id
        }, process.env.JWT_KEY, { expiresIn: '1h' });
        
        res.status(200).json({
            message: 'Authentication successful',
            token: token,
            user: {
                name: resultUser.name,
                email: resultUser.email,
                role: resultUser.role,
                id: resultUser.id
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
    User.findAll({
        attributes: { exclude: ['roleId'] },
        include: [ {model: Role, as: 'role'} ]
    })
    .then(users => {
        const procUsers = users.map(user => user.toJSON());
        res.status(200).json({
            count: procUsers.length,
            users: procUsers
        });
    })
    .catch(err => {
        console.log(err);
        errorController.generic(err, res);
    });
};

exports.delete = (req, res, next) => {
    const id = req.params.userId;
    User.destroy({
        where: {
            id: id
        }
    })
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        errorController.generic(err, res);
    });
}