import mongoose, { Document, Schema } from 'mongoose';

// Define lesson interface and schema
interface ILesson extends Document {
  title: string;
  description: string;
  content: string;
  contentType: 'text' | 'video' | 'interactive';
  duration: number; // in minutes
  xpReward: number;
  tokenReward: number;
  order: number;
}

const LessonSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required'],
  },
  contentType: {
    type: String,
    enum: ['text', 'video', 'interactive'],
    default: 'text',
  },
  duration: {
    type: Number,
    required: [true, 'Lesson duration is required'],
    min: 1,
  },
  xpReward: {
    type: Number,
    default: 10,
  },
  tokenReward: {
    type: Number,
    default: 1,
  },
  order: {
    type: Number,
    required: [true, 'Lesson order is required'],
  },
});

// Define quiz interface and schema
interface IQuiz extends Document {
  title: string;
  description: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  passingScore: number;
  xpReward: number;
  tokenReward: number;
}

const QuizSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
    trim: true,
  },
  questions: [{
    question: {
      type: String,
      required: [true, 'Question text is required'],
    },
    options: [{
      type: String,
      required: [true, 'Options are required'],
    }],
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer is required'],
    },
  }],
  passingScore: {
    type: Number,
    required: [true, 'Passing score is required'],
    min: 1,
  },
  xpReward: {
    type: Number,
    default: 50,
  },
  tokenReward: {
    type: Number,
    default: 5,
  },
});

// Define course interface
export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnailUrl: string;
  creator: mongoose.Types.ObjectId;
  lessons: ILesson[];
  quiz: IQuiz;
  totalDuration: number;
  totalXpReward: number;
  totalTokenReward: number;
  prerequisites: mongoose.Types.ObjectId[];
  isPublished: boolean;
  enrollmentCount: number;
  completionCount: number;
  averageRating: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Create course schema
const CourseSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    thumbnailUrl: {
      type: String,
      default: '/images/default-course.png',
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Course creator is required'],
    },
    lessons: [LessonSchema],
    quiz: QuizSchema,
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalXpReward: {
      type: Number,
      default: 0,
    },
    totalTokenReward: {
      type: Number,
      default: 0,
    },
    prerequisites: [{
      type: Schema.Types.ObjectId,
      ref: 'Course',
    }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    completionCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Calculate total course metrics before saving
CourseSchema.pre<ICourse>('save', function(next) {
  // Only recalculate if lessons changed
  if (this.isModified('lessons') || this.isModified('quiz')) {
    let totalDuration = 0;
    let totalXpReward = 0;
    let totalTokenReward = 0;
    
    // Calculate from lessons
    this.lessons.forEach(lesson => {
      totalDuration += lesson.duration;
      totalXpReward += lesson.xpReward;
      totalTokenReward += lesson.tokenReward;
    });
    
    // Add quiz rewards
    if (this.quiz) {
      totalXpReward += this.quiz.xpReward;
      totalTokenReward += this.quiz.tokenReward;
    }
    
    this.totalDuration = totalDuration;
    this.totalXpReward = totalXpReward;
    this.totalTokenReward = totalTokenReward;
  }
  
  next();
});

export default mongoose.model<ICourse>('Course', CourseSchema); 