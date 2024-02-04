const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const password = process.env.PASSWORD;
const email = process.env.EMAIL;

// Connect to the database
mongoose.connect('mongodb+srv://${email}:${password}@cluster0.mauoshz.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Check if the connection is successful
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to the database')
})

// Export the database connection
module.exports = db


const app = express()
// Use the body-parser middleware to parse JSON requests
app.use(bodyParser.json());

const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
