const config = require(`../config/${process.NODE_ENV || 'dev'}/jwt.json`)
const jwksClient = require('jwks-rsa');
var jwt = require('jsonwebtoken');

let client;
const init = async ()=>{
    client = jwksClient({
        jwksUri: config.auth_conf_url
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