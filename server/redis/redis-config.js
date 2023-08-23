require('dotenv').config()
const { createClient } = require('redis');
const client = parseInt(process.env.PROD) !== 0 ? createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19143.c61.us-east-1-3.ec2.cloud.redislabs.com',
        port: 19143
    }
}) : createClient();
client.connect()

module.exports = client