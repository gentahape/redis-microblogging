const { ResponseError } = require('../utils/responses');

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        res.status(err.status).json({ 
            message: "Something went wrong",
            errors: err.message 
        });
    } else {
        res.status(500).json({
            message: "Internal server error", 
            errors: err.message 
        });
    }
}

module.exports = {
    errorMiddleware
}