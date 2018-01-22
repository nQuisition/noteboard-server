const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const roles = require('../models/roles');
const User = require('../models/user');

const errorController = require('../controllers/error');

function check(role) {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.userData = decoded;
            User.findById(decoded.userId).exec()
                .then(result => {
                    if(!result || (role && roles[role] < roles[result.role])) {
                        console.log('Attempt of unauthorized access by', result.name, result._id);
                        return errorController.unauthorized(res);
                    }
                    next();
                })
                .catch(err => {
                    console.log(err);
                    errorController.generic(err, res);
                });
        } catch(err) {
            return errorController.unauthorized(res);
        }
    };
}

module.exports = check;