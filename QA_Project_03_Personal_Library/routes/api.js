/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require("mongoose");

const Book = require('../models/book');

module.exports = function(app) {

  app.route('/api/books')
    .get(async function(req, res) {
      //response ill be arr ay of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const data = await Book.find({}).select('_id title commentcount')
        res.json(data);
        return;
      } catch (err) {
        console.log(err)
      }
    })

    .post(async function(req, res) {
      //response will contain new book object including atleast _id and title
      try {
        let title = req.body.title;
        if (!title) {
          res.send('missing required field title');
          return;
        }

        const newBook = new Book({
          title: title,
          comments: [],
          commentcount: 0
        })

        newBook.save()
          .then(() => {
            res.json(newBook)
            return;
          })
          .catch(() => {
            res.send('there was an error saving the book');
            return;
          })
      } catch (err) {
        console.log(err)
      }
    })

    .delete(async function(req, res) {
      //if successful response  will be 'complete delete successful'
      try {
        await Book.deleteMany({})
          .then(() => {
            res.send('complete delete successful');
            return;
          })
          .catch(() => {
            res.send('there was an error deleting');
            return;
          })
      } catch (err) {
        console.log(err)
      }
    });


  app.route('/api/books/:id')
    .get(async function(req, res) {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let bookid = req.params.id;
        if (!bookid) {
          res.send('missing required field bookid');
          return;
        }
        const data = await Book.findById(bookid).select('_id title comments')
        if (!data) {
          res.send('no book exists');
          return;
        } else {
          res.json(data);
          return;
        }
      } catch (err) {
        console.log(err)
      }
    })

    .post(async function(req, res) {
      //json res format same as .get
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
        if (!bookid) {
          res.send('missing required field bookid');
          return;
        }
        if (!comment) {
          res.send('missing required field comment');
          return;
        }
        const findBook = await Book.findById(bookid)
        if (!findBook) {
          res.send('no book exists');
          return;
        } else {
          findBook.comments.push(comment);
          findBook.commentcount = findBook.commentcount + 1;
          await findBook.save()
            .then(() => {
              res.json(findBook);
              return;
            })
            .catch(() => {
              res.send('there was an error commenting');
              return;
            })
        }
      } catch (err) {
        console.log(err)
      }
    })

    .delete(async function(req, res) {
      //if successful response will be 'delete successful'
      try {
        let bookid = req.params.id;
        if (!bookid) {
          res.send('missing required field bookid');
          return;
        }
        const deleteBook = await Book.findById(bookid)
        if (!deleteBook) {
          res.send('no book exists');
          return;
        } else {
          deleteBook.deleteOne()
            .then(() => {
              res.send('delete successful');
              return;
            })
            .catch(() => {
              res.send('there was an error deleting');
              return;
            })
        }
      } catch (err) {
        console.log(err)
      }
    });
}