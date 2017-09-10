var express = require('express')
var app = express()
var passport = require('passport')
var session = require('express-session')
var flash = require('connect-flash')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars')
var path = require('path')
var cookieParser = require('cookie-parser')
var LocalStrategy = require('passport-local').Strategy;

var PORT = process.env.PORT || 3000


var users = require('./app/routes/auth');

    //For BodyParser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());


     // For Passport
    app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized:true})
    ); // session secret

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

//views


// const hbs = exphbs.create({
//     extname      :'hbs',
//     layoutsDir   : 'path/to/layout/directory',
//     defaultLayout: 'main',
//     helpers      : 'path/to/helpers/directory',
//     partialsDir  : [
//         path/to/partials/directory
//     ]
// });


// var hbs = exphbs.create({
//         extname: '.hbs',
//         layoutsDir:'app/views/layouts',
//         defaultLayout: 'layout', 
//         partialsDir:'app/views'
// });

// app.set('view engine', '.hbs');

    app.set('views', path.join(__dirname, 'views'));
    app.engine('handlebars', exphbs({defaultLayout:'layout'}));
    app.set('view engine', 'handlebars');

    app.use(express.static(path.join(__dirname, 'public')));

  //Models
    var models = require("./app/models");

    app.use(expressValidator());

    // Connect Flash
    app.use(flash());

    // Global Vars
    app.use(function (req, res, next) {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;
      next();
    });


    //Routes
    var authRoute = require('./app/routes/auth.js')(app,passport);
    // app.use('/api', apiRoutes);
    //load passport strategies
    require('./app/config/passport/passport.js')(passport,models.user);

    var apiRoutes = require('./app/routes/api-routes.js');

    // app.use('/auth', users);
    app.use('/api', apiRoutes);

    //Sync Database
   	models.sequelize.sync().then(function(){
    console.log('Nice! Database looks fine')

    }).catch(function(err){
    console.log(err,"Something went wrong with the Database Update!")
    });



	app.listen(PORT, function(err){
      if(!err)
      console.log("Site is live at port 3000"); else console.log(err)
  });
