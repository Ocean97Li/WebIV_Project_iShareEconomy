var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let LendObject = mongoose.model('LendObject');
module.exports = router;

router.get('/lends', function (req, res) {
  let query = LendObject.find();
  query.exec(function (err, los) {
    if (err) {
      return next(err);
    }
    res.json(los);
  });
});

router.post('/check/request', function (req, res, next) {
  //check if dates are valid
  const today = new Date();
  console.log(today);
  console.log(req.body.fromdate);
  console.log(new Date(req.body.fromdate));
  console.log(req.body.todate);
  console.log(new Date(req.body.todate));
  console.log(new Date(req.body.fromdate) <= new Date(req.body.todate));
  console.log(new Date(req.body.fromdate).setHours(0, 0, 0, 0).valueOf() >= new Date().setHours(0, 0, 0, 0).valueOf());
  if (!(
      new Date(req.body.fromdate) <= new Date(req.body.todate) &&
      new Date(req.body.fromdate).setHours(0, 0, 0, 0).valueOf() >= new Date().setHours(0, 0, 0, 0).valueOf()
    )) {
    return res.json({
      state: 'invalid dates'
    })
  }
  //check if the request does not conflict with current/future users
  LendObject.findOne({
    _id: req.body.object._id
  }).exec(
    function (err, object) {
      if (object.waitinglist) {
        if (object.waitinglist.length > 0) {
          object.waitinglist.forEach(usage => {
            if (!(usage.todate < req.body.fromdate && !(req.body.todate < usage.fromdate))) {
              return res.json({
                state: 'request conflict'
              })
            }
          });
        }
      }
    });
  res.json({
    state: 'ok'
  });
});