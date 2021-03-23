const httpClient = require('../util/http_client');
const { get } = require('lodash');
let config;
const init = async (conf) => {
    config = conf;
};

const addBlog = async (blog)=>{
    const res = await httpClient.post(`${config['server_url']}/blog/_doc/`,blog);
    if(get(res, 'data.result') == 'created'){
        return get(res, 'data._id');
    }
};

module.exports = {
    addBlog,
    init
}