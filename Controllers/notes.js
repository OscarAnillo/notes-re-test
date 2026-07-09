const notesRouter = require("express").Router();
const Note = require("../Models/note");

notesRouter.get("/", async (req, res) => {
  const allNotes = await Note.find({});
  res.json(allNotes);
});

notesRouter.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).end();
  }
  res.json(note);
});

notesRouter.post("/", async (req, res) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  const savedNote = await note.save();
  res.status(201).json(savedNote);
});

notesRouter.put("/:id", async (req, res, next) => {
  try {
    const { content, important } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { content, important },
      {
        new: true,
        runValidators: true,
        context: "query",
      },
    );

    if (!updatedNote) {
      return res.status(404).json({
        error: "Note not found",
      });
    }

    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = notesRouter;
