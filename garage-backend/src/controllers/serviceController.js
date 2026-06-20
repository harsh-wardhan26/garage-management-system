import ServiceRequest from '../models/ServiceRequest.js';
import Customer from '../models/Customer.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

/**
 * @desc    Create a new service request
 * @route   POST /api/services
 * @access  Private (Admin, Manager, Receptionist)
 */
export const createServiceRequest = async (req, res, next) => {
  try {
    const { customer, vehicle, description, laborCost, parts } = req.body;

    // Verify customer exists
    const customerExists = await Customer.findById(customer);
    if (!customerExists) {
      return res.status(404).json({
        success: false,
        error: 'Customer profile not found'
      });
    }

    // Verify vehicle exists
    const vehicleExists = await Vehicle.findById(vehicle);
    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle record not found'
      });
    }

    // Create service request
    const serviceRequest = await ServiceRequest.create({
      customer,
      vehicle,
      description,
      laborCost: laborCost || 0,
      parts: parts || []
    });

    res.status(201).json({
      success: true,
      data: serviceRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign a mechanic to a service request
 * @route   PATCH /api/services/:id/mechanic
 * @access  Private (Admin, Manager)
 */
export const assignMechanic = async (req, res, next) => {
  try {
    const { mechanicId } = req.body;

    // Verify mechanic exists and belongs to correct role
    const mechanicUser = await User.findById(mechanicId);
    if (!mechanicUser) {
      return res.status(404).json({
        success: false,
        error: 'Mechanic user not found'
      });
    }

    if (mechanicUser.role !== 'Mechanic' && mechanicUser.role !== 'Admin' && mechanicUser.role !== 'Manager') {
      return res.status(400).json({
        success: false,
        error: 'Assigned user does not possess required service/mechanic role authorizations'
      });
    }

    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { mechanic: mechanicId },
      { new: true, runValidators: true }
    ).populate('customer').populate('vehicle').populate('mechanic');

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: serviceRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Transition status of service request
 * @route   PATCH /api/services/:id/status
 * @access  Private (Admin, Manager, Mechanic, Receptionist)
 */
export const changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'diagnosing', 'waiting_parts', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status transition: ${status}. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updateFields = { status };
    if (status === 'completed') {
      updateFields.completedAt = new Date();
    } else {
      updateFields.$unset = { completedAt: 1 }; // Unsets completion timestamp if status moved back
    }

    // Handle update
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('customer').populate('vehicle').populate('mechanic');

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: serviceRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update service request general fields (Labor cost, Parts list, description)
 * @route   PUT /api/services/:id
 * @access  Private (Admin, Manager, Receptionist)
 */
export const updateServiceRequest = async (req, res, next) => {
  try {
    const { description, laborCost, parts } = req.body;

    let serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found'
      });
    }

    serviceRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { description, laborCost, parts },
      { new: true, runValidators: true }
    ).populate('customer').populate('vehicle').populate('mechanic');

    res.status(200).json({
      success: true,
      data: serviceRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    View single service request details
 * @route   GET /api/services/:id
 * @access  Private
 */
export const getServiceRequest = async (req, res, next) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
      .populate('customer')
      .populate('vehicle')
      .populate('mechanic');

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: serviceRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    View list of all service requests (with optional filters)
 * @route   GET /api/services
 * @access  Private
 */
export const getServiceRequests = async (req, res, next) => {
  try {
    const { status, customer, vehicle, mechanic } = req.query;

    const query = {};
    if (status) query.status = status;
    if (customer) query.customer = customer;
    if (vehicle) query.vehicle = vehicle;
    if (mechanic) query.mechanic = mechanic;

    const serviceRequests = await ServiceRequest.find(query)
      .populate('customer')
      .populate('vehicle')
      .populate('mechanic')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: serviceRequests.length,
      data: serviceRequests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    View service history of a specific vehicle
 * @route   GET /api/services/vehicle/:vehicleId
 * @access  Private
 */
export const getVehicleHistory = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    // Verify vehicle exists
    const vehicleExists = await Vehicle.findById(vehicleId);
    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle record not found'
      });
    }

    const serviceHistory = await ServiceRequest.find({ vehicle: vehicleId })
      .populate('mechanic')
      .populate('customer')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: serviceHistory.length,
      data: serviceHistory
    });
  } catch (error) {
    next(error);
  }
};
