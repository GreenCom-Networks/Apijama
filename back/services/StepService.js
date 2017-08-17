const DatabaseService = require('../services/DatabaseService');
const ObjectID = require("mongodb").ObjectID;
const Promise = require('bluebird').Promise;

module.exports = {
    insertStep(runId, step){
        return new Promise((resolve, reject) => {
            DatabaseService
                .getDb()
                .then(db => {
                    db.collection('runs')
                        .updateOne(
                            {
                                _id: new ObjectID(runId)
                            },
                            {
                                $push: {
                                    steps: step
                                }
                            }
                        )
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }
};