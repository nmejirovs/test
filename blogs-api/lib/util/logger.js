const winston = require('winston');

let config;
let logger;


const init = async (conf) => {
    if(!logger){
        config = conf;
        const wlogger = winston.createLogger({
            level: 'silly',
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: config['log_path'] })
            ]
        });

        logger = {
            log: wlogger.log.bind(wlogger),
            error: wlogger.error.bind(wlogger),
            warn: wlogger.warn.bind(wlogger),
            info: wlogger.info.bind(wlogger),
            http: wlogger.http.bind(wlogger),
            verbose: wlogger.verbose.bind(wlogger),
            debug: wlogger.debug.bind(wlogger),
            silly: wlogger.silly.bind(wlogger),
        }
    }
};

const getLoggger = ()=>logger;



module.exports = {
    init,
    getLoggger
};