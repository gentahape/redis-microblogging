const userService = require('./user-service');
const { responseSuccess } = require('../../utils/responses');

const register = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await userService.register(request);

        res.status(201).json(responseSuccess('User registered successfully', result));
    } catch (error) {
        next(error);
    }
};

const profile = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const userProfile = await userService.profile(userId);
        res.status(200).json(responseSuccess('User profile found', userProfile));
    } catch (error) {
        next(error);
    }
};

const follow = async (req, res, next) => {
    try {
        await userService.follow(req.params.user_id, req.body.target_id);
        res.status(200).json(responseSuccess('User followed successfully', null));
    } catch (error) {
        next(error);
    }
};

const unfollow = async (req, res, next) => {
    try {
        await userService.unfollow(req.params.user_id, req.body.target_id);
        res.status(200).json(responseSuccess('User unfollowed successfully', null));
    } catch (error) {
        next(error);
    }
};

const mutual = async (req, res, next) => {
    try {
        const result = await userService.mutual(req.params);
        res.status(200).json(responseSuccess('User mutuals', result));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    profile,
    follow,
    unfollow,
    mutual
};