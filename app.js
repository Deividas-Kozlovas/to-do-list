const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, '[]', 'utf8');
}

app.use(express.static('public'));
app.use(express.json());

app.get('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks file');
        }
        let tasks;
        try {
            tasks = JSON.parse(data);
        } catch (e) {
            return res.status(500).send('Error parsing tasks data');
        }
        if (index < 0 || index >= tasks.length) {
            return res.status(404).send('Task not found');
        }
        res.json(tasks[index]);
    });
});

app.get('/tasks', (req, res) => {
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks file');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/tasks', (req, res) => {
    const newTask = req.body;
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading task file');
        }
        const tasks = JSON.parse(data);
        tasks.push(newTask);
        fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing task file');
            }
            res.status(201).send('Task added');
        });
    });
});

app.put('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const updatedTask = req.body;
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks file');
        }
        let tasks;
        try {
            tasks = JSON.parse(data);
        } catch (e) {
            return res.status(500).send('Error parsing tasks data');
        }
        if (index < 0 || index >= tasks.length) {
            return res.status(404).send('Task not found');
        }
        tasks[index] = { ...tasks[index], completed: updatedTask.completed }; // Update only the completed status
        fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing tasks file');
            }
            res.status(200).send('Task updated');
        });
    });
});

app.delete('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks file');
        }
        let tasks;
        try {
            tasks = JSON.parse(data);
        } catch (e) {
            return res.status(500).send('Error parsing tasks data');
        }
        if (index < 0 || index >= tasks.length) {
            return res.status(404).send('Task not found');
        }
        tasks.splice(index, 1);
        fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing tasks file');
            }
            res.status(200).send('Task deleted');
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
