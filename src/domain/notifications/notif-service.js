const redisClient = require('../../config/redis');

const stream = async () => {
    return await redisClient.duplicate();
};

module.exports = {
    stream
}