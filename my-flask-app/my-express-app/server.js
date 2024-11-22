const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { exec } = require('child_process');

// Require the metrics service
require('./metricsService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/upkeep', { useNewUrlParser: true, useUnifiedTopology: true });

// Model for Logs
const logSchema = new mongoose.Schema({
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const Log = mongoose.model('Log', logSchema);

// Model for Configurations
const configSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true }
});
const Configuration = mongoose.model('Configuration', configSchema);

// CRUD Operations for Logs
app.post('/api/logs', async (req, res) => {
    const newLog = new Log(req.body);
    await newLog.save();
    res.status(201).json(newLog);
});

app.get('/api/logs', async (req, res) => {
    const logs = await Log.find();
    res.json(logs);
});

app.put('/api/logs/:id', async (req, res) => {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(log);
});

app.delete('/api/logs/:id', async (req, res) => {
    await Log.findByIdAndDelete(req.params.id);
    res.json({ message: 'Log deleted successfully' });
});

// CRUD Operations for Configurations
app.post('/api/configurations', async (req, res) => {
    const newConfig = new Configuration(req.body);
    await newConfig.save();
    res.status(201).json(newConfig);
});

app.get('/api/configurations', async (req, res) => {
    const configs = await Configuration.find();
    res.json(configs);
});

app.put('/api/configurations/:id', async (req, res) => {
    const config = await Configuration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(config);
});

app.delete('/api/configurations/:id', async (req, res) => {
    await Configuration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Configuration deleted successfully' });
});

// Function to perform disk cleanup
const diskCleanup = () => {
    exec('del /q/f/s %TEMP%\\*', (error) => {
        if (error) {
            console.error(`Error during disk cleanup: ${error}`);
            return;
        }
        console.log('Disk cleanup completed!');
    });
};

// Schedule the cleanup to run daily at midnight
cron.schedule('0 0 * * *', diskCleanup);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
