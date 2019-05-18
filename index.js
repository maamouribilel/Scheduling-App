const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

var mongoose = require('mongoose');
mongoose.connect(config.database, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.once('open', function() {
  console.log('Connected to MongoDB');
});
db.on('error', function(err) {
  console.log(err);
});

const app = express();
let Appointment = require('./models/appointment');
let Activity = require('./models/activity');
let User = require('./models/user');
let Parc = require('./models/parc');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
);
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Appointments'
  });
});

app.get('/home', ensureAuthenticated, function(req, res) {
  Appointment.find({ user: req.user._id }, function(err, appointments) {
    if (err) {
      console.log(err);
    } else {
      res.render('home', {
        title: 'Appointments',
        appointments: appointments
      });
    }
  }).sort({ day: 1 });
});

app.get('/home_coach', ensureAuthenticated, function(req, res) {
  Appointment.find({ state: 1 }, function(err, appointments) {
    Appointment.find({ state: 0 }, function(err, rvs) {
      if (err) {
        console.log(err);
      } else {
        console.log(appointments);
        res.render('home_coach', {
          title: 'Appointments',
          appointments: appointments,
          rvs: rvs,
          calendarlink: true
        });
      }
    });
  }).sort({ day: 1 });
});
app.get('/api/events', ensureAuthenticated, function(req, res) {
  Appointment.find({ state: 1 }, function(err, appointments) {
    if (err) {
      console.log(err);
    } else {
      var events = [];
      appointments.forEach(function(appointment) {
        events.push({
          title: appointment.activity,
          start: appointment.day
        });
      });

      res.json(events);
    }
  });
});

let appointments = require('./routes/appointments');
let users = require('./routes/users');
let activities = require('./routes/activities');
let parcs = require('./routes/parcs');
app.use('/appointment', appointments);
app.use('/users', users);
app.use('/activities', activities);
app.use('/parcs', parcs);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server started on port ' + port);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

(function delete_old() {
  Appointment.remove({ $where: 'this.day < new Date()' }, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log('done!');
    }
  });
})();
