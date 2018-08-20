let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

let passport = require("passport");
let LendObject = mongoose.model("LendObject");
let User = mongoose.model("User");
let Request = mongoose.model("Request");
let jwt = require("express-jwt");
let auth = jwt({
  secret: process.env.BACKEND_SECRET
});

//login and regsiter
router.post("/register", function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: "Please fill out all fields"
    });
  }
  let user = new User();
  user.username = req.body.username;
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.address = req.body.address;
  user.mapLocation = req.body.mapLocation;
  user.rating = 5;
  user.setPassword(req.body.password);
  user.save(function (err) {
    if (err) {
      return next(err);
    }
    return res.json({
      token: user.generateJWT()
    });
  });
});

router.post("/login", function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: "Please fill out all fields"
    });
  }
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.json({
        token: user.generateJWT()
      });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post("/checkusername", function (req, res, next) {
  User.find({
      username: req.body.username
    },
    function (err, result) {
      if (result.length) {
        res.json({
          username: "alreadyexists"
        });
      } else {
        res.json({
          username: "ok"
        });
      }
    }
  );
});

//params
router.param("user", function (req, res, next, id) {
  let query = User.findById(id).populate("lending").populate("using");
  query.exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("user not found " + id));
    }
    req.user = user;
    req.lending = user.lending;
    req.using = user.using;
    return next();
  });
});

router.param("object", function (req, res, next, id) {
  let query = LendObject.findById(id);
  query.exec(function (err, obj) {
    if (err) {
      return next(err);
    }
    if (!obj) {
      return next(new Error("object not found " + id));
    }
    req.id = id;
    req.user.obj = obj;
    return next();
  });
});

router.param("request", function (req, res, next, id) {
  let query = Request.findById(id).populate("object");
  query.exec(function (err, obj) {
    if (err) {
      return next(err);
    }
    if (!obj) {
      return next(new Error("request not found " + id));
    }
    req.id = id;
    req.user.request = obj;
    return next();
  });
});

//users
router.get("/:user/users", function (req, res, next) {
  const lat2 = req.user.mapLocation.lat;
  const lng2 = req.user.mapLocation.lng;
  const rating = req.user.rating;
  let query = User.find().populate("lending").populate("using");
  query.exec(function (err, users) {
    if (err) {
      return next(err);
    }
    //decide how much users to load based on rating
    let numberOfusers = 50;
    switch (rating) {
      case 0:
        numberOfusers = 4;
        break;
      case 1:
        numberOfusers = 6;
        break;
      case 2:
        numberOfusers = 8;
        break;
      case 3:
        numberOfusers = 10;
        break;
      case 4:
        numberOfusers = 20;
        break;
      case 5:
        numberOfusers = 20;
        break;
      case 6:
        numberOfusers = 30;
        break;
      case 7:
        numberOfusers = 30;
        break;
      case 8:
        numberOfusers = 40;
        break;
      case 9:
        numberOfusers = 40;
        break;
      case 10:
        numberOfusers = 50;
        break;
    }
    users = users.slice(0, numberOfusers >= users.length ? users.length : numberOfusers);
    //calculate distance for every loaded user
    for (let i = 0; i < users.length; i++) {
      users[i].distance = calcDistanceBetween(users[i].mapLocation.lat, users[i].mapLocation.lng, lat2, lng2);
    }
    users = users.sort(
      (user1, user2) => {
        if (user1.distance < user2.distance) {
          return -1;
        }
        if (user1.distance > user2.distance) {
          return 1;
        }
        // equal
        return 0;
      }
    );
    res.json(users);
  });
}, auth);

//user specific
router.get("/:user", auth, function (req, res, next) {
  req.user.using = req.using;
  req.user.lending = req.lending;
  req.user.password = undefined;
  req.user.salt = undefined;
  req.user.hash = undefined;
  req.user.inRequest = undefined;
  req.user.outRequest = undefined;
  res.json(req.user);
}, auth);

//lending objects
router.get("/:user/lending", function (req, res, next) {

  res.json(req.user.lending);
}, auth);

router.post("/:user/lending", function (req, res, next) {
  let obj = new LendObject();
  obj.name = req.body.name;
  obj.description = req.body.description;
  obj.type = req.body.type;
  obj.rules = req.body.rules;
  obj.owner = req.body.owner;
  obj.user = undefined;

  if (req.body.waitinglist) {
    obj.waitinglist = req.body.waitinglist;
  }

  obj.save(function (err, obj) {
    if (err) return next(err);
    req.user.lending.push(obj);
    req.user.save(function (err, user) {
      if (err) return next(err);
      res.json(obj);
    });
  });
}, auth);

router.get("/:user/using",  function (req, res, next) {
  res.json(req.user.using);
}, auth);

// router.delete("/:user/using/:object",function (req, res) {
//   console.log('the params');
//   console.log(req.user.obj);
//   console.log(req.user);
//   req.user.obj.remove(function (err) {
//     if (err) return next(err);
//     let id = req.user.obj._id;
//     //find all requests for deleted object, set  approved = flase
//     Request.find({
//       object: {
//         $in: req.user.inRequest
//       }
//     }).exec(function (err, requests) {
//       if (err) return next(err);
//       requests.forEach(req => {
//         req.approved = false;
//         req.save(function (err) {
//           if (err) return next(err);
//         });
//       });
//     });
//     res.json(req.user.obj);
//   });
// });

router.post("/:user/using/:object/return", function (req, res, next) {
  // object removed from user
  req.user.using = req.user.using.filter(obj => obj === req.user.obj._id);
  req.user.obj.user = undefined;
  // object waitinglist evaluation
  console.log(req.user.obj.waitinglist.length);
  usage = req.user.obj.waitinglist.shift();
  console.log(req.user.obj.waitinglist.length);
  console.log(usage);
  let newcurrentuser;
  if (usage) {
    req.user.obj.user = usage;
    User.findById(usage.id).exec(function (err, user) {
      if (err) next(err);
      console.log('hello');
      console.log(user);
      newcurrentuser = user;
      newcurrentuser.using.push(req.user.obj);
    });
  }
  //save it all
  req.user.obj.save(function (err) {
    if (err) next(err);
      req.user.save(function (err) {
        if (err) next(err);
        if(newcurrentuser){
        newcurrentuser.save(function(err){
          if (err) next(err);
        res.json(req.user.obj);
      });
      }
    })
  });
}, auth);

router.delete("/:user/lending/:object", function (req, res) {
  req.user.obj.remove(function (err) {
    if (err) return next(err);
    let id = req.user.obj._id;
    //find all requests for deleted object, delete requests
    Request.remove({
      _id: {
        $in: req.user.inRequest
      }
    }).exec(function (err, requests) {
      if (err) return next(err);
      //lower rating based on waitinglist length
      if (req.user.obj.waitinglist.length === 0 && req.user.obj.user.id) {
        req.user.rating = req.user.rating - 1;
      }

      switch (req.user.obj.waitinglist.length) {
        case 0:
          break;
        case 1:
        case 2:
          {
            req.user.rating = req.user.rating - 3;
            break;
          }
        case 3:
        case 4:
        case 5:
          {
            req.user.rating = req.user.rating - 4;
            break;
          }
        case 6:
        case 7:
        case 8:
          {
            req.user.rating = req.user.rating - 5;
            break;
          }
        case 9:
        case 10:
        case 11:
          {
            req.user.rating = req.user.rating - 6;
            break;
          }
        default:
          {
            req.user.rating = req.user.rating - 8;
            break;
          }
      }
      if (req.user.rating < 0) {
        req.user.rating = 0;
      }
      req.user.save(function (err) {
        if (err) next(err);
      });
    });
  });
  res.json(req.user.obj);
}, auth);

router.get("/:user/inRequest", function (req, res, next) {
  Request.find({
      _id: {
        $in: req.user.inRequest
      }
    })
    .populate("object")
    .exec(function (err, requests) {
      if (err) return next(err);
      res.json(requests);
    });
}, auth);

router.get("/:user/outRequest", function (req, res, next) {
  Request.find({
      _id: {
        $in: req.user.outRequest
      }
    })
    .populate("object")
    .exec(function (err, requests) {
      if (err) return next(err);
      res.json(requests);
    });
}, auth);

router.delete("/remove-request", function (req, res, next) {
  Request.remove(function (err) {
    res.json();
  });
  User.find().exec(function (err, users) {
    for (let i = 0; i < users.length; i++) {
      users[i].inRequest = [];
      users[i].outRequest = [];
      users[i].save();
    }
  });
}, auth);

router.post("/:user/outRequest", function (req, res, next) {
  //making the request
  let obj = new Request();
  obj.source = req.body.source;
  obj.object = req.body.object._id;
  obj.fromdate = req.body.fromdate;
  obj.todate = req.body.todate;
  obj.approved = req.body.approved;
  obj.messages = req.body.messages;
    //add it to outRequest of the logged in user
    req.user.outRequest.push(obj);
  //add it to the inRequest of the selected user
  let ownerglob;
  User.findOne({
    _id: req.body.object.owner.id
  }).exec(function (err, owner) {
    if (err) return next(err);
    ownerglob = owner
    owner.inRequest.push(obj);
  });
    //save it-all
    obj.save(function (err, obj) {
      if (err) return next(err);
      console.log('ownerglob');
      ownerglob.save(function (err, user) {
        if (err) return next(err);
      });
      req.user.save(function (err, user) {
        if (err) return next(err);
        req.body._id = obj;
        res.json(req.body);
      });
    });
}, auth);

router.post("/:user/inRequest/:request/deny", function (req, res, next) {
  //check if the request isn't already approved/denied
  if (req.user.request.approved !== undefined) {
    return next(new Error("Request already " + (req.user.request.approve ? "approved" : "denied")));
  }
  //deny the request
  req.user.request.approved = false;
  req.user.request.save(function (err, request) {
    if (err) return next();
    res.json(request);
  });
}, auth);

router.post("/:user/inRequest/:request/approve", function (req, res, next) {
  //check if the request isn't already approved/denied
  if (req.user.request.approved !== undefined) {
    return next(new Error("Request already " + (req.user.request.approve ? "approved" : "denied")));
  }
  
  console.log(req.user.request.source);
  User.findById(req.user.request.source.id).exec(function (err, user1) {
    if (err) return next();
    const request = req.user.request;
    const object = req.user.request.object;
    const user = user1;
    const owner = req.user;

    //set user / waitinglist of object
    if (object.user.id && new Date(request.fromdate).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
      //check for possiblity that current user of object needs to be changed
      if (new Date(object.user.fromdate).setHours(0, 0, 0, 0) > new Date(request.fromdate).setHours(0, 0, 0, 0)) {
        object.waitinglist = object.waitinglist.sort((w1,w2) => dateSort(w1,w2));
        let usage = object.user;
        object.waitinglist.unshift(usage);
        object.user = {
          id: user._id,
          name: `${user.firstname} ${user.lastname}`,
          fromdate: request.fromdate,
          todate: request.todate
        };
        //find previous user and remove object from using
        User.findById(usage.id).exec(function (err, prevcuruser) {
          let res = prevcuruser.using.splice(prevcuruser.using.findIndex(lo => lo === object.id), 1);
          // current user and add using
          user1.lending.push(res);
        });

      } else {
        object.waitinglist.push({
          id: user._id,
          name: `${user.firstname} ${user.lastname}`,
          fromdate: request.fromdate,
          todate: request.todate
        });
        object.waitinglist = object.waitinglist.sort((w1,w2) => dateSort(w1,w2));
      }
    } else {
      object.user = {
        id: user._id,
        name: `${user.firstname} ${user.lastname}`,
        fromdate: request.fromdate,
        todate: request.todate
      };
      user1.using.push(object);
    }
    //update the owner's rating
    if (owner.rating < 10) {
      owner.rating = owner.rating + 1
    }
    //deny any other conflicting requests
    for (let i = 0; i < owner.inRequest.length; i++) {
      Request.findById(owner.inRequest[i]).exec(function (err, currentrequest) {
        if (err) console.log(err);
        if (currentrequest !== null) {
          if (currentrequest._id.toString() !== request._id.toString() && currentrequest.approved === undefined && isConflictingRequest(currentrequest, request)) {
            currentrequest.approved = false;
            currentrequest.save(function (err, request) {
              if (err) return next();
            });
          }
        }
      });
    }
    request.approved = true;
    //save the whole shebang
    object.save(function (err, object) {
      if (err) return next();
      //approved true
      request.approved = true;
      request.save(function (err, request) {
        if (err) return next();
        user.save(function (err, user) {
          if (err) return next();
          owner.save(function (err, user) {
            if (err) return next();
          });
          return res.json(request);
        });
      });
    });
  });
},auth);

router.delete("/:user/inRequest/:request", function (req, res, next) {
  //check if the request is approved/denied
  if (req.user.request.approved === undefined) {
    return next(new Error("Request not yet approved/denied"));
  }
  req.user.request.remove(function (err) {
    if (err) return next(err);
    req.user.inRequest = req.user.inRequest.filter(r => r._id !== req.user.request._id)
    req.user.save(function (err, user) {
      if (err) return next(err);
    });
    res.json(req.user.request);
  });
}, auth);

router.delete("/:user/outRequest/:request", function (req, res, next) {
  //check if the request is approved/denied
  if (req.user.request.approved === true) {
    return next(new Error("Request is approved"));
  }
  req.user.request.remove(function (err, request) {
    if (err) return next(err);
    req.user.outRequest = req.user.outRequest.filter(r => r._id !== request._id)
    req.user.save(function (err, user) {
      if (err) return next(err);
    });
    res.json(req.user.request);
  });
}, auth);

function calcDistanceBetween(lat1, lon1, lat2, lon2) {
  // from https://stackoverflow.com/questions/5260423/torad-javascript-function-throwing-error
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function toRad(Value) {
  /** Converts numeric degrees to radians */
  return Value * Math.PI / 180;
}

function isConflictingRequest(request, checkwith) {
  //checks for overlaps
  return (request.fromdate <= checkwith.todate) && (request.todate >= checkwith.fromdate)
}

function dateSort(a, b) {
  if (a.fromdate < b.fromdate) {
    return -1;
  }
  if (a.fromdate > b.fromdate) {
    return 1;
  }
  if (a.fromdate < b.fromdate) {
    return 0;
  }
}

module.exports = router;