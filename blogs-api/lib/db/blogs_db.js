const httpClient = require('../util/http_client');
const { get } = require('lodash');
let config;
const init = async (conf) => {
    config = conf;
};

const addBlog = async (blog) => {
    const res = await httpClient.post(`${config['server_url']}/blog/_doc/`, blog);
    if (get(res, 'data.result') == 'created') {
        return get(res, 'data._id');
    }
};

const getAllBlogs = async (count) => {
    const res = await httpClient.post(`${config['server_url']}/blog/_search`,
        {
            "size": count
        }
    );

    return get(res, 'data.hits.hits').map((record)=>{
        return record._source
    });
};

module.exports = {
    init,
    addBlog,
    getAllBlogs
}