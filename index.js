require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./Models/note");

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json()); //This is for post requests!

app.get("/", (req, res) => {
  res.send("<h1>Hello World! This is a refresh!</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);
  note ? res.json(note) : res.status(404).end();
});

app.post("/api/notes", (req, res) => {
  const note = req.body;
  if (!note.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const newNote = {
    content: note.content,
    important: Math.random() > 0.5,
  };
  notes = notes.concat(newNote);
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.patch("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const { important } = req.body;

  const note = notes.find((note) => note.id === id);
  if (!note) {
    return res.status(404).json({
      error: "Note was not found",
    });
  }
  note.important = important;
  res.json(note);
});

const unknownEndpoint = (_, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
