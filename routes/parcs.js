const express = require('express');
const router = express.Router();

let Parc = require('../models/parc');
let User = require('../models/user');

router.get('/add', ensureAuthenticated, function(req, res) {
  Parc.find({}, function(err, parcs) {
    res.render('add_parc', {
      title: ' Manage content',
      parcs: parcs
    });
  });
});

router.post('/add', function(req, res) {
  req.checkBody('name', 'Name of parc is required').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('add_parc', {
      title: 'Add Parc',
      errors: errors
    });
  } else {
    let parc = new Parc();
    parc.name = req.body.name;

    Parc.findOne({ name: parc.name }, function(err, result) {
      if (err) {
        console.log('eroor');
      }
      if (!result) {
        parc.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'Parc Added');
            res.redirect('/parcs/add');
          }
        });
      } else {
        req.flash('info', 'This parc already exist!');
        res.redirect('/parcs/add');
      }
    });
  }
});

router.post('/edit/:id', ensureAuthenticated, function(req, res) {
  let parc = {};
  parc.name = req.body.name1;
  let query = { _id: req.params.id };

  Parc.update(query, parc, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Parc updated');
      res.redirect('/parcs/add');
    }
  });
});

router.delete('/:id', ensureAuthenticated, function(req, res) {
  var query = { _id: req.params.id };
  Parc.findById(req.params.id, function(err, parc) {
    Parc.remove(query, function(err) {
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
