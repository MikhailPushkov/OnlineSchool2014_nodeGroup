var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    parentSchema = new Schema({
        "firstName": String,
        "lastName": String,
        "patronymic": String,
        "phone": String,
        "email": String
    }),

    Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
    
     