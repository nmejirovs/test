const blogsDb = require('../db/blogs_db'),
    dayjs = require('dayjs'),
    utc = require('dayjs/plugin/utc'),
    userdsDb = require('../db/users_db'),
    { getUserData } = require('./users_service');

dayjs.extend(utc);



const validateInput = ({ title, content })=>{
    if(title.length > 100){
        return { state: 400, msg: 'title should be up to 100 characters' }; 
    }

    if(content.length > 1000){
        return { state: 400, msg: 'content should be up to 1000 characters' }; 
    }
    return true;
};

const enrichWithAuthorsNames = async (blogs) => {
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
            id: blog.id,
            title: blog.title,
            content: blog.content,
            author: usersNamesMap.get(blog.author_id),
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt
        };
    });
};

const addBlog = async ({ title, content }, userContext) => {

    if (!userContext.isBloger) {
        return { state: 401 };
    }

    const userData = await getUserData(userContext.userName);
    if (!userData) {
        return { state: 401 };
    }

    content = content.trim(); 
    title = title.trim();

    const valid = validateInput({ title, content });

    if(valid !== true)
        return valid;

    const date = dayjs.utc();
    return blogsDb.addBlog({ title, content, author_id: userData.id, createdAt: date, updatedAt: date });
};

const getAllBlogs = async (count) => {
    const blogs = await blogsDb.getAllBlogs(count);
    if(blogs.length == 0){
        return blogs;
    }

    return enrichWithAuthorsNames(blogs);
}

const getBlogById = async (blogId) => {
    const blog = await blogsDb.getBlogByID(blogId);
    if(blog.state){
        return blog;
    }

    const result = (await enrichWithAuthorsNames([blog]))[0];
    return result;
}

const updateBlog = async ( id, { title, content }, userContext)=>{
    const userData = await getUserData(userContext.userName);
    if (!userData) {
        return { state: 401 };
    }

    content = content.trim(); 
    title = title.trim();

    const valid = validateInput({ title, content });

    if(valid !== true)
        return valid;

    return await blogsDb.updateBlog(id, { blog: { title, content, updatedAt: dayjs.utc()}, userId: userData.id });
};

const removeBlog = async ( id, userContext)=>{
    const userData = await getUserData(userContext.userName);
    if (!userData) {
        return { state: 401 };
    }

    return await blogsDb.removeBlog(id, userData.id);
};

module.exports = {
    addBlog,
    getAllBlogs,
    updateBlog,
    getBlogById,
    removeBlog
};