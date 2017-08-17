const MongoClient = require("mongodb").MongoClient;
const Promise = require('bluebird').Promise;

module.exports = {
    db: null,

    getDb(){
        return new Promise((resolve, reject) => {
            if (this.db) return resolve(this.db);
            else {
                this
                    .connectDb()
                    .then(resolve)
                    .catch(reject)
            }
        })
    },

    connectDb(){
        return new Promise((resolve, reject) => {
            MongoClient.connect("mongodb://localhost/apijama", (err, d) => {
                if (err) return reject(err);
                else {
                    this.db = d;
                    return resolve(d);
                }
            });
        })
    }
};
