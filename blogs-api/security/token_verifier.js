const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const httpClient = require('../util/http_client');

let config;

let client;
const init = async (conf)=>{
    config = conf;
    client = jwksClient({
        jwksUri: config.auth_conf_url,
        fetcher: async (url)=>{
            const response = await httpClient.get(url);
            return response.data;
        }
    });
};

const getKey = (header, callback)=>{
    client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
    });
}


const verify_token = (token)=>{
    return new Promise((resolve, reject)=>{
        jwt.verify(token, getKey, {
			algorithms: ['RS256', 'SH256', 'AES']
		}, function(err, decoded) {
            if(!err)
                resolve(decoded);
            else
                reject(err);
        });
    });
}


module.exports = {
    init,
    verify_token
}