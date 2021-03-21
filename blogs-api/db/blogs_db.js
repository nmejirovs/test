const httpClient = require('../util/http_client');
const { get } = require('lodash');
let config;
const init = async (conf) => {
    config = conf;
};

const addBlog = async (blog)=>{
    const res = await httpClient.post(`${config['server_url']}/blogs/_doc/`,blog);
    if(get(res, 'result') == 'created'){
        return get(res, '_id');
    }
};

module.exports = {
    addBlog,
    init
}