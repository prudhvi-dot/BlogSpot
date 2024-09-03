const{Schema, model} = require('mongoose');
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

const blogSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    coverImage: {
            url: String,
            fileName: String
        },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true});

blogSchema.plugin(sanitizePlugin);

module.exports = model("Blog", blogSchema); 