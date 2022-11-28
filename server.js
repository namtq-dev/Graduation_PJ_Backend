const express = require('express');
const cors = require('cors');

const app = express();

// CORS config
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Welcome from home');
});

app.get('/books', (req, res) => {
  res.send('Welcome from books page');
});

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});
