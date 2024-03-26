document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
  
    taskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const taskDescription = taskInput.value;
  
      
      fetch('/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: taskDescription }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            addTaskToList(data.task);
            taskInput.value = '';
          } else {
            console.error(data.error);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  
    function addTaskToList(task) {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.innerHTML = `
        <span>${task.description}</span>
        <button data-taskid="${task._id}" class="btn btn-danger btn-sm float-right delete-task">Delete</button>
      `;
      
      taskList.appendChild(listItem);
    }
  
    taskList.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-task')) {
        const taskId = event.target.getAttribute('data-taskid');
        // Send a DELETE request to the server to delete the task
        fetch(`/delete/${taskId}`, { method: 'DELETE' })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              event.target.parentNode.remove();
            } else {
              console.error(data.error);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    });
  
    // Fetch initial task data from the server
    fetch('/tasks')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          data.tasks.forEach(addTaskToList);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
  