const httpClient = require('../util/http_client');
const { get } = require('lodash');
let config;
const init = async (conf) => {
    config = conf;
};

const addLikeForBlog = async ({ blogId, userId }) => {
    const res = await httpClient.post(`${config['server_url']}/blog_likes/_doc/${blogId}_${userId}`, { blogId, userId });
    if (get(res, 'data.result') == 'created' || get(res, 'data.result') == 'updated') {
        return true;
    }
    else {
        return false;
    }
};

const removeLikeForBlog = async ({ blogId, userId }) => {
    try {
        const res = await httpClient.delete(`${config['server_url']}/blog_likes/_doc/${blogId}_${userId}`);
        if (get(res, 'data.result') == 'deleted') {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        if (get(error, 'response.status') === 404) {
            return { state: 404, msg: 'Blog like not found' };
        }
        throw error;
    }

};




module.exports = {
    init,
    addLikeForBlog,
    removeLikeForBlog
}