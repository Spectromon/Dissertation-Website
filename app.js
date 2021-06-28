//setTimeout() # Call a function after a delay
//clearTimeout() #Stop above
// setInterval() #Call a function repeatedly after a delay
// clearInterval() #Stop above
// Importing express module
const env = process.env.NODE_ENV || 'development'
const express = require('express');
const app = express();
  
// Getting Request
app.get('/', (req, res) => {
  
    // Sending the response
    res.send('Hello World!')
     
    // Ending the response 
    res.end()
})
  
// Establishing the port 
const PORT = process.env.PORT ||5000;
  
// Executing the sever on given port number
app.listen(PORT, console.log(
  `Server started on port ${PORT}`));
