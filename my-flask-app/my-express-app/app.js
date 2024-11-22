const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/api/status', (req, res) => {
    res.json({ status: "running" });
});

app.get('/api/logs', (req, res) => {
    // Logic to retrieve logs
    res.json({ logs: ["Log entry 1", "Log entry 2"] });
});

app.post('/api/maintenance', (req, res) => {
    // Logic for maintenance tasks
    res.json({ message: "Maintenance task executed" });
});

app.get('/api/notifications', (req, res) => {
    // Logic to retrieve notifications
    res.json({ notifications: ["Notification 1", "Notification 2"] });
});

const os = require('os');
const { exec } = require('child_process');

app.get('/api/resources', (req, res) => {
    const cpuUsage = os.loadavg();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    res.json({
        cpu_usage: cpuUsage,
        total_memory: totalMemory,
        available_memory: freeMemory
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});