const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express()


const password = process.env.PASSWORD;
const email = process.env.EMAIL;
//const uri = `mongodb+srv://suryakantsharma84:${password}@cluster0.mauoshz.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb+srv://suryakantsharma84:bksurya128086@cluster0.mauoshz.mongodb.net/?retryWrites=true&w=majority";

// Connect to the database
mongoose.connect(uri)
app.use(bodyParser.urlencoded({extented: false}));

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
   newUser.save() 
   .then((user) => { 
    res.status(201).send(user)
   })
   .catch((err) => {
    res.status(500).send(err.message)
  });
}); 

app.post('/api/users/:_id/exercises', (req, res) => { 
  const user = User.findOne(
    {_id: req.params._id })
    .then((user) => { 
      const newExercise = new Excercise(
        {
          userId: req.params._id, 
          description: req.body.description,
          duration: req.body.duration,
          date: req.body.date,
        }
      )
      newExercise.save() 
      .then((exercise) => { 
       res.status(201).send(exercise)
      })
      .catch((err) => {
       res.status(500).send(err.message)
     });    
    })
    .catch((err)=> {
      console.error(err);
      res.status(500).send(err.message);
    })
    
  })


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

