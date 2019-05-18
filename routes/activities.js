const express = require('express');
const router = express.Router();

let Activity = require('../models/activity');
let Parc = require('../models/parc');
let User = require('../models/user');

router.get('/add', ensureAuthenticated, function(req, res) {
  Activity.find({}, function(err, activities) {
    res.render('add_activity', {
      title: ' Manage content',
      activities: activities
    });
  });
});

router.post('/add', function(req, res) {
  req.checkBody('name', 'Name of activity is required').notEmpty();
  req.checkBody('price', 'Price is required').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('add_activity', {
      title: 'Add Activity',
      errors: errors
    });
  } else {
    let activity = new Activity();
    activity.name = req.body.name;
    activity.price = req.body.price;

    Activity.findOne({ name: activity.name }, function(err, result) {
      if (err) {
        console.log('eroor');
      }
      if (!result) {
        activity.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'Activity Added');
            res.redirect('/activities/add');
          }
        });
      } else {
        req.flash('info', 'This activity already exist!');
        res.redirect('/activities/add');
      }
    });
  }
});

router.get('/:id', function(req, res) {
  Activity.findById(req.params.id, function(err, activity) {
    User.findById(appointment.author, function(err, user) {
      res.render('appointment', {
        activity: activity,
        author: user.name
      });
    });
  });
});

router.post('/edit/:id', function(req, res) {
  let activity = {};

  activity.name = req.body.name1;
  activity.price = req.body.price1;

  let query = { _id: req.params.id };

  Activity.update(query, activity, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Activity updated');
      res.redirect('/activities/add');
    }
  });
});

router.delete('/:id', ensureAuthenticated, function(req, res) {
  var query = { _id: req.params.id };
  Activity.findById(req.params.id, function(err, activity) {
    Activity.remove(query, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.send('Success');
      }
    });
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
