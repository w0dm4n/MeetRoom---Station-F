import Processor from "../class/processor.js"
const express = require("express");
const bodyParser = require("body-parser");
export default class Server
{
    constructor(listenPort)
    {
        this.listenPort = listenPort;
    }

    initServer()
    {
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.use(function(req, res, next) {
            if (req.headers.origin) {
                res.header('Access-Control-Allow-Origin', '*') // just for being sure that the 'test' is okay everywhere
                res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
                res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
            }
            next();
        })

        this.router = express.Router();
        this.app.use('/', this.router);

        Processor.routeHandler(this.router);
        this.app.listen(this.listenPort, () => {
            console.log("Server started on port " + this.listenPort);
        });
    }
}