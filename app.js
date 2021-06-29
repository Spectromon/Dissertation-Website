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
  res.sendFile('index.html', {root: __dirname })
});

app.get('/signup', (req, res) => {
  res.sendFile('signup.html', {root: __dirname })
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', {root: __dirname })
});


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
    subject: 'Sending Email using Node.js',
    text: 'Hi there,\n\n Thank you for signing up to be a part of this study. In order to maintain your anonymity, and to limit the opportunity for bias towards results, you have been assigned a random username and password.\n\n For the purposes of this study, please only make one account, as making multiple accounts may sqew results and hinder the study! Please also conduct eyetracking on games with eyetracking included, and complete at least 3 attempts on each game.\n\n Your username is' + u_name + '.\n Your password is ' + p_word  + '.\n\n Again, thank you for participating, and enjoy the games!\n\n Braintroller Team'
  };

  transporter.sendMail(mailOptions);

  res.redirect('/login')
})

app.post('/login',urlencodedParser, async (req,res) =>{
  u_name = req.body.username
  p_word = req.body.password
  checker = 0
  var sql = {text: 'SELECT * FROM u_info where u_name = $1 and p_word = $2;', values: [u_name, p_word]}
  var logger = await client.query(sql)
  if (logger == undefined){
    console.log('No entry of that username or password')
  }
  else if (logger != undefined){
      if (logger.rows.length != 0){
        console.log('An entry was found')
      }
    }
  res.sendFile('login.html', {root: __dirname })
                
                
  // client.query(sql, checker = (err, res) =>{
  //   if(err){
  //     console.log(err)
  //   }
  //   else{
  //     logger = res.rows
  //     if (logger.length != 0){
  //       if (logger[0].u_name != undefined && logger[0].p_word != undefined){
  //         if (logger[0].u_name == u_name && logger[0].p_word == p_word){
  //           checker = 1
  //           console.log(checker)
  //         }
  //       }
  //     }
  //   };
  // })
  // if (checker == 1){
  //   res.sendFile('index.html', {root: __dirname })
  // }
  // else{
  //   res.sendFile('login.html', {root: __dirname })
  // }
})
  
// Establishing the port 
const PORT = process.env.PORT ||5000;
  
// Executing the sever on given port number
app.listen(PORT, console.log(
  `Server started on http://localhost:${PORT}`));
