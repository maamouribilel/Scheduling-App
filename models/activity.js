let mongoose = require('mongoose');

//activity schema
let activitySchema = mongoose.Schema({

  name :{
    type: String,
    required: true
  },
  price :{
    type: Number,
    required: true
  }
});

let Activity = module.exports = mongoose.model('Activity', activitySchema);
