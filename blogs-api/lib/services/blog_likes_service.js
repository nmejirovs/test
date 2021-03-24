const blogsLikesDb = require('../db/blogs_likes_db'),
{ getUserData } = require('./users_service'),
blogsDb = require('../db/blogs_db');

const isBlogExists = async (blogId)=>{
    const res = await blogsDb.getBlogByID(blogId);
    if(res.state){
        return res;
    }
    else {
        return true;
    }
};

const addLike = async ({ blogId }, userContext) => {
    const isExists = await isBlogExists(blogId);
    if(isExists.state){
        return isExists;
    }
    const userData = await getUserData(userContext.userName);
    if (!userData) {
        return { state: 401 };
    }

    return blogsLikesDb.addLikeForBlog({ blogId, userId: userData.id })
}

const removeLike = async ({ blogId }, userContext) => {
    const userData = await getUserData(userContext.userName);
    if (!userData) {
        return { state: 401 };
    }

    return blogsLikesDb.removeLikeForBlog({ blogId, userId: userData.id })
}

module.exports = {
    addLike,
    removeLike
};