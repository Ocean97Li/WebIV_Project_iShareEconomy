let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let passport = require('passport');
let LendObject = mongoose.model('LendObject');
let User = mongoose.model('User');
let Request = mongoose.model('Request');
let jwt = require('express-jwt');
let auth = jwt({
  secret: process.env.RECIPE_BACKEND_SECRET
});

router.post('/register', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  }
  let user = new User();
  user.username = req.body.username;
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.address = req.body.address;
  user.mapLocation = req.body.mapLocation;
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

router.post('/login', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  }
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
      console.log(err);
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

router.get('', function (req, res, next) {
  let query = User.find().populate('lending');
  query.exec(function (err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
});

router.get('/requests', function (req, res, next) {
  let query = Request.find().populate('object');
  query.exec(function (err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
});

router.post('/checkusername', function (req, res, next) {
  User.find({
    username: req.body.username
  }, function (err, result) {
    if (result.length) {
      res.json({
        username: 'alreadyexists'
      });
    } else {
      res.json({
        username: 'ok'
      });
    }
  });
});

router.param('user', function (req, res, next, id) {
  let query = User.findById(id).populate('lending', 'using');
  query.exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('not found ' + id));
    }
    req.user = user;
    return next();
  });
});

router.get('/:user', function (req, res, next) {
  req.user.password = undefined;
  req.user.salt = undefined;
  req.user.hash = undefined;
  // req.user.inRequest = undefined;
  req.user.outRequest = undefined;
  console.log(req.user.inRequest)
  res.json(req.user);
});

router.get('/:user/lending', function (req, res, next) {
  res.json(req.user.lending);
});

router.get('/:user/using', function (req, res, next) {
  res.json(req.user.using);
});

router.get('/:user/inRequest', function (req, res, next) {
  console.log('get inrequest');
  Request.find({
    _id: {
      $in: req.user.inRequest
    }
  }).populate('object', ).exec(function (err, requests) {
    if (err) return next(err)
    console.log(requests)
    res.json(requests);
  });
});

router.get('/:user/outRequest', function (req, res, next) {
  console.log('get outrequest');
  Request.find({
    _id: {
      $in: req.user.outRequest
    }
  }).populate('object').exec(function (err, requests) {
    if (err) return next(err)
    console.log(requests)
    res.json(requests);
  });
});


router.post('/:user/lending', function (req, res, next) {
  let obj = new LendObject();
  obj.name = req.body.name;
  obj.description = req.body.description;
  obj.type = req.body.type;
  obj.rules = req.body.rules;
  obj.owner = req.body.owner;
  obj.user = req.body.user;

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

router.delete('/user:/using/:object', function (req, res) {
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
        console.log('requests for object ' + id);
        console.log(req);
        req.approved = false;
      });
      requests.save(
        function (err) {
          if (err) return next(err);
        }
      );
    });
    res.json(req.user.obj);
  });
});


router.delete('/:user/lending/:object', function (req, res) {
  req.user.obj.remove(function (err) {
    if (err) return next(err);
    let id = req.user.obj._id;
    //find all requests for deleted object, set  approved = flase
    Request.find({
      _id: {
        $in: req.user.inRequest
      }
    }).exec(function (err, requests) {
      if (err) return next(err);
      requests.forEach(req => {
        console.log('requests for object ' + id);
        console.log(req);
        req.approved = false;
      })
    });
    res.json(req.user.obj);
  });
});

router.param('object', function (req, res, next, id) {
  let query = LendObject.findById(id);
  query.exec(function (err, obj) {
    if (err) {
      return next(err);
    }
    if (!obj) {
      return next(new Error('not found ' + id));
    }
    req.id = id;
    req.user.obj = obj;
    console.log('param object');
    console.log(req.user.obj);
    return next();
  });
});

router.post('/:user/outRequest', function (req, res, next) {

  //making the request
  console.log('gets here');
  let obj = new Request();
  obj.source = req.body.source;
  obj.object = req.body.object._id;
  obj.fromdate = req.body.fromdate;
  obj.todate = req.body.todate;
  obj.approved = req.body.approved;
  obj.messages = req.body.messages;
  console.log('gets here2');
  obj.save(function (err, obj) {
    if (err) return next(err);
    //add it to the inRequest of the selected user
    User.findOne({
      _id: req.body.object.owner.id
    }).exec(
      function (err, owner) {
        console.log('gets here3');
        if (err) return next(err);
        console.log('gets here4');
        console.log(obj.object);
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

module.exports = router;