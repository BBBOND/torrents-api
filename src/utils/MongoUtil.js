let f = require('util').format;
let {mongoConfig} = require('../../config');
let mongoose = require('mongoose');
let URL = f('mongodb://%s:%s@%s:27017/torrents?authMechanism=%s', mongoConfig.user, mongoConfig.password, mongoConfig.url, mongoConfig.authMechanism);
let options = {
    promiseLibrary: require('bluebird'),
    useMongoClient: true,
    server: {
        auto_reconnect: true,
        poolSize: 10
    }
};
mongoose.Promise = global.Promise;

class MongoUtil {

    constructor() {
        this.connect();
    }

    connect(url = URL) {
        mongoose.connect(url, options);
    }

    getAllDoc(schema) {
        return new Promise((resolve, reject) => {
            schema.find({}, (err, doc) => {
                err && reject(err);
                resolve(doc);
            });
        });
    }

    getCount(schema) {
        return new Promise((resolve, reject) => {
            schema.count({}, (err, doc) => {
                err && reject(err);
                resolve(doc);
            })
        })
    }

    insertDoc(schema, doc) {
        return new Promise((resolve, reject) => {
            let s = new schema(doc);
            s.save((err, result) => {
                err && reject(err);
                resolve(result);
            });
        });
    }

    findDocsByQuery(schema, query, page, size) {
        return new Promise((resolve, reject) => {
            let transaction = schema
                .find(query)
                .skip(Number((page - 1) * size))
                .limit(Number(size));
            transaction.exec((err, doc) => {
                err && reject(err);
                resolve(doc);
            });
        });
    }

    close() {
        mongoose.disconnect();
    }
}

module.exports = new MongoUtil();