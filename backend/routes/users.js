let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

let passport = require("passport");
let LendObject = mongoose.model("LendObject");
let User = mongoose.model("User");
let Request = mongoose.model("Request");
let jwt = require("express-jwt");
let auth = jwt({
  secret: process.env.RECIPE_BACKEND_SECRET
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
  let query = User.findById(id).populate("lending", "using");
  query.exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("not found " + id));
    }
    req.user = user;
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
      return next(new Error("not found " + id));
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
      return next(new Error("not found " + id));
    }
    req.id = id;
    req.user.request = obj;
    return next();
  });
});

//users
router.get("/:user/users",function (req, res, next) {
  const lat2 = req.user.mapLocation.lat;
  const lng2 = req.user.mapLocation.lng;
  const rating = req.user.rating;
  let query = User.find().populate("lending").populate("using");
  query.exec(function (err, users) {
    if (err) {
      return next(err);
    }
    users = users.sort(
      (user1, user2) => {
        const dist1 = calcDistanceBetween(user1.mapLocation.lat, user1.mapLocation.lng, lat2, lng2);
        const dist2 = calcDistanceBetween(user2.mapLocation.lat, user2.mapLocation.lng, lat2, lng2);
        if (dist1 < dist2) {
          return -1;
        }
        if (dist1 > dist2) {
          return 1;
        }
        // equal
        return 0;
      }
    );
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
    res.json(users);
  });
});

//requests
router.get("/requests", function (req, res, next) {
  let query = Request.find().populate("object");
  query.exec(function (err, requests) {
    if (err) {
      return next(err);
    }
    res.json(requests);
  });
});

//user specific
router.get("/:user", function (req, res, next) {
  req.user.password = undefined;
  req.user.salt = undefined;
  req.user.hash = undefined;
  req.user.inRequest = undefined;
  req.user.outRequest = undefined;
  res.json(req.user);
});

//lending objects
router.get("/:user/lending", function (req, res, next) {
  res.json(req.user.lending);
});

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
});

router.get("/:user/using", auth, function (req, res, next) {
  res.json(req.user.using);
});

router.delete("/:user/using/:object", function (req, res) {
  req.user.obj.remove(function (err) {
    if (err) return next(err);
    let id = req.user.obj._id;
    //find all requests for deleted object, set  approved = flase
    Request.find({
      object: {
        $in: req.user.inRequest
      }
    }).exec(function (err, requests) {
      if (err) return next(err);
      requests.forEach(req => {
        req.approved = false;
      });
      requests.save(function (err) {
        if (err) return next(err);
      });
    });
    res.json(req.user.obj);
  });
});

router.post("/:user/using/:object/return", function (req, res, next) {
  // object removed from user
  req.user.obj.user = undefined;
  let objs = [];
  req.user.using.forEach(objId => {
    if (objId.toString() !== req.user.obj._id.toString()) {
      objs.push(objId);
    }
  });
  req.user.using = objs;
  
  // object waitinglist evaluation
  usage = req.user.obj.waitinglist.shift()

  //find corresponding request
  // Request.find().exec(function(err,requests){
  //   requests.find(r => r.)
  // });

  if (usage) {
    req.user.obj.user = usage;
    User.findById(req.user.obj.user.id).exec(function(err,user){
      if(err) next(err);
      user.using.push(req.user.obj);
    });
  }
  //save it all
  req.user.obj.save(function (err) {
    if (err) next(err);
    req.user.save(function (err) {
      if (err) next(err);
      res.json(req.user.obj);
    });
  });
});

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
            req.user.rating = req.user.rating - 1;
            break;
          }
        case 3:
        case 4:
        case 5:
          {
            req.user.rating = req.user.rating - 2;
            break;
          }
        case 6:
        case 7:
        case 8:
          {
            req.user.rating = req.user.rating - 3;
            break;
          }
        case 9:
        case 10:
        case 11:
          {
            req.user.rating = req.user.rating - 4;
            break;
          }
        default:
          {
            req.user.rating = req.user.rating - 5;
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
});

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
});

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
});

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
});

router.post("/:user/outRequest", function (req, res, next) {
  //making the request
  let obj = new Request();
  obj.source = req.body.source;
  obj.object = req.body.object._id;
  obj.fromdate = req.body.fromdate;
  obj.todate = req.body.todate;
  obj.approved = req.body.approved;
  obj.messages = req.body.messages;
  obj.save(function (err, obj) {
    if (err) return next(err);
    //add it to the inRequest of the selected user
    User.findOne({
      _id: req.body.object.owner.id
    }).exec(function (err, owner) {
      if (err) return next(err);
      owner.inRequest.push(obj);
      owner.save(function (err, user) {
        if (err) return next(err);
      });
    });
    //add it to outRequest of the logged in user
    req.user.outRequest.push(obj);
    req.user.save(function (err4, user) {
      if (err4) return next(err4);
    });
  });
  req.body._id = obj;
  res.json(req.body);
});

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
});

router.post("/:user/inRequest/:request/approve", function (req, res, next) {
  //check if the request isn't already approved/denied
  if (req.user.request.approved !== undefined) {
    return next(new Error("Request already " + (req.user.request.approve ? "approved" : "denied")));
  }
  User.findById(req.user.request.source.id).exec(function (err, user1) {
    if (err) return next();
    const request = req.user.request;
    const object = req.user.request.object;
    const user = user1;
    const owner = req.user;
    //approved true
    request.approved = true;
    //set user / waitinglist of object
    if (object.user.id && new Date(req.user.request.fromdate).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
      object.waitinglist.push({
        id: user._id,
        name: `${user.firstname} ${user.lastname}`,
        fromdate: request.fromdate,
        todate: request.todate
      });
    } else {
      object.user = {
        id: user._id,
        name: `${user.firstname} ${user.lastname}`,
        fromdate: request.fromdate,
        todate: request.todate
      };
      user.using.push(object);
    }
    //update the owner's rating
    if (owner.rating < 10) {
      owner.rating = owner.rating + 1
    }
    //save the whole shebang
    object.save(function (err, object) {
      if (err) return next();
      request.save(function (err, request) {
        if (err) return next();
        user.save(function (err, user) {
          if (err) return next();
          owner.save(function (err, user) {
            if (err) return next();
          });
          res.json(request);
        });
      });
    });
  });
});

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
});

router.delete("/:user/outRequest/:request", function (req, res, next) {
  //check if the request is approved/denied
  if (req.user.request.approved === true) {
    return next(new Error("Request is approved"));
  }
  req.user.request.remove(function (err) {
    if (err) return next(err);
    req.user.outRequest = req.user.outRequest.filter(r => r._id !== req.user.request._id)
    req.user.save(function (err, user) {
      if (err) return next(err);
    });
    res.json(req.user.request);
  });
});

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

module.exports = router;