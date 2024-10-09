const mongoose = require('mongoose');

const userCollectionSchema = new mongoose.Schema({
  "username": String,
  "email": String,
  "password": String,
  "created_at": Date,
  "updated_at": Date
});

module.exports = mongoose.model('User', userCollectionSchema);

