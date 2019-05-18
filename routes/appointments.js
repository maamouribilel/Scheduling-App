const express = require('express');
const router = express.Router();

let Appointment = require('../models/appointment');
let Activity = require('../models/activity');
let Parc = require('../models/parc');

let User = require('../models/user');

router.get('/add', ensureAuthenticated, function(req, res) {
  Activity.find({}, function(err, activities) {
    Parc.find({}, function(err, parcs) {
      res.render('add_appointment', {
        title: ' Add Appointment',
        activities: activities,
        parcs: parcs
      });
    });
  });
});

router.post('/add', function(req, res) {
  req.checkBody('day', 'Day is required').notEmpty();
  req.checkBody('time', 'Time is required').notEmpty();
  req.checkBody('parti', 'Number of participants is required').notEmpty();
  req.checkBody('activity', 'Activity is required').notEmpty();
  req.checkBody('place', 'Place is required').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.render('add_appointment', {
      title: 'Add Appointment',
      errors: errors
    });
  } else {
    let appointment = new Appointment();
    appointment.user = req.user._id;
    appointment.state = req.body.state;
    appointment.day = req.body.day;
    appointment.time = req.body.time;
    appointment.parti = req.body.parti;
    appointment.activity = req.body.activity;
    appointment.place = req.body.place;
    Appointment.findOne(
      { day: appointment.day, time: appointment.time },
      function(err, result) {
        if (err) {
          console.log('eroor');
        }
        if (!result) {
          appointment.save(function(err) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Appointment Added');
              res.redirect('/home');
            }
          });
        } else {
          req.flash('info', 'Session already booked try another one!');
          res.redirect('/appointment/add');
        }
      }
    );
  }
});

router.get('/:id', function(req, res) {
  Appointment.findById(req.params.id, function(err, appointment) {
    User.findById(appointment.author, function(err, user) {
      res.render('appointment', {
        appointment: appointment,
        author: user.name
      });
    });
  });
});

router.get('/edit/:id', ensureAuthenticated, function(req, res) {
  Article.findById(req.params.id, function(err, appointment) {
    if (article.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    } else {
      res.render('edit_appointment', {
        title: 'Edit Appointment',
        appointment: appointment
      });
    }
  });
});

router.post('/edit/:id', function(req, res) {
  let appointment = {};

  appointment.date = req.body.title;
  appointment.author = req.body.author;
  appointment.body = req.body.body;

  let query = { _id: req.params.id };

  Appointment.update(query, appointment, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Appointment updated');
      res.redirect('/');
    }
  });
});

router.delete('/:id', ensureAuthenticated, function(req, res) {
  var query = { _id: req.params.id };
  Appointment.findById(req.params.id, function(err, appointment) {
    Appointment.remove(query, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.send('Success');
      }
    });
  });
});

router.put('/:id', ensureAuthenticated, function(req, res) {
  var query = { _id: req.params.id };
  var appointment = {};
  appointment.state = '1';

  Appointment.update(query, appointment, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send('Success');
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

module.exports = router;
