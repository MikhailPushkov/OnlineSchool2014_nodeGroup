var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schedule = new Schema({
        "startTime": Date,
        "endTime": Date,
        classId: String,
        "weekDay": Number,
        "room": String,
        "lessonsOfTeacherId": String
    }),
    scheduledb = mongoose.model('Schedule', schedule);
module.exports = scheduledb;