//setTimeout() # Call a function after a delay
//clearTimeout() #Stop above
// setInterval() #Call a function repeatedly after a delay
// clearInterval() #Stop above

const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });