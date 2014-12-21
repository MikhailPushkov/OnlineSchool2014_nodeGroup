var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schedule = new Schema({
        "startTime": String,
        "endTime": String,
        "classId": String,
        "weekDay": Number,
        "room": String,
        "lessonId": String,
        "teacherId":String
    }),
    scheduledb = mongoose.model('Schedule', schedule);
module.exports = scheduledb;