var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let LendObject = mongoose.model('LendObject');
module.exports = router;

router.get('/lends',function(req, res) {
    let query = LendObject.find();
    query.exec(function(err, los) {
      if (err) {
        return next(err);
      }
      res.json(los);
    });
  });