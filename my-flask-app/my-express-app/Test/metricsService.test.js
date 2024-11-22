const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const Metrics = require('../metricsService'); // Adjust the import based on your structure

chai.use(chaiHttp);
const { expect } = chai;

describe('Metrics Service', () => {
    before((done) => {
        // Connect to the test database
        mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            done();
        });
    });

    after((done) => {
        // Clean up the test database
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });

    it('should save metrics to the database', (done) => {
        const metrics = new Metrics({ cpuUsage: 75, memoryUsage: 2048 });
        metrics.save().then((savedMetrics) => {
            expect(savedMetrics.cpuUsage).to.equal(75);
            expect(savedMetrics.memoryUsage).to.equal(2048);
            done();
        }).catch(done);
    });
});