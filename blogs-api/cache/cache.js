const Redis = require("ioredis");
let cluster;


const init = async (conf)=>{
    cluster = new Redis.Cluster(conf.hosts);

    cluster.set("foo", "bar");
};