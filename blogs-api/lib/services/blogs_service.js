const blogsDb = require('../db/blogs_db'),
 dayjs = require('dayjs'),
 utc = require('dayjs/plugin/utc'),
 userdsDb = require('../db/users_db'),
 cacheService = require('../cache/cache_service');

 dayjs.extend(utc);



const addBlog = async ({ title,  content, author, createdAt, updatedAt }, userContext)=>{

    if(!userContext.isBloger){
        return 401;
    }

    let userData = await cacheService.getUserData({ username: userContext.userName });
    if(!userData){
        userData = await userdsDb.getUserData({ username: userContext.userName});
        if(userData){
           await cacheService.setUserData({ id: userData.id, username: userData.username })
        }
        else{
            return 401;
        }
    }

    const date = dayjs.utc()
    const blogId = await blogsDb.addBlog({ title,  content, author_id: userData.id , createdAt: date, updatedAt: date });
    return blogId;
};

module.exports = {
    addBlog
};