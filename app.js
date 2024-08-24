const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

app.use(express.static('public'));
app.use(express.json());

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
            return res.status(500).send('Error reading tasks file');
        }
        const tasks = JSON.parse(data);
        tasks.push(newTask);
        fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
            if (err) {
                return res.status(500).send('Error writing tasks file');
            }
            res.status(201).send('Task added');
        });
    });
});

app.delete('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index);
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks file');
        }
        const tasks = JSON.parse(data);
        tasks.splice(index, 1);
        fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
            if (err) {
                return res.status(500).send('Error writing tasks file');
            }
            res.status(200).send('Task deleted');
        });
    });
});

app.put('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const updatedTask = req.body;
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks file');
        }
        const tasks = JSON.parse(data);
        tasks[index] = updatedTask;
        fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
            if (err) {
                return res.status(500).send('Error writing tasks file');
            }
            res.status(200).send('Task updated');
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
