import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  slug: string;
  features: string[];
  duration: string;
  students: string;
  displayOrder: number;
  isActive: boolean;
  // Detallı məlumatlar
  fullDescription: string;
  lessons: number;
  hours: number;
  teacher: string;
  price: string;
  program: string[];
  requirements: string[];
  outcomes: string[];
  targetAudience: string;
  level: string;
  certificate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema: Schema<ICourse> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Kursun adı tələb olunur'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Təsvir tələb olunur'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'İkon tələb olunur'],
      default: 'BookOpen',
    },
    color: {
      type: String,
      required: [true, 'Rəng tələb olunur'],
      default: 'blue',
      enum: ['blue', 'green', 'red', 'yellow', 'pink', 'purple', 'orange', 'indigo', 'teal', 'cyan'],
    },
    href: {
      type: String,
      required: [true, 'URL tələb olunur'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug tələb olunur'],
      trim: true,
      unique: true,
    },
    features: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      default: '9 ay',
    },
    students: {
      type: String,
      default: '0+',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Detallı məlumatlar
    fullDescription: {
      type: String,
      default: '',
    },
    lessons: {
      type: Number,
      default: 0,
    },
    hours: {
      type: Number,
      default: 0,
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
      enum: ['Başlanğıc', 'Orta', 'İrəli', 'Hər səviyyə'],
    },
    certificate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
courseSchema.index({ displayOrder: 1 });
courseSchema.index({ isActive: 1 });
courseSchema.index({ slug: 1 });

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);

export default Course;