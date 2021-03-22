const Redis = require("ioredis");
let client;


const init = async (conf)=>{
    client = new Redis(conf.host);
};

module.exports = {
    init
};