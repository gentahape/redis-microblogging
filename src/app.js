const express = require('express');
const redisClient = require('./config/redis');
const { extractHashtags } = require('./utils/helpers');
const { errorMiddleware } = require('./middleware/error-middleware');

require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/users', require('./domain/users/user-route'));
app.use('/api/feeds', require('./domain/feeds/feed-route'));
app.use('/api/posts', require('./domain/posts/post-route'));
app.use('/api/notifications', require('./domain/notifications/notif-route'));

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});