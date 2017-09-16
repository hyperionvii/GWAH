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


    app.set('views', path.join(__dirname, 'views'));
    app.engine('handlebars', exphbs({defaultLayout:'layout'}));
    app.set('view engine', 'handlebars');

    app.use(express.static(path.join(__dirname, 'public')));

  //Models
    var models = require("./app/models");
    console.log(models.blackCard)
    // var modelBlackCard = require("./app/models")

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
      var cardModelWhite = models.sequelize.import(path.join(__dirname, 'app/models/white-card'));
      var cardModel = models.sequelize.import(path.join(__dirname, 'app/models/black-card'));
      WhiteCard = cardModelWhite;
      BlackCard = cardModel;

      // WhiteCard.destroy({where:{}});
      // BlackCard.destroy({where:{}});

      Promise.all([WhiteCard.destroy({where:{}}), BlackCard.destroy({where:{}})]).then(function(){
        var arrayOfCards = [{
            "text": "In the seventh circle of Hell, sinners must endure ____ for all eternity."
            },
            {
            "text": "The blind date was going horribly until we discovered our shared interest in ____."
            },
            {
            "text": "____. Awesome in theory, kind of a mess in practice."
            },
            {
            "text": "I'm not like the rest of you. I'm too rich and busy for ____."
            },
            {
            "text": "And what did *you* bring for show and tell?"
            },
            {
            "text": "As part of his contract, Prince won't perform without ____ in his dressing room."
            },
            {
            "text": "How did I lose my virginity?"
            },
            {
            "text": "Here is the church. Here is the steeple. Open the doors. And there is ____."
            },
            {
            "text": "During his childhood, Salvador Dalí produced hundreds of paintings of ____."
            },
            {
            "text": "In 1,000 years, when paper money is a distant memory, how will we pay for goods and services?"
            },
            {
            "text": "What don't you want to find in your Kung Pao chicken?"
            },
            {
            "text": "The Smithsonian Museum of Natural History has just opened an exhibit on ____."
            }];

          var arrayOfWhiteCards =[
            {
            "text": "Being fat and stupid."
            },
            {
            "text": "Getting married, having a few kids, buying some stuff, retiring to Florida, and dying."
            },
            {
            "text": "A pyramid of severed heads."
            },
            {
            "text": "Crucifixion."
            },
            {
            "text": "A subscription to Men's Fitness."
            },
            {
            "text": "Some god-damn peace and quiet."
            },
            {
            "text": "A micropig wearing a tiny raincoat and booties."
            },
            {
            "text": "Used panties."
            },
            {
            "text": "The penny whistle solo from \"My Heart Will Go On.\""
            },
            {
            "text": "A tribe of warrior women."
            },
            {
            "text": "An oversized lollipop."
            },
            {
            "text": "Helplessly giggling at the mention of Hutus and Tutsis."
            },
            {
            "text": "Not wearing pants."
            },
            {
            "text": "Consensual sex."
            },
            {
            "text": "Her Majesty, Queen Elizabeth II."
            },
            {
            "text": "Man meat."
            },
            {
            "text": "Autocannibalism."
            },
            {
            "text": "Vigorous jazz hands."
            },
            {
            "text": "Flightless birds."
            },
            {
            "text": "Pictures of boobs."
            },
            {
            "text": "Doing the right thing."
            },
            {
            "text": "Hunting accidents."
            },
            {
            "text": "A cartoon camel enjoying the smooth, refreshing taste of a cigarette."
            },
            {
            "text": "The violation of our most basic human rights."
            },
            {
            "text": "Viagra®."
            },
            {
            "text": "Self-loathing."
            },
            {
            "text": "Spectacular abs."
            },
            {
            "text": "An honest cop with nothing left to lose."
            },
            {
            "text": "Abstinence."
            },
            {
            "text": "A balanced breakfast."
            },
            {
            "text": "Mountain Dew Code Red."
            },
            {
            "text": "Concealing a boner."
            },
            {
            "text": "Roofies."
            },
            {
            "text": "Glenn Beck convulsively vomiting as a brood of crab spiders hatches in his brain and erupts from his tear ducts."
            },
            {
            "text": "Tweeting."
            },
            {
            "text": "The Big Bang."
            },
            {
            "text": "Amputees."
            },
            {
            "text": "The Rev. Dr. Martin Luther King, Jr."
            },
            {
            "text": "Former President George W. Bush."
            },
            {
            "text": "Being marginalized."
            },
            {
            "text": "Smegma."
            },
            {
            "text": "Laying an egg."
            },
            {
            "text": "Cuddling."
            },
            {
            "text": "Aaron Burr."
            },
            {
            "text": "The Pope."
            },
            {
            "text": "A bleached asshole."
            },
            {
            "text": "Horse meat."
            },
            {
            "text": "Genital piercings."
            },
            {
            "text": "Fingering."
            },
            {
            "text": "Elderly Japanese men."
            },
            {
            "text": "Stranger danger."
            },
            {
            "text": "Fear itself."
            },
            {
            "text": "Science."
            },
            {
            "text": "Praying the gay away."
            },
            {
            "text": "Same-sex ice dancing."
            },
            {
            "text": "The terrorists."
            },
            {
            "text": "Making sex at her."
            },
            {
            "text": "German dungeon porn."
            },
            {
            "text": "Bingeing and purging."
            }
          ];

          WhiteCard.bulkCreate(arrayOfWhiteCards, ["text"]);
          BlackCard.bulkCreate(arrayOfCards, ["text"]);
      })



    }).catch(function(err){
        console.log(err,"Something went wrong with the Database Update!")
    });


	app.listen(PORT, function(err){
      if(!err)
      console.log("Site is live at port 3000"); else console.log(err)
  });
