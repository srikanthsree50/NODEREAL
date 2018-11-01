var config = {
    development: {
        //url to be used in link generation
        url: 'mongodb://pradeepchandra007:Itsme007@ds157248.mlab.com:57248/projectxdb',
        //mongodb connection settings
        database: {
            host:   '127.0.0.1',
            port:   '27017',
            db:     'site_dev'
        },
        //server details
        server: {
            host: '127.0.0.1',
            port: '9090'
        }
    },
    production: {
        //url to be used in link generation
        url: 'mongodb://pradeepchandra007:Itsme007@ds157248.mlab.com:57248/projectxdb',
        //mongodb connection settings
        database: {
            host: '127.0.0.1',
            port: '27017',
            db:     'site'
        },
        //server details
        server: {
            host:   '127.0.0.1',
            port:    process.env.PORT
        }
    }
};
module.exports = config;