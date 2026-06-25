const redisClient = require('../../config/redis');
const { ResponseError } = require('../../utils/responses');

const register = async (request) => {
    const { username, name, bio } = request;

    if (!username || !name) {
        throw new ResponseError(400, 'Username and name are required');
    }

    const newUserId = await redisClient.incr('global:next_user_id');
    const userKey = `user:${newUserId}`;

    await redisClient.hSet(userKey, {
        id: newUserId.toString(),
        username,
        name,
        bio: bio || '',
        created_at: new Date().toISOString(),
        followers_count: 0,
        following_count: 0,
        posts_count: 0
    });

    return {
        user_id: newUserId,
        key_stored: userKey
    };
};

const profile = async (userId) => {
    const userKey = `user:${userId}`;
    const userProfile = await redisClient.hGetAll(userKey);
    if (Object.keys(userProfile).length === 0) {
        throw new ResponseError(404, 'User not found');
    }
    return userProfile;
};

const follow = async (user_id, target_id) => {
    if (!user_id || !target_id) {
        throw new ResponseError(400, 'User ID and target ID are required');
    }

    if (user_id === target_id) {
        throw new ResponseError(400, 'You cannot follow yourself');
    }

    const userKey = `user:${user_id}`;
    const targetKey = `user:${target_id}`;

    const [userExists, targetExists] = await Promise.all([
        redisClient.exists(userKey),
        redisClient.exists(targetKey)
    ]);

    if (!userExists || !targetExists) {
        throw new ResponseError(404, 'User or target not found');
    }

    const followingKey = `user:${user_id}:following`;
    const followersKey = `user:${target_id}:followers`;

    const isNewFollow = await redisClient.sAdd(followingKey, target_id.toString());
    if (isNewFollow == 0) {
        throw new ResponseError(400, 'You are already following this user');
    }

    await redisClient.sAdd(followersKey, user_id.toString());

    await redisClient.hIncrBy(userKey, 'following_count', 1);
    await redisClient.hIncrBy(targetKey, 'followers_count', 1);

    return true;
};

const unfollow = async (user_id, target_id) => {
    const followingKey = `user:${user_id}:following`;
    const followersKey = `user:${target_id}:followers`;

    const isRemoved = await redisClient.sRem(followingKey, target_id.toString());
    if (isRemoved == 0) {
        throw new ResponseError(400, 'You are not following this user');
    }

    await redisClient.sRem(followersKey, user_id.toString());

    const userKey = `user:${user_id}`;
    const targetKey = `user:${target_id}`;

    await redisClient.hIncrBy(userKey, 'following_count', -1);
    await redisClient.hIncrBy(targetKey, 'followers_count', -1);

    return true;
};

const mutual = async (request) => {
    const { user_id, target_id } = request;

    const myFollowingKey = `user:${user_id}:following`;
    const targetFollowingKey = `user:${target_id}:following`;

    const mutualIds = await redisClient.sInter([
        myFollowingKey,
        targetFollowingKey
    ])
    if (mutualIds.length === 0) {
        return {
            mutual_count: 0,
            mutual_users: []
        };
    }

    const userPromises = mutualIds.map(userId => redisClient.hGetAll(`user:${userId}`));
    const mutualUsers = await Promise.all(userPromises);

    return {
        mutual_count: mutualUsers.length,
        mutual_users: mutualUsers
    }
};

module.exports = {
    register,
    profile,
    follow,
    unfollow,
    mutual,
}