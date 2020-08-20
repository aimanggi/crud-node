// Async Await Version

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://root:root@cluster0.gfdvr.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

app.listen(3000, () => console.log("Running on port 3000"));

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
}, {
    timestamps: true,
})

const todoModel = mongoose.model('Todo', TodoSchema)

app.get("/", async function (req, res) {
  const todo = await todoModel.find();
  console.log("todo", todo);
  try {
    res.send(todo);
  } catch (err) {
    res.send(err);
  }
});

app.post("/new", async function (req, res) {
  const newTodo = new todoModel(req.body);
  console.log("req body", req.body);
  try {
    await newTodo.save();
    res.send(newTodo);
  } catch (err) {
    res.send(err);
  }
});

app.put("/edit/:id", async function (req, res) {
    const updateTodo = await todoModel.findByIdAndUpdate(req.params.id, req.body);
    console.log("req body", req.body);
    console.log("upadate", updateTodo);

    try {
        await updateTodo.save();
        const getUpdated = await todoModel.findById(req.params.id)
        res.send(getUpdated)
    } catch (err) {
        res.send(err);
    }
})

app.delete("/delete/:id", async function (req, res) {
    const deleteTodo = await todoModel.findByIdAndDelete(req.params.id);
    console.log('delete todo', deleteTodo)
    try {
        if (!deleteTodo) {
            throw new Error('No todo found!')
        }
        res.send('Todo Deleted');
    } catch (err) {
        console.log('err', err.message)
        res.send(err.message);
    }
})




