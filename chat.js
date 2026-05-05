import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    subjects: {
      type: [String],
      default: [],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Remove password from JSON output
teacherSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
