let mongoose = require('mongoose');

let RequestSchema = new mongoose.Schema({
  source: {
    id: String,
    name: String
  },
  object: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LendObject'
  },
  fromdate: {
    type: Date
  },
  todate: {
    type: Date
  },
  approved: Boolean
});

mongoose.model('Request', RequestSchema);