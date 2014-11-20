var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    lessonsOfTeacherShema = new Schema({
        "teacherId": String,
        "lessonId": String
    }),

    lessonsOfTeacher = mongoose.model('LessonsOfTeacher', lessonsOfTeacherShema);

module.exports = lessonsOfTeacher;