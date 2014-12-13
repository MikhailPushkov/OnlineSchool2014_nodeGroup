var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    classesSchema = new Schema({
        "nameClass": String,
        "teacherID": String
    }),
    classes = mongoose.model('Classes', classesSchema);

module.exports =classes;
