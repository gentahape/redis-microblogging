const notifService = require('./notif-service');

const stream = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log('Someone connected to notifications stream');

    const streamingSubClient = await notifService.stream();
    
    await streamingSubClient.connect();
    await streamingSubClient.subscribe('notifications:new_post', (message) => {
        res.write(`data: ${message}\n\n`);
    });

    req.on('close', async () => {
        console.log('Notifications stream connection closed');
        await streamingSubClient.disconnect();
    });
}

module.exports = {
    stream
}