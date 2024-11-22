const cron = require('node-cron');
const { exec } = require('child_process');
const mongoose = require('mongoose');
const axios = require('axios'); // Import axios for HTTP requests
const twilio = require('twilio');

// Slack webhook URL
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';

// Connect to your database
mongoose.connect('mongodb://localhost:27017/yourdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for system metrics
const metricsSchema = new mongoose.Schema({
    cpuUsage: Number,
    memoryUsage: Number,
    timestamp: { type: Date, default: Date.now }
});

const Metrics = mongoose.model('Metrics', metricsSchema);

// Twilio credentials
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = new twilio(accountSid, authToken);

// Function to send alert to Slack
const sendSlackAlert = (message) => {
    axios.post(SLACK_WEBHOOK_URL, { text: message })
        .then(() => console.log('Alert sent to Slack!'))
        .catch((error) => console.error(`Error sending alert: ${error}`));
};

// Function to send SMS alert
const sendSmsAlert = (message) => {
    client.messages.create({
        body: message,
        to: 'YOUR_PHONE_NUMBER',  // Your phone number
        from: 'YOUR_TWILIO_PHONE_NUMBER' // Your Twilio number
    })
    .then(() => console.log('SMS alert sent!'))
    .catch((error) => console.error(`Error sending SMS: ${error}`));
};

// Function to check system metrics
const checkSystemMetrics = () => {
    exec('wmic cpu get loadpercentage', (error, stdout) => {
        if (error) {
            console.error(`Error fetching CPU usage: ${error}`);
            return;
        }
        const cpuUsage = parseInt(stdout.split('\n')[1].trim(), 10);
        
        exec('wmic OS get FreePhysicalMemory', (error, stdout) => {
            if (error) {
                console.error(`Error fetching Memory usage: ${error}`);
                return;
            }
            const memoryUsage = parseInt(stdout.split('\n')[1].trim(), 10);
            
            // Save metrics to the database
            const metrics = new Metrics({ cpuUsage, memoryUsage });
            metrics.save().then(() => console.log('Metrics saved!'));

            // Check conditions for alerts
            if (cpuUsage > 80) { // Example condition for high CPU usage
                sendSmsAlert(`High CPU Usage Alert: ${cpuUsage}%`);
            }
        });
    });
};

// Schedule the task to run every 5 minutes
cron.schedule('*/5 * * * *', checkSystemMetrics);
