const { responseSuccess } = require('../../utils/responses');
const feedService = require('./feed-service');

const feed = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const result = await feedService.feed(userId);

        res.json(responseSuccess('User feed', result));
    } catch (error) {
        next(error);
    }
};

const trending = async (req, res, next) => {
    try {
        const result = await feedService.trending();
        res.json(responseSuccess('Trending topics', result));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    feed,
    trending
}