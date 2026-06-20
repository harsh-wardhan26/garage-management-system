import Customer from '../models/Customer.js';

/**
 * @desc    Create new customer profile
 * @route   POST /api/customers
 * @access  Private (Admin, Manager, Receptionist)
 */
export const addCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, address, notes } = req.body;

    // Check if customer email already exists
    const emailExists = await Customer.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: 'Customer with this email already exists'
      });
    }

    // Check if customer phone number already exists
    const phoneExists = await Customer.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        error: 'Customer with this phone number already exists'
      });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      notes
    });

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update customer profile by ID
 * @route   PUT /api/customers/:id
 * @access  Private (Admin, Manager, Receptionist)
 */
export const updateCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, address, notes } = req.body;

    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Check unique email constraint if changed
    if (email && email !== customer.email) {
      const emailExists = await Customer.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: 'Email address is already in use by another customer'
        });
      }
    }

    // Check unique phone constraint if changed
    if (phone && phone !== customer.phone) {
      const phoneExists = await Customer.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          error: 'Phone number is already in use by another customer'
        });
      }
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, notes },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a customer profile by ID
 * @route   DELETE /api/customers/:id
 * @access  Private (Admin, Manager)
 */
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Customer profile deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of a single customer profile
 * @route   GET /api/customers/:id
 * @access  Private
 */
export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all customers with query search & pagination
 * @route   GET /api/customers
 * @access  Private
 */
export const getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search query matches name, email, or phone (case-insensitive regex)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination variables setup
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: customers
    });
  } catch (error) {
    next(error);
  }
};
