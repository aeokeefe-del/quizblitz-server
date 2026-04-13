require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const questions = require('./data/questions')
const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'QuizBlitz server is running' })
})

// Connect to MongoDB, then start the server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running at http://localhost:${process.env.PORT || 3000}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })

// GET /api/questions — returns all questions
app.get('/api/questions', (req, res) => {
  res.json(questions)
})

// GET /api/questions/random — returns 10 shuffled questions
/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The same array, shuffled in place.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

app.get('/api/questions/random', (req, res) => {
  const shuffled = [...questions]  // copy — never mutate the original

  shuffleArray(shuffled);

  res.json(shuffled.slice(0, 10))
})

// In-memory scores store (replaced by MongoDB in Week 10)
let scores = []

// POST /api/scores — submit a new score
app.post('/api/scores', (req, res) => {
  const { playerName, score, totalQuestions } = req.body

  if (!playerName || score === undefined || !totalQuestions) {
    return res.status(400).json({ error: 'playerName, score, and totalQuestions are required' })
  }

  const newScore = {
    id: Date.now(),
    playerName,
    score,
    totalQuestions,
    date: new Date().toISOString()
  }

  scores.push(newScore)
  console.log('Score received:', newScore)

  res.status(201).json(newScore)
})

// GET /api/scores — return all scores, highest first
app.get('/api/scores', (req, res) => {
  const sorted = [...scores].sort((a, b) => b.score - a.score)
  res.json(sorted)
})