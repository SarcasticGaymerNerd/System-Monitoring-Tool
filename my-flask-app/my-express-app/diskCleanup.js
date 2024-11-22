const cron = require('node-cron');
const { exec } = require('child_process');

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