let getClient;


const init = async (getCacheClient)=>{
    getClient = getCacheClient;
    const client = await getClient();
    await client.set("foo", "bar");
    const r = await client.get("foo")
};

module.exports = {
    init
}