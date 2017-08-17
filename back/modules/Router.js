const express = require('express');
const router = new express.Router();

const RunController = require('../controllers/RunController');
const StepController = require('../controllers/StepController');

/********
 * RUNS *
 ********/

router
    .post('/runs', RunController.createRun)
    .get('/runs', RunController.getAllRuns)
    .get('/runs/:runId', RunController.getOneRun)
    .patch('/runs/:runId', RunController.patchRun);


/*********
 * STEPS *
 *********/

router
    .post('/runs/:runId/steps', StepController.createStep);

module.exports = router;