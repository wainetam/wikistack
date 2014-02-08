
/**
 * Module dependencies.
 */
var passport = require('passport');

// local strategy for Passport
var LocalStrategy = require('passport-local').Strategy;

var express = require('express');
var swig = require('swig'); // added to access Swig
require('./filters')(swig);

var routes = require('./routes');
var user = require('./routes/user');
var add = require('./routes/add');
var edit = require('./routes/edit');
var http = require('http');
var path = require('path');

var models = require("./models"); // DO WE NEED THIS FOR PASSPORT?

var app = express();
// tells Express to use swig's renderFile function to render html files
app.engine('html', swig.renderFile);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// use html documents for its views
// when we were using EJS, view engine was 'ejs'
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize()); // installs middleware
app.use(passport.session()); // installs middleware express-> passport->app

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// passport module
// app.configure(function() {
  // app.use(express.static('public'));
  // app.use(express.cookieParser());
  // app.use(express.bodyParser());
  // app.use(express.session({ secret: 'keyboard cat' }));

  // app.use(passport.session());
  // app.use(app.router);
// });

// passport.username(new LocalStrategy(models.User.authenticate()));

passport.serializeUser(function(user, done) {
  console.log('in serializer');
  done(null, user.id);
  // console.log('user', user);
  // console.log('user_id', user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    models.User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  swig.setDefaults({ cache: false });
}

app.get('/', routes.index);
//'routes here is an obj, not the directory; the directory is in require'
app.get('/page/new', add.form); // page/new
app.get('/wiki/:id/:url_name', routes.show);
app.get('/wiki/:id', routes.show);

app.get('/edit/:id', edit.show);
app.post('/page', add.submit); // page
app.post('/edit_submit/:id', passport.authenticate('local'), edit.submit);
app.get('/users', user.list);
app.get('/delete/:id', edit.delete);
app.get('/login', user.login);
app.get('/logout', user.logout);
// if passport.authenticate returns true, goes to user.auth
app.post('/login', passport.authenticate('local'), user.auth);
// but how to set a sad path?


// app.post('/login', passport.authenticate('local'), { successRedirect: '/',
//                                    failureRedirect: '/login',
//                                    failureFlash: true });

app.post('/user/new', user.new);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
