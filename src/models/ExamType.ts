import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExamType extends Document {
  name: string;           // İmtahan növünün adı (məs: "9-cu sinif attestat")
  description?: string;   // Təsvir (istəyə bağlı)
  price?: number;         // Ödəniş məbləği (AZN) - bir dəfəlik ödəniş
  isActive: boolean;      // Aktivdir?
  displayOrder: number;   // Sıralama
  createdAt: Date;
  updatedAt: Date;
}

const ExamTypeSchema = new Schema<IExamType>(
  {
    name: {
      type: String,
      required: [true, "İmtahan növü adı vacibdir"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
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
    collection: "examTypes",
    timestamps: true,
  },
);

ExamTypeSchema.index({ displayOrder: 1, name: 1 });

const ExamType: Model<IExamType> =
  mongoose.models.ExamType ||
  mongoose.model<IExamType>("ExamType", ExamTypeSchema);

export default ExamType;
