let getClient;


const init = async (getCacheClient)=>{
    getClient = getCacheClient;
};

const cachePrefix = 'user:data'

const getUserData = async ({ username }) => {
    const client = await getClient();
    const userData = JSON.parse(await client.get(`${cachePrefix}:${username}`));
    return userData;
};

const setUserData = async ({ id, username}) => {
    const client = await getClient();
    await client.set(`${cachePrefix}:${username}`, JSON.stringify({ id }), "EX", 18000);
};

module.exports = {
    init, 
    getUserData,
    setUserData
}