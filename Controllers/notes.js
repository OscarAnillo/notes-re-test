const notesRouter = require("express").Router();
const Note = require("../Models/note");
const User = require("../Models/user");

notesRouter.get("/", async (req, res) => {
  const allNotes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
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

  const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });
  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

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
