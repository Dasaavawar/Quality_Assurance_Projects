const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const { before, test, after } = require('mocha');
const server = require('../server');
const Project = require('../models/project');
const Issue = require('../models/issue');
require("../config/db-connection");

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let firstId;
  let secondId;
  let wrongId = "646fa4877eff82a70579bd8e";

  before(async function() {
    const projectName = 'testproject';
    const project = await Project.findOne({ name: projectName });
    if (project) {
      const issueIds = project.issues;
      await Issue.deleteMany({ _id: { $in: issueIds } });
      await project.deleteOne({ name: projectName });
    }
  });

  test("Create an issue with every field: POST request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .post("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        issue_title: "First issue",
        issue_text: "Text for test",
        created_by: "Da",
        assigned_to: "Joe",
        status_text: "Priority",
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "First issue");
        assert.equal(res.body.issue_text, "Text for test");
        assert.equal(res.body.created_by, "Da");
        assert.equal(res.body.assigned_to, "Joe");
        assert.equal(res.body.status_text, "Priority");
        firstId = res.body._id;
        done();
      });
  })

  test("Create an issue with only required fields: POST request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .post("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        issue_title: "Second issue",
        issue_text: "Text for test",
        created_by: "Da"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Second issue");
        assert.equal(res.body.issue_text, "Text for test");
        assert.equal(res.body.created_by, "Da");
        secondId = res.body._id;
        done();
      });

  })

  test("Create an issue with missing required fields: POST request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .post("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        issue_title: "First issue",
        issue_text: "Text for test"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  })

  test("View issues on a project: GET request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .get("/api/issues/testproject")
      .set("content-type", "application/json")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 2);
        done();
      });
  })

  test("View issues on a project with one filter: GET request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .get("/api/issues/testproject?open=true")
      .set("content-type", "application/json")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 2);
        done();
      });
  })

  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .get("/api/issues/testproject?open=true&assigned_to=Joe")
      .set("content-type", "application/json")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 1);
        done();
      });
  })

  test("Update one field on an issue: PUT request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        _id: firstId,
        issue_title: "First title",
        issue_text: "Text for test",
        created_by: "Da",
        assigned_to: "Joe",
        status_text: "Priority",
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, firstId)
        done();
      });
  })

  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        _id: secondId,
        issue_title: "Second title",
        issue_text: "Text for test",
        created_by: "Da",
        assigned_to: "Joe",
        status_text: "Nevermind",
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, secondId)
        done();
      });
  })

  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        issue_title: "Second title",
        issue_text: "Text for test",
        created_by: "Da",
        assigned_to: "Joe",
        status_text: "Nevermind",
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  })

  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        _id: firstId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.equal(res.body._id, firstId);
        done();
      });
  })

  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        _id: wrongId,
        issue_title: "Second title"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, wrongId);
        done();
      });
  })

  test("Delete an issue: DELETE request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .delete("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        _id: firstId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, firstId);
        done();
      });
  })

  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .delete("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({
        _id: wrongId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, wrongId);
        done();
      });
  })

  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function(done) {
    chai
      .request(server)
      .delete("/api/issues/testproject")
      .set("content-type", "application/json")
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  })

  after(function() {
    chai.request(server)
      .get('/');
  })
});