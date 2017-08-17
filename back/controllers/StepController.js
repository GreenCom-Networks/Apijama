const StepService = require('../services/StepService');

module.exports = {
    createStep(req, res){
        StepService
            .insertStep(req.params['runId'], req.body)
            .then(id => {
                return res
                    .status(201)
                    .send({id});
            })
    }
};