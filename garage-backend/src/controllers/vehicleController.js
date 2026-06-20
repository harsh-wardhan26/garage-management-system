import Vehicle from '../models/Vehicle.js';
import Customer from '../models/Customer.js';

/**
 * @desc    Add a vehicle associated with a customer
 * @route   POST /api/vehicles
 * @access  Private (Admin, Manager, Receptionist)
 */
export const addVehicle = async (req, res, next) => {
  try {
    const { licensePlate, make, model, year, color, vin, mileage, customer } = req.body;

    // Verify target customer profile exists
    const customerExists = await Customer.findById(customer);
    if (!customerExists) {
      return res.status(404).json({
        success: false,
        error: 'Associated customer reference profile not found'
      });
    }

    // Validate license plate uniqueness
    const plateExists = await Vehicle.findOne({ licensePlate });
    if (plateExists) {
      return res.status(400).json({
        success: false,
        error: 'Vehicle with this license plate is already registered'
      });
    }

    // Validate VIN uniqueness if provided
    if (vin) {
      const vinExists = await Vehicle.findOne({ vin });
      if (vinExists) {
        return res.status(400).json({
          success: false,
          error: 'Vehicle with this VIN number is already registered'
        });
      }
    }

    const vehicle = await Vehicle.create({
      licensePlate,
      make,
      model,
      year,
      color,
      vin,
      mileage,
      customer
    });

    res.status(201).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit details of a registered vehicle
 * @route   PUT /api/vehicles/:id
 * @access  Private (Admin, Manager, Receptionist)
 */
export const updateVehicle = async (req, res, next) => {
  try {
    const { licensePlate, make, model, year, color, vin, mileage, customer } = req.body;

    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle record not found'
      });
    }

    // Verify customer exists if customer mapping is changing
    if (customer && customer !== vehicle.customer.toString()) {
      const customerExists = await Customer.findById(customer);
      if (!customerExists) {
        return res.status(404).json({
          success: false,
          error: 'Associated customer profile not found'
        });
      }
    }

    // Validate license plate uniqueness if changing
    if (licensePlate && licensePlate !== vehicle.licensePlate) {
      const plateExists = await Vehicle.findOne({ licensePlate });
      if (plateExists) {
        return res.status(400).json({
          success: false,
          error: 'License plate is already registered to another vehicle'
        });
      }
    }

    // Validate VIN uniqueness if changing
    if (vin && vin !== vehicle.vin) {
      const vinExists = await Vehicle.findOne({ vin });
      if (vinExists) {
        return res.status(400).json({
          success: false,
          error: 'VIN number is already registered to another vehicle'
        });
      }
    }

    vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { licensePlate, make, model, year, color, vin, mileage, customer },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a vehicle record
 * @route   DELETE /api/vehicles/:id
 * @access  Private (Admin, Manager)
 */
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle record not found'
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Vehicle record deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    View single vehicle details populated with customer information
 * @route   GET /api/vehicles/:id
 * @access  Private
 */
export const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('customer');
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    View list of all vehicles (filter by customer optionally)
 * @route   GET /api/vehicles
 * @access  Private
 */
export const getVehicles = async (req, res, next) => {
  try {
    const { customer } = req.query;

    const query = {};
    if (customer) {
      query.customer = customer;
    }

    const vehicles = await Vehicle.find(query).populate('customer').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    View vehicle service/maintenance history logs
 * @route   GET /api/vehicles/:id/history
 * @access  Private
 */
export const getVehicleHistory = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle record not found'
      });
    }

    // Mock history records; can be mapped to a real jobCards/appointments schema later
    const history = [
      {
        id: 'h1',
        date: '2026-05-10',
        mileage: vehicle.mileage - 1500 > 0 ? vehicle.mileage - 1500 : 500,
        serviceType: 'Routine Maintenance Check',
        description: 'Engine oil fluid top-up, filter clean, tyre alignment adjustment.',
        cost: 150,
        status: 'Completed'
      },
      {
        id: 'h2',
        date: '2026-02-14',
        mileage: vehicle.mileage - 5000 > 0 ? vehicle.mileage - 5000 : 0,
        serviceType: 'Brake Servicing',
        description: 'Replaced rear and front brake pads, serviced brake fluid reservoir.',
        cost: 320,
        status: 'Completed'
      }
    ];

    res.status(200).json({
      success: true,
      vehicle: {
        id: vehicle._id,
        licensePlate: vehicle.licensePlate,
        make: vehicle.make,
        model: vehicle.model
      },
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};
