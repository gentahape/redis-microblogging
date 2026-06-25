const redisClient = require("../../config/redis");
const { extractHashtags } = require("../../utils/helpers");
const { ResponseError } = require("../../utils/responses");

const create = async (request) => {
    const { user_id, content } = request;

    if (!user_id || !content) {
        throw new ResponseError(400, 'User ID and content are required');
    }

    const userKey = `user:${user_id}`;

    const userExists = await redisClient.exists(userKey);
    if (!userExists) {
        throw new ResponseError(404, 'User not found');
    }

    const newPostId = await redisClient.incr('global:next_post_id');
    const postKey = `post:${newPostId}`;

    await redisClient.hSet(postKey, {
        id: newPostId.toString(),
        user_id,
        content,
        created_at: new Date().toISOString()
    });

    const userPostsKey = `user:${user_id}:posts`;
    await redisClient.lPush(userPostsKey, newPostId.toString());

    await redisClient.hIncrBy(userKey, 'posts_count', 1);

    const followersKey = `user:${user_id}:followers`;
    const followers = await redisClient.sMembers(followersKey);
    if (followers.length > 0) {
        const fanOutPromises = followers.map(async (followerId) => {
            const feedKey = `user:${followerId}:feed`;
            await redisClient.lPush(feedKey, newPostId.toString());
            await redisClient.lTrim(feedKey, 0, 499);
        });
        await Promise.all(fanOutPromises);
    }

    const hashtags = extractHashtags(content);
    if (hashtags.length > 0) {
        const hashtagPromises = hashtags.map(async (tag) => {
            await redisClient.zIncrBy(`hashtags:trending`, 1, tag);
        });
        await Promise.all(hashtagPromises);
    }

    const authorData = await redisClient.hGetAll(userKey);
    const notificationPayload = {
        post_id: newPostId,
        author_username: authorData.username,
        snippet: content.substring(0, 40) + (content.length > 40 ? '...' : ''),
        timestamp: new Date().toISOString()
    }
    await redisClient.publish('notifications:new_post', JSON.stringify(notificationPayload));

    return {
        post_id: newPostId,
        key_stored: postKey,
        distributed_to: followers.length
    }
}

const get = async (userId) => {
    const userPostsKey = `user:${userId}:posts`;

    const postIds = await redisClient.lRange(userPostsKey, 0, -1);

    if (postIds.length === 0) {
        return {
            posts: []
        };
    }

    const postsPromises = postIds.map(postId => redisClient.hGetAll(`post:${postId}`));
    const posts = await Promise.all(postsPromises);

    return {
        total_posts: posts.length,
        posts
    }
}

module.exports = {
    create,
    get
}