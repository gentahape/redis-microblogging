const { responseSuccess } = require('../../utils/responses');
const postService = require('./post-service');

const create = async (req, res, next) => {
    try {
        const result = await postService.create(req.params.user_id, req.body.content);
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

const remove = async (req, res, next) => {
    try {
        const result = await postService.remove(req.params);
        res.json(responseSuccess('Post removed successfully', result));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    get,
    remove
}