const userdsDb = require('../db/users_db'),
    cacheService = require('../cache/cache_service');

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

module.exports = {
    getUserData
}