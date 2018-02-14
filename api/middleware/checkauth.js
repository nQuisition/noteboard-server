const jwt = require('jsonwebtoken');

const db = require('../../db/models');
const Op = db.Sequelize.Op;
const User = db.User;
const Role = db.Role;

const errorController = require('../controllers/error');

function check(role) {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.userData = decoded;
            let userRolePrio = -1;
            let rolePrio = -1;
            Role.findOne({
                where: {
                    name: role
                }
            })
            .then(result => {
                if(result) {
                    rolePrio = result.toJSON().priority;
                }
                return User.findOne({
                    attributes: { exclude: ['roleId'] },
                    include: [ {model: Role, as: 'role'} ],
                    where: {
                        id: decoded.userId
                    }
                })
            })
            .then(result => {
                userRolePrio = result.toJSON().role.priority;
                if(!result || (role && rolePrio < userRolePrio)) {
                    console.log('Attempt of unauthorized access by', result.toJSON().name, result.toJSON().id);
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