require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./Models/note");

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json()); //This is for post requests!

/* GET Requests */
app.get("/", (req, res) => {
  res.send("<h1>Hello World! This is a refresh!</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

/* POST Request */
app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const newNote = new Note({
    content: body.content,
    important: Math.random() > 0.5,
  });

  newNote.save().then((savedNote) => res.json(savedNote));
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((note) => {
      res.status(204).end();
    })
    .catch(next);
});

/* PATCH Request */
app.patch("/api/notes/:id", (req, res) => {
  const { important } = req.body;

  Note.findByIdAndUpdate(
    req.params.id,
    { important },
    { new: true, runValidators: true },
  ).then((updatedNote) => {
    res.json(updatedNote);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
