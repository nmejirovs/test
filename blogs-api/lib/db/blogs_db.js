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
            return {
                id: record._id,
                ...record._source
            };
        });
    } catch (error) {
        if (get(error, 'response.status') === 404) {
            return [];
        }
        throw error;
    }
};

const updateBlog = async (id, { blog: { title, content, updatedAt}, userId }) => {
    try {
        const res = await httpClient.post(`${config['server_url']}/blog/_update_by_query`,
            {
                "script": {
                    "inline": `ctx._source.title = '${title}'; ctx._source.content = '${content}';ctx._source.updatedAt = '${JSON.parse(JSON.stringify({ updatedAt })).updatedAt}';`,
                    "lang": "painless"
                },
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "_id": `${id}`
                                }
                            },
                            {
                                "match": {
                                    "author_id": `${userId}`
                                }
                            }
                        ]
                    }
                }
            }
        );

        if(get(res, 'data.updated') == 0){
            try {
                const resp = await httpClient.get(`${config['server_url']}/blog/_doc/${id}`);   
                if(get(resp, 'data._source.author_id') != userId){
                    return { state: 401, msg: 'Blog can be updated by author only' };
                }
            } catch (err) {
                if (get(err, 'response.status') === 404) {
                    return { state: 404, msg: 'Blog not found' };
                }
                throw err;
            }
        }
        
        return true;

    } catch (error) {
        if (get(error, 'response.status') === 404) {
            return { state: 404, msg: 'Blog not found' };
        }
        throw error;
    }
};

module.exports = {
    init,
    addBlog,
    getAllBlogs,
    updateBlog
}