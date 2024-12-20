// Retrieve tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskManagerContainer = document.querySelector(".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
let indexToBeDeleted = null;

// Request permission for notifications
Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
        console.log('Notification permission granted.');
    } else {
        console.log('Notification permission denied.');
    }
});

// Add event listener to the form submit event
document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value; // Get the due date value

    if (taskText !== '' && dueDate !== '') { // Ensure both fields are filled
        const newTask = {
            text: taskText,
            completed: false,
            dueDate: dueDate // Store due date
        };

        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
        dueDateInput.value = ''; // Clear inputs after adding
        renderTasks();
    }
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial rendering of tasks
renderTasks();

// Function to render tasks
function renderTasks() {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('taskCard');
        let classVal = "pending";
        let textVal = "Pending";
        if (task.completed) {
            classVal = "completed";
            textVal = "Completed";
        }
        taskCard.classList.add(classVal);

        const taskText = document.createElement('p');
        taskText.innerText = task.text;

        const taskDueDate = document.createElement('p'); // Show the due date
        taskDueDate.innerText = `Due: ${task.dueDate}`;
        taskDueDate.classList.add('due-date');

        const taskStatus = document.createElement('p');
        taskStatus.classList.add('status');
        taskStatus.innerText = textVal;

        const toggleButton = document.createElement('button');
        toggleButton.classList.add("button-box");
        const btnContentEl = document.createElement("span");
        btnContentEl.classList.add("green");
        btnContentEl.innerText = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        toggleButton.appendChild(btnContentEl);
        toggleButton.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
            updateProgress(); // Update progress after toggling
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("button-box");
        const delBtnContentEl = document.createElement("span");
        delBtnContentEl.classList.add("red");
        delBtnContentEl.innerText = 'Delete';
        deleteButton.appendChild(delBtnContentEl);
        deleteButton.addEventListener('click', () => {
            indexToBeDeleted = index;
            confirmEl.style.display = "block";
            taskManagerContainer.classList.add("overlay");
        });

        // Add the edit button
        const editButton = document.createElement('button');
        editButton.classList.add("button-box");
        const editBtnContentEl = document.createElement("span");
        editBtnContentEl.classList.add("blue");
        editBtnContentEl.innerText = 'Edit';
        editButton.appendChild(editBtnContentEl);

        editButton.addEventListener('click', () => {
            const newText = prompt("Edit Task:", task.text);
            const newDueDate = prompt("Edit Due Date:", task.dueDate); // Prompt for due date update
            if (newText !== null && newDueDate !== null) {
                tasks[index].text = newText;
                tasks[index].dueDate = newDueDate; // Update due date
                saveTasks();
                renderTasks();
                updateProgress(); // Update progress after editing
            }
        });

        taskCard.appendChild(taskText);
        taskCard.appendChild(taskDueDate); // Append due date to card
        taskCard.appendChild(taskStatus);
        taskCard.appendChild(toggleButton);
        taskCard.appendChild(editButton);
        taskCard.appendChild(deleteButton);

        taskContainer.appendChild(taskCard);
    });

    // Call updateProgress after rendering tasks
    updateProgress();
}

// Function to delete the selected task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Confirmation dialog buttons
confirmedBtn.addEventListener("click", () => {
    confirmEl.style.display = "none";
    taskManagerContainer.classList.remove("overlay");
    deleteTask(indexToBeDeleted);
});

cancelledBtn.addEventListener("click", () => {
    confirmEl.style.display = "none";
    taskManagerContainer.classList.remove("overlay");
});

// Function to update progress
function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = (completedTasks / tasks.length) * 100 || 0; // Prevent division by zero
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('taskStats').innerText = `${completedTasks}/${tasks.length} tasks completed`;
}

// Function to check due tasks and send notifications
function checkDueTasks() {
    const now = new Date();
    tasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        if (dueDate - now <= 86400000 && !task.completed) { // If due within 1 day
            // If notifications are allowed, send a notification
            if (Notification.permission === 'granted') {
                new Notification(`Reminder: Task "${task.text}" is due soon!`);
            } else {
                alert(`Reminder: Task "${task.text}" is due soon!`);
            }
        }
    });
}

// Set an interval to check due tasks every hour
setInterval(checkDueTasks, 3600000); // 3600000 ms = 1 hour

// Call checkDueTasks immediately on load to catch any due tasks
checkDueTasks();