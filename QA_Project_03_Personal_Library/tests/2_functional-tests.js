/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const { before, test, after } = require('mocha');

chai.use(chaiHttp);

const server = require('../server');
const Book = require('../models/book');
require("../config/db-connection");

suite('Functional Tests', function() {

  let firstId;
  let wrongId = "646fa4877eff82a70579bd8e";

  before(async function() {
    await Book.deleteMany();
    await Book.create({ title: 'The Bible', comments: [], commentcount: 0 })
  });

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done) {
    chai.request(server)
      .get('/api/books')
      .end(function(err, res) {
        assert.equal(res.status, 200)
        assert.isArray(res.body, 'response should be an array')
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
        assert.property(res.body[0], 'title', 'Books in array should contain title')
        assert.property(res.body[0], '_id', 'Books in array should contain _id')
        done()
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .set("content-type", "application/json")
          .send({
            title: "Don Qixote"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.title, "Don Qixote")
            assert.deepEqual(res.body.comments, [])
            assert.equal(res.body.commentcount, 0)
            firstId = res.body._id
            done()
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .set("content-type", "application/json")
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required field title')
            done()
          });
      });

    });

    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .set("content-type", "application/json")
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 2)
            done()
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .get(`/api/books/${wrongId}`)
          .set("content-type", "application/json")
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .get(`/api/books/${firstId}`)
          .set("content-type", "application/json")
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.title, "Don Qixote")
            assert.deepEqual(res.body.comments, [])
            done()
          });
      });

    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai.request(server)
          .post(`/api/books/${firstId}`)
          .set("content-type", "application/json")
          .send({
            comment: "Great novel"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.title, "Don Qixote")
            assert.deepEqual(res.body.comments, ['Great novel'])
            done()
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai.request(server)
          .post(`/api/books/${firstId}`)
          .set("content-type", "application/json")
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required field comment')
            done()
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai.request(server)
          .post(`/api/books/${wrongId}`)
          .set("content-type", "application/json")
          .send({
            comment: "Inspirational"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .delete(`/api/books/${firstId}`)
          .set("content-type", "application/json")
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'delete successful')
            done()
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .delete(`/api/books/${wrongId}`)
          .set("content-type", "application/json")
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          });
      });

    });

  });

  after(function() {
    chai.request(server)
      .get('/')
  });
  
});
