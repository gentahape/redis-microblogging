class ResponseError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const responseSuccess = (message, data) => {
    return {
        message,
        data,
    }
}

module.exports = {
    ResponseError,
    responseSuccess
};