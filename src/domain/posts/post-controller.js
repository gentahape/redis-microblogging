const { responseSuccess } = require('../../utils/responses');
const postService = require('./post-service');

const create = async (req, res, next) => {
    try {
        const result = await postService.create(req.body);
        res.status(201).json(responseSuccess('Post created successfully', result));
    } catch (error) {
        next(error);
    }
}

const get = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const result = await postService.get(userId);
        res.json(responseSuccess('User posts', result));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    get,
}