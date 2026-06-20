import express from 'express';
import { 
  addCustomer, 
  updateCustomer, 
  deleteCustomer, 
  getCustomer, 
  getCustomers 
} from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply token validation protection globally on customer endpoints
router.use(protect);

// Customer routing endpoints
router.route('/')
  .post(authorize('Admin', 'Manager', 'Receptionist'), addCustomer)
  .get(getCustomers);

router.route('/:id')
  .get(getCustomer)
  .put(authorize('Admin', 'Manager', 'Receptionist'), updateCustomer)
  .delete(authorize('Admin', 'Manager'), deleteCustomer);

export default router;
