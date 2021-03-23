const blogsDb = require('../db/blogs_db'),
    dayjs = require('dayjs'),
    utc = require('dayjs/plugin/utc'),
    userdsDb = require('../db/users_db'),
    cacheService = require('../cache/cache_service');

dayjs.extend(utc);

const getUserData = async (userName) => {
    let userData = await cacheService.getUserData({ username: userName });
    if (!userData) {
        userData = await userdsDb.getUserData({ username: userName });
        if (userData) {
            await cacheService.setUserData({ id: userData.id, username: userData.username })
        }
    }
    return userData;
};

const addBlog = async ({ title, content, author, createdAt, updatedAt }, userContext) => {

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
    const blogId = await blogsDb.addBlog({ title, content, author_id: userData.id, createdAt: date, updatedAt: date });
    return blogId;
};

const getAllBlogs = async (count) => {
    const blogs = await blogsDb.getAllBlogs(count);
    const authorIds = new Set();
    blogs.map((blog) => {
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