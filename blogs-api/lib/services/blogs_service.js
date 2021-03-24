const blogsDb = require('../db/blogs_db'),
    dayjs = require('dayjs'),
    utc = require('dayjs/plugin/utc'),
    userdsDb = require('../db/users_db'),
    { getUserData } = require('./users_service');

dayjs.extend(utc);



const addBlog = async ({ title, content }, userContext) => {

    if (!userContext.isBloger) {
        return { state: 401 };
    }

    const userData = await getUserData(userContext.userName);
    if (!userData) {
        return { state: 401 };
    }

    content = content.trim(); 
    if(content.length > 1000){
        return { state: 400, msg: 'content should be less then 1000 characters' }; 
    }

    const date = dayjs.utc()
    return blogsDb.addBlog({ title, content, author_id: userData.id, createdAt: date, updatedAt: date });
};

const getAllBlogs = async (count) => {
    const blogs = await blogsDb.getAllBlogs(count);
    if(blogs.length == 0){
        return blogs;
    }
    const authorIds = new Set();
    blogs.map((blog) => {
        if(!authorIds.has(blog.author_id))
            authorIds.add(blog.author_id);
        return true;
    });
    const usersNames = await userdsDb.getUsersNames(...authorIds);
    const usersNamesMap = new Map();
    usersNames.map((userNameEnt) => {
        usersNamesMap.set(userNameEnt.id, userNameEnt.username)
    });

    return blogs.map((blog) => {
        return {
            title: blog.title,
            content: blog.content,
            author: usersNamesMap.get(blog.author_id),
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt
        };
    });

}

module.exports = {
    addBlog,
    getAllBlogs
};