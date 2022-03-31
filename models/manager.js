var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var Manager = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    }
});

Manager.plugin(passportLocalMongoose);

module.exports = mongoose.model('Manager', Manager);