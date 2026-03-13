import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVacancyApplication extends Document {
  vacancyId: string;
  name: string;
  surname: string;
  specialty: string;
  department: string;
  branch: string;
  birthDate: Date;
  phone: string;
  email: string;
  cvUrl: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const vacancyApplicationSchema: Schema<IVacancyApplication> = new Schema(
  {
    vacancyId: {
      type: String,
      required: [true, 'Vakansiya ID-si tələb olunur'],
    },
    name: {
      type: String,
      required: [true, 'Ad tələb olunur'],
      trim: true,
    },
    surname: {
      type: String,
      required: [true, 'Soyad tələb olunur'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'İxtisas tələb olunur'],
      trim: true,
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
    birthDate: {
      type: Date,
      required: [true, 'Doğum tarixi tələb olunur'],
    },
    phone: {
      type: String,
      required: [true, 'Telefon tələb olunur'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'E-mail tələb olunur'],
      trim: true,
    },
    cvUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

vacancyApplicationSchema.index({ status: 1 });
vacancyApplicationSchema.index({ createdAt: -1 });
vacancyApplicationSchema.index({ vacancyId: 1 });

const VacancyApplication: Model<IVacancyApplication> = mongoose.models.VacancyApplication || mongoose.model<IVacancyApplication>('VacancyApplication', vacancyApplicationSchema);

export default VacancyApplication;