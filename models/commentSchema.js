const { Schema, model } = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const sanitizePlugin = (schema) => {
  schema.pre('save', function (next) {
    const sanitizeOptions = {
      allowedTags: [], 
      allowedAttributes: {},
      allowedIframeDomains: []
    };


    const doc = this.toObject();

    Object.keys(doc).forEach((key) => {
      if (typeof doc[key] === 'string') {
        this[key] = sanitizeHtml(doc[key], sanitizeOptions);
      }
    });

    next();
  });
};


const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "Blog"
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

commentSchema.plugin(sanitizePlugin);


module.exports = model("Comment", commentSchema);
