import mongoose from 'mongoose';

const PartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a part name'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity used'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Please add price per unit'],
    min: [0, 'Price cannot be negative'],
    default: 0
  }
});

const ServiceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Service request must be associated with a customer reference']
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Service request must be associated with a vehicle reference']
    },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: {
      type: String,
      required: [true, 'Please add a service request issue/description'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'diagnosing', 'waiting_parts', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    laborCost: {
      type: Number,
      default: 0,
      min: [0, 'Labor cost cannot be negative']
    },
    parts: [PartSchema],
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    // Enable virtual fields to populate automatically in JSON responses
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual calculation for totalCost (laborCost + total parts costs)
ServiceRequestSchema.virtual('totalCost').get(function () {
  const partsCost = this.parts.reduce((sum, part) => sum + (part.price * part.quantity), 0);
  return this.laborCost + partsCost;
});

const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema);
export default ServiceRequest;
