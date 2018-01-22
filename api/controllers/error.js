function error(status, err, res) {
    return res.status(status).json({
        status: status,
        error: err
    });
}

exports.error = error;
exports.notFound = (res) => error(404, 'Resource not found or not available for given operation', res);
exports.authFailed = (res) => error(401, 'Authentication failed', res);
exports.unauthorized = (res) => error(401, 'Not authorized', res);
exports.conflict = (message, res) => error(409, message, res);
exports.generic = (err, res) => error(500, err, res);