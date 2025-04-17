
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 9000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/todo_list_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Mongoose Schema and Model
const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// Get all tasks
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();

    let taskListHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* Your CSS styles here (same as before) */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          color: #333;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin: 10px 0;
          background-color: #fff;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        a {
          text-decoration: none;
          color: #fff;
          padding: 5px 10px;
          background-color: #f44336;
          border-radius: 5px;
          cursor: pointer;
        }
        form {
          text-align: center;
          margin-top: 20px;
        }
        input[type="text"] {
          width: 70%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button[type="submit"] {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>To-Do List</h1>
        <ul>
    `;

    tasks.forEach(task => {
      taskListHTML += `<li>${task.description} <a href="/delete/${task._id}">Delete</a></li>`;
    });

    taskListHTML += `
        </ul>
        <form action="/add" method="post">
          <input type="text" name="task" placeholder="Add a new task" />
          <button type="submit">Add</button>
        </form>
      </div>
    </body>
    </html>
    `;

    res.send(taskListHTML);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Add a task
app.post('/add', async (req, res) => {
  const description = req.body.task;
  try {
    await Task.create({ description });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a task
app.get('/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
