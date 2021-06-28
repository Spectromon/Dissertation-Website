//setTimeout() # Call a function after a delay
//clearTimeout() #Stop above
// setInterval() #Call a function repeatedly after a delay
// clearInterval() #Stop above
const env = process.env.NODE_ENV || 'development'
const express = require('express');
const app = express();
app.use(express.static(__dirname));
  
// Getting Request
app.get('/', (req, res) => {
    res.sendFile('rubick.html', {root: __dirname })
});
  
// Establishing the port 
const PORT = process.env.PORT ||5000;
  
// Executing the sever on given port number
app.listen(PORT, console.log(
  `Server started on http://localhost:${PORT}`));
