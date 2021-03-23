const blogsLikesDb = require('../db/blogs_likes_db'),
{ getUserData } = require('./users_service');

const addLike = async ({ blogId }, userContext) => {
    const userData = await getUserData(userContext.userName);
    if (!userData) {
        return { state: 401 };
    }

    return blogsLikesDb.addLikeForBlog({ blogId, userId: userData.id })
}

module.exports = {
    addLike
};