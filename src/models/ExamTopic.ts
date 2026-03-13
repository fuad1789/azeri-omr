import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExamTopic extends Document {
  category: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  students: number;
  displayOrder: number;
  isActive: boolean;
  slug: string;
  icon: string;
  color: string;
  fullDescription: string;
  teacher: string;
  price: string;
  program: string[];
  requirements: string[];
  outcomes: string[];
  targetAudience: string;
  level: string;
  certificate: boolean;
  hours: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const examTopicSchema: Schema<IExamTopic> = new Schema(
  {
    category: {
      type: String,
      required: [true, 'Kateqoriya tələb olunur'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Mövzu adı tələb olunur'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Təsvir tələb olunur'],
      trim: true,
    },
    lessons: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: '0 saat',
    },
    students: {
      type: Number,
      default: 0,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug tələb olunur'],
      trim: true,
      unique: true,
    },
    icon: {
      type: String,
      default: 'Book',
    },
    color: {
      type: String,
      default: 'red',
    },
    fullDescription: {
      type: String,
      default: '',
    },
    teacher: {
      type: String,
      default: '',
    },
    price: {
      type: String,
      default: '',
    },
    program: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    outcomes: {
      type: [String],
      default: [],
    },
    targetAudience: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      default: 'Başlanğıc',
    },
    certificate: {
      type: Boolean,
      default: false,
    },
    hours: {
      type: Number,
      default: 0,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
examTopicSchema.index({ category: 1 });
examTopicSchema.index({ displayOrder: 1 });
examTopicSchema.index({ isActive: 1 });

const ExamTopic: Model<IExamTopic> = mongoose.models.ExamTopic || mongoose.model<IExamTopic>('ExamTopic', examTopicSchema);

export default ExamTopic;