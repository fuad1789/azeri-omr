import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVacancy extends Document {
  title: string;
  description: string;
  requirements: string[];
  department: string;
  branch: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const vacancySchema: Schema<IVacancy> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Vakansiyanın adı tələb olunur'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Təsvir tələb olunur'],
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    department: {
      type: String,
      required: [true, 'Şöbə tələb olunur'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Filial tələb olunur'],
      trim: true,
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

vacancySchema.index({ displayOrder: 1 });
vacancySchema.index({ isActive: 1 });

const Vacancy: Model<IVacancy> = mongoose.models.Vacancy || mongoose.model<IVacancy>('Vacancy', vacancySchema);

export default Vacancy;