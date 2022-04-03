var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    schoolID: {
        type    : mongoose.Schema.Types.ObjectId,
        default : mongoose.Types.ObjectId,
        index   : {
             unique: true
             }
    },
    manager: {
      type: Boolean,
      default: false

    },
    lessons: [
      {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Lesson'
    }
  ]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);