const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust the import based on your structure
const { expect } = chai;

chai.use(chaiHttp);

describe('API Endpoints', () => {
    it('should return metrics data', (done) => {
        chai.request(server)
            .get('/api/metrics') // Adjust the endpoint based on your API
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array'); // Assuming it returns an array of metrics
                done();
            });
    });

    it('should create new metrics', (done) => {
        chai.request(server)
            .post('/api/metrics') // Adjust the endpoint based on your API
            .send({ cpuUsage: 85, memoryUsage: 4096 })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.cpuUsage).to.equal(85);
                expect(res.body.memoryUsage).to.equal(4096);
                done();
            });
    });
});