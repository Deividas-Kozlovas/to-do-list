document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const input = document.getElementById('todoInput');
    const task = input.value.trim();
    if (task) {
        const tasks = getTasks();
        tasks.push({ text: task, completed: false });
        saveTasks(tasks);
        input.value = '';
        loadTasks();
    }
}

function loadTasks() {
    const tasks = getTasks();
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.textContent = task.text;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'task-buttons';

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.onclick = () => toggleComplete(index);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeTask(index);

        buttonsDiv.appendChild(completeBtn);
        buttonsDiv.appendChild(removeBtn);

        li.appendChild(buttonsDiv);
        list.appendChild(li);
    });
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    loadTasks();
}

function toggleComplete(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    loadTasks();
}