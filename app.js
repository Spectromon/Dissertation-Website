//setTimeout() # Call a function after a delay
//clearTimeout() #Stop above
// setInterval() #Call a function repeatedly after a delay
// clearInterval() #Stop above
const env = process.env.NODE_ENV || 'development'
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const nodemailer = require('nodemailer');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();
app.use(express.static(__dirname));

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
  res.sendFile('signup.html', {root: __dirname })
});

//This works. Requires urlencodedParser however does send an email to the specific inputted email address.
app.post('/', urlencodedParser, (req,res) =>{
  console.log(req.body.email) //you will get your data in this as object
  u_name = makeid(5)
  var mailOptions = {
    from: 'rgu20daudissertation@gmail.com',
    to: req.body.email,
    subject: 'Sending Email using Node.js',
    text: 'Your username is ' + u_name
  };

  transporter.sendMail(mailOptions);

  res.sendFile('signup.html', {root: __dirname })
})
  
// Establishing the port 
const PORT = process.env.PORT ||5000;
  
// Executing the sever on given port number
app.listen(PORT, console.log(
  `Server started on http://localhost:${PORT}`));
