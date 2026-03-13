import mongoose, { Document, Schema } from 'mongoose';

export interface IExamRegistration extends Document {
  fullName: string;
  phone: string;
  email?: string;
  examType: string;
  location: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod?: 'whatsapp' | 'check'; // Ödəniş üsulu: WhatsApp və ya çək
  checkImages?: string[]; // Çək şəkillərinin yolları
  createdAt: Date;
  updatedAt: Date;
}

const ExamRegistrationSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Ad və soyad tələb olunur'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Telefon nömrəsi tələb olunur'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    examType: {
      type: String,
      required: [true, 'İmtahan növü tələb olunur'],
      // enum məhdudiyyəti yoxdur - dinamik olaraq API-dən gələn dəyərlər qəbul edilir
    },
    location: {
      type: String,
      required: [true, 'Filial tələb olunur'],
      // enum məhdudiyyəti yoxdur - dinamik olaraq API-dən gələn dəyərlər qəbul edilir
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['whatsapp', 'check'],
      default: 'whatsapp',
    },
    checkImages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose modelini yarat
export const ExamRegistration =
  mongoose.models.ExamRegistration ||
  mongoose.model<IExamRegistration>('ExamRegistration', ExamRegistrationSchema);