import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBranch extends Document {
  name: string;           // Filial adı (məs: "Nərimanov filialı")
  address?: string;       // Ünvan
  phone?: string;         // Telefon nömrəsi
  email?: string;         // Elektron poçt
  mapUrl?: string;        // Google Maps embed URL
  isActive: boolean;      // Aktivdir?
  displayOrder: number;   // Sıralama
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    name: { 
      type: String, 
      required: [true, 'Filial adı vacibdir'],
      unique: true,
      trim: true 
    },
    address: { 
      type: String, 
      default: '' 
    },
    phone: { 
      type: String, 
      default: '' 
    },
    email: { 
      type: String, 
      default: '' 
    },
    mapUrl: { 
      type: String, 
      default: '' 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    displayOrder: { 
      type: Number, 
      default: 0 
    },
  },
  {
    collection: 'branches',
    timestamps: true,
  }
);

BranchSchema.index({ displayOrder: 1, name: 1 });

const Branch: Model<IBranch> =
  mongoose.models.Branch ||
  mongoose.model<IBranch>('Branch', BranchSchema);

export default Branch;