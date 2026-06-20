import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema(
  {
    licensePlate: {
      type: String,
      required: [true, 'Please add a license plate number'],
      unique: true,
      trim: true,
      uppercase: true
    },
    make: {
      type: String,
      required: [true, 'Please add a vehicle make (e.g. Toyota, Honda)'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Please add a vehicle model (e.g. Corolla, Civic)'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Please add the manufacturing year'],
      min: [1886, 'Manufacturing year cannot be before the invention of the automobile (1886)'],
      max: [new Date().getFullYear() + 2, 'Vehicle year is too far in the future']
    },
    color: {
      type: String,
      trim: true
    },
    vin: {
      type: String,
      unique: true,
      sparse: true, // allows null/empty values to bypass uniqueness check
      trim: true,
      uppercase: true,
      match: [
        /^[A-HJ-NPR-Z0-9]{17}$/,
        'Please enter a valid 17-character VIN standard'
      ]
    },
    mileage: {
      type: Number,
      required: [true, 'Please enter current vehicle mileage'],
      min: [0, 'Mileage cannot be less than 0']
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Vehicle must be associated with a customer reference']
    }
  },
  {
    timestamps: true
  }
);

const Vehicle = mongoose.model('Vehicle', VehicleSchema);
export default Vehicle;
