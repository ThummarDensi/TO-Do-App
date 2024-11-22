let tasks = [];

function addTask() {
    let taskInput = document.getElementById('taskInput');
    let dueDateTimeInput = document.getElementById('dueDateTime');
    let taskText = taskInput.value.trim();
    let dueDateTime = dueDateTimeInput.value;

    if (taskText !== '' && dueDateTime !== '') {
        let task = {
            id: Date.now(),
            text: taskText,
            dueDateTime: new Date(dueDateTime).toLocaleString(),
            completed: false
        };

        tasks.push(task);
        taskInput.value = '';
        dueDateTimeInput.value = '';
        renderTasks();
    } else {
        alert('Please enter both task and due date & time.');
    }
}

function renderTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        let li = document.createElement('li');
        li.textContent = task.text + ' - Due : ' + task.dueDateTime ;
        li.className = task.completed ? 'completed' :'';
        
        // Checkbox to mark task as completed
        let checkbox = document.createElement('input');
        checkbox.type =  'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            renderTasks();
        });
        li.appendChild(checkbox);

        // Edit button
        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            let newText = prompt('Enter new task text:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                renderTasks();
            }
        });
        li.appendChild(editButton);

        // Delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            renderTasks();
        });
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}
