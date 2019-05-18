let mongoose = require('mongoose');

//article schema
let appointmentSchema = mongoose.Schema({
  user :{
    type: String,
    required: true
  },
  day :{
    type: Date,
    required: true
  },
  time :{
    type: Number,
    required: true
  },
  parti :{
    type: Number,
    required: true
  },
  activity:{
    type: String,
    required: true
  },
  place:{
    type: String,
    required: true
  },
  state:{
    type: Number,
    required: true
  }
});

let Appointment = module.exports = mongoose.model('Appointment', appointmentSchema);
