var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: String,
  body: String,
  tags: {}
});

module.exports = mongoose.model('Post',postSchema);
