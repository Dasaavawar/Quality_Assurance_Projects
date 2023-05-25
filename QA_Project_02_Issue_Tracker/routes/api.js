'use strict';
const mongoose = require("mongoose");

const Project = require('../models/project');
const Issue = require('../models/issue');

const ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {

  app.route('/api/issues/:project')
    .get(async function(req, res) {
      try {
        let project = req.params.project;
        const { _id, open, issue_title, issue_text, created_by, assigned_to, status_text } = req.query;

        const data = await Project.aggregate([
          { $match: { name: project } },

          { $lookup: { from: 'issues', localField: 'issues', foreignField: '_id', as: 'issues' } }
        ]);

        if (!data || data.length == 0) {
          res.json([]);
          return;
        } else if (data.length > 0) {
          let filteredIssues = data[0].issues;
          const filters = {};

          if (_id) {
            filters['_id'] = _id;
          }
          if (open !== undefined) {
            filters['open'] = open === 'true';
          }
          if (issue_title) {
            filters['issue_title'] = issue_title;
          }
          if (issue_text) {
            filters['issue_text'] = issue_text;
          }
          if (created_by) {
            filters['created_by'] = created_by;
          }
          if (assigned_to) {
            filters['assigned_to'] = assigned_to;
          }
          if (status_text) {
            filters['status_text'] = status_text;
          }

          filteredIssues = filteredIssues.filter(issue => {
            for (let key in filters) {
              if (issue[key] != filters[key]) {
                return false;
              }
            }
            return true;
          });

          res.json(filteredIssues);
          return;
        }
      } catch (err) {
        console.log(err)
      }
    })

    .post(async function(req, res) {
      try {
        let project = req.params.project;
        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

        if (!issue_title || !issue_text || !created_by) {
          res.json({ error: 'required field(s) missing' });
          return;
        }

        const newIssue = new Issue({
          issue_title: issue_title || "",
          issue_text: issue_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || "",
          assigned_to: assigned_to || "",
          open: true,
          status_text: status_text || ""
        });

        newIssue.save()

        const findProject = await Project.findOne({ name: project })
        if (!findProject) {
          const newProject = new Project({ name: project });
          newProject.issues.push(newIssue);
          await newProject
            .save()
            .then(() => {
              res.json(newIssue)
              return;
            })
            .catch(() => {
              res.json({ error: 'there was an error saving the issue' });
              return;
            })
        } else {
          findProject.issues.push(newIssue);
          findProject
            .save()
            .then(() => {
              res.json(newIssue)
              return;
            })
            .catch(() => {
              res.json({ error: 'there was an error saving the issue' });
              return;
            })
        }
      } catch (err) {
        console.log(err)
      }
    })

    .put(async function(req, res) {
      try {
        const { _id, open, issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

        if (!_id) {
          res.json({ error: 'missing _id' });
          return;
        }

        if (!open && !issue_title && !issue_text && !created_by && !assigned_to && !status_text) {
          res.json({ error: 'no update field(s) sent', '_id': _id });
          return;
        }

        const existingIssue = await Issue.findById(_id)

        if (!existingIssue) {
          res.json({ error: 'could not update', '_id': _id });
          return;
        } else {
          if (issue_title) {
            existingIssue.issue_title = issue_title || existingIssue.issue_title;
          }
          if (issue_text) {
            existingIssue.issue_text = issue_text || existingIssue.issue_text;
          }
          if (created_by) {
            existingIssue.created_by = created_by || existingIssue.created_by;
          }
          if (assigned_to) {
            existingIssue.assigned_to = assigned_to || existingIssue.assigned_to;
          }
          if (status_text) {
            existingIssue.status_text = status_text || existingIssue.status_text;
          }
          if (open) {
            existingIssue.open = open || existingIssue.open;
          }
          existingIssue.updated_on = new Date();

          await existingIssue
            .save()
            .then(() => {
              res.json({ result: 'successfully updated', '_id': _id })
              return;
            })
            .catch(() => {
              res.json({ error: 'could not update', '_id': _id });
              return;
            });
        }

      } catch (err) {
        const { _id } = req.body;
        res.json({ error: 'could not update', '_id': _id });
        return;
      }
    })

    .delete(async function(req, res) {
      try {
        let project = req.params.project;
        const { _id } = req.body;
        if (!_id) {
          res.json({ error: 'missing _id' });
          return;
        }
        const deleteIssue = await Issue.findById(_id)
        if (!deleteIssue) {
          res.json({ error: 'could not delete', '_id': _id });
          return;
        } else {
          deleteIssue
            .deleteOne()
            .then(async () => {
              if (project) {
                const findProject = await Project.findOne({ name: project });
                if (findProject) {
                  const updatedIssues = findProject.issues.filter(issueId => issueId.toString() != _id);
                  findProject.issues = updatedIssues;
                  await findProject.save();
                  res.json({ result: 'successfully deleted', '_id': _id });
                  return;
                }
              }
            })
            .catch(() => {
              res.json({ error: 'could not delete', '_id': _id });
              return;
            });
        }
      } catch (err) {
        const { _id } = req.body;
        res.json({ error: 'could not delete', '_id': _id });
        return;
      }
    });

};
// findProject.save().then(data => {})