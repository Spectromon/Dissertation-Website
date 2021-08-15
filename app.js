//setTimeout() # Call a function after a delay
//clearTimeout() #Stop above
// setInterval() #Call a function repeatedly after a delay
// clearInterval() #Stop above
const env = process.env.NODE_ENV || 'development'
const collect = require('collect');
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const nodemailer = require('nodemailer');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();
app.use(express.static(__dirname));

var logpage = 0;
const session = require('express-session');
const store = new session.MemoryStore();

app.use(express.static(__dirname));
app.use(session({
  secret: 'monkeybanana',
  cookie: {maxAge: null},
  saveUninitialized: false,
  store
}))

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rgu20daudissertation@gmail.com',
    pass: 'yMspnGe#Q!a4t5g9'
  }
});

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}
  
// Getting Request
app.get('/', (req, res) => {
  logpage = 0
  store.get(req.sessionID, (err, session) =>{
    if (err) throw err;
    else if (session != undefined && session != null) {
      res.redirect('/gamehub')//change this to the html of the game selection screen (containing logout button).
    }
      else{ 
      res.sendFile('main.html', {root: __dirname })} //requires main, elsewise heroku constnatly pushes index.html.
  })
});

app.get('/gamehub', (req, res) => {
  console.log(store)
  store.get(req.sessionID, (err, session) =>{
    if (err) throw err;
    else if (session != undefined && session != null) {
      res.sendFile('games.html', {root: __dirname })//change this to the html of the game selection screen (containing logout button).
    }
      else{
            logpage = 2
            res.redirect('/login')
      }
  })
});

app.get('/signup', (req, res) => {
  store.get(req.sessionID, (err, session) =>{
    if (err) throw err;
    else if (session != undefined && session != null) {
      
      res.redirect('/gamehub')}
     else{
       res.sendFile('signup.html', {root: __dirname })}
    })
});

app.get('/login', (req, res) => {
  store.get(req.sessionID, (err, session) =>{
    if (err) throw err;
    else if (session != undefined && session != null) {
      res.redirect('/gamehub')}                 
     else{
       if (logpage == 0){
       res.sendFile('login.html', {root: __dirname })
       }
       else if (logpage == 1){
       res.sendFile('login - signup.html', {root: __dirname })
       }
       else if (logpage == 2){
         res.sendFile('login - nosesh.html', {root: __dirname })
       }
    }
  })
});

app.get('/logout', (req, res) => {
  store.destroy(req.sessionID, (err) => { if (err) throw err;})
  req.session.destroy( (err) => {if (err) throw err});
  res.redirect('/')
});

app.get('/dotsandboxes', (req, res) => {
  store.get(req.sessionID, (err, session) =>{
  if (err) throw err;
  else if (session != undefined && session != null) {
    res.sendFile('dotsandboxes.html', {root: __dirname })
               }
   else{
     logpage = 2;
     res.redirect('/login')
   }; 
  })
});

app.get('/rubick', (req, res) => {
  store.get(req.sessionID, (err, session) =>{
  if (err) throw err;
  else if (session != undefined && session != null) {
    res.sendFile('rubick.html', {root: __dirname })
               }
   else{ 
     logpage = 2;
     res.redirect('/login')}; 
  })
});

app.get('/asteroids', (req, res) => {
  store.get(req.sessionID, (err, session) =>{
  if (err) throw err;
  else if (session != undefined && session != null) {
    res.sendFile('asteroids.html', {root: __dirname })
               }
   else{
     logpage = 2
     res.redirect('/login')}; 
  })
});

app.get('/snake', (req, res) => {
  store.get(req.sessionID, (err, session) =>{
  if (err) throw err;
  else if (session != undefined && session != null) {
    res.sendFile('snake.html', {root: __dirname })
               }
   else{
     logpage = 2
     res.redirect('/login')}; 
  })
});
app.post('/rubick', (req, res) => {
  console.log(req.sessionID)
  store.get(req.sessionID, (err, session) =>{
    if (err) throw err;
    else if (session != undefined && session != null) {
      res.sendFile('rubick.html', {root: __dirname })
                 }
     else{
       logpage = 2
       res.redirect('/login')}; 
    })
});

app.post('/machinelearning', urlencodedParser, async (req, res) => {
  u_name = req.session.user.u_name
  g_name = req.body.Game
  p_move = req.body.PlayerMove
  board_state = req.body.BoardState


  console.log(u_name, g_name, p_move, board_state)

  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  var DateTime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

  var sql = {text: 'INSERT INTO ml_info(u_name, move, board_state, g_name, datetime) VALUES($1, $2, $3, $4, $5);', values: [u_name, p_move, board_state, g_name, DateTime]}
  client.query(sql, (err, res) => {
    if (err){
      console.log(err)
    };
  });
})

app.post('/submission', urlencodedParser, async (req, res) => {
  username = req.session.user.u_name
  g_name = req.body.game
  score = req.body.score
  console.log('Score submission')
  var sql = {text: 'INSERT INTO g_info(u_name, g_name, score) VALUES($1, $2, $3);', values: [username, g_name, score]}
  client.query(sql, (err, res) => {
    if (err){
      console.log(err)
    }
    else{console.log('Score Submitted')}
  });
  res.end();
});

app.post("/eyetracking", urlencodedParser, async (req,res) =>{
  var u_name = req.session.user.u_name
  var GazeX = req.body.GazeX
  var GazeY = req.body.GazeY
  var HeadX = req.body.HeadX
  var HeadY = req.body.HeadY
  var HeadZ = req.body.HeadZ
  var Yaw = req.body.Yaw
  var Pitch = req.body.Pitch
  var Roll = req.body.Roll
  var Game = req.body.Game
  var innerHeight = req.body.InnerHeight
  var innerWidth = req.body.InnerWidth
  
  console.log(innerWidth, innerHeight)
  //console.log('Username: ' + u_name + ', GazeX :' + GazeX + ', GazeY :' + GazeY + ', HeadX :' + HeadX + ', HeadY :' + HeadY + ', HeadZ :' + HeadZ + ', Yaw :' + Yaw + ', Pitch :' + Pitch + ', Roll :' + Roll)

  //These are changed within the server itself and not taken from the HTML form
let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

var DateTime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

//console.log('Username: ' + u_name + ', GazeX :' + GazeX + ', GazeY :' + GazeY + ', HeadX :' + HeadX + ', HeadY :' + HeadY + ', HeadZ :' + HeadZ + ', Yaw :' + Yaw + ', Pitch :' + Pitch + ', Roll :' + Roll + ', DateTime: ' + DateTime + ', Game:' + Game)
var sql = {text: 'INSERT INTO e_info(u_name, gazex, gazey, headx, heady, headz, yaw, pitch, roll, datetime, game, inner_width, inner_height) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);', values: [u_name, GazeX, GazeY, HeadX, HeadY, HeadZ, Yaw, Pitch, Roll, DateTime, Game, innerWidth, innerHeight]}
  client.query(sql, (err, res) => {
    if (err){
      console.log(err)
    };
//     else{console.log('Eye Tracking Registered')}
  });
res.end();
})


//This works. Requires urlencodedParser however does send an email to the specific inputted email address.
app.post('/signup', urlencodedParser, (req,res) =>{
    email = req.body.email
    u_name = makeid(5)
    p_word = makeid(8)
    var sql = {text: 'INSERT INTO u_info(u_name, p_word, email) VALUES($1,$2,$3);', values: [u_name, p_word, email]}
    client.query(sql, (err, res) => {
      if (err){
        console.log(err)
      };
    });
    var mailOptions = {
      from: 'rgu20daudissertation@gmail.com',
      to: req.body.email,
      subject: 'RGU20DAU Dissertation Study Details',
      text: 'To Participant of RGU20DAU Dissertation Study,\n\n Thank you for signing up to be a part of this study. In order to maintain your anonymity, and to limit the opportunity for bias towards results, you have been assigned a random username and password. Please also find attached further participant information.\n\n For the purposes of this study, please only make one account, as making multiple accounts may skew results and hinder the study.\n\n Please ensure that eyetracking is done for each game by pressing the start button and completing calibration, and that when changing games, you stop the eyetracking using the stop button. This will ensure that, if you move to a new webpage, you are not sending further results or causing inaccuracies. If you are playing the game again on the same page, continue eyetracking.\n\n It would be incredibly beneficial to the study if you could complete every game on the platform at least three times, with eyetracking, however please feel no pressure to do so. Any results are greatly appreciated and valued. \n\n Your login details are as follows: \n\n Your username is ' + u_name + '.\n Your password is ' + p_word  + '.\n\n Again, thank you for participating, and enjoy the games!\n\n Tommy Carter',
      attachments: [{   
        path: 'Participant_Information.docx' // stream this file
    },] 
    };
  
    transporter.sendMail(mailOptions);
    logpage = 1
    res.redirect('/login')
  })

app.post('/login', urlencodedParser, async (req,res) =>{
  console.log(req.sessionID);
  u_name = req.body.username
  p_word = req.body.password
  var sql = {text: 'SELECT * FROM u_info where u_name = $1 and p_word = $2;', values: [u_name, p_word]}
  var logger = await client.query(sql)
  if (logger == undefined){
    res.sendFile('login.html', {root: __dirname })
  }
  else if (logger != undefined){
      if (logger.rows.length != 0){
        login = logger.rows[0]
        if (login.u_name == u_name && login.p_word == p_word){
          
          store.all((err, sessions) =>{
            if (err) console.log(err)
            else if (sessions) {
              if (sessions.length !=0){
                sessionactive = false
                for(let sesh in sessions){
                  store.get(sesh, (err, s) =>{
                        if (err) throw err;
                        else if (s != undefined && s != null) {
                          if(s.user.u_name == u_name){
                            console.log('Session for this user already exists!')
                            console.log(sesh)
                            store.destroy(sesh, (err) => { if (err) throw err;})
                            
                          }                          
                        }
                      })
                  }
                req.session.authenticated = true;
                req.session.user = {u_name};
                store.set(req.sessionID, session, (err) =>{
                  if (err) console.log(err)
                })
                res.redirect('/gamehub')

               }
              else if (sessions.length == 0){
                req.session.authenticated = true;
                req.session.user = {u_name};
                store.set(req.sessionID, session, (err) =>{
                  if (err) console.log(err)
                })
                res.redirect('/gamehub')
              }
            }
          })
        }
        else{
          res.redirect('/signup')
        }
      }
      else{
        res.sendFile('login.html', {root: __dirname })
        }
    }
})
  
// Establishing the port 
const PORT = process.env.PORT ||5000;
  
// Executing the sever on given port number
app.listen(PORT, console.log(
  `Server started on http://localhost:${PORT}`));
