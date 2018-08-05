let mongoose = require('mongoose');

let LendObjectSchema = new mongoose.Schema({
    _name: String,
    _description: String,
    _type: String,
    _rules: String,
    _waitList: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Request'
        }
      ],
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
    _owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }

});

IngredientSchema.pre('remove', function (next) {
    this.model('User').update({}, {
            $pull: {
                sharing: this._id,
                lending: this._id
            },
        }, {
            safe: true,
            multi: true
        },
        next
    );
});

mongoose.model('Lend-Object', LendObjectSchema);
