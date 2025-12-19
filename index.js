let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateTimeInput = document.getElementById('dueDateTime');
    const prioritySelect = document.getElementById('priority');
    const taskText = taskInput.value.trim();
    const dueDateTime = dueDateTimeInput.value;
    const priority = prioritySelect.value;

    if (taskText && dueDateTime) {
        const task = {
            id: Date.now(),
            text: taskText,
            dueDateTime: new Date(dueDateTime).toISOString(), // Store as ISO for easy comparison
            priority,
            completed: false
        };
        tasks.push(task);
        taskInput.value = '';
        dueDateTimeInput.value = '';
        prioritySelect.value = 'medium';
        saveTasks();
        renderTasks();
    } else {
        alert('Please enter task, due date/time, and priority.');
    }
}

function renderTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        
        // Check if overdue
        const dueDate = new Date(task.dueDate);
        if (!task.completed && dueDate < new Date()) {
            li.classList.add('overdue');
        }

        li.innerHTML = `
            <span>${task.text} - Due: ${new Date(task.dueDateTime).toLocaleString()} (${task.priority.toUpperCase()})</span>
            <div class="actions">
                <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark as completed">
                <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;

        // Checkbox event
        li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            task.completed = e.target.checked;
            saveTasks();
            renderTasks();
        });

        // Edit button
        li.querySelector('.edit-btn').addEventListener('click', () => {
            const newText = prompt('Edit task:', task.text);
            if (newText && newText.trim()) {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        });

        // Delete button
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    });
}

function sortTasksByDueDate() {
    tasks.sort((a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime));
    renderTasks();
}

function filterTasks(type) {
    let filtered;
    if (type === 'pending') {
        filtered = tasks.filter(t => !t.completed);
    } else if (type === 'completed') {
        filtered = tasks.filter(t => t.completed);
    } else {
        filtered = tasks;
    }
    renderTasks(filtered);
}

function clearAllTasks() {
    if (confirm('Clear all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Initial render
renderTasks();
