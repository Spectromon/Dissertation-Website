//setTimeout() # Call a function after a delay
//clearTimeout() #Stop above
// setInterval() #Call a function repeatedly after a delay
// clearInterval() #Stop above
const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
    console.log('Server listening on http://localhost:' + port);
  });