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
        return res.json(data);
      } catch (err) {
        console.log(err);
      }
    })

    .post(async function(req, res) {
      //response will contain new book object including atleast _id and title
      try {
        let title = req.body.title;
        if (!title) {
          return res.send('missing required field title');
        }

        const newBook = new Book({
          title: title,
          comments: [],
          commentcount: 0
        })

        newBook.save()
          .then(() => {
            return res.json(newBook);
          })
          .catch(() => {
            return res.send('there was an error saving the book');
          })
      } catch (err) {
        console.log(err);
      }
    })

    .delete(async function(req, res) {
      //if successful response  will be 'complete delete successful'
      try {
        await Book.deleteMany({})
          .then(() => {
            return res.send('complete delete successful');
          })
          .catch(() => {
            return res.send('there was an error deleting');
          })
      } catch (err) {
        console.log(err);
      }
    });


  app.route('/api/books/:id')
    .get(async function(req, res) {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let bookid = req.params.id;
        if (!bookid) {
          return res.send('missing required field bookid');
        }
        const data = await Book.findById(bookid).select('_id title comments')
        if (!data) {
          return res.send('no book exists');
        } else {
          return res.json(data);
        }
      } catch (err) {
        console.log(err);
      }
    })

    .post(async function(req, res) {
      //json res format same as .get
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
        if (!bookid) {
          return res.send('missing required field bookid');
        }
        if (!comment) {
          return res.send('missing required field comment');
        }
        const findBook = await Book.findById(bookid)
        if (!findBook) {
          return res.send('no book exists');
        } else {
          findBook.comments.push(comment);
          findBook.commentcount = findBook.commentcount + 1;
          await findBook.save()
            .then(() => {
              return res.json(findBook);
            })
            .catch(() => {
              return res.send('there was an error commenting');
            })
        }
      } catch (err) {
        console.log(err);
      }
    })

    .delete(async function(req, res) {
      //if successful response will be 'delete successful'
      try {
        let bookid = req.params.id;
        if (!bookid) {
          return res.send('missing required field bookid');
        }
        const deleteBook = await Book.findById(bookid)
        if (!deleteBook) {
          return res.send('no book exists');
        } else {
          deleteBook.deleteOne()
            .then(() => {
              return res.send('delete successful');
            })
            .catch(() => {
              return res.send('there was an error deleting');
            })
        }
      } catch (err) {
        console.log(err);
      }
    });

}