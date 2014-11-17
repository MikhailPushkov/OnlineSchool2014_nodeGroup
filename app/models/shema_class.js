var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    classSchema = new Schema({
        "name": String,
        "teacher": String
    }),
    clazz = mongoose.model('Class', classSchema);

module.exports = clazz;
