var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    journalSchema = new Schema({
        date: Date,
        item: String,
        learnerId: String,
        lessonsOfTeacherId: String
    }),

    Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;