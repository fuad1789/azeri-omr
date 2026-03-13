import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISuccessStory extends Document {
  name: string;
  university: string;
  faculty: string;
  score: number;
  year: number;
  department: string;
  image: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const successStorySchema: Schema<ISuccessStory> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Ad tələb olunur'],
      trim: true,
    },
    university: {
      type: String,
      required: [true, 'Universitet tələb olunur'],
      trim: true,
    },
    faculty: {
      type: String,
      default: '',
      trim: true,
    },
    score: {
      type: Number,
      required: [true, 'Bal tələb olunur'],
    },
    year: {
      type: Number,
      required: [true, 'İl tələb olunur'],
    },
    department: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

successStorySchema.index({ displayOrder: 1 });
successStorySchema.index({ isActive: 1 });
successStorySchema.index({ year: -1 });
successStorySchema.index({ score: -1 });

const SuccessStory: Model<ISuccessStory> = mongoose.models.SuccessStory || mongoose.model<ISuccessStory>('SuccessStory', successStorySchema);

export default SuccessStory;