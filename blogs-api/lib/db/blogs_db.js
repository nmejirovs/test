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
    let res;
    try {
        res = await httpClient.post(`${config['server_url']}/blog/_search`,
            {
                "size": count
            }
        );

        return get(res, 'data.hits.hits').map((record) => {
            return record._source
        });
    } catch (error) {
        if(get(error, 'response.status') === 404){
            return [];
        }
        throw error;
    }
};

module.exports = {
    init,
    addBlog,
    getAllBlogs
}