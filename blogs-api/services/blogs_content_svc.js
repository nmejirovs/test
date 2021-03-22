const blogsDb = require('../db/blogs_db');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

const addBlog = ({ title,  content, author, createdAt, updatedAt })=>{
    return blogsDb.addBlog({ title,  content, createdAt, updatedAt });
};

module.exports = {
    addBlog
};