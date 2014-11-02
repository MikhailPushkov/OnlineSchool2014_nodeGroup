var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    teacherSchema = new Schema({
        "firstName": String,
        "lastName": String,
        "patronymic": String
    }),

    teacher = mongoose.model('Teacher', teacherSchema);

module.exports = teacher;    