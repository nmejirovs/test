const Redis = require("ioredis");
let redisClient;

let client;



const init = async (conf)=>{
    redisClient = new Redis(conf.host);
    client = {
        get: async (...args) => redisClient.get(args),
        set: async ( key, value, ...args)=>redisClient.set(key, value, args) 
    };
};

const getClient = async ()=>{
    return client;
};

module.exports = {
    init, 
    getClient
};