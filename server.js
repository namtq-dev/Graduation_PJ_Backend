const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome from home');
});

app.get('/books', (req, res) => {
  res.send('Welcome from books page');
});

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});
