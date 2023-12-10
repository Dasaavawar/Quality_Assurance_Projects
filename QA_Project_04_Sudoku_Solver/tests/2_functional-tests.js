const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const { before, test, after } = require('mocha');

chai.use(chaiHttp);

const server = require('../server');

suite('Functional Tests', () => {

  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function done() {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
        done()
      })
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function done() {
    chai.request(server)
      .post('/api/solve')
      .send()
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, "Required field missing")
        done()
      })
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function done() {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...f' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, "Invalid characters in puzzle")
        done()
      })
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function done() {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...17' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
        done()
      })
  });
  
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function done() {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.7' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, "Puzzle cannot be solved")
        done()
      })
  });
  
  test("Check a puzzle placement with all fields: POST request to /api/check", function done() {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '827549163531672894649831527496157382218396475753284916962415738185763249374928651', coordinate: 'A1', value: 8 })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.valid, true)
        done()
      })
  });
  
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function done() {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: 4 })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.valid, false)
        assert.deepEqual(res.body.conflict, ["row"])
        done()
      })
  });
  
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function done() {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3', coordinate: 'A3', value: 3 })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.valid, false)
        assert.deepEqual(res.body.conflict, ["row", "region"])
        done()
      })
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function done() {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', coordinate: 'B3', value: 7 })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.valid, false)
        assert.deepEqual(res.body.conflict, ["row", "column", "region"])
        done()
      })
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", function done() {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, "Required field(s) missing")
        done()
      })
  });
 
  test("Check a puzzle placement with invalid characters: POST request to /api/check", function done() {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.5f', coordinate: 'C2', value: 1 })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, "Invalid characters in puzzle")
        done()
      })
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", function done() {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.7', coordinate: 'E1', value: 2 })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
        done()
      })
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function done() {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3', coordinate: 'Y6', value: 9 })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, "Invalid coordinate")
        done()
      })
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function done() {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', coordinate: 'D4', value: 's' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, "Invalid value")
        done()
      })
  });
  
});
