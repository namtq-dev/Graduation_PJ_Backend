const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const { readdirSync } = require('fs');

dotenv.config();

// database config
connectDB().catch((err) => console.log(err));
mongoose.connection.on(
  'error',
  console.error.bind(console, 'connection error:')
);

async function connectDB() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('Connected to the MongoDB Server');
}

const app = express();

// CORS config
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// routes config
readdirSync('./routes').map((route) =>
  app.use('/', require('./routes/' + route))
);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
