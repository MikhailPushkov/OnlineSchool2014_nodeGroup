var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    homeworkShema = new Schema({
        "learnerId": String,
        "classId": String,
        "lessonsOfTeacherId": String,
        "theme": String,
        "text": String,
        "createDate": Date,
        "executionDate": Date
    }),

    homework = mongoose.model('Homework', homeworkShema);

module.exports = homework;