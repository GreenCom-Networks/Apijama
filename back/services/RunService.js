const DatabaseService = require('../services/DatabaseService');
const ObjectID = require("mongodb").ObjectID;
const Promise = require('bluebird').Promise;

module.exports = {
    findRuns(query = {}){
        return new Promise((resolve, reject) => {
            DatabaseService
                .getDb()
                .then(db => {
                    db.collection('runs')
                        .find(query)
                        .toArray()
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    },

    insertRun(test){
        return new Promise((resolve, reject) => {
            DatabaseService
                .getDb()
                .then(db => {
                    db.collection('runs')
                        .insertOne(test)
                        .then(res => resolve(res.insertedId))
                        .catch(reject);
                })
                .catch(reject);
        });
    },

    updateRun(runId, fields){
        return new Promise((resolve, reject) => {
            DatabaseService
                .getDb()
                .then(db => {
                    db.collection('runs')
                        .updateOne(
                            {
                                _id: new ObjectID(runId, fields)
                            },
                            {
                                $set: fields
                            },
                            {
                                upsert: false,
                                multi: false
                            }
                        )
                        .then(res => resolve(res.insertedId))
                        .catch(reject);
                })
                .catch(reject);
        });
    }
};