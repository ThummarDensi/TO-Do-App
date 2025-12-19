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
            dueDateTime: dueDateTime, // ISO string
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
        alert('Please enter a task and select due date & time.');
    }
}

function renderTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `priority-${task.priority} ${task.completed ? 'completed' : ''}`;

        const dueDate = new Date(task.dueDateTime);
        if (!task.completed && dueDate < new Date()) {
            li.classList.add('overdue');
        }

        li.innerHTML = `
            <span>${task.text}<br>
                <small>Due: ${dueDate.toLocaleString()} • ${task.priority.toUpperCase()}</small>
            </span>
            <div class="actions">
                <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark complete">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Animation on appear
        li.style.opacity = '0';
        li.style.transform = 'translateY(20px)';
        setTimeout(() => {
            li.style.transition = 'all 0.5s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        }, 10);

        // Checkbox
        li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            task.completed = e.target.checked;
            saveTasks();
            renderTasks();
        });

        // Edit
        li.querySelector('.edit-btn').addEventListener('click', () => {
            const newText = prompt('Edit task:', task.text);
            if (newText && newText.trim()) {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        });

        // Delete
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
    saveTasks();
    renderTasks();
}

function filterTasks(type) {
    let filtered;
    if (type === 'pending') filtered = tasks.filter(t => !t.completed);
    else if (type === 'completed') filtered = tasks.filter(t => t.completed);
    else filtered = tasks;

    renderTasks(filtered);
    setActiveFilter(type);
}

function setActiveFilter(type) {
    document.querySelectorAll('.controls button:not(.clear-btn)').forEach((btn, index) => {
        btn.classList.remove('active');
        // Buttons order: Sort, All, Pending, Completed
        if ((type === 'all' && index === 1) ||
            (type === 'pending' && index === 2) ||
            (type === 'completed' && index === 3)) {
            btn.classList.add('active');
        }
    });
}

function clearAllTasks() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Initial render
renderTasks();
setActiveFilter('all');
