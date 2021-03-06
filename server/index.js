require("dotenv").config()
const express = require("express")
const session = require("express-session")

const messageCtrl = require("./messagesCtrl")

let { SERVER_PORT, SESSION_SECRET } = process.env

const app = express()

app.use(express.json()) // creates an object called body on the req | req.body
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use((req, res, next) => {
  if (!req.session.history) {
    req.session.history = []
  }
  next()
})

app.use((req, res, next) => {
  let badWords = ["knucklehead", "jerk", "internet explorer"]
  if (req.body.message) {
    for (let i = 0; i < badWords.length; i++) {
      let regex = new RegExp(badWords[i], "g")
      req.body.message = req.body.message.replace(regex, "****")
    }
    next()
  } else {
    next()
  }
})

app.get("/api/messages", messageCtrl.getAllMessages)
app.post("/api/messages", messageCtrl.createMessage)

app.get("/api/messages/history", messageCtrl.history)

app.listen(SERVER_PORT, () => {
  console.log(`listening on port ${SERVER_PORT}`)
})


