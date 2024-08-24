document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const input = document.getElementById('todoInput');
    const task = { text: input.value.trim(), completed: false };
    if (task.text) {
        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
        .then(() => {
            input.value = '';
            loadTasks();
        });
    }
}

function loadTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
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
        });
}

function toggleComplete(index) {
    fetch(`/tasks/${index}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Task not found');
            }
            return response.json();
        })
        .then(task => {
            task.completed = !task.completed;
            return fetch(`/tasks/${index}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
        })
        .then(() => loadTasks())
        .catch(error => console.error('Failed to toggle task completion:', error));
}

function removeTask(index) {
    fetch(`/tasks/${index}`, {
        method: 'DELETE'
    })
    .then(() => loadTasks());
}
