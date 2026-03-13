import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  excerpt: string;
  image: string;
  date: Date;
  category: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema: Schema<INews> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Xəbərin başlığı tələb olunur'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Məzmun tələb olunur'],
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Qısa məzmun tələb olunur'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      default: 'Ümumi',
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

newsSchema.index({ displayOrder: 1 });
newsSchema.index({ isActive: 1 });
newsSchema.index({ date: -1 });

const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', newsSchema);

export default News;