var express = require('express');
var router = express.Router();

var HandlerGenerator = require("../handlegenerator.js");
var middleware = require("../middleware.js");

HandlerGenerator = new HandlerGenerator();

/* GET home page. */
router.get('/', middleware.checkToken, HandlerGenerator.index);

router.post( '/login', HandlerGenerator.login);

router.post( '/createUser', HandlerGenerator.createUser);

router.get('/read', middleware.checkToken, HandlerGenerator.read);

router.get('/write', middleware.checkToken, HandlerGenerator.write);


module.exports = router;