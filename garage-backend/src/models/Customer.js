import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a customer name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true,
      trim: true,
      match: [
        /^\+?[0-9\s\-()]{7,15}$/,
        'Please add a valid phone number'
      ]
    },
    address: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;
