import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    licenseNumber: {
      type: String,
      trim: true,
      default: '',
    },
    licenseType: {
      type: String,
      required: [true, 'License type is required'],
      trim: true,
    },
    availability: {
      days: {
        type: [String],
        default: [],
      },
      timeSlot: {
        from: { type: String, default: '' },
        to: { type: String, default: '' },
      },
    },
  },
  { timestamps: true }
);

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;

