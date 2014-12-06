var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    lessons = new Schema({
        "teacherId": String,
        "lesson": String
    }),

    lessons = mongoose.model('Lessons', lessons);

module.exports = lessons;