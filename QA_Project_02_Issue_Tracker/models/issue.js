const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, required: true },
  updated_on: { type: Date, required: true },
  created_by: { type: String, required: false },
  assigned_to: { type: String, required: false },
  open: { type: Boolean, required: true, default: true },
  status_text: { type: String, required: false }
});

module.exports = mongoose.model('Issue', issueSchema)