const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json()) // Send req body as json
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3030, () => console.log('Server running on port 3030'))

mongoose.connect('mongodb+srv://<dbname>:<password>@cluster0.gfdvr.mongodb.net/<databaseName>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

// Create database schema
const TodoSchema = new mongoose.Schema({
    title: String,
    username: String,
    done: Boolean, 
}, {
    timestamps: true,
})

// Register schema to database
const todoModel = mongoose.model('newTodo', TodoSchema);

// req: Request -> Header, Body (content)
// res: Respond

// Initial value for respond
const initial = {
    data: null,
    error: null,
}

app.get('/', (req, res) => {
    res.send('Hello World')
})

// Read - All data
app.get('/get-all', (req, res) => {
    todoModel.find().then(data => {
        console.log('data', data)
        
        initial.data = data // change data value to fetch result
        res.send(initial)
    })
})

// Read - get by Id
app.get('/:id', (req, res) => {
    todoModel.findById(req.params.id).then(data => {
        console.log('data', data)
        if(!data) {
            initial.error = 'No todo found!' // change error value
            res.send(initial)
        }
        initial.data = data
        res.send(initial)
    })
})

// Create
app.post('/new', (req, res) => {
   const createTodo = new todoModel(req.body)
   createTodo.save().then(data => {
       res.send(data)
   })
})

// Edit
app.put('/:id/edit', (req, res) => {
    // find and update first then get the new data to send the respond
    todoModel.findByIdAndUpdate(req.params.id, req.body).exec().then(() => {
        todoModel.findById(req.params.id).then(data => {
            res.send(data)
        })
    })
})

// Delete
app.delete(`/:id/delete`, (req, res) => {
    todoModel.findByIdAndDelete(req.params.id).then((data) => {
        console.log('data', data)
        if(!data) {
            initial.error = 'No todo found!' // change error value
            initial.data = null
            res.send(initial)
        }
        initial.data = 'Todo deleted'
        initial.error = null
        res.send(initial)
    })
})