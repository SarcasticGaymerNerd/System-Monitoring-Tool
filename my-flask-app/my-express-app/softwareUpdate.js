const cron = require('node-cron');
const { exec } = require('child_process');

// Function to update software (example for npm packages)
const updateSoftware = () => {
    exec('npm update -g', (error) => {
        if (error) {
            console.error(`Error updating software: ${error}`);
            return;
        }
        console.log('Software updated successfully!');
    });
};

// Schedule the update to run weekly on Mondays at 3 AM
cron.schedule('0 3 * * 1', updateSoftware);