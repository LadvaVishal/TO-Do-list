const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 9000;

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_list_db'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Serve static files and use bodyParser middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Retrieve and display all tasks
app.get('/', (req, res) => {
  db.query('SELECT * FROM tasks_1', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    let taskListHTML = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
      /* Your CSS styles here */
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

    results.forEach(task => {
      taskListHTML += `<li>${task.description} <a href="/delete/${task.id}">Delete</a></li>`;
    });

    taskListHTML += `</ul>
        <form action="/add" method="post">
          <input type="text" name="task" placeholder="Add a new task" />
          <button type="submit">Add</button>
        </form>
      </div>
      </body>
      </html>`;

    res.send(taskListHTML);
  });
});

// Add a new task
app.post('/add', (req, res) => {
  const description = req.body.task;
  const query = 'INSERT INTO tasks_1 (description) VALUES (?)';

  db.query(query, [description], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.redirect('/');
  });
});

// Delete a task by ID
app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM tasks_1 WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.redirect('/');
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
