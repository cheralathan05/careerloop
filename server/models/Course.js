import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true,
    trim: true
  },
  provider: { 
    type: String,
    required: true,
    trim: true
  },
  url: { 
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+$/i.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  domain: { 
    type: String,
    required: true,
    index: true
  },
  level: { 
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Beginner'
  }
}, { 
  timestamps: true
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;
