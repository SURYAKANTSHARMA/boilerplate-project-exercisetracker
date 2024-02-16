const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express()


const password = process.env.PASSWORD;
const email = process.env.EMAIL;
const uri = `mongodb+srv://${email}:${password}@cluster0.mauoshz.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Connect to the database
mongoose.connect(uri)
app.use(bodyParser.urlencoded({ extented: false }));

// Check if the connection is successful
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connected to the database')
})

const exercise = new mongoose.Schema({
  description: String,
  duration: Number,
  date: Date
});

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  logs: {
    type: [exercise],
    default: [],
  },
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
  const user = User.findOne({ _id: req.params._id })
    .then((user) => {
      const newExercise = new Excercise({
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date,
      });
      newExercise.save()
        .then((exercise) => {
          user.logs.push(exercise);
          user.count = user.logs.length;
          user.save()
            .then(() => {
              const customDate = new Date(exercise.date).toDateString();
              const customResponse = {
                _id: user._id,
                username: user.username,
                description: exercise.description,
                duration: exercise.duration,
                date: customDate,
              };
              res.status(201).send(customResponse);
            })
            .catch((err) => {
              res.status(500).send(err.message);
            });
        })
        .catch((err) => {
          res.status(500).send(err.message);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err.message);
    });
});

app.get('/api/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Unable to fetch users.' });
    });
})

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  
  User.findById(_id)
    .exec()
    .then((user) => {
      let exercises = user.logs;

      // Apply filtering if `from`, `to`, and `limit` query parameters are provided
      if (from && to && limit) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        exercises = exercises.filter((exercise) => {
          const exerciseDate = new Date(exercise.date); // Convert exercise.date to Date object
          return exerciseDate >= fromDate && exerciseDate <= toDate;
        });
        exercises = exercises.slice(0, parseInt(limit));
      }
      const formattedExcercises = exercises.map((exercise) => {
        return {
          date: new Date(exercise.date).toDateString(),
          description: exercise.description,
          duration: exercise.duration
        };
      });
      const filteredUser = {
        _id: user._id,
        username: user.username,
        log: formattedExcercises,
        count: user.count
      };
      res.status(200).send(filteredUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err.message);
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})