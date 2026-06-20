import express from 'express';
import { 
  addVehicle, 
  updateVehicle, 
  deleteVehicle, 
  getVehicle, 
  getVehicles, 
  getVehicleHistory 
} from '../controllers/vehicleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protect vehicle endpoints
router.use(protect);

// Vehicle routing endpoints
router.route('/')
  .post(authorize('Admin', 'Manager', 'Receptionist'), addVehicle)
  .get(getVehicles);

router.route('/:id')
  .get(getVehicle)
  .put(authorize('Admin', 'Manager', 'Receptionist'), updateVehicle)
  .delete(authorize('Admin', 'Manager'), deleteVehicle);

router.get('/:id/history', getVehicleHistory);

export default router;
