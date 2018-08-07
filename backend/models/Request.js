let mongoose = require('mongoose');

let RequestSchema = new mongoose.Schema({
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  object: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LendObject'
    }
  ],
  fromDate: { type: Date },
  toDate: { type: Date},
});

mongoose.model('Request', RecipeSchema);