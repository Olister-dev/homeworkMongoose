const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      min: 5,
      max: 400,
      required: true
    },
    subtitle: {
      type: String,
      min: 5
    },
    description: {
      type: String,
      min: 5
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
      // required: true
    },
    category: {
      type: String,
      enum: ['sport', 'game', 'history']
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('Article', ArticleSchema);
