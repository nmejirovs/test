const blogsDb = require('../db/blogs_db');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

const addBlog = ({ userName, blogContent })=>{
    blogsDb.addBlog({
        userName,
        blogContent,
        createdAt:  dayjs.utc()
    });
};