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
};

module.exports = {
    init,
    addLikeForBlog
}