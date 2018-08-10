let mongoose = require('mongoose');

let LendObjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    type: String,
    rules: String,
    owner: {id: String,name: String},
    user: {id: String,name: String},
    
});
mongoose.model('LendObject', LendObjectSchema);
