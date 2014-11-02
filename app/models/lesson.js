var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    lessonShema = new Schema({
        'name': String
    }),
    lesson = mongoose.model('Lesson', lessonShema);
module.exports = lesson;
