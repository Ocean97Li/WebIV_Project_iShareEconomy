var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let LendObject = mongoose.model('LendObject');
module.exports = router;

router.post('/check/request', function (req, res, next) {
  //fix the date 
  req.body.fromdate = new Date(req.body.fromdate);
  req.body.todate = new Date(req.body.todate);
  //check if dates are valid
  if (isOutdatedRequest(req.body.fromdate)||isDeformedRequest(req.body.fromdate,req.body.todate)) {
    return res.json({
      state: 'invalid dates'
    })
  } else {
    //check if the request does not conflict with current/future users
    let resobject = {
      state: 'ok'
    };
    LendObject.findOne({
      _id: req.body.object._id
    }).exec(
      function (err, object) {
        if (object.waitinglist || object.user) {
          if (object.user) {
            if (isConflictingRequest(object.user,req.body)){
              resobject.state = 'request conflict';
            }
          }
          if (object.waitinglist.length > 0) {
            object.waitinglist.forEach(
              usage => {
              if (isConflictingRequest({fromdate: req.body.fromdate,todate: req.body.todate},usage)) {
                resobject.state = 'request conflict';
              }
            });
          }

        } 
        return res.json(resobject);
      });
  }
});

function isOutdatedRequest(fromdate) {
  //request that is for a date already passed
  return fromdate <= new Date().setTime(0,0,0,0);
}
function isDeformedRequest(fromdate,todate){
  //request that is for a date already passed
  return !(fromdate <= todate);
}
function isConflictingRequest(request,checkwith){
  //checks for overlaps
  return (request.fromdate  <= checkwith.todate )  &&  (request.todate  >= checkwith.fromdate)
}