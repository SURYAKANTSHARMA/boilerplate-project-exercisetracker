const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
require('dotenv').config();


const password = process.env.PASSWORD;
const email = process.env.EMAIL;

// Connect to the database
mongoose.connect('mongodb+srv://${email}:${password}@cluster0.mauoshz.mongodb.net/?retryWrites=true&w=majority')

// Check if the connection is successful
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to the database')
})

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },  
  count: {
    type: Number,
    default: 0
  }
});

const exercise = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: String, 
  duration: Number,
  date: Date
});

const User = mongoose.model('user', user);
const Excercise = mongoose.model('exercise', exercise);


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

app.post('/api/users', (req, res) => { 
   const newUser = new User(
     { username: req.body.username }
   )

   newUser.save((err, user) => {
     if (err) {
      res.status(500).send(errr)
     }
      res.status(201).send(user)
   })
}); 




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
