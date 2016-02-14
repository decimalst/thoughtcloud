var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: String,
  body: String,
  tags: {type: [String], index: true}
});

module.exports = mongoose.model('Post',postSchema);
