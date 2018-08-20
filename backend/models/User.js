let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
  //login
  username: {
    type: String,
    lowercase: true,
    unique: true
  },
  hash: String,
  salt: String,
  //user data
  rating: Number,
  lending: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LendObject'
    }
  ],
  using: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LendObject'
    }
  ],
  firstname: String,
  lastname: String,
  address: String,
  distance: Number,
  mapLocation:  { lat: Number, lng: Number },
  inRequest: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }],
  outRequest: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }]
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(32).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
    .toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  return jwt.sign(
    {
      user: {
      _id: this._id,
      username: this.username,
    },
      exp: parseInt(exp.getTime() / 1000)
    },
    process.env.BACKEND_SECRET
  );
};

mongoose.model('User', UserSchema);
