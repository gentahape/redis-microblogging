const redisClient = require("../../config/redis");

const feed = async (userId) => {
    const feedKey = `user:${userId}:feed`;

    const postIds = await redisClient.lRange(feedKey, 0, 19);
    if (postIds.length === 0) {
        return {
            feed_count: 0,
            feed: []
        }
    }

    const postsPromises = postIds.map(async (postId) => {
        const postData = await redisClient.hGetAll(`post:${postId}`);

        if (postData.user_id) {
            const authorData = await redisClient.hGetAll(`user:${postData.user_id}`);
            postData.author = {
                username: authorData.username,
                name: authorData.name
            }
        }
        return postData;
    });

    const feedDetails = await Promise.all(postsPromises);

    return {
        feed_count: feedDetails.length,
        feed: feedDetails
    }
}

const trending = async () => {
    const trendingRaw = await redisClient.zRangeWithScores('hashtags:trending', 0, 4, {
        REV: true
    });;

    const trendingTopics = trendingRaw.map(item => ({
        hashtag: item.value,
        count: item.score
    }));

    return {
        timestamp: new Date().toISOString(),
        trending_topics: trendingTopics
    }
}

module.exports = {
    feed,
    trending
}