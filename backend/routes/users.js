let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let passport = require('passport');
let LendObject = mongoose.model('LendObject');
let User = mongoose.model('User');
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
    console.log('param user');
    console.log(req.user);
    return next();
  });
});

router.get('/:user', function (req, res, next) {
  res.json(req.user);
});


router.get('/:user/lending', function (req, res, next) {
  res.json(req.user.lending);
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

router.delete('/:user/lending/:object', function (req, res) {
  req.user.obj.remove(function (err) {
    if (err) return next(err);
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
module.exports = router;