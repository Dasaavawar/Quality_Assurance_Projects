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

          return res.json(filteredIssues);
        }
      } catch (err) {
        console.log(err);
      }
    })

    .post(async function(req, res) {
      try {
        let project = req.params.project;
        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

        if (!issue_title || !issue_text || !created_by) {
          return res.json({ error: 'required field(s) missing' });
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
              return res.json(newIssue);
            })
            .catch(() => {
              return res.json({ error: 'there was an error saving the issue' });
            })
        } else {
          findProject.issues.push(newIssue);
          findProject
            .save()
            .then(() => {
              return res.json(newIssue);
            })
            .catch(() => {
              return res.json({ error: 'there was an error saving the issue' });
            })
        }
      } catch (err) {
        console.log(err);
      }
    })

    .put(async function(req, res) {
      try {
        const { _id, open, issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

        if (!_id) {
          return res.json({ error: 'missing _id' });
        }

        if (!open && !issue_title && !issue_text && !created_by && !assigned_to && !status_text) {
          return res.json({ error: 'no update field(s) sent', '_id': _id });
        }

        const existingIssue = await Issue.findById(_id)

        if (!existingIssue) {
          return res.json({ error: 'could not update', '_id': _id });
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
              return res.json({ result: 'successfully updated', '_id': _id });
            })
            .catch(() => {
              return res.json({ error: 'could not update', '_id': _id });
            });
        }

      } catch (err) {
        const { _id } = req.body;
        return res.json({ error: 'could not update', '_id': _id });
      }
    })

    .delete(async function(req, res) {
      try {
        let project = req.params.project;
        const { _id } = req.body;
        if (!_id) {
          return res.json({ error: 'missing _id' });
        }
        const deleteIssue = await Issue.findById(_id)
        if (!deleteIssue) {
          return res.json({ error: 'could not delete', '_id': _id });
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
                  return res.json({ result: 'successfully deleted', '_id': _id });
                }
              }
            })
            .catch(() => {
              return res.json({ error: 'could not delete', '_id': _id });
            });
        }
      } catch (err) {
        const { _id } = req.body;
        return res.json({ error: 'could not delete', '_id': _id });
      }
    });

};