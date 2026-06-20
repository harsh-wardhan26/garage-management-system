import express from 'express';
import { 
  createServiceRequest, 
  updateServiceRequest, 
  assignMechanic, 
  changeStatus, 
  getServiceRequest, 
  getServiceRequests, 
  getVehicleHistory 
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protect service endpoints
router.use(protect);

// Service Request Routing Endpoints
router.route('/')
  .post(authorize('Admin', 'Manager', 'Receptionist'), createServiceRequest)
  .get(getServiceRequests);

router.route('/:id')
  .get(getServiceRequest)
  .put(authorize('Admin', 'Manager', 'Receptionist'), updateServiceRequest);

// Status and Assignee updates
router.patch('/:id/mechanic', authorize('Admin', 'Manager'), assignMechanic);
router.patch('/:id/status', authorize('Admin', 'Manager', 'Mechanic', 'Receptionist'), changeStatus);

// History querying
router.get('/vehicle/:vehicleId', getVehicleHistory);

export default router;
