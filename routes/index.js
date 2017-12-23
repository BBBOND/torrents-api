var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let json = {
    code: 0,
    msg: 'Hello World'
  }
  res.send(json);
  res.end();
});

module.exports = router;
