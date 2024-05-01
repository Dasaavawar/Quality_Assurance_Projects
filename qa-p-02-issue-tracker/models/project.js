const mongoose = require('mongoose');
const { Schema } = mongoose;
const Issue = require('./issue');

const projectSchema = new Schema({
  name: { type: String, required: true },
  issues: [{ type: Schema.Types.ObjectId, ref: Issue }]
})

module.exports = mongoose.model('Project', projectSchema)