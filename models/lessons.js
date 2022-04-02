var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Lesson = new Schema({
     name: {
         type: String,
         unique: true
     },
     quota: {
         type: Number,
         default: 0
     },
     user: [
         {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'User'
         }
     ]
});


module.exports = mongoose.model('Lesson', Lesson);