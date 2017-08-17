const RunService = require('../services/RunService');
const ObjectID = require("mongodb").ObjectID;

module.exports = {
    getAllRuns(req, res){
        RunService
            .findRuns()
            .then(runs => {
                return res
                    .status(200)
                    .send(runs);
            })
    },

    getOneRun(req, res){
        RunService
            .findRuns({_id: new ObjectID(req.params['runId'])})
            .then(runs => {
                return res
                    .status(200)
                    .send(runs);
            })
    },

    createRun(req, res){
        RunService
            .insertRun(req.body)
            .then(id => {
                return res
                    .status(201)
                    .send({id});
            })
    },

    patchRun(req, res){
        RunService
            .updateRun(req.params['runId'], req.body)
            .then(id => {
                return res
                    .status(200)
                    .send({id});
            })
    }
};