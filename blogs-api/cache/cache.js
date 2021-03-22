const Redis = require("ioredis");
let client;


const init = async (conf)=>{
    client = new Redis(conf.host);
      
    await client.set("foo", "bar");

    let res = await client.get("foo");
};

module.exports = {
    init
};