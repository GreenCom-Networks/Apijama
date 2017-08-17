const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Router = require('./modules/Router');

app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

app.use('*', (req, res, next) => {
    console.log("Requested :: ", req.method, req.baseUrl);
    next();
});

app.use('/', Router);

app.listen(process.env.PORT || 3000);

console.log('Server ready');
