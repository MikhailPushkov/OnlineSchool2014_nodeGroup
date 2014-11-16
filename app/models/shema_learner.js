var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    learnerSchema = new Schema({
        "firstName": String,
        "lastName": String,
        "patronymic": String,
        "parents": Array,
        "class": String,
        "adress": String
    }),

    Learner = mongoose.model('Learner', learnerSchema);

module.exports = Learner;