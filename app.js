//  A Program which consist of topics : Forms, validation, closures, hoisting, callbacks, async and JavaScript(setTimeout, setInterval) and Event Delegation.

// Hoisted global -->> to keep track of all tasks
var tasks = [];

document.getElementById('taskForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('taskName').value.trim();
  const time = parseInt(document.getElementById('taskTime').value.trim());

  // calls a function -->> to check input and the task
  // Validation and callback logic
  validateAndAddTask(name, time, function(err) {
    if (err) {
      alert(err);
    } else {
      document.getElementById('taskForm').reset();
    }
  });
});

// to check if the task name and time are valid
// Validation with callback
function validateAndAddTask(name, time, callback) {
  if (!name || isNaN(time) || time <= 0) {
    return callback("Invalid input. Please enter a valid task and time.");
  }

  // here we're creating a task object using another function
  const task = createTask(name, time);
  task.id = tasks.length; // assigning unique ID for event delegation
  tasks.push(task);
  renderTask(task);
  callback(null);
}

// Creating the task using closures (function inside a function) ->> data privacy and security
function createTask(name, minutes) {
  let remainingTime = minutes * 60;
  let isCompleted = false;

  const intervalId = setInterval(() => {
    remainingTime--;
    updateCountdownUI();
    if (remainingTime <= 0) {
      clearInterval(intervalId);
    }
  }, 1000);

  const timeoutId = setTimeout(() => {
    alert(`Reminder: ${name}`);
    completeTask(task);
  }, minutes * 60 * 1000);

  // creates a task object with functions to access private data
  const task = {
    getName: () => name,
    getRemainingTime: () => remainingTime,
    isCompleted: () => isCompleted,
    complete: () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      isCompleted = true;
    },
    intervalId,
    timeoutId,
    element: null,
    id: null
  };

  // function to update countdown timer
  function updateCountdownUI() {
    if (!task.isCompleted() && task.element) {
      task.element.querySelector('.task-label').innerText =
        `${task.getName()} — Time left: ${formatTime(task.getRemainingTime())}`;
    }
  }

  return task;
}

// function to render task
function renderTask(task) {
  const li = document.createElement('li');
  task.element = li;
  li.setAttribute('data-task-id', task.id);

  const taskName = document.createElement('span');
  taskName.innerText = `${task.getName()} — Time left: ${formatTime(task.getRemainingTime())}`;
  taskName.classList.add('task-label');

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  // complete button is been created
  const completeBtn = document.createElement('button');
  completeBtn.innerText = 'Complete';
  completeBtn.setAttribute('data-action', 'complete');

  // delete button creation
  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Delete';
  deleteBtn.setAttribute('data-action', 'delete');

  // Append buttons to action container (adding data dynamically) --> like adding buttons to your web page using JavaScript — instead of writing them directly in HTML.
  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(taskName);
  li.appendChild(actions);

  document.getElementById('pendingTasks').appendChild(li);
}

// Format time mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Complete task
function completeTask(task) {
  if (task.isCompleted()) return;

  task.complete();
  task.element.remove();

  const li = document.createElement('li');
  li.innerText = `${task.getName()} — Completed`;
  document.getElementById('completedTasks').appendChild(li);
}

// button function ->> to delete a task.
function deleteTask(task) {
  task.complete(); // Cancel timers
  task.element.remove();
  tasks = tasks.filter(t => t !== task);
}

// Event Delegation for Complete & Delete
document.getElementById('pendingTasks').addEventListener('click', function(e) {
  const action = e.target.getAttribute('data-action');
  if (!action) return;

  const li = e.target.closest('li');
  const taskId = parseInt(li.getAttribute('data-task-id'));
  const task = tasks.find(t => t.id === taskId);

  if (!task) return;

  if (action === 'complete') {
    completeTask(task);
  } else if (action === 'delete') {
    deleteTask(task);
  }
});
