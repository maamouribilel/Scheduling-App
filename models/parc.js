let mongoose = require('mongoose');

//activity schema
let parcSchema = mongoose.Schema({

  name :{
    type: String,
    required: true
  }
});

let Parc = module.exports = mongoose.model('Parc', parcSchema);
